import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import NavigationItems from "@/components/navigation-items";
import { LogOut, UserRound } from "lucide-react";
import { logout } from "@/lib/jar-entry/crud";

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

export default async function AuthenticatedHeader() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();

  const isSignedIn = !error && Boolean(data?.claims?.sub);

  return (
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
  );
}
