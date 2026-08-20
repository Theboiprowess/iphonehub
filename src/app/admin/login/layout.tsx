import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "../../globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

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
    <html lang="en" className={`${manrope.variable} ${inter.variable} antialiased`}>
      <body className="min-h-screen font-body bg-[#0E161B]">
        <div className="min-h-screen w-full">
          {children}
        </div>
      </body>
    </html>
  );
}
