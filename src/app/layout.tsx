import type { Metadata, Viewport } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartProvider } from "@/lib/cart-context";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { ThemeProvider } from "@/components/theme-provider";
import { GoldSmokeBackground } from "@/components/gold-smoke-background";
import { ChatWidget } from "@/components/support/chat-widget";
import { headers } from "next/headers";

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
  title: {
    default: "iPhone Hub Zimbabwe | Buy Boxed, Pre-Owned & Second-Hand iPhones",
    template: "%s | iPhone Hub Zimbabwe"
  },
  description: "Shop quality boxed, pre-owned and second-hand iPhones from iPhone Hub Zimbabwe. Based in Masvingo and serving customers across Zimbabwe with transparent pricing and trusted service.",
  keywords: ["iPhone Hub Zimbabwe", "iPhones in Zimbabwe", "Buy iPhone Zimbabwe", "iPhone Zimbabwe", "iPhone prices Zimbabwe", "Pre-owned iPhones Zimbabwe", "Second-hand iPhones Zimbabwe", "Boxed iPhones Zimbabwe", "iPhone trade-in Zimbabwe", "iPhone accessories Zimbabwe"],
  authors: [{ name: "iPhone Hub Zimbabwe" }],
  creator: "iPhone Hub Zimbabwe",
  publisher: "iPhone Hub Zimbabwe",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://iphone-hub-masvingo.vercel.app"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "iPhone Hub Zimbabwe | Buy Boxed, Pre-Owned & Second-Hand iPhones",
    description: "Shop quality boxed, pre-owned and second-hand iPhones from iPhone Hub Zimbabwe. Based in Masvingo and serving customers across Zimbabwe with transparent pricing and trusted service.",
    siteName: "iPhone Hub Zimbabwe",
    images: [
      {
        url: "/logo.jpeg",
        width: 400,
        height: 400,
        alt: "iPhone Hub Zimbabwe Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "iPhone Hub Zimbabwe | Buy Boxed, Pre-Owned & Second-Hand iPhones",
    description: "Shop quality boxed, pre-owned and second-hand iPhones from iPhone Hub Zimbabwe. Based in Masvingo and serving customers across Zimbabwe with transparent pricing and trusted service.",
    images: ["/logo.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const isAdminRoute = headersList.get('x-is-admin') === 'true';

  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable} antialiased`}>
      <body className="min-h-screen flex flex-col font-body relative">
        <ThemeProvider>
          <CartProvider>
            {!isAdminRoute && <Header />}
            <main className="flex-1 relative z-10 w-full">{children}</main>
            {!isAdminRoute && (
              <div className="relative z-10 w-full pt-16 sm:pt-20 lg:pt-24">
                <Footer />
              </div>
            )}
            {!isAdminRoute && <WhatsAppFloat />}
            {!isAdminRoute && <ChatWidget />}
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
