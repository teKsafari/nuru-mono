"use client";

import React, { useState } from "react";
import { Menu, Github, Sprout } from "lucide-react";
import { usePathname } from "next/navigation";
import { MobileMenuDrawer } from "./mobile-menu-drawer";
import { AppLogo } from "@/components/app-logo";
import Link from "next/link";

interface SiteHeaderProps {
  onMenuClick?: () => void;
}



export function SiteHeader({ onMenuClick }: SiteHeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/", active: pathname === "/" },
    { label: "Anza", href: "/anza", active: pathname === "/anza" },
  ];

  return (
    <>
      <MobileMenuDrawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      
      {/* Main Header Container */}
      <header className="sticky top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm">
        <div className="flex items-center justify-between px-4 h-14 md:px-8">
          
          {/* Logo Section (Left on Mobile & Desktop) */}
          <div className="flex items-center gap-2 md:order-1">
            <Link href="/" className="flex items-center gap-3 group transition-opacity hover:opacity-90">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <AppLogo
                  size={32}
                  className="relative z-10 group-hover:animate-[logo-hover_3s_ease-in-out_infinite]"
                />
              </div>
             
              <span className="hidden md:block font-bold text-lg tracking-tight">
                Nuru
              </span>
            </Link>
          </div>

          {/* Desktop Center Navigation */}
          <nav className="hidden md:flex items-center gap-1 md:order-2 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  item.active
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Section: External Links & Mobile Menu */}
          <div className="flex items-center gap-2 md:order-3">
            {/* Desktop Only External Links */}
            <div className="hidden md:flex items-center gap-2 pr-2 border-l border-border/50 ">
              <a
                href="https://github.com/NuruProgramming"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
                title="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://teksafari.org"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-[#00b4d8] hover:bg-[#00b4d8]/10 rounded-full transition-colors"
                title="teKsafari"
              >
                <Sprout className="w-5 h-5" />
              </a>
            </div>

            {/* Mobile Menu Toggle (Moved to Right) */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => {
                  setMenuOpen(true);
                  onMenuClick?.();
                }}
                className="p-2 -mr-2 hover:bg-muted rounded-md transition-colors"
                aria-label="Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

      </header>
    </>
  );
}
