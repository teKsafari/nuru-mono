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
	const { executor, components, updateConfig } = useElectronicsExecutor();
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

            // Calculate max pin to set correct component count for executor
            // Default to 5 if no nodes or pins found, but ensure at least enough for max pin
            const maxPin = initialNodes.reduce((max, node) => {
                const pin = node.data?.pin as number | undefined;
                return pin ? Math.max(max, pin) : max;
            }, 5); // Default min 5

            updateConfig({ componentCount: maxPin });

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

	// Logic to handle refinement/next lesson
	const [refinementPrompt, setRefinementPrompt] = useState("");
	const [isRefining, setIsRefining] = useState(false);

	const handleRefinement = async (promptOverride?: string) => {
		const promptToSend = promptOverride || refinementPrompt;
		if (!promptToSend) return;

		setIsRefining(true);
		
        // Get current context from local storage to include in request
        const currentData = JSON.parse(localStorage.getItem("wazia_result") || "{}");

		try {
			const res = await fetch("/api/imagine", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ 
                    prompt: promptToSend,
                    context: currentData 
                }),
			});

			if (!res.ok) throw new Error("Failed to refine lesson");

			const newData = await res.json();
			
            // Update local storage
			localStorage.setItem("wazia_result", JSON.stringify(newData));
            
            // Reload page to reflect changes (simplest way to reset everything correctly)
			window.location.reload();

		} catch (error) {
			console.error(error);
			alert("Samahani, imeshindikana kuboresha somo. Tafadhali jaribu tena.");
            setIsRefining(false);
		}
	};

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

    if (isRefining) {
		return (
			<div className="flex h-screen items-center justify-center bg-background text-foreground">
				<div className="flex flex-col items-center gap-4">
					<div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                    <p className="animate-pulse">Inaboresha somo lako...</p>
				</div>
			</div>
		);
	}

	return (
		<Playground
			lesson={{
                ...lesson,
                description: (
                    <div className="space-y-6">
                        {lesson.description}
                        
                        <div className="mt-8 pt-6 border-t border-border">
                            <h4 className="text-sm font-semibold mb-3">Hatua Inayofuata?</h4>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <Button 
                                    onClick={() => handleRefinement("Niwekee somo linalofuata kulingana na hili.")}
                                    variant="secondary" 
                                    size="sm"
                                >
                                    Somo Lijalo &rarr;
                                </Button>
                                <Button 
                                    onClick={() => handleRefinement("Fanya somo hili kuwa gumu zaidi, ongeza changamoto.")}
                                    variant="outline" 
                                    size="sm"
                                >
                                    Ongeza Ugumu
                                </Button>
                            </div>
                            
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={refinementPrompt}
                                    onChange={(e) => setRefinementPrompt(e.target.value)}
                                    placeholder="Mfano: Badilisha taa iwe bluu..."
                                    className="flex-1 px-3 py-1 text-sm bg-muted rounded-md border border-input focus:outline-none focus:ring-1 focus:ring-ring"
                                    onKeyDown={(e) => e.key === "Enter" && handleRefinement()}
                                />
                                <Button 
                                    onClick={() => handleRefinement()}
                                    size="sm"
                                    disabled={!refinementPrompt.trim()}
                                >
                                    Badilisha
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            }}
			executor={executor}
			nodes={nodes}
			onNodesChange={onNodesChange}
			nodeTypes={nodeTypes}
			rendererConfig={SIMULATIONS.find(s => s.id === (typeof window !== "undefined" ? JSON.parse(localStorage.getItem("wazia_result") || "{}").simulationId : null))?.rendererConfig}
		/>
	);
}
