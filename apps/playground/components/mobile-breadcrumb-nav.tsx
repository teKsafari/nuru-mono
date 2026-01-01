"use client";

import React, { useState } from "react";
import { Menu, ChevronDown, ChevronRight, Bell, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileMenuDrawer } from "./mobile-menu-drawer";

interface MobileBreadcrumbNavProps {
  onMenuClick?: () => void;
}

export function MobileBreadcrumbNav({ onMenuClick }: MobileBreadcrumbNavProps) {
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Determine current section based on pathname
  const getCurrentSection = () => {
    if (pathname === "/electronics") {
      return "Electronics Simulator";
    } else if (pathname === "/software") {
      return "Software Simulator";
    }
    return "Home";
  };

  const currentSection = getCurrentSection();

  // Define available sections for dropdown
  const sections = [
    { label: "Home", href: "/" },
    { label: "Electronics Simulator", href: "/electronics" },
    { label: "Software Simulator", href: "/software" },
  ];

  // Define tabs for each section
  const getTabs = () => {
    if (pathname === "/electronics" || pathname === "/software") {
      return [
        { label: "Code", value: "code" },
        { label: "Terminal", value: "terminal" },
        { label: "Simulator", value: "simulator" },
      ];
    }
    return [];
  };

  const tabs = getTabs();
  const [activeTab, setActiveTab] = useState(tabs[0]?.value || "code");

  return (
    <>
      <MobileMenuDrawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border/50 shadow-sm">
        {/* Top bar with breadcrumb */}
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left side - Menu & Icons */}
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

            {/* Notification Badge */}
            <div className="relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                6
              </span>
            </div>

            {/* Score/Stats Icon */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border-2 border-primary bg-background">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold">99v</span>
            </div>
          </div>

          {/* Right side - Breadcrumb & Navigation */}
          <div className="flex items-center gap-2">
            {/* Breadcrumb Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <span className="text-sm font-medium truncate max-w-[120px]">
                  {currentSection}
                </span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-background rounded-lg shadow-lg border border-border z-50">
                    {sections.map((section) => (
                      <Link
                        key={section.href}
                        href={section.href}
                        onClick={() => setShowDropdown(false)}
                        className={`block px-4 py-3 hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg ${
                          pathname === section.href
                            ? "bg-accent text-accent-foreground font-medium"
                            : ""
                        }`}
                      >
                        {section.label}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Next Arrow Button */}
            <button className="p-2 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors shadow-md">
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Tabs Row */}
        {tabs.length > 0 && (
          <div className="flex items-center gap-1 px-4 pb-2 overflow-x-auto scrollbar-none">
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
        )}
      </div>
    </>
  );
}
