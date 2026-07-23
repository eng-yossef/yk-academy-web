import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

const ALLOWED_ROLES = ["STUDENT", "ADMIN", "SUPER_ADMIN"] as const;

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  if (!ALLOWED_ROLES.includes(session.user.role as (typeof ALLOWED_ROLES)[number])) {
    redirect("/auth/signin");
  }

  return <DashboardLayout role="student">{children}</DashboardLayout>;
}
