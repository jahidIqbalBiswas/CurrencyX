import Link from "next/link";
import { ArrowLeftRight } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { siteConfig } from "@/config/site";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
          aria-label={`${siteConfig.name} home`}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-brand">
            <ArrowLeftRight className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            {siteConfig.name}
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
