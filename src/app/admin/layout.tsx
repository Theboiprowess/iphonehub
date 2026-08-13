import { AdminLayoutWrapper } from "./admin-layout-wrapper";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/admin/login");
  }

  const userRole = (session.user as any).role;
  const adminRoles = ["SUPER_ADMIN", "ADMIN", "CONTENT_MANAGER", "INVENTORY_MANAGER", "ORDER_MANAGER"];

  if (!userRole || !adminRoles.includes(userRole as string)) {
    redirect("/");
  }

  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}
