"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface MotorProps {
	isEnabled: boolean;
	pin: number;
}

export function Motor({ isEnabled, pin }: MotorProps) {
	// Track rotation position with a ref to avoid re-renders
	const rotationRef = useRef(0);
	const prevEnabledRef = useRef(isEnabled);

	// Update rotation immediately when deactivated
	useEffect(() => {
		// Handle motor stopping
		if (prevEnabledRef.current && !isEnabled) {
			// Capture the exact rotation at stop time
			const element = document.querySelector(
				`[data-motor-id="${pin}"]`,
			) as HTMLElement;
			if (element) {
				const transform = element.style.transform;
				if (transform) {
					const match = transform.match(/rotate\(([^)]+)deg\)/);
					if (match && match[1]) {
						const currentRotation = parseFloat(match[1]) % 360;
						rotationRef.current = currentRotation;
					}
				}
			}
		}

		prevEnabledRef.current = isEnabled;
	}, [isEnabled, pin]);

	return (
		<div className="flex flex-col items-center">
			<motion.div className="relative">
				<span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-500 dark:text-slate-400">
					{pin}
				</span>

				{/* Motor Base */}
				<div
					className={`relative flex h-16 w-24 items-center justify-center rounded-lg bg-slate-700 dark:bg-slate-800 ${isEnabled ? "ring-2 ring-blue-400 ring-opacity-70" : ""}`}
				>
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="z-10 flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 dark:bg-slate-900">
							<div className="h-2 w-2 rounded-full bg-slate-600 dark:bg-slate-700"></div>
						</div>
					</div>

					{/* Motor Shaft with enhanced spinning */}
					<motion.div
						className="absolute h-16 w-16"
						data-motor-id={pin}
						initial={{ rotate: rotationRef.current }}
						animate={{
							rotate: isEnabled
								? [rotationRef.current, rotationRef.current + 360]
								: rotationRef.current,
							scale: isEnabled ? [1, 1.03, 1] : 1,
						}}
						transition={{
							rotate: {
								repeat: isEnabled ? Number.POSITIVE_INFINITY : 0,
								duration: isEnabled ? 0.5 : 0,
								ease: "linear",
							},
							scale: {
								repeat: Number.POSITIVE_INFINITY,
								duration: 0.3,
							},
						}}
					>
						<div className="absolute left-1/2 top-1/2 h-8 w-1 -translate-x-1/2 -translate-y-1/2 bg-slate-400 dark:bg-slate-300"></div>
						<div className="absolute left-1/2 top-1/2 h-1 w-8 -translate-x-1/2 -translate-y-1/2 bg-slate-400 dark:bg-slate-300"></div>

						{/* Circular sector marker to visualize rotation */}
						<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
							<div className="relative h-10 w-10">
								{/* Sector marker */}
								<div
									className="absolute h-4 w-4 rounded-sm bg-yellow-300"
									style={{ top: "0px", left: "3px" }}
								></div>
							</div>
						</div>
					</motion.div>

					{/* Visual spinning indicator */}
					{isEnabled && (
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
				<div
					className={`absolute -bottom-2 left-0 h-4 w-4 ${isEnabled ? "bg-red-600" : "bg-red-500 dark:bg-red-700"} rounded-full border-2 border-slate-700 dark:border-slate-800`}
				></div>
				<div
					className={`absolute -bottom-2 right-0 h-4 w-4 ${isEnabled ? "bg-blue-600" : "bg-blue-500 dark:bg-blue-700"} rounded-full border-2 border-slate-700 dark:border-slate-800`}
				></div>
			</motion.div>
			<div className="mt-1 text-xs text-slate-600 dark:text-slate-400">
				MOTOR
			</div>
		</div>
	);
}
