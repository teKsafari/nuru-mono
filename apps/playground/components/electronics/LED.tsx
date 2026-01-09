"use client";

import "@wokwi/elements";
import { useEffect, useState } from "react";

interface LEDProps {
	isEnabled: boolean;
	color?: string;
	pin: number;
}

export function LED({ isEnabled, color = "red", pin }: LEDProps) {
	// Ensure component is mounted to avoid hydration namespace mismatches if any
	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return <div className="h-[72px] w-[42px]" />; // Placeholder size roughly matching the LED
	}

	return (
		<div className="flex flex-col items-center">
			{/* @ts-ignore - Web Component */}
			<wokwi-led color={color} value={isEnabled} label={pin.toString()} />
			<div className="mt-1 text-xs text-slate-600 dark:text-slate-400">
				{color.toUpperCase()}
			</div>
		</div>
	);
}
