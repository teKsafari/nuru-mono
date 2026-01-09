"use client";

import { useState } from "react";
import {
	ReactFlow,
	Background,
	Controls,
	ControlButton,
	BackgroundVariant,
	Node,
	Edge,
	NodeTypes,
	OnNodesChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { SimulationPanel3D } from "./simulation-panel-3d";

interface SimulationPanelProps {
	nodes: Node[];
	edges: Edge[];
	onNodesChange?: OnNodesChange;
	nodeTypes?: NodeTypes;
	content?: React.ReactNode;
}

export function SimulationPanel({
	nodes,
	edges,
	onNodesChange,
	nodeTypes,
	content,
}: SimulationPanelProps) {
	const [is3D, setIs3D] = useState(false);

	if (is3D) {
		return (
			<SimulationPanel3D nodes={nodes} onToggleView={() => setIs3D(false)} />
		);
	}

	return (
		<div className="h-full w-full">
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				nodeTypes={nodeTypes}
				fitView
				className="bg-slate-950"
				proOptions={{ hideAttribution: true }}
				minZoom={0.5}
				maxZoom={2}
			>
				<Background
					variant={BackgroundVariant.Dots}
					color="#334155"
					gap={20}
					size={1}
				/>
				<Controls className="border-slate-700 bg-slate-800 text-slate-300 [&>button:hover]:bg-slate-700 [&>button]:border-slate-700 [&>button]:bg-slate-800 [&>button]:text-slate-300">
					<ControlButton onClick={() => setIs3D(true)} title="3D view">
						3D
					</ControlButton>
				</Controls>
				{content}
			</ReactFlow>
		</div>
	);
}
