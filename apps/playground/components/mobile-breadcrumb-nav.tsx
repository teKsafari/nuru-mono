"use client";

import React, { useState } from "react";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { MobileMenuDrawer } from "./mobile-menu-drawer";
import { AppLogo } from "@/components/app-logo";
import Link from "next/link";


interface MobileBreadcrumbNavProps {
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

// Inline TabsRow component - reusable tabs navigation
function TabsRow({ tabs, defaultTab }: TabsRowProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.value || "");

  if (tabs.length === 0) return null;

  return (
    <div className="flex justify-center items-center gap-1 px-4 pb-2 overflow-x-auto scrollbar-none">
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

export function MobileBreadcrumbNav({ onMenuClick }: MobileBreadcrumbNavProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Define tabs for each section
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

  return (
    <>
      <MobileMenuDrawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border/50 shadow-sm">
        {/* Top bar with breadcrumb */}
        <div className="flex items-center justify-between px-4 py-1 border-b border-border/50">
          {/* Left side - Menu Icon */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setMenuOpen(true);
                onMenuClick?.();
              }}
              className="p-1.5 hover:bg-muted rounded-md transition-colors"
              aria-label="Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
          {/* clicking this should take us to the home page */} 
          <Link href="/" className="p-1.5 hover:bg-muted rounded-md transition-colors">
            <AppLogo
              size={24}
              className="animate-[logo-hover_1.5s_ease-in-out_infinite]"
            />
          </Link>
        </div>

        {/* Tabs Row - using the extracted component */}
        <TabsRow tabs={tabs} defaultTab="code" />
      </div>
    </>
  );
}
