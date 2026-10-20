import type { Metadata } from "next";
import { AdminLayoutWrapper } from "./admin-layout-wrapper";

export const metadata: Metadata = {
  title: "Admin Dashboard - iPhone Hub Zimbabwe",
  description: "Admin Dashboard for iPhone Hub Zimbabwe",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen font-body bg-gradient-to-br from-[#F7F5EF] to-[#EBE2C5]">
        <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
      </body>
    </html>
  );
}
