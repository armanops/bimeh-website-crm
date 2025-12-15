import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || !["admin", "super-admin"].includes(session.user.role)) {
    redirect("/auth/signin");
  }

  return <>{children}</>;
}
