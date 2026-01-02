"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { LightbulbIcon, Paintbrush, Play, Square } from "lucide-react";

type ProgramState = "idle" | "running" | "paused";

interface CodeEditorComponentProps {
	code: string;
	setCode: (code: string) => void;
	programState: ProgramState;
	currentLine: number;
	exampleCode: string;
	codeCleared: boolean;
	setCodeCleared: (cleared: boolean) => void;
	startProgram: () => void;
	stopProgram: () => void;
	resetComponents: () => void;
}

export default function CodeEditorComponent({
	code,
	setCode,
	programState,
	currentLine,
	exampleCode,
	codeCleared,
	setCodeCleared,
	startProgram,
	stopProgram,
	resetComponents,
}: CodeEditorComponentProps) {
	return (
		<Card className="flex flex-col border-[2px] border-accent dark:bg-slate-900">
			<CardContent className="flex h-fit flex-col p-4">
				<div className="mb-2 flex items-center justify-between">
					<h3 className="text-lg font-medium">Hariri</h3>

					<div className="flex items-center gap-2">
						<Button
							onClick={() => {
								if (!codeCleared) {
									setCode("");
									setCodeCleared(true);
								} else {
									setCode(`${exampleCode}`);
									setCodeCleared(false);
								}
							}}
							disabled={programState === "running"}
							size="sm"
							variant="secondary"
							className="flex items-center gap-2"
						>
							{codeCleared ? (
								<LightbulbIcon size={16} />
							) : (
								<Paintbrush size={16} />
							)}
						</Button>

						<Button
							onClick={() => {
								if (programState == "running") {
									stopProgram();
									resetComponents();
								} else if (programState == "idle") {
									resetComponents();
									startProgram();
								}
							}}
							size="sm"
							className="flex animate-[logo-pulse_1.5s_ease-in-out_infinite] items-center gap-2"
							variant={programState == "running" ? "destructive" : "default"}
						>
							{programState === "running" ? (
								<Square className="animate-pulse" size={16} />
							) : (
								<Play size={16} />
							)}
						</Button>
					</div>
				</div>

				<div className="mb-4 flex items-center justify-between">
					<div className="flex items-center gap-2"></div>
				</div>

				<div className="relative flex-1">
					<Textarea
						value={code}
						onChange={(e) => {
							setCode(e.target.value);
							setCodeCleared(e.target.value === "");
						}}
						className="h-[14rem] resize-none bg-slate-50 font-mono text-sm dark:bg-background md:h-[18rem]"
						placeholder="Andika programu yako ya elektroniki hapa..."
						disabled={programState === "running"}
					/>
				</div>

				{programState === "running" && (
					<div className="mt-2 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
						<div className="h-2 w-2 animate-pulse rounded-full bg-blue-600 dark:bg-blue-400" />
						Programu inaendelea... (Mstari {currentLine + 1})
					</div>
				)}
			</CardContent>
		</Card>
	);
}
