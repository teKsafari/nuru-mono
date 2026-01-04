"use client";

import * as React from "react";
import { Drawer } from "vaul";
import { Book, BookOpen, ChevronRight, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface LessonsDrawerProps {
	children?: React.ReactNode;
}

export function LessonsDrawer({ children }: LessonsDrawerProps) {
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
		<Drawer.Root open={open} onOpenChange={setOpen}>
			<Drawer.Trigger asChild>
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
			</Drawer.Trigger>
			<Drawer.Portal>
				<Drawer.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
				<Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 mt-24 flex h-[60%] flex-col rounded-t-[10px] border-t border-border bg-background focus:outline-none">
					<div className="flex-1 rounded-t-[10px] bg-background p-4">
						<div className="mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-muted" />
						<div className="mx-auto max-w-md">
							<Drawer.Title className="mb-4 text-lg font-medium">
								Lessons
							</Drawer.Title>
							<div className="flex flex-col space-y-2">
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
						</div>
					</div>
					<div className="mt-auto border-t border-border bg-background p-4">
						<div className="mx-auto flex max-w-md justify-center gap-6">
							<a
								className="text-xs text-muted-foreground underline hover:text-foreground"
								href="https://github.com/nuru-programming"
								target="_blank"
								rel="noreferrer"
							>
								GitHub
							</a>
							<a
								className="text-xs text-muted-foreground underline hover:text-foreground"
								href="https://twitter.com/nuru_programming"
								target="_blank"
								rel="noreferrer"
							>
								Twitter
							</a>
						</div>
					</div>
				</Drawer.Content>
			</Drawer.Portal>
		</Drawer.Root>
	);
}
