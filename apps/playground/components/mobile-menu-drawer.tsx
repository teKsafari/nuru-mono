"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Home, BookOpenIcon, Github, Sprout } from "lucide-react";
import { AppLogo } from "./app-logo";

interface MobileMenuDrawerProps {
	isOpen: boolean;
	onClose: () => void;
}

export function MobileMenuDrawer({ isOpen, onClose }: MobileMenuDrawerProps) {
	const pathname = usePathname();

	const navItems = [
		{ icon: <Home className="h-5 w-5" />, label: "Home", href: "/" },
		{
			icon: <BookOpenIcon className="h-5 w-5" />,
			label: "Anza Kujifunza",
			href: "/anza",
		},
	];

	const externalLinks = [
		{
			icon: <Github className="h-5 w-5" />,
			label: "GitHub",
			href: "https://github.com/teksafari/nuru",
		},
		{
			icon: <Sprout className="h-5 w-5 text-[#00b4d8]" />,
			label: "teKsafari",
			href: "https://teksafari.org",
		},
	];

	return (
		<>
			{/* Backdrop */}
			{isOpen && (
				<div
					className="fixed inset-0 z-50 bg-black/50 md:hidden"
					onClick={onClose}
				/>
			)}

			{/* Drawer */}
			<div
				className={`fixed left-0 top-0 z-50 h-full w-80 max-w-[85vw] transform bg-background shadow-xl transition-transform duration-300 ease-in-out md:hidden ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<div className="flex h-full flex-col">
					{/* Header */}
					<div className="flex items-center justify-between border-b border-border p-4">
						<div className="flex items-center gap-3">
							<AppLogo size={32} />
							<div>
								<h2 className="text-lg font-bold">Nuru</h2>
								<p className="text-xs text-muted-foreground">
									Jifunze, Unda na Vumbua
								</p>
							</div>
						</div>
						<button
							onClick={onClose}
							className="rounded-lg p-2 transition-colors hover:bg-muted"
							aria-label="Close menu"
						>
							<X className="h-5 w-5" />
						</button>
					</div>

					{/* Navigation Links */}
					<div className="flex-1 overflow-y-auto p-4">
						<div className="space-y-1">
							<p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
								Navigation
							</p>
							{navItems.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									onClick={onClose}
									className={`flex items-center gap-3 rounded-lg px-3 py-3 transition-colors ${
										pathname === item.href
											? "bg-accent font-medium text-accent-foreground"
											: "text-muted-foreground hover:bg-muted hover:text-foreground"
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
							<p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
								Resources
							</p>
							{externalLinks.map((link) => (
								<a
									key={link.href}
									href={link.href}
									target="_blank"
									rel="noopener noreferrer"
									onClick={onClose}
									className="flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
								>
									{link.icon}
									<span>{link.label}</span>
								</a>
							))}
						</div>
					</div>

					{/* Footer */}
					<div className="border-t border-border p-4">
						<p className="text-center text-xs text-muted-foreground">
							Built with ❤️ by teKsafari
						</p>
					</div>
				</div>
			</div>
		</>
	);
}
