"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { BotMessageSquare, FileText, BarChart3, Leaf } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const mobileNavItems: NavItem[] = [
  { href: "/generate-plan", label: "Generate Plan", icon: BotMessageSquare },
  { href: "/view-plan", label: "View Plans", icon: FileText },
  { href: "/progress", label: "Progress", icon: BarChart3 },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2 p-4">
      <Link
        href="/generate-plan"
        className="group mb-4 flex h-10 items-center gap-2 rounded-lg px-3 text-lg font-semibold"
      >
        <Leaf className="h-6 w-6 text-primary transition-all group-hover:scale-110" />
        <span className="text-primary">Aura Health AI</span>
      </Link>
      {mobileNavItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            pathname === item.href &&
              "bg-accent text-accent-foreground hover:text-accent-foreground"
          )}
        >
          <item.icon className="h-5 w-5" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
