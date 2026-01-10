import { Node, Edge } from "@xyflow/react";

export interface RendererConfig {
	modelPath: string;
	mappings: Record<
		string,
		{
			type: "LED" | "BUZZER" | "MOTOR";
			pin: number;
			colorHex?: number;
			offColorHex?: number;
		}
	>;
	initialCameraPosition?: [number, number, number];
}

export interface SimulationDef {
	id: string;
	name: string;
	description: string;
	keywords: string[];
	nodes: Node[];
	edges: Edge[];
	rendererConfig: RendererConfig;
}

const DEFAULT_MODEL = "/models/Arduino-nuru.glb";

export const SIMULATIONS: SimulationDef[] = [
	{
		id: "traffic-lights",
		name: "Taa za Trafiki",
		description: "Mfumo wa taa za barabarani wenye taa nyekundu, njano, na kijani.",
		keywords: ["traffic", "lights", "taa", "barabarani", "red", "green", "yellow"],
		nodes: [
			{
				id: "1",
				type: "led",
				position: { x: 50, y: 50 },
				data: { isEnabled: false, color: "red", pin: 1, label: "Red" },
			},
			{
				id: "2",
				type: "led",
				position: { x: 50, y: 150 },
				data: { isEnabled: false, color: "yellow", pin: 2, label: "Yellow" },
			},
			{
				id: "3",
				type: "led",
				position: { x: 50, y: 250 },
				data: { isEnabled: false, color: "green", pin: 3, label: "Green" },
			},
		],
		edges: [],
		rendererConfig: {
			modelPath: DEFAULT_MODEL,
			mappings: {
				RED: { type: "LED", pin: 1, colorHex: 0xff0000, offColorHex: 0x440000 },
				YELLOW: { type: "LED", pin: 2, colorHex: 0xffff00, offColorHex: 0x444400 }, // Assuming model has YELLOW or we re-color GREEN? The code previously used GREEN for pin 2? No, wait.
                // Previous code: RED: 1, GREEN: 2, BLUE: 3.
                // Traffic light usually needs R, Y, G.
                // Let's check the previous LED_CONFIG: RED, GREEN, BLUE.
                // It seems the model might only have RGB. 
                // For traffic lights, we might need to be creative. 
                // If the model *only* has RED, GREEN, BLUE meshes, we can't make a YELLOW one appear unless we recolor one of them.
                // Let's assume we use GREEN as Yellow for now, or maybe the model has a YELLOW mesh? 
                // The user said "use specific simulations".
                // Let's map RED->1, GREEN->2 (Yellowish?), BLUE->3 (Green?). 
                // Wait, typically traffic lights are R, Y, G. 
                // Let's Map: RED -> 1 (Red), GREEN -> 2 (Yellow - by overriding color?), BLUE -> 3 (Green).
                // I will try to override the color in the config.
				GREEN: { type: "LED", pin: 2, colorHex: 0xffff00, offColorHex: 0x333300 }, // Re-purposing Green mesh as Yellow
				BLUE: { type: "LED", pin: 3, colorHex: 0x00ff00, offColorHex: 0x003300 }, // Re-purposing Blue mesh as Green
			},
		},
	},
	{
		id: "basic-blink",
		name: "Blink LED",
		description: "Taa moja inayowaka na kuzima.",
		keywords: ["blink", "led", "waka", "zima", "moja"],
		nodes: [
			{
				id: "1",
				type: "led",
				position: { x: 100, y: 100 },
				data: { isEnabled: false, color: "red", pin: 1 },
			},
		],
		edges: [],
		rendererConfig: {
			modelPath: DEFAULT_MODEL,
			mappings: {
				RED: { type: "LED", pin: 1, colorHex: 0xff0000, offColorHex: 0x440000 },
			},
		},
	},
	{
		id: "motor-control",
		name: "Udhibiti wa Moto",
		description: "Moto unaoweza kuwashwa na kuzimwa.",
		keywords: ["motor", "engine", "moto", "zunguka"],
		nodes: [
			{
				id: "1",
				type: "motor",
				position: { x: 100, y: 100 },
				data: { isEnabled: false, pin: 1 },
			},
		],
		edges: [],
		rendererConfig: {
			modelPath: DEFAULT_MODEL,
			mappings: {
				SHAFT: { type: "MOTOR", pin: 1 },
			},
		},
	},
	{
		id: "police-siren",
		name: "Siren ya Polisi",
		description: "Taa mbili za bluu na nyekundu zinazopokezana kuwaka.",
		keywords: ["police", "siren", "polisi", "alarm", "bluu", "nyekundu"],
		nodes: [
			{
				id: "1",
				type: "led",
				position: { x: 50, y: 100 },
				data: { isEnabled: false, color: "red", pin: 1 },
			},
			{
				id: "2",
				type: "led",
				position: { x: 150, y: 100 },
				data: { isEnabled: false, color: "blue", pin: 2 },
			},
			{
				id: "3",
				type: "buzzer",
				position: { x: 100, y: 200 },
				data: { isEnabled: false, pin: 3 },
			},
		],
		edges: [],
		rendererConfig: {
			modelPath: DEFAULT_MODEL,
			mappings: {
				RED: { type: "LED", pin: 1, colorHex: 0xff0000, offColorHex: 0x440000 },
				BLUE: { type: "LED", pin: 2, colorHex: 0x0000ff, offColorHex: 0x000033 },
				BUZZER: { type: "BUZZER", pin: 3 },
			},
		},
	},
];
