"use client";

import { useRef, useEffect, useState } from "react";
import "@wokwi/elements";

interface BuzzerProps {
	isEnabled: boolean;
	pin: number;
}

export function Buzzer({ isEnabled, pin }: BuzzerProps) {
	const audioContextRef = useRef<AudioContext | null>(null);
	const oscillatorRef = useRef<OscillatorNode | null>(null);
	const gainNodeRef = useRef<GainNode | null>(null);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

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

	if (!mounted) {
		return <div className="h-[75px] w-[75px]" />;
	}

	return (
		<div className="flex flex-col items-center">
			{/* @ts-ignore - Web Component */}
			<wokwi-buzzer hasSignal={isEnabled} />
			<div className="mt-1 text-xs text-slate-600 dark:text-slate-400">
				BUZZER {pin}
			</div>
		</div>
	);
}
