import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

async function seedSuperAdmin() {
  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;
  const firstName = process.env.SUPER_ADMIN_FIRST_NAME || "Super";
  const lastName = process.env.SUPER_ADMIN_LAST_NAME || "Admin";

  if (!email || !password) {
    console.log("Super admin env vars not set, skipping seed");
    return;
  }

  const [existing] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  if (existing) {
    console.log("Super admin already exists");
    return;
  }

  const hashed = await bcrypt.hash(password, 12);

  await db.insert(usersTable).values({
    email,
    passwordHash: hashed,
    firstName,
    lastName,
    displayName: "Super Admin",
    role: "super-admin",
  });

  console.log("Super admin created");
}

seedSuperAdmin()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
