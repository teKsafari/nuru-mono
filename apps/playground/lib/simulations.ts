import { Node, Edge } from "@xyflow/react";

export interface SimulationDef {
	id: string;
	name: string;
	description: string;
	keywords: string[];
	nodes: Node[];
	edges: Edge[];
}

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
	},
];
