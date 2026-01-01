"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Home, CircuitBoard, Github, Sprout } from "lucide-react";
import { AppLogo } from "./app-logo";

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenuDrawer({ isOpen, onClose }: MobileMenuDrawerProps) {
  const pathname = usePathname();

  const navItems = [
    { icon: <Home className="w-5 h-5" />, label: "Home", href: "/" },
    {
      icon: <CircuitBoard className="w-5 h-5" />,
      label: "Play",
      href: "/play",
    },
  ];

  const externalLinks = [
    {
      icon: <Github className="w-5 h-5" />,
      label: "GitHub",
      href: "https://github.com/NuruProgramming",
    },
    {
      icon: <Sprout className="w-5 h-5 text-[#00b4d8]" />,
      label: "teKsafari",
      href: "https://teksafari.org",
    },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-background z-50 shadow-xl transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <AppLogo size={32} />
              <div>
                <h2 className="font-bold text-lg">Nuru</h2>
                <p className="text-xs text-muted-foreground">
                  Learn & Create
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
                Navigation
              </p>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                    pathname === item.href
                      ? "bg-accent text-accent-foreground font-medium"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Divider */}
            <div className="my-4 border-t border-border" />

            {/* External Links */}
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
                Resources
              </p>
              {externalLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg transition-colors hover:bg-muted text-muted-foreground hover:text-foreground"
                >
                  {link.icon}
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <p className="text-xs text-center text-muted-foreground">
              Built with ❤️ by teKsafari
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
