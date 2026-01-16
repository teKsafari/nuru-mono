import React from "react";
import type { Node, Edge, NodeTypes, OnNodesChange } from "@xyflow/react";

export interface LanguageExecutor {
	language: string;
	run: (code: string) => Promise<string>;
	submit: (code: string) => Promise<string>;
	getSolution?: () => string;
	// Callback before execution starts (for resetting components, etc.)
	onBeforeRun?: () => void;
}

export interface LessonContent {
	title: string;
	description: React.ReactNode;
	initialCode: string;
	simulation?: React.ReactNode;
	// New ReactFlow props
	initialNodes?: Node[];
	initialEdges?: Edge[];
	nodeTypes?: NodeTypes;
}

export interface PlaygroundProps {
	lesson: LessonContent;
	executor: LanguageExecutor;
	simulation?: React.ReactNode;
	// New ReactFlow props
	nodes?: Node[];
	edges?: Edge[];
	onNodesChange?: OnNodesChange;
	nodeTypes?: NodeTypes;
}
