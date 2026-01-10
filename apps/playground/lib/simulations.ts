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
	disable2D?: boolean;
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

const DEFAULT_MODEL = "/models/Arduino-full.glb";

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
			modelPath: "/models/Arduino-three-LEDs.glb",
			mappings: {
				RED: { type: "LED", pin: 1, colorHex: 0xff0000, offColorHex: 0x440000 },
				GREEN: { type: "LED", pin: 2, colorHex: 0xffff00, offColorHex: 0x333300 }, // Using Green mesh as Yellow
				BLUE: { type: "LED", pin: 3, colorHex: 0x00ff00, offColorHex: 0x003300 }, // Using Blue mesh as Green
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
			modelPath: "/models/arduino-single-led.glb",
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
	{
		id: "push-button",
		name: "Batanikizo",
		description: "Mfano wa batanikizo (Push Button) na LED.",
		keywords: ["button", "push", "batanikizo", "led", "switch"],
		nodes: [
			{
				id: "1",
				type: "led",
				position: { x: 100, y: 100 },
				data: { isEnabled: false, color: "red", pin: 7, label: "LED" },
			},
            // Note: Button input handling in Nuru might be limited, but the simulation visualizes it
		],
		edges: [],
		rendererConfig: {
			modelPath: "/models/arduino-pushbutton.glb",
			mappings: {
				LED: { type: "LED", pin: 7, colorHex: 0xff0000, offColorHex: 0x440000 },
                // BUTTON mapping might be needed if visual feedback from code is possible, or just for the internal logic of the scene
			},
            disable2D: true, // Button component doesn't exist in 2D yet
            initialCameraPosition: [12, 8, 12]
		},
	},
    {
		id: "four-led-buzzer",
		name: "4 LEDs & Buzzer",
		description: "Taa nne na kengele (Buzzer) kwa ajili ya mifumo ya alarm.",
		keywords: ["led", "buzzer", "alarm", "kengele", "nne"],
		nodes: [
			{ id: "1", type: "led", position: { x: 50, y: 50 }, data: { isEnabled: false, color: "red", pin: 1, label: "RED" } },
            { id: "2", type: "led", position: { x: 150, y: 50 }, data: { isEnabled: false, color: "red", pin: 2, label: "RED1" } },
            { id: "3", type: "led", position: { x: 250, y: 50 }, data: { isEnabled: false, color: "red", pin: 3, label: "RED2" } },
            { id: "4", type: "led", position: { x: 350, y: 50 }, data: { isEnabled: false, color: "red", pin: 4, label: "RED3" } },
            { id: "5", type: "buzzer", position: { x: 200, y: 150 }, data: { isEnabled: false, pin: 5, label: "BUZZER" } },
		],
		edges: [],
		rendererConfig: {
			modelPath: "/models/4LEDBuzzer.glb",
			mappings: {
				RED: { type: "LED", pin: 1, colorHex: 0xff0000, offColorHex: 0x440000 },
                RED1: { type: "LED", pin: 2, colorHex: 0xff0000, offColorHex: 0x440000 },
                RED2: { type: "LED", pin: 3, colorHex: 0xff0000, offColorHex: 0x440000 },
                RED3: { type: "LED", pin: 4, colorHex: 0xff0000, offColorHex: 0x440000 },
                BUZZER: { type: "BUZZER", pin: 5 }
			},
            disable2D: false
		},
	},
    {
		id: "nine-led",
		name: "9 LEDs Display",
		description: "Onyesho la taa tisa (9) za rangi mbalimbali.",
		keywords: ["led", "display", "matrix", "tisa", "nying", "rangi"],
		nodes: Array.from({ length: 9 }, (_, i) => ({
            id: `${i + 1}`,
            type: "led",
            position: { x: 50 + (i % 3) * 100, y: 50 + Math.floor(i / 3) * 100 },
            data: { 
                isEnabled: false, 
                color: i < 3 ? "red" : i < 6 ? "yellow" : "green", 
                pin: i + 1,
                label: i < 3 ? `RED${i+1}` : i < 6 ? `YELLOW${i-2}` : `GREEN${i-5}`
            },
        })),
		edges: [],
		rendererConfig: {
			modelPath: "/models/9LED.glb",
			mappings: {
				RED1: { type: "LED", pin: 1, colorHex: 0xff0000, offColorHex: 0x440000 },
                RED2: { type: "LED", pin: 2, colorHex: 0xff0000, offColorHex: 0x440000 },
                RED3: { type: "LED", pin: 3, colorHex: 0xff0000, offColorHex: 0x440000 },
                YELLOW1: { type: "LED", pin: 4, colorHex: 0xffdd00, offColorHex: 0x443300 },
                YELLOW2: { type: "LED", pin: 5, colorHex: 0xffdd00, offColorHex: 0x443300 },
                YELLOW3: { type: "LED", pin: 6, colorHex: 0xffdd00, offColorHex: 0x443300 },
                GREEN1: { type: "LED", pin: 7, colorHex: 0x00ff44, offColorHex: 0x004411 },
                GREEN2: { type: "LED", pin: 8, colorHex: 0x00ff44, offColorHex: 0x004411 },
                GREEN3: { type: "LED", pin: 9, colorHex: 0x00ff44, offColorHex: 0x004411 },
			},
		},
	},
    {
		id: "vu-meter",
		name: "VU Meter",
		description: "Kipimo cha sauti (VU Meter) kwa kutumia LEDs.",
		keywords: ["vu", "meter", "sound", "sauti", "level"],
		nodes: [
            { id: "1", type: "led", position: { x: 50, y: 50 }, data: { isEnabled: false, color: "white", pin: 1, label: "WHITE" } },
            { id: "2", type: "led", position: { x: 50, y: 150 }, data: { isEnabled: false, color: "yellow", pin: 2, label: "YELLOW" } },
            { id: "3", type: "led", position: { x: 50, y: 250 }, data: { isEnabled: false, color: "green", pin: 3, label: "GREEN" } },
            { id: "4", type: "led", position: { x: 50, y: 350 }, data: { isEnabled: false, color: "blue", pin: 4, label: "BLUE" } },
            { id: "5", type: "led", position: { x: 50, y: 450 }, data: { isEnabled: false, color: "red", pin: 5, label: "RED" } },
        ],
		edges: [],
		rendererConfig: {
			modelPath: "/models/vu-meter.glb",
			mappings: {
				WHITE: { type: "LED", pin: 1, colorHex: 0xffffff, offColorHex: 0x444444 },
                YELLOW: { type: "LED", pin: 2, colorHex: 0xffdd00, offColorHex: 0x443300 },
                GREEN: { type: "LED", pin: 3, colorHex: 0x00ff44, offColorHex: 0x004411 },
                BLUE: { type: "LED", pin: 4, colorHex: 0x0088ff, offColorHex: 0x002244 },
                RED: { type: "LED", pin: 5, colorHex: 0xff0000, offColorHex: 0x440000 },
			},
		},
	},
    {
		id: "simple-led",
		name: "Taa Moja (Single LED)",
		description: "Mfano rahisi wa taa moja ya LED.",
		keywords: ["led", "single", "moja", "taa"],
		nodes: [
			{
				id: "1",
				type: "led",
				position: { x: 100, y: 100 },
				data: { isEnabled: false, color: "red", pin: 7, label: "LED" },
			},
		],
		edges: [],
		rendererConfig: {
			modelPath: "/models/arduino-led.glb",
			mappings: {
				LED: { type: "LED", pin: 7, colorHex: 0xff0000, offColorHex: 0x440000 },
			},
		},
	},
];
