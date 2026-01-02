"use client";

import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

type ProgramState = "idle" | "running" | "paused";

interface TerminalComponentProps {
	output: string[];
	error: string | null;
	programState: ProgramState;
	command: string;
	setCommand: (cmd: string) => void;
	executeDirectCommand: () => void;
	clearOutput: () => void;
}

export default function TerminalComponent({
	output,
	error,
	programState,
	command,
	setCommand,
	executeDirectCommand,
	clearOutput,
}: TerminalComponentProps) {
	const commandInputRef = useRef<HTMLInputElement>(null);
	const outputRef = useRef<HTMLDivElement>(null);

	// Auto-scroll output to bottom
	useEffect(() => {
		if (outputRef.current) {
			outputRef.current.scrollTop = outputRef.current.scrollHeight;
		}
	}, [output]);

	return (
		<Card className="h-80 border-[2px] dark:bg-slate-900">
			<CardContent className="flex h-full flex-col p-4">
				<div className="mb-2 flex items-center justify-between">
					<h3 className="text-lg font-medium">Terminali</h3>
					<Button onClick={clearOutput} size="sm" variant="outline">
						Futa
					</Button>
				</div>

				<div
					ref={outputRef}
					className="mb-4 flex-1 overflow-y-auto rounded-lg border-[1px] border-accent bg-slate-100 p-3 font-mono text-sm dark:bg-slate-950 dark:text-slate-100"
				>
					{output.length === 0 ? (
						<div className="italic text-slate-500 dark:text-slate-400">
							Matokeo yataonekana hapa...
						</div>
					) : (
						output.map((line, i) => (
							<div
								key={i}
								className={
									line.includes("❌")
										? "text-red-400 dark:text-red-400"
										: line.includes("✅")
											? "text-green-400 dark:text-green-400"
											: line.includes("🚀") || line.includes("✨")
												? "text-blue-400 dark:text-blue-300"
												: ""
								}
							>
								{line}
							</div>
						))
					)}
				</div>

				{error && (
					<div className="mb-2 flex items-center gap-2 text-sm text-red-500 dark:text-red-400">
						<AlertCircle size={16} />
						<span>{error}</span>
					</div>
				)}

				<form
					onSubmit={(e) => {
						e.preventDefault();
						executeDirectCommand();
					}}
					className="flex gap-2"
				>
					<Input
						ref={commandInputRef}
						value={command}
						onChange={(e) => setCommand(e.target.value)}
						placeholder="Amri ya moja kwa moja (mf. washa(1))"
						className="font-mono text-sm"
						disabled={programState === "running"}
					/>
					<Button type="submit" disabled={programState === "running"}>
						Tekeleza
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
