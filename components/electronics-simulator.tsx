"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Play, Square } from "lucide-react";

type ComponentState = {
	active: boolean;
	type: "led" | "buzzer" | "motor";
	color?: string;
};

type ProgramState = "idle" | "running" | "paused";

export default function ElectronicsSimulator() {
	const [components, setComponents] = useState<ComponentState[]>([
		{ active: false, type: "led", color: "red" }, // Component 1: Red LED
		{ active: false, type: "led", color: "green" }, // Component 2: Green LED
		{ active: false, type: "led", color: "blue" }, // Component 3: Blue LED
		{ active: false, type: "buzzer" }, // Component 4: Buzzer
		{ active: false, type: "motor" }, // Component 5: Motor
	]);

	// Msimbo wa programu

	const exampleCode = `// Mfano: kawasha na kuzima vifaa vyote

washa(1)
subiri(200)
washa(2)
subiri(200)
washa(3)
subiri(200)
washa(4)
subiri(200)
washa(5)
subiri(200)

zima(1)
subiri(200)
zima(2)
subiri(200)
zima(3)
subiri(200)
zima(4)
subiri(200)
zima(5)
subiri(200)
    
    `;

	const [code, setCode] = useState(exampleCode);

	const [command, setCommand] = useState("");
	const [output, setOutput] = useState<string[]>([]);
	const [programState, setProgramState] = useState<ProgramState>("idle");
	const programStateRef = useRef<ProgramState>("idle");
	const [currentLine, setCurrentLine] = useState(-1);
	const [error, setError] = useState<string | null>(null);
	const [loop, setLoop] = useState(true);
	const [codeCleared, setCodeCleared] = useState(false);

	const commandInputRef = useRef<HTMLInputElement>(null);
	const outputRef = useRef<HTMLDivElement>(null);
	const executionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Auto-scroll output to bottom
	useEffect(() => {
		if (outputRef.current) {
			outputRef.current.scrollTop = outputRef.current.scrollHeight;
		}
	}, [output]);

	const addOutput = (message: string, type: "info" | "error" | "success" = "info") => {
		const timestamp = new Date().toLocaleTimeString();
		const prefix = type === "error" ? "❌" : type === "success" ? "✅" : "ℹ️";
		setOutput((prev) => [...prev, `[${timestamp}] ${prefix} ${message}`]);
	};

	const executeCommand = (cmd: string): Promise<void> => {
		return new Promise((resolve, reject) => {
			const trimmedCmd = cmd.trim();

			if (!trimmedCmd || trimmedCmd.startsWith("//")) {
				resolve();
				return;
			}

			// Tafsiri amri
			const washaMatch = trimmedCmd.match(/^washa\((\d+)\)$/);
			const zimaMatch = trimmedCmd.match(/^zima\((\d+)\)$/);
			const subiriMatch = trimmedCmd.match(/^subiri\((\d+)\)$/);

			if (washaMatch) {
				const componentIndex = Number.parseInt(washaMatch[1]) - 1;
				if (componentIndex >= 0 && componentIndex < components.length) {
					setComponents((prev) => prev.map((comp, i) => (i === componentIndex ? { ...comp, active: true } : comp)));
					addOutput(`Kifaa nambari ${componentIndex + 1} kimewashwa`, "success");
					resolve();
				} else {
					const errorMsg = `Nambari ya kifaa si sahihi: ${componentIndex + 1}`;
					addOutput(errorMsg, "error");
					reject(new Error(errorMsg));
				}
			} else if (zimaMatch) {
				const componentIndex = Number.parseInt(zimaMatch[1]) - 1;
				if (componentIndex >= 0 && componentIndex < components.length) {
					setComponents((prev) => prev.map((comp, i) => (i === componentIndex ? { ...comp, active: false } : comp)));
					addOutput(`Kifaa nambari ${componentIndex + 1} kimezimwa`, "success");
					resolve();
				} else {
					const errorMsg = `Nambari ya kifaa si sahihi: ${componentIndex + 1}`;
					addOutput(errorMsg, "error");
					reject(new Error(errorMsg));
				}
			} else if (subiriMatch) {
				const delayMs = Number.parseInt(subiriMatch[1]);
				addOutput(`Inasubiri kwa ${delayMs}ms...`);
				executionTimeoutRef.current = setTimeout(() => {
					addOutput(`Muda wa kusubiri umeisha`);
					resolve();
				}, delayMs);
			} else {
				const errorMsg = `Amri haijulikani: ${trimmedCmd}`;
				addOutput(errorMsg, "error");
				reject(new Error(errorMsg));
			}
		});
	};
	const runProgram = async () => {
		if (programStateRef.current === "running") return;

		setProgramState("running");
		programStateRef.current = "running";
		setCurrentLine(-1);
		setError(null);
		addOutput("🚀 Kuanzisha utekelezaji wa programu...");

		const lines = code.split("\n");

		// Msaidizi wa kutekeleza kila mstari mmoja baada ya mwingine
		const runLine = async (i: number): Promise<void> => {
			if (i >= lines.length) {
				if (loop && programStateRef.current === "running") {
					setCurrentLine(-1);
					setTimeout(() => runLine(0), 0);
					return;
				} else {
					// Mwisho wa programu, simamisha utekelezaji
					addOutput("✨ Programu imekamilika kwa mafanikio!", "success");
					setProgramState("idle");
					programStateRef.current = "idle";
					setCurrentLine(-1);
					return;
				}
			}
			if (programStateRef.current !== "running") {
				setCurrentLine(-1);
				return;
			}
			setCurrentLine(i);
			const line = lines[i].trim();
			if (line && !line.startsWith("//")) {
				addOutput(`Inatekeleza: ${line}`);
				try {
					await executeCommand(line);
				} catch (error) {
					addOutput(`Programu imesimama kutokana na kosa: ${error}", "error`);
					setProgramState("idle");
					programStateRef.current = "idle";
					setError(error instanceof Error ? error.message : String(error));
					setCurrentLine(-1);
					return;
				}
			}
			// Nenda kwenye mstari unaofuata baada ya amri ya sasa kukamilika
			setTimeout(() => runLine(i + 1), 0);
		};

		runLine(0);
	};

	const stopProgram = () => {
		if (executionTimeoutRef.current) {
			clearTimeout(executionTimeoutRef.current);
			executionTimeoutRef.current = null;
		}
		setProgramState("idle");
		programStateRef.current = "idle";
		setCurrentLine(-1);
		addOutput("⏹️ Utekelezaji wa programu umesimamishwa", "info");
	};

	const resetComponents = () => {
		setComponents((prev) => prev.map((comp) => ({ ...comp, active: false })));
		addOutput("🔄 Vifaa vyote vimeresetishwa", "info");
	};

	const executeDirectCommand = () => {
		if (!command.trim()) return;

		addOutput(`> ${command}`);
		executeCommand(command)
			.then(() => {
				setError(null);
			})
			.catch((err) => {
				setError(err.message);
			});

		setCommand("");
		commandInputRef.current?.focus();
	};

	const clearOutput = () => {
		setOutput([]);
	};

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-screen max-h-screen p-4">
			{/* Upande wa Kushoto - Mhariri wa Msimbo na Terminal */}
			<div className="flex flex-col gap-4 h-full ">
				{/* Mhariri wa Msimbo */}
				<Card className="flex-1 border-[1px] border-accent dark:bg-slate-900">
					<CardContent className="p-4 h-full flex flex-col">
						<div className="flex items-center justify-between mb-4">
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
									variant="outline"
									className="flex items-center gap-2"
								>
									{codeCleared ? "Onyesha Mfano" : "Safisha"}
								</Button>
							</div>
							<div className="flex gap-2 items-center">
								<label className={`flex items-center gap-1 text-xs select-none ${programState === "running" ? "text-slate-400 dark:text-slate-500" : ""}`}>
									<input type="checkbox" checked={loop} onChange={(e) => setLoop(e.target.checked)} className="accent-blue-600" disabled={programState === "running"} />
									Rudiarudia (loop)
								</label>
								<Button onClick={runProgram} disabled={programState === "running"} size="sm" className="flex items-center gap-2">
									{programState === "running" ? " ..." : <Play size={16} />}
								</Button>
								<Button
									onClick={() => {
										stopProgram();
										resetComponents();
									}}
									disabled={programState !== "running"}
									size="sm"
									variant="destructive"
									className="flex items-center gap-2"
								>
									<Square size={16} />
								</Button>
							</div>
						</div>

						<div className="flex-1 relative">
							<Textarea
								value={code}
								onChange={(e) => {
									setCode(e.target.value);
									setCodeCleared(e.target.value === "");
								}}
								className="font-mono text-sm h-full resize-none bg-slate-50 dark:bg-background"
								placeholder="Andika programu yako ya elektroniki hapa..."
								disabled={programState === "running"}
							/>

							{/* Angazia mstari wa sasa wa utekelezaji */}
							{currentLine >= 0 && (
								<div
									className="absolute left-0 right-0 bg-yellow-200 opacity-30 pointer-events-none"
									style={{
										top: `${currentLine * 1.5}rem`,
										height: "1.5rem",
									}}
								/>
							)}
						</div>

						{programState === "running" && (
							<div className="mt-2 text-sm text-blue-600 dark:text-blue-400 flex items-center gap-2">
								<div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse" />
								Programu inaendelea... (Mstari {currentLine + 1})
							</div>
						)}
					</CardContent>
				</Card>

				{/* Terminal */}
				<Card className="h-80 border-[1px] dark:bg-slate-900">
					<CardContent className="p-4 h-full flex flex-col">
						<div className="flex items-center justify-between mb-2">
							<h3 className="text-lg font-medium">Terminali</h3>
							<Button onClick={clearOutput} size="sm" variant="outline">
								Futa
							</Button>
						</div>

						<div ref={outputRef} className="bg-slate-100 dark:bg-slate-950 dark:text-slate-100 p-3 rounded-lg flex-1 overflow-y-auto font-mono text-sm mb-4">
							{output.length === 0 ? (
								<div className="text-slate-500 dark:text-slate-400 italic">Matokeo yataonekana hapa...</div>
							) : (
								output.map((line, i) => (
									<div key={i} className={line.includes("❌") ? "text-red-400 dark:text-red-400" : line.includes("✅") ? "text-green-400 dark:text-green-400" : line.includes("🚀") || line.includes("✨") ? "text-blue-400 dark:text-blue-300" : ""}>
										{line}
									</div>
								))
							)}
						</div>

						{error && (
							<div className="flex items-center gap-2 text-red-500 dark:text-red-400 mb-2 text-sm">
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
							<Input ref={commandInputRef} value={command} onChange={(e) => setCommand(e.target.value)} placeholder="Amri ya moja kwa moja (mf. washa(1))" className="font-mono text-sm" disabled={programState === "running"} />
							<Button type="submit" disabled={programState === "running"}>
								Tekeleza
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>

			{/* Upande wa Kulia - Vifaa vya Elektroniki */}
			<Card className="max-w-md w-full border-[1px] dark:bg-slate-900">
				<CardContent className="p-6 h-full">
					<h3 className="text-lg font-medium mb-4">Vifaa vya Elektroniki</h3>
					<div className="mb-20 text-sm text-muted-foreground">
						<div className="font-medium">Nambari za Vifaa:</div>
						<div>1: LED Nyekundu</div>
						<div>2: LED ya Kijani</div>
						<div>3: LED ya Buluu</div>
						<div>4: Buzzer</div>
						<div>5: Motor</div>
					</div>
					<div className="border-[1px] border-accent rounded-lg p-8 flex items-center justify-center bg-slate-50 dark:bg-background">
						<div className="flex flex-col items-center">
							<div className="grid grid-cols-1 gap-12">
								{/* LED */}
								<div className="flex justify-center items-center gap-8">
									<LED active={components[0].active} color="red" label="1" />
									<LED active={components[1].active} color="green" label="2" />
									<LED active={components[2].active} color="blue" label="3" />
								</div>
								{/* Buzzer na Motor */}
								<div className="flex justify-center items-center gap-16">
									<Buzzer active={components[3].active} label="4" />
									<Motor active={components[4].active} label="5" />
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

// LED Component
function LED({ active, color, label }: { active: boolean; color: string; label: string }) {
	const ledColors = {
		red: {
			off: "bg-red-200 dark:bg-red-950",
			on: "bg-red-500 dark:bg-red-600",
			glow: "shadow-[0_0_10px_#ef4444] dark:shadow-[0_0_15px_#ef4444]",
		},
		green: {
			off: "bg-green-200 dark:bg-green-950",
			on: "bg-green-500 dark:bg-green-600",
			glow: "shadow-[0_0_10px_#22c55e] dark:shadow-[0_0_15px_#22c55e]",
		},
		blue: {
			off: "bg-blue-200 dark:bg-blue-950",
			on: "bg-blue-500 dark:bg-blue-600",
			glow: "shadow-[0_0_10px_#3b82f6] dark:shadow-[0_0_15px_#3b82f6]",
		},
	};

	const colorConfig = ledColors[color as keyof typeof ledColors];

	return (
		<div className="flex flex-col items-center">
			<motion.div className={`w-12 h-12 rounded-full flex items-center justify-center ${active ? colorConfig.on : colorConfig.off} ${active ? colorConfig.glow : ""} transition-colors`} initial={{ scale: 1 }} animate={{ scale: active ? [1, 1.05, 1] : 1 }} transition={{ duration: 0.3 }}>
				<span className="text-xs font-bold text-white opacity-70">{label}</span>
			</motion.div>
			<div className="text-xs mt-1 text-slate-600 dark:text-slate-400">{color.toUpperCase()}</div>
		</div>
	);
}

// Buzzer Component with Sound
function Buzzer({ active, label }: { active: boolean; label: string }) {
	const audioContextRef = useRef<AudioContext | null>(null);
	const oscillatorRef = useRef<OscillatorNode | null>(null);
	const gainNodeRef = useRef<GainNode | null>(null);

	useEffect(() => {
		// Initialize audio context on first render
		if (!audioContextRef.current) {
			try {
				audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
			} catch {
				console.warn("Web Audio API not supported");
			}
		}

		if (active && audioContextRef.current) {
			// Create and start buzzer sound
			try {
				// Resume audio context if it's suspended (required by browser policies)
				if (audioContextRef.current.state === "suspended") {
					audioContextRef.current.resume();
				}

				// Create oscillator for buzzer tone
				const oscillator = audioContextRef.current.createOscillator();
				const gainNode = audioContextRef.current.createGain();

				// Set buzzer frequency (800Hz is a typical buzzer frequency)
				oscillator.frequency.setValueAtTime(1200, audioContextRef.current.currentTime);
				oscillator.type = "sine"; // Square wave for buzzer-like sound

				// Set volume (start low to avoid being too loud)
				gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);

				// Connect audio nodes
				oscillator.connect(gainNode);
				gainNode.connect(audioContextRef.current.destination);

				// Start the sound
				oscillator.start();

				// Store references for cleanup
				oscillatorRef.current = oscillator;
				gainNodeRef.current = gainNode;
			} catch (error) {
				console.warn("Could not create buzzer sound:", error);
			}
		} else if (!active && oscillatorRef.current) {
			// Stop the buzzer sound
			try {
				oscillatorRef.current.stop();
				oscillatorRef.current = null;
				gainNodeRef.current = null;
			} catch (error) {
				console.warn("Could not stop buzzer sound:", error);
			}
		}

		// Cleanup function
		return () => {
			if (oscillatorRef.current) {
				try {
					oscillatorRef.current.stop();
				} catch {
					// Oscillator might already be stopped
				}
				oscillatorRef.current = null;
				gainNodeRef.current = null;
			}
		};
	}, [active]);

	return (
		<div className="flex flex-col items-center">
			<motion.div
				className={`w-20 h-20 rounded-full bg-slate-800 dark:bg-slate-900 border-4 ${active ? "border-yellow-400" : "border-slate-600 dark:border-slate-700"} flex items-center justify-center relative`}
				animate={active ? { rotate: [0, 5, -5, 0] } : {}}
				transition={{
					repeat: active ? Number.POSITIVE_INFINITY : 0,
					duration: 0.2,
				}}
			>
				<span className="text-xs font-bold text-white opacity-70 absolute top-1">{label}</span>
				<div className="w-10 h-10 rounded-full bg-slate-700 dark:bg-slate-800 flex items-center justify-center">
					<div className={`w-6 h-6 rounded-full ${active ? "bg-yellow-400" : "bg-slate-600 dark:bg-slate-700"}`}></div>
				</div>

				{active && (
					<>
						<motion.div
							className="absolute -inset-1 rounded-full border-2 border-yellow-400 opacity-70"
							initial={{ scale: 1, opacity: 0.7 }}
							animate={{ scale: 1.2, opacity: 0 }}
							transition={{
								repeat: Number.POSITIVE_INFINITY,
								duration: 0.8,
								ease: "easeOut",
							}}
						/>
						<motion.div
							className="absolute -inset-3 rounded-full border-2 border-yellow-300 opacity-50"
							initial={{ scale: 1, opacity: 0.5 }}
							animate={{ scale: 1.4, opacity: 0 }}
							transition={{
								repeat: Number.POSITIVE_INFINITY,
								duration: 1,
								ease: "easeOut",
							}}
						/>
						<motion.div
							className="absolute -inset-5 rounded-full border-2 border-yellow-200 opacity-30"
							initial={{ scale: 1, opacity: 0.3 }}
							animate={{ scale: 1.6, opacity: 0 }}
							transition={{
								repeat: Number.POSITIVE_INFINITY,
								duration: 1.2,
								ease: "easeOut",
							}}
						/>
					</>
				)}
			</motion.div>
			<div className="text-xs mt-1 text-slate-600 dark:text-slate-400">BUZZER</div>
		</div>
	);
}

// Motor Component
function Motor({ active, label }: { active: boolean; label: string }) {
	// Track rotation position with a ref to avoid re-renders
	const rotationRef = useRef(0);
	// const [rotationPosition, setRotationPosition] = useState(0);
	const prevActiveRef = useRef(active);

	// Update rotation immediately when deactivated
	useEffect(() => {
		// Handle motor stopping
		if (prevActiveRef.current && !active) {
			// Capture the exact rotation at stop time
			const element = document.querySelector(`[data-motor-id="${label}"]`) as HTMLElement;
			if (element) {
				const transform = element.style.transform;
				if (transform) {
					const match = transform.match(/rotate\(([^)]+)deg\)/);
					if (match && match[1]) {
						const currentRotation = parseFloat(match[1]) % 360;
						rotationRef.current = currentRotation;
						// setRotationPosition(currentRotation);
					}
				}
			}
		}

		prevActiveRef.current = active;
	}, [active, label]);

	return (
		<div className="flex flex-col items-center">
			<motion.div className="relative">
				<span className="text-xs font-bold text-slate-500 dark:text-slate-400 absolute -top-6 left-1/2 -translate-x-1/2">{label}</span>

				{/* Motor Base */}
				<div className={`w-24 h-16 bg-slate-700 dark:bg-slate-800 rounded-lg flex items-center justify-center relative ${active ? "ring-2 ring-blue-400 ring-opacity-70" : ""}`}>
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="w-10 h-10 rounded-full bg-slate-800 dark:bg-slate-900 flex items-center justify-center z-10">
							<div className="w-2 h-2 rounded-full bg-slate-600 dark:bg-slate-700"></div>
						</div>
					</div>

					{/* Motor Shaft with enhanced spinning */}
					<motion.div
						className="w-16 h-16 absolute"
						data-motor-id={label}
						initial={{ rotate: rotationRef.current }}
						animate={{
							rotate: active ? [rotationRef.current, rotationRef.current + 360] : rotationRef.current,
							scale: active ? [1, 1.03, 1] : 1,
						}}
						transition={{
							rotate: {
								repeat: active ? Number.POSITIVE_INFINITY : 0,
								duration: active ? 0.5 : 0,
								ease: "linear",
								immediateRender: true,
							},
							scale: {
								repeat: Number.POSITIVE_INFINITY,
								duration: 0.3,
							},
						}}
					>
						<div className="absolute top-1/2 left-1/2 w-1 h-8 bg-slate-400 dark:bg-slate-300 -translate-x-1/2 -translate-y-1/2"></div>
						<div className="absolute top-1/2 left-1/2 w-8 h-1 bg-slate-400 dark:bg-slate-300 -translate-x-1/2 -translate-y-1/2"></div>

						{/* Circular sector marker to visualize rotation */}
						<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
							<div className="relative w-10 h-10">
								{/* Sector marker */}
								<div className="absolute w-4 h-4 bg-yellow-300 rounded-sm" style={{ top: "0px", left: "3px" }}></div>
							</div>
						</div>
					</motion.div>

					{/* Visual spinning indicator */}
					{active && (
						<motion.div
							className="absolute inset-0 rounded-lg border-2 border-blue-400 opacity-60"
							initial={{ scale: 1, opacity: 0.6 }}
							animate={{ scale: 1.1, opacity: 0 }}
							transition={{
								repeat: Number.POSITIVE_INFINITY,
								duration: 0.8,
								ease: "easeOut",
							}}
						/>
					)}
				</div>

				{/* Motor Terminals */}
				<div className={`absolute -bottom-2 left-0 w-4 h-4 ${active ? "bg-red-600" : "bg-red-500 dark:bg-red-700"} rounded-full border-2 border-slate-700 dark:border-slate-800`}></div>
				<div className={`absolute -bottom-2 right-0 w-4 h-4 ${active ? "bg-blue-600" : "bg-blue-500 dark:bg-blue-700"} rounded-full border-2 border-slate-700 dark:border-slate-800`}></div>
			</motion.div>
			<div className="text-xs mt-1 text-slate-600 dark:text-slate-400">MOTOR</div>
		</div>
	);
}
