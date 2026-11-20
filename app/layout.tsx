import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

import Link from "next/link";
import Image from "next/image";
import { LogOut, UserRound } from "lucide-react";
import NavigationItems from "@/components/navigation-items";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/jar-entry/crud";

import { createClient } from "@/lib/supabase/server";

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

function AccountControl({ isSignedIn }: { isSignedIn: boolean }) {
  const buttonStyle =
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-jar-gray bg-white p-0 text-jar-gray hover:bg-jar-sage-light [&_svg]:size-6 md:h-12 md:w-12";

  if (isSignedIn) {
    return (
      <Button
        onClick={logout}
        aria-label="Sign out"
        title="Sign out"
        className={buttonStyle}
      >
        <LogOut aria-hidden="true" />
      </Button>
    );
  }

  return (
    <Button asChild className={buttonStyle}>
      <Link href="/auth/login" aria-label="Sign in" title="Sign in">
        <UserRound aria-hidden="true" />
      </Link>
    </Button>
  );
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const isSignedIn = !error && Boolean(data?.claims?.sub);

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
                className="flex shrink-0 items-center gap-1"
              >
                <Image
                  src="/images/logo/gratitude-jar-icon.png"
                  alt=""
                  width={64}
                  height={64}
                  className="h-14 w-14 object-contain md:h-16 md:w-16"
                />

                <span className="text-lg font-semibold text-jar-charcoal md:text-2xl">
                  gratitude jar
                </span>
              </Link>
              <div className="hidden w-full max-w-[650px] items-center justify-between gap-2 pl-8 md:flex">
                <NavigationItems />

                <AccountControl isSignedIn={isSignedIn} />
              </div>
              <div className="md:hidden">
                <AccountControl isSignedIn={isSignedIn} />
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
