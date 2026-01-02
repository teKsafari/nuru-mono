"use client";

import type { ComponentState } from "@/types/electronics";
import { LED } from "./LED";
import { Buzzer } from "./Buzzer";
import { Motor } from "./Motor";

interface ElectronicsDisplayProps {
	components: ComponentState[];
}

/**
 * ElectronicsDisplay - Simplified display component for playground integration
 *
 * This component renders LEDs, Buzzers, and Motors based on the provided
 * component states. It has no controls - those are handled by the playground.
 */
export function ElectronicsDisplay({ components }: ElectronicsDisplayProps) {
	const leds = components.filter((c) => c.type === "led");
	const buzzers = components.filter((c) => c.type === "buzzer");
	const motors = components.filter((c) => c.type === "motor");

	return (
		<div className="flex h-full w-full items-center justify-center">
			<div className="flex flex-col items-center gap-8 rounded-lg bg-slate-50/50 p-8 dark:bg-slate-900/50">
				{/* LEDs Row */}
				{leds.length > 0 && (
					<div className="flex items-center justify-center gap-8">
						{leds.map((component) => (
							<LED
								key={component.pin}
								pin={component.pin}
								isEnabled={component.isEnabled}
								color={component.color}
							/>
						))}
					</div>
				)}

				{/* Buzzer and Motor Row */}
				{(buzzers.length > 0 || motors.length > 0) && (
					<div className="flex items-center justify-center gap-16">
						{buzzers.map((component) => (
							<Buzzer
								key={component.pin}
								pin={component.pin}
								isEnabled={component.isEnabled}
							/>
						))}
						{motors.map((component) => (
							<Motor
								key={component.pin}
								pin={component.pin}
								isEnabled={component.isEnabled}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
