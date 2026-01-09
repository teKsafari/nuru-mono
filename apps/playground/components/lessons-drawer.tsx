"use client";

import * as React from "react";
import { Book, BookOpen, ChevronRight, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
	DrawerFooter,
} from "@/components/ui/drawer";

export function LessonsDrawer() {
	const [open, setOpen] = React.useState(false);
	const pathname = usePathname();

	const lessons = [
		{
			id: "anza",
			title: "Anza",
			description: "Learn the basics of Nuru",
			href: "/anza",
			icon: <BookOpen className="h-5 w-5 text-blue-500" />,
		},
		{
			id: "umeme",
			title: "Umeme",
			description: "Learn electronics with Nuru",
			href: "/umeme",
			icon: <Zap className="h-5 w-5 text-yellow-500" />,
		},
	];

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<button
					className="group flex items-center justify-center rounded-full p-2 transition-colors hover:bg-muted"
					aria-label="Open lessons"
				>
					{open ? (
						<BookOpen className="h-6 w-6 scale-110 transform transition-all duration-300" />
					) : (
						<Book className="h-6 w-6 transition-all duration-300 group-hover:scale-105" />
					)}
				</button>
			</DrawerTrigger>
			<DrawerContent className="h-[60%]">
				<div className="mx-auto w-full max-w-sm">
					<DrawerHeader>
						<DrawerTitle className="text-center text-xl font-bold">
							Lessons
						</DrawerTitle>
					</DrawerHeader>
					<div className="flex flex-col space-y-3 p-4">
						{lessons.map((lesson) => (
							<Link
								key={lesson.id}
								href={lesson.href}
								onClick={() => setOpen(false)}
								className={cn(
									"flex items-center gap-4 rounded-xl border p-4 transition-all duration-200",
									pathname === lesson.href
										? "border-primary/50 bg-primary/5 shadow-sm"
										: "border-border hover:border-foreground/20 hover:bg-muted/50",
								)}
							>
								<div className="rounded-lg border border-border/50 bg-background p-2 shadow-sm">
									{lesson.icon}
								</div>
								<div className="flex-1">
									<h3 className="text-base font-medium">{lesson.title}</h3>
									<p className="text-sm text-muted-foreground">
										{lesson.description}
									</p>
								</div>
								<ChevronRight className="h-4 w-4 text-muted-foreground" />
							</Link>
						))}
					</div>
					<DrawerFooter>
						<div className="flex w-full justify-center gap-6">
							<a
								className="text-xs text-muted-foreground underline hover:text-foreground"
								href="https://github.com/nuruprogramming"
								target="_blank"
								rel="noreferrer"
							>
								GitHub
							</a>
							<a
								className="text-xs text-muted-foreground underline hover:text-foreground"
								href="https://teksafari.org"
								target="_blank"
								rel="noreferrer"
							>
								teKsafari
							</a>
						</div>
					</DrawerFooter>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
