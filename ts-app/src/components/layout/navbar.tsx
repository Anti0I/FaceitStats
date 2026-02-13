"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Users, LayoutDashboard, Crosshair, Menu, UserPlus, Trophy, List } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Players", href: "/players", icon: List },
  { name: "Add Player", href: "/add-player", icon: UserPlus },
  { name: "Team Builder", href: "/team-builder", icon: Users },
  { name: "Teams", href: "/teams", icon: Trophy },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Crosshair className="h-6 w-6 text-primary" />
          <span className="hidden font-bold sm:inline-block text-lg tracking-tight">
            Anti<span className="text-primary">STATS</span>
          </span>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {NAV_ITEMS.map((item) => (
             <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors hover:text-foreground/80 flex items-center gap-2",
                pathname === item.href ? "text-foreground" : "text-foreground/60"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-4">
           {/* Mobile Menu */}
           <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-card border-l border-border">
              <div className="flex flex-col gap-4 mt-8">
                 {NAV_ITEMS.map((item) => (
                    <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "flex items-center gap-2 text-lg font-medium transition-colors hover:text-primary",
                        pathname === item.href ? "text-primary" : "text-muted-foreground"
                    )}
                    >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                    </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          <span className="text-xs text-muted-foreground hidden sm:inline-flex items-center gap-1.5 border border-primary/20 rounded-full px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Admin
          </span>
        </div>
      </div>
    </header>
  );
}
