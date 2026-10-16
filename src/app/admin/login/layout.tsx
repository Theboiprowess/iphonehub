import type { Metadata } from "next";
import "../../globals.css";

export const metadata: Metadata = {
  title: "Admin Login - iPhone Hub Zimbabwe",
  description: "Login to iPhone Hub Zimbabwe Admin Dashboard",
};

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen font-body bg-[#0E161B]">
        <div className="min-h-screen w-full">
          {children}
        </div>
      </body>
    </html>
  );
}
