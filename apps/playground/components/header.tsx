"use client";

import React, { useState } from "react";
import { Menu, Github, Sprout } from "lucide-react";
import { usePathname } from "next/navigation";
import { MobileMenuDrawer } from "./mobile-menu-drawer";
import { LessonsDrawer } from "./lessons-drawer";
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
		{
			label: "Elektroniki",
			href: "/umeme",
			active: pathname === "/umeme",
		},
	];

	return (
		<>
			<MobileMenuDrawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

			{/* Main Header Container */}
			<header className="sticky left-0 right-0 top-0 z-40 border-b border-border/50 bg-background/80 shadow-sm backdrop-blur-md">
				<div className="flex h-14 items-center justify-between px-4 md:px-8">
					{/* Logo Section (Left on Mobile & Desktop) */}
					<div className="flex items-center gap-2 md:order-1">
						<Link
							href="/"
							className="group flex items-center gap-3 transition-opacity hover:opacity-90"
						>
							<div className="relative">
								<div className="absolute inset-0 rounded-full bg-yellow-500/20 opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-100" />
								<AppLogo
									size={32}
									className="relative z-10 group-hover:animate-[logo-hover_3s_ease-in-out_infinite]"
								/>
							</div>

							<span className="hidden text-lg font-bold tracking-tight md:block">
								Nuru
							</span>
						</Link>
					</div>

					{/* Desktop Center Navigation */}
					<nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:order-2 md:flex">
						{navItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
									item.active
										? "bg-accent text-accent-foreground shadow-sm"
										: "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
								}`}
							>
								{item.label}
							</Link>
						))}
					</nav>

					{/* Right Section: External Links & Mobile Menu */}
					<div className="flex items-center gap-2 md:order-3">
						{/* Desktop Only External Links */}
						<div className="hidden items-center gap-2 border-l border-border/50 pr-2 md:flex">
							<a
								href="https://github.com/NuruProgramming"
								target="_blank"
								rel="noopener noreferrer"
								className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
								title="GitHub"
							>
								<Github className="h-5 w-5" />
							</a>
							<a
								href="https://teksafari.org"
								target="_blank"
								rel="noopener noreferrer"
								className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-[#00b4d8]/10 hover:text-[#00b4d8]"
								title="teKsafari"
							>
								<Sprout className="h-5 w-5" />
							</a>
						</div>

						{/* Mobile Lessons Drawer Trigger */}
						<div className="md:hidden">
							<LessonsDrawer />
						</div>

						{/* Mobile Menu Toggle (Moved to Right) */}
						<div className="flex items-center md:hidden">
							<button
								onClick={() => {
									setMenuOpen(true);
									onMenuClick?.();
								}}
								className="-mr-2 rounded-md p-2 transition-colors hover:bg-muted"
								aria-label="Menu"
							>
								<Menu className="h-6 w-6" />
							</button>
						</div>
					</div>
				</div>
			</header>
		</>
	);
}
