"use client";

import { Playground } from "@/components/playground/playground";
import { ElectronicsDisplay } from "@/components/electronics";
import { useElectronicsExecutor } from "@/hooks/useElectronicsExecutor";
import { EXAMPLE_CODE } from "@/lib/electronicsExecutor";
import type { LessonContent } from "@/types/playground";

export default function IntegratedElectronicsPage() {
	const { executor, components } = useElectronicsExecutor();

	const lesson: LessonContent = {
		title: "Elektroniki - Jifunze kudhibiti vifaa kwa Kiswahili",
		initialCode: EXAMPLE_CODE,
		description: (
			<div className="space-y-6 leading-relaxed text-muted-foreground">
				<p>
					Jifunze kudhibiti vifaa vya elektroniki kama LED, buzzer, na motor kwa
					kutumia amri rahisi za Kiswahili. Hii ni njia nzuri ya kuelewa jinsi
					programu inavyodhibiti vifaa vya kimwili.
				</p>

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

				<div className="space-y-3">
					<h3 className="font-semibold text-foreground">Vifaa:</h3>
					<ul className="list-inside list-disc space-y-2">
						<li>
							<span className="text-red-500">●</span> LED Nyekundu (1)
						</li>
						<li>
							<span className="text-green-500">●</span> LED Kijani (2)
						</li>
						<li>
							<span className="text-blue-500">●</span> LED Bluu (3)
						</li>
						<li>
							<span className="text-yellow-500">◉</span> Buzzer (4)
						</li>
						<li>
							<span className="text-slate-400">⚙</span> Motor (5)
						</li>
					</ul>
				</div>

				<div className="mt-6 rounded-lg border border-border bg-secondary/50 p-4">
					<p className="break-words text-sm text-muted-foreground">
						<span className="font-semibold text-foreground">Kidokezo:</span>{" "}
						Bonyeza kitufe cha <strong>Run</strong> kuona matokeo ya programu
						yako kwenye terminali na vifaa vikifanya kazi kwenye simulation.
					</p>
				</div>
			</div>
		),
	};

	return (
		<Playground
			lesson={lesson}
			executor={executor}
			simulation={<ElectronicsDisplay components={components} />}
		/>
	);
}
