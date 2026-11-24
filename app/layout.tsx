import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

import NavigationItems from "@/components/navigation-items";

import { Suspense } from "react";
import AuthenticatedHeader from "@/components/layout/authenticated-header";

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

export default async function RootLayout({
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

          <Suspense fallback={<div>Loading account...</div>}>
            <AuthenticatedHeader />
          </Suspense>
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
