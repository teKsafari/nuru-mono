"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface BuzzerProps {
	isEnabled: boolean;
	pin: number;
}

export function Buzzer({ isEnabled, pin }: BuzzerProps) {
	const audioContextRef = useRef<AudioContext | null>(null);
	const oscillatorRef = useRef<OscillatorNode | null>(null);
	const gainNodeRef = useRef<GainNode | null>(null);

	useEffect(() => {
		// Initialize audio context on first render
		if (!audioContextRef.current) {
			try {
				audioContextRef.current = new (
					window.AudioContext ||
					(window as unknown as { webkitAudioContext: typeof AudioContext })
						.webkitAudioContext
				)();
			} catch {
				console.warn("Web Audio API not supported");
			}
		}

		if (isEnabled && audioContextRef.current) {
			// Create and start buzzer sound
			try {
				// Resume audio context if it's suspended (required by browser policies)
				if (audioContextRef.current.state === "suspended") {
					audioContextRef.current.resume();
				}

				// Create oscillator for buzzer tone
				const oscillator = audioContextRef.current.createOscillator();
				const gainNode = audioContextRef.current.createGain();

				// Set buzzer frequency (1200Hz)
				oscillator.frequency.setValueAtTime(
					1200,
					audioContextRef.current.currentTime,
				);
				oscillator.type = "sine";

				// Set volume (low to avoid being too loud)
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
		} else if (!isEnabled && oscillatorRef.current) {
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
	}, [isEnabled]);

	return (
		<div className="flex flex-col items-center">
			<motion.div
				className={`h-20 w-20 rounded-full border-4 bg-slate-800 dark:bg-slate-900 ${isEnabled ? "border-yellow-400" : "border-slate-600 dark:border-slate-700"} relative flex items-center justify-center`}
				animate={isEnabled ? { rotate: [0, 5, -5, 0] } : {}}
				transition={{
					repeat: isEnabled ? Number.POSITIVE_INFINITY : 0,
					duration: 0.2,
				}}
			>
				<span className="absolute top-1 text-xs font-bold text-white opacity-70">
					{pin}
				</span>
				<div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700 dark:bg-slate-800">
					<div
						className={`h-6 w-6 rounded-full ${isEnabled ? "bg-yellow-400" : "bg-slate-600 dark:bg-slate-700"}`}
					></div>
				</div>

				{isEnabled && (
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
			<div className="mt-1 text-xs text-slate-600 dark:text-slate-400">
				BUZZER
			</div>
		</div>
	);
}
