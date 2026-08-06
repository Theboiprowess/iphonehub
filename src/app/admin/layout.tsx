import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F7F5EF]">
      <AdminSidebar />
      <div className="lg:ml-64">
        <AdminTopbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}