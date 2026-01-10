"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useNodesState, Node } from "@xyflow/react";
import { Playground } from "@/components/playground/playground";
import { useElectronicsExecutor } from "@/hooks/useElectronicsExecutor";
import type { LessonContent } from "@/types/playground";
import { LEDNode, BuzzerNode, MotorNode } from "@/components/electronics/nodes";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SIMULATIONS } from "@/lib/simulations";

// Define node types outside component to avoid re-creation
const nodeTypes = {
	led: LEDNode,
	buzzer: BuzzerNode,
	motor: MotorNode,
};

export default function WaziaPage() {
	const router = useRouter();
	const { executor, components } = useElectronicsExecutor();
	const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
	const [lesson, setLesson] = useState<LessonContent | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Load data from localStorage
		const storedData = localStorage.getItem("wazia_result");
		if (!storedData) {
			router.push("/");
			return;
		}

		try {
			const data = JSON.parse(storedData);
			
            // Find the simulation definition to get initial nodes
            const simDef = SIMULATIONS.find(s => s.id === data.simulationId);
            const initialNodes = simDef ? simDef.nodes : [];

			// Set nodes
			setNodes(initialNodes);

			// Construct lesson content
			const lessonContent: LessonContent = {
				title: data.lesson.title,
				initialCode: data.code,
				description: (
					<div className="space-y-6 leading-relaxed text-muted-foreground">
						<p>{data.lesson.description}</p>
						
						<div className="space-y-3">
							<h3 className="font-semibold text-foreground">Jinsi inavyofanya kazi:</h3>
							<ul className="list-inside list-disc space-y-2">
								{data.lesson.steps.map((step: string, i: number) => (
									<li key={i}>{step}</li>
								))}
							</ul>
						</div>

                        <div className="mt-8">
                             <Link href="/">
                                <Button variant="outline" size="sm" className="gap-2">
                                    <ArrowLeft className="h-4 w-4" />
                                    Jaribu Wazo Lingine
                                </Button>
                             </Link>
                        </div>
					</div>
				),
			};

			setLesson(lessonContent);
		} catch (error) {
			console.error("Failed to parse wazia data", error);
			router.push("/");
		} finally {
			setLoading(false);
		}
	}, [router, setNodes]);

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

	if (loading || !lesson) {
		return (
			<div className="flex h-screen items-center justify-center bg-background text-foreground">
				<div className="flex flex-col items-center gap-4">
					<div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent"></div>
					<p>Inapakia wazo lako...</p>
				</div>
			</div>
		);
	}

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
