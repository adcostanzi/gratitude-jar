import Link from "next/link";
import {
  BookOpen,
  ChartNoAxesColumn,
  CircleUserRound,
  House,
  Settings,
} from "lucide-react";
import Image from "next/image";

const navigationItems = [
  {
    label: "Home",
    href: "/",
    icon: House,
    color: "bg-jar-sage-light",
  },
  {
    label: "Memories",
    href: "/",
    icon: BookOpen,
    color: "bg-jar-peach",
  },
  {
    label: "Insights",
    href: "/",
    icon: ChartNoAxesColumn,
    color: "bg-jar-lavender",
  },
  {
    label: "Settings",
    href: "/",
    icon: Settings,
    color: "bg-jar-gold-light",
  },
];

function NavigationItems() {
  return (
    <>
      {navigationItems.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.label}
            href={item.href}
            aria-current={item.label === "Home" ? "page" : undefined}
            className="flex min-w-0 flex-1 flex-col items-center gap-1 text-xs font-medium text-jar-charcoal sm:text-sm md:flex-none"
          >
            <span className={`rounded-2xl p-3 ${item.color}`}>
              <Icon size={24} aria-hidden="true" />
            </span>
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

export default function Home() {
  return (
    <>
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
      <main className="min-h-screen bg-white px-6 pb-32 pt-8 text-jar-charcoal md:py-12">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <h1 className="max-w-xl text-3xl font-semibold leading-tight sm:text-4xl md:mt-8">
            Every jar starts with one moment.
          </h1>
          <Image
            className="h-auto w-full max-w-[400px]"
            src="/images/gratitude-jar.svg"
            alt="Gratitude Jar"
            width={400}
            height={400}
          />
          <h2 className="mt-8 text-2xl font-semibold">Your Gratitude Jar</h2>

          <p className="mt-3 text-jar-gray">
            Begin colleting the little things that matter.
          </p>

          <button
            type="button"
            className="mt-6 rounded-full bg-jar-sage px-6 py-3 font-semibold text-white hover:bg-jar-sage-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jar-sage w-full max-w-sm md:w-auto"
          >
            Add your first Gratitude
          </button>
        </div>
      </main>
      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-10 border-t border-[#E6EBE6] bg-white px-6 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 md:hidden"
      >
        <div className="flex items-start justify-around">
          <NavigationItems />
        </div>
      </nav>
    </>
  );
}
