"use client";

import { useCallback } from "react";
import {
	ReactFlow,
	Background,
	Controls,
	BackgroundVariant,
	MiniMap,
	addEdge,
	useNodesState,
	useEdgesState,
	type Node,
	type Edge,
	type Connection,
	Handle,
	Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const initialNodes: Node[] = [
	{
		id: "1",
		type: "codeBlock",
		position: { x: 50, y: 100 },
		data: { label: "code", code: "package main\nfunc main(){...}" },
	},
	{
		id: "2",
		type: "process",
		position: { x: 280, y: 100 },
		data: { label: "compiler", subtitle: "go build" },
	},
	{
		id: "3",
		type: "output",
		position: { x: 480, y: 100 },
		data: { label: "executable", subtitle: "./hello" },
	},
];

const initialEdges: Edge[] = [
	{
		id: "e1-2",
		source: "1",
		target: "2",
		animated: true,
		style: { stroke: "#22d3d1" },
	},
	{
		id: "e2-3",
		source: "2",
		target: "3",
		animated: true,
		style: { stroke: "#22d3d1" },
	},
];

interface SimulationPanelProps {
	nodes: Node[];
	edges: Edge[];
	content?: React.ReactNode;
}

export function SimulationPanel({
	nodes,
	edges,
	content,
}: SimulationPanelProps) {
	return (
		<div className="h-full w-full">
			<ReactFlow
				fitView
				className="bg-slate-950"
				proOptions={{ hideAttribution: true }}
			>
				<Background
					variant={BackgroundVariant.Cross}
					color="#334155"
					gap={40}
				/>
				<Controls className="butt border-slate-700 bg-slate-800 text-slate-300 [&>button:hover]:bg-slate-700 [&>button]:border-slate-700 [&>button]:bg-slate-800 [&>button]:text-slate-300" />
				{content}
			</ReactFlow>
		</div>
	);
}
