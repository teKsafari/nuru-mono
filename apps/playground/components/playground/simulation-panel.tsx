"use client";

import {
	ReactFlow,
	Background,
	Controls,
	BackgroundVariant,
	Node,
	Edge,
	NodeTypes,
	OnNodesChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

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
				<Controls className="border-slate-700 bg-slate-800 text-slate-300 [&>button:hover]:bg-slate-700 [&>button]:border-slate-700 [&>button]:bg-slate-800 [&>button]:text-slate-300" />
				{content}
			</ReactFlow>
		</div>
	);
}
