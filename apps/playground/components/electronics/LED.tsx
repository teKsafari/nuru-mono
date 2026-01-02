"use client";

import { motion } from "framer-motion";

interface LEDProps {
	isEnabled: boolean;
	color?: string;
	pin: number;
}

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

export function LED({ isEnabled, color = "red", pin }: LEDProps) {
	const colorConfig =
		ledColors[color as keyof typeof ledColors] || ledColors.red;

	return (
		<div className="flex flex-col items-center">
			<motion.div
				className={`flex h-12 w-12 items-center justify-center rounded-full ${isEnabled ? colorConfig.on : colorConfig.off} ${isEnabled ? colorConfig.glow : ""} transition-colors`}
				initial={{ scale: 1 }}
				animate={{ scale: isEnabled ? [1, 1.05, 1] : 1 }}
				transition={{ duration: 0.3 }}
			>
				<span className="text-xs font-bold text-white opacity-70">{pin}</span>
			</motion.div>
			<div className="mt-1 text-xs text-slate-600 dark:text-slate-400">
				{color.toUpperCase()}
			</div>
		</div>
	);
}
