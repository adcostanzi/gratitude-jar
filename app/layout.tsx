import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

import Link from "next/link";
import Image from "next/image";
import {
  CircleUserRound,
} from "lucide-react";
import NavigationItems from "@/components/navigation-items";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Gratitude Jar",
  description: "A place to collect and appreciate the little things",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="border-b border-[#E6EBE6] bg-white px-6">
            <nav
              aria-label="Main navigation"
              className="mx-auto flex max-w-6xl items-center justify-between py-4"
            >
              <Link
                href="/"
                aria-label="Gratitude Jar home"
                className="flex items-center gap-3"
              >
                <Image
                  className="h-auto w-[100px] md:w-[150px]"
                  src="/images/logo/gratitude-jar-logo.png"
                  alt=""
                  width={100}
                  height={100}
                />
              </Link>
              <div className="hidden items-center gap-8 md:flex">
                <NavigationItems />
                <Link
                  href="/"
                  aria-label="Account"
                  className="flex h-12 items-center self-start text-jar-gray"
                >
                  <CircleUserRound size={32} aria-hidden="true" />
                </Link>
              </div>
            </nav>
          </header>
          {children}
          <nav
            aria-label="Mobile navigation"
            className="fixed inset-x-0 bottom-0 z-10 border-t border-[#E6EBE6] bg-white px-6 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 md:hidden"
          >
            <div className="flex items-start justify-around">
              <NavigationItems />
            </div>
          </nav>
        </ThemeProvider>
      </body>
    </html>
  );
}
