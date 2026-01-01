"use client";

import React, { useState } from "react";
import { Menu, Github, Sprout, Home, CircuitBoard } from "lucide-react";
import { usePathname } from "next/navigation";
import { MobileMenuDrawer } from "./mobile-menu-drawer";
import { AppLogo } from "@/components/app-logo";
import Link from "next/link";

interface SiteHeaderProps {
  onMenuClick?: () => void;
}

interface Tab {
  label: string;
  value: string;
}

interface TabsRowProps {
  tabs: Tab[];
  defaultTab?: string;
}

// Inline TabsRow component - reusable tabs navigation (Mobile only)
function TabsRow({ tabs, defaultTab }: TabsRowProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.value || "");

  if (tabs.length === 0) return null;

  return (
    <div className="flex justify-center items-center gap-1 px-4 pb-2 overflow-x-auto scrollbar-none md:hidden">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => setActiveTab(tab.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
            activeTab === tab.value
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function SiteHeader({ onMenuClick }: SiteHeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Define tabs for each section (Mobile only)
  const getTabs = (): Tab[] => {
    if (pathname === "/play") {
      return [
        { label: "Code", value: "code" },
        { label: "Terminal", value: "terminal" },
        { label: "Simulator", value: "simulator" },
      ];
    }
    return [];
  };

  const tabs = getTabs();

  const navItems = [
    { label: "Home", href: "/", active: pathname === "/" },
    { label: "Play", href: "/play", active: pathname === "/play" },
  ];

  return (
    <>
      <MobileMenuDrawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      
      {/* Main Header Container */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm">
        <div className="flex items-center justify-between px-4 h-14 md:px-8">
          
          {/* Mobile Left: Menu Toggle */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => {
                setMenuOpen(true);
                onMenuClick?.();
              }}
              className="p-2 -ml-2 hover:bg-muted rounded-md transition-colors"
              aria-label="Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Logo Section (Centered on Mobile, Left on Desktop) */}
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
                Nuru Playground
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

          {/* Right Section: External Links & Extras */}
          <div className="flex items-center gap-2 md:order-3">
            {/* Desktop Only External Links */}
            <div className="hidden md:flex items-center gap-2 pr-2 border-r border-border/50 mr-2">
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

            {/* Placeholder for future Theme Toggle or User Menu if needed */}
          </div>
        </div>

        {/* Mobile Tabs Row (Visible only on mobile when applicable) */}
        {tabs.length > 0 && (
           <div className="md:hidden border-t border-border/50 pt-2">
             <TabsRow tabs={tabs} defaultTab="code" />
           </div>
        )}
      </header>
    </>
  );
}
