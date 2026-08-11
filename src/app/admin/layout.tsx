import { AdminSidebar, AdminTopbar } from "@/components/admin/admin-sidebar";
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

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#F7F5EF] grid grid-cols-1 lg:grid-cols-[256px_minmax(0,1fr)]">
      <AdminSidebar />
      <div className="flex flex-col min-w-0 overflow-hidden">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8 max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
