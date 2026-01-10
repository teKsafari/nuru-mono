"use client";

import { useEffect, useMemo } from "react";
import { useNodesState, Node } from "@xyflow/react";
import { Playground } from "@/components/playground/playground";
import { useElectronicsExecutor } from "@/hooks/useElectronicsExecutor";
import { EXAMPLE_CODE } from "@/lib/electronicsExecutor";
import type { LessonContent } from "@/types/playground";
import { LEDNode, BuzzerNode, MotorNode } from "@/components/electronics/nodes";

// Define node types outside component to avoid re-creation
const nodeTypes = {
	led: LEDNode,
	buzzer: BuzzerNode,
	motor: MotorNode,
};

const initialNodes: Node[] = [
	// LEDs
	{
		id: "1",
		type: "led",
		position: { x: 50, y: 50 },
		data: { isEnabled: false, color: "red", pin: 1 },
	},
	{
		id: "2",
		type: "led",
		position: { x: 150, y: 50 },
		data: { isEnabled: false, color: "green", pin: 2 },
	},
	{
		id: "3",
		type: "led",
		position: { x: 250, y: 50 },
		data: { isEnabled: false, color: "blue", pin: 3 },
	},
	// Buzzer
	{
		id: "4",
		type: "buzzer",
		position: { x: 80, y: 180 },
		data: { isEnabled: false, pin: 4 },
	},
	// Motor
	{
		id: "5",
		type: "motor",
		position: { x: 220, y: 180 },
		data: { isEnabled: false, pin: 5 },
	},
];

export default function IntegratedElectronicsPage() {
	const { executor, components, updateConfig } = useElectronicsExecutor();
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

    // Ensure executor has enough components for these nodes
    useEffect(() => {
        const maxPin = initialNodes.reduce((max, node) => {
            const pin = node.data?.pin as number | undefined;
            return pin ? Math.max(max, pin) : max;
        }, 5);
        updateConfig({ componentCount: Math.max(maxPin, 20) }); // Default to at least 20 for experimentation
    }, [updateConfig]);

	// Sync executor state to nodes
	useEffect(() => {
		setNodes((nds) =>
			nds.map((node) => {
				const pin = node.data.pin as number;
				// Find component state by pin
				const comp = components.find((c) => c.pin === pin);

				if (comp && comp.isEnabled !== node.data.isEnabled) {
					return {
						...node,
						data: {
							...node.data,
							isEnabled: comp.isEnabled,
						},
					};
				}
				return node;
			}),
		);
	}, [components, setNodes]);

	const lesson: LessonContent = {
		title: "Elektroniki - Jifunze kudhibiti vifaa kwa Kiswahili",
		initialCode: EXAMPLE_CODE,
		description: (
			<div className="space-y-6 leading-relaxed text-muted-foreground">
				<p>
					Jifunze kudhibiti vifaa vya elektroniki kama LED, buzzer, na motor kwa
					kutumia amri rahisi za Kiswahili. Sasa unaweza pia kupanga vifaa hivi
					navyo unavyotaka!
				</p>

				{/* ... (Existing description content) ... */}

				<div className="space-y-3">
					<h3 className="font-semibold text-foreground">
						Amri zinazopatikana:
					</h3>
					<ul className="list-inside list-disc space-y-2">
						<li>
							<code className="rounded bg-background px-1 py-0.5 font-mono text-xs">
								washa(n)
							</code>{" "}
							- Washa kifaa nambari n
						</li>
						<li>
							<code className="rounded bg-background px-1 py-0.5 font-mono text-xs">
								zima(n)
							</code>{" "}
							- Zima kifaa nambari n
						</li>
						<li>
							<code className="rounded bg-background px-1 py-0.5 font-mono text-xs">
								subiri(ms)
							</code>{" "}
							- Subiri kwa millisekunde
						</li>
						<li>
							<code className="rounded bg-background px-1 py-0.5 font-mono text-xs">
								{"rudia(n) { ... }"}
							</code>{" "}
							- Rudia amri mara n
						</li>
					</ul>
				</div>

				<div className="mt-6 rounded-lg border border-border bg-secondary/50 p-4">
					<p className="break-words text-sm text-muted-foreground">
						<span className="font-semibold text-foreground">Kidokezo:</span>{" "}
						Jaribu kuburuta vifaa hivi kupanga muundo wako!
					</p>
				</div>
			</div>
		),
	};

	return (
		<Playground
			lesson={lesson}
			executor={executor}
			nodes={nodes}
			onNodesChange={onNodesChange}
			nodeTypes={nodeTypes}
		/>
	);
}
