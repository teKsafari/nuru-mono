"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { CircuitBoard, Code2, Sprout, Github} from "lucide-react";
import Link from "next/link";
import { AppLogo } from "./app-logo";

export function SidebarNav() {
  const pathname = usePathname();

  const navItems = [
    {
      icon: <CircuitBoard className="w-6 h-6" />,
      label: "Electronics Simulator",
      href: "/electronics",
      active: pathname === "/electronics",
    },
    {
      icon: <Code2 className="w-6 h-6" />,
      label: "Software Simulator",
      href: "/software",
      active: pathname === "/software",
    },
  ];

  return (
    <>
      {/* Desktop: Left Sidebar */}
      <div className="hidden md:flex fixed left-0 top-0 h-full w-16 bg-background shadow-muted-foreground shadow-right shadow-sm flex-col items-center py-4 z-40">
        <div className="mb-6">
          <Link href="/" title="Nuru Playground">
            <div className="logo-pulse hover:animate-[logo-hover_1.5s_ease-in-out_infinite]">
              <AppLogo size={36} />
            </div>
          </Link>
        </div>
        
        {/* GitHub Link */}
        <div className="mb-4">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/NuruProgramming"
            className="flex flex-col items-center justify-center w-12 h-12 rounded-md transition-colors hover:bg-muted text-muted-foreground hover:text-foreground"
            title="Nuru GitHub Repository"
          >
            <Github className="w-6 h-6" />
          </a>
        </div>

        <div className="w-8 h-[0.1px] bg-muted-foreground mb-4 rounded-full"></div>

        {navItems.map((item) => (
          <React.Fragment key={item.href}>
            <Link
              href={item.href}
              className={`flex flex-col items-center justify-center w-12 h-12 mb-4 rounded-md transition-colors ${
                item.active
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
              title={item.label}
            >
              {item.icon}
            </Link>
          </React.Fragment>
        ))}

        {/* Sprouting Tree Icon at Bottom */}
        <div className="mt-auto mb-4">
          <a
            target="_blank"
            href="https://teksafari.org"
            className="flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all group"
            title="Garden"
          >
            <div className="relative">
              <Sprout className="w-7 h-7 text-[#00b4d8] z-10 group-hover:text-[#aac9cf] transition-colors" />
              <div className="absolute inset-0 bg-[#22c55e]/20 rounded-full blur-md sprout-pulse -z-10 group-hover:bg-[#22c55e]/30"></div>
            </div>
          </a>
        </div>
      </div>

      {/* Mobile: Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <nav className="grid w-full select-none auto-cols-fr grid-flow-col items-center justify-between rounded-t-2xl bg-background/80 backdrop-blur-[2.5rem] shadow-[0_-4px_30px_rgba(0,0,0,0.1)] border-t border-border/50 pb-safe">
          {/* Logo/Home */}
          <div className="relative flex h-full flex-col items-center justify-center py-3">
            <Link 
              href="/" 
              className={`flex flex-col items-center justify-center transition-colors ${
                pathname === "/" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className={pathname === "/" ? "logo-pulse" : ""}>
                <AppLogo size={28} />
              </div>
              <span className="text-[10px] font-medium mt-1">Home</span>
            </Link>
            {pathname === "/" && (
              <div className="absolute top-0 w-8 h-1 rounded-b-full bg-primary shadow-[0_2px_10px_rgba(0,0,0,0.2)] animate-in fade-in zoom-in duration-300"></div>
            )}
          </div>

          {/* Navigation Items */}
          {navItems.map((item) => (
            <div key={item.href} className="relative flex h-full flex-col items-center justify-center py-3">
              <Link
                href={item.href}
                className={`flex flex-col items-center justify-center transition-colors ${
                  item.active
                    ? "text-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {/* Clone the icon to add the specific size classes */}
                {React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, { className: "w-7 h-7" })}
                <span className="text-[10px] font-medium mt-1">{item.label.split(" ")[0]}</span>
              </Link>
              {item.active && (
                <div className="absolute top-0 w-8 h-1 rounded-b-full bg-primary shadow-[0_2px_10px_rgba(0,0,0,0.2)] animate-in fade-in zoom-in duration-300"></div>
              )}
            </div>
          ))}

          {/* GitHub Link */}
          <div className="relative flex h-full flex-col items-center justify-center py-3">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/NuruProgramming"
              className="flex flex-col items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="w-7 h-7" />
              <span className="text-[10px] font-medium mt-1">GitHub</span>
            </a>
          </div>

          {/* Garden Link */}
          <div className="relative flex h-full flex-col items-center justify-center py-3">
            <a
              target="_blank"
              href="https://teksafari.org"
              className="flex flex-col items-center justify-center group"
            >
              <div className="relative">
                <Sprout className="w-7 h-7 text-[#00b4d8] z-10 group-hover:text-[#aac9cf] transition-colors" />
                <div className="absolute inset-0 bg-[#22c55e]/20 rounded-full blur-md sprout-pulse -z-10 group-hover:bg-[#22c55e]/30"></div>
              </div>
              <span className="text-[10px] font-medium mt-1 text-muted-foreground group-hover:text-foreground transition-colors">teKsafari</span>
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
