"use server";

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { z } from "zod";

const updateProfileSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  displayName: z.string().optional(),
  phone: z.string().optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

const changeEmailSchema = z.object({
  newEmail: z.string().email(),
  password: z.string().min(1),
});

const createAdminSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  displayName: z.string().optional(),
  phone: z.string().optional(),
});

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const data = Object.fromEntries(formData);
  const validated = updateProfileSchema.parse(data);

  await db
    .update(usersTable)
    .set({
      firstName: validated.firstName,
      lastName: validated.lastName,
      displayName: validated.displayName,
      phone: validated.phone,
      updatedAt: new Date(),
    })
    .where(eq(usersTable.id, parseInt(session.user.id)));

  revalidatePath("/admin/profile");
}

export async function changePassword(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const data = Object.fromEntries(formData);
  const validated = changePasswordSchema.parse(data);

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, parseInt(session.user.id)))
    .limit(1);

  if (!user) throw new Error("User not found");

  const isValid = await bcrypt.compare(
    validated.currentPassword,
    user.passwordHash
  );
  if (!isValid) throw new Error("Current password is incorrect");

  const hashed = await bcrypt.hash(validated.newPassword, 12);

  await db
    .update(usersTable)
    .set({ passwordHash: hashed, updatedAt: new Date() })
    .where(eq(usersTable.id, parseInt(session.user.id)));

  revalidatePath("/admin/profile");
}

export async function changeEmail(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const data = Object.fromEntries(formData);
  const validated = changeEmailSchema.parse(data);

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, parseInt(session.user.id)))
    .limit(1);

  if (!user) throw new Error("User not found");

  const isValid = await bcrypt.compare(validated.password, user.passwordHash);
  if (!isValid) throw new Error("Password is incorrect");

  await db
    .update(usersTable)
    .set({ email: validated.newEmail, updatedAt: new Date() })
    .where(eq(usersTable.id, parseInt(session.user.id)));

  revalidatePath("/admin/profile");
}

export async function createAdmin(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "super-admin") throw new Error("Unauthorized");

  const data = Object.fromEntries(formData);
  const validated = createAdminSchema.parse(data);

  const hashed = await bcrypt.hash(validated.password, 12);

  await db.insert(usersTable).values({
    email: validated.email,
    passwordHash: hashed,
    firstName: validated.firstName,
    lastName: validated.lastName,
    displayName: validated.displayName,
    phone: validated.phone,
    role: "admin",
  });

  revalidatePath("/admin/admins");
}
