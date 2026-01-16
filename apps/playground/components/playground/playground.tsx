"use client";

import { useState } from "react";
import { LessonPanel } from "./lesson-panel";
import { CodePanel } from "./code-panel";
import { SimulationPanel } from "./simulation-panel";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/playground/resizable";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileNav } from "./mobile-nav";
import { PlaygroundProps } from "@/types/playground";

export function Playground({
	lesson,
	executor,
	simulation,
	nodes = [],
	edges = [],
	onNodesChange,
	nodeTypes,
}: PlaygroundProps) {
	const isMobile = useIsMobile();
	const [activeTab, setActiveTab] = useState<"lesson" | "code" | "simulation">(
		"lesson",
	);
	const [code, setCode] = useState(lesson.initialCode);
	const [output, setOutput] = useState("");

	const handleRun = async () => {
		if (executor.onBeforeRun) {
			executor.onBeforeRun();
		}
		setOutput("Running...");
		try {
			const result = await executor.run(code);
			setOutput(result);
		} catch (error) {
			setOutput(`Error: ${error}`);
		}
	};

	const handleSubmit = async () => {
		setOutput("Testing...");
		try {
			const result = await executor.submit(code);
			setOutput(result);
		} catch (error) {
			setOutput(`Error: ${error}`);
		}
	};

	const handleShowSolution = () => {
		if (executor.getSolution) {
			setCode(executor.getSolution());
		}
	};

	const hasSimulation = simulation || (nodes && nodes.length > 0);

	if (isMobile) {
		return (
			<div className="flex max-h-full flex-1 flex-col bg-background">
				<MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
				<div className="flex-1 overflow-hidden">
					{activeTab === "lesson" ? (
						<LessonPanel lesson={lesson} />
					) : activeTab === "code" ? (
						<CodePanel
							code={code}
							output={output}
							onCodeChange={setCode}
							onRun={handleRun}
							onSubmit={handleSubmit}
							onShowSolution={handleShowSolution}
						/>
					) : hasSimulation ? (
						<SimulationPanel
							nodes={nodes}
							edges={edges}
							onNodesChange={onNodesChange}
							nodeTypes={nodeTypes}
							content={simulation}
						/>
					) : (
						<div className="flex h-full w-full items-center justify-center">
							<p className="text-green-500">No simulation available</p>
						</div>
					)}
				</div>
			</div>
		);
	}

	return (
		<div className="h-screen bg-background">
			<ResizablePanelGroup direction="horizontal" className="h-full">
				<ResizablePanel defaultSize={35} minSize={20}>
					<LessonPanel lesson={lesson} />
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel defaultSize={40} minSize={25}>
					<CodePanel
						code={code}
						output={output}
						onCodeChange={setCode}
						onRun={handleRun}
						onSubmit={handleSubmit}
						onShowSolution={handleShowSolution}
					/>
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel defaultSize={25} minSize={15}>
					<SimulationPanel
						nodes={nodes}
						edges={edges}
						onNodesChange={onNodesChange}
						nodeTypes={nodeTypes}
						content={simulation}
					/>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}
