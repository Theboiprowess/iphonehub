import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartProvider } from "@/lib/cart-context";
import { WhatsAppFloat } from "@/components/whatsapp-float";

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
  title: "iPhone Hub Masvingo - Your Trusted iPhone Hub in Masvingo",
  description: "Shop boxed, pre-owned and second-hand iPhones with confidence. Quality devices. Transparent pricing. Trusted service in Masvingo, Zimbabwe.",
  keywords: ["iPhone Hub Masvingo", "iPhones in Masvingo", "Buy iPhone Zimbabwe", "iPhone Masvingo", "iPhone prices Zimbabwe", "Pre-owned iPhones Zimbabwe", "Second-hand iPhones Masvingo", "Boxed iPhones Zimbabwe"],
  authors: [{ name: "iPhone Hub Masvingo" }],
  creator: "iPhone Hub Masvingo",
  publisher: "iPhone Hub Masvingo",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "iPhone Hub Masvingo - Your Trusted iPhone Hub in Masvingo",
    description: "Shop boxed, pre-owned and second-hand iPhones with confidence. Quality devices. Transparent pricing. Trusted service in Masvingo, Zimbabwe.",
    siteName: "iPhone Hub Masvingo",
  },
  twitter: {
    card: "summary_large_image",
    title: "iPhone Hub Masvingo - Your Trusted iPhone Hub in Masvingo",
    description: "Shop boxed, pre-owned and second-hand iPhones with confidence. Quality devices. Transparent pricing. Trusted service in Masvingo, Zimbabwe.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable} antialiased`}>
      <body className="min-h-screen flex flex-col font-body">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppFloat />
        </CartProvider>
      </body>
    </html>
  );
}
