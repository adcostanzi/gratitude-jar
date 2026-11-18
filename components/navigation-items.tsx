import Link from "next/link";
import {
  BookOpen,
  ChartNoAxesColumn,
  CircleUserRound,
  House,
  Settings,
} from "lucide-react";
import Image from "next/image";
import AddEntryDialog from "@/components/ui/add-entry-dialog";


const navigationItems = [
  {
    label: "Home",
    href: "/",
    icon: House,
    color: "bg-jar-sage-light",
  },
  {
    label: "Memories",
    href: "/gratitude-entry", //Temporal Route
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

export default function NavigationItems() {
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