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
import { Play, Send, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface SimulationPanelProps {
	nodes: Node[];
	edges: Edge[];
	onNodesChange?: OnNodesChange;
	nodeTypes?: NodeTypes;
	content?: React.ReactNode;
	onRun?: () => void;
	onSubmit?: () => void;
	onShowSolution?: () => void;
}

export function SimulationPanel({
	nodes,
	edges,
	onNodesChange,
	nodeTypes,
	content,
	onRun,
	onSubmit,
	onShowSolution,
}: SimulationPanelProps) {
	const [is3D, setIs3D] = useState(false);
	const isMobile = useIsMobile();

	if (is3D) {
		return (
			<SimulationPanel3D nodes={nodes} onToggleView={() => setIs3D(false)} />
		);
	}

	return (
		<div className="h-full w-full flex flex-col">
			{isMobile && (onRun || onSubmit || onShowSolution) && (
				<div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-card">
					{onSubmit && (
						<Button
							onClick={onSubmit}
							size="sm"
							className="bg-primary hover:bg-primary/90 text-primary-foreground h-7 px-3 text-xs"
						>
							<Send className="w-3 h-3 mr-1.5" />
							Submit
						</Button>
					)}
					{onRun && (
						<Button
							variant="secondary"
							size="sm"
							onClick={onRun}
							className="h-7 px-3 text-xs"
						>
							<Play className="w-3 h-3 mr-1.5" />
							Run
						</Button>
					)}
					{onShowSolution && (
						<Button
							variant="secondary"
							size="sm"
							onClick={onShowSolution}
							className="h-7 px-3 text-xs"
						>
							<Eye className="w-3 h-3 mr-1.5" />
							Solution
						</Button>
					)}
				</div>
			)}
			<div className="flex-1">
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
		</div>
	);
}
