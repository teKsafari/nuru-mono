"use client"

import { Playground } from "@/components/playground/playground"
import { LanguageExecutor, LessonContent } from "@/types/playground";
import { executeNuru } from "@/lib/nuru";

export default function Home() {
  return <Playground lesson={nuruDemo} executor={nuruExecutor} />
}



const nuruExecutor: LanguageExecutor = {
	language: "Nuru",
	run: async (code) => {
		return await executeNuru(code);
	},
	submit: async (code) => {
		try {
			await executeNuru(code);
			return "✓ Submitted!";
		} catch (e) {
			return `X Kosa: ${e}`;
		}
	}
};

const nuruDemo: LessonContent = {
	title: "Nuru - jifunze programu kwa Kiswahili",
	initialCode: `// Programu ya kwanza - Salamu!

jina = jaza("Ingiza jina lako")

andika("Habari " + jina + "!")
`,
	description: (
		//  maelekezo kuhusu nuru kwa lugha ya Kiswahili
		<div className="space-y-6 leading-relaxed text-muted-foreground">
			<p>
				Nuru ni lugha ya programu na mfumo wa kujifunzia ulioundwa mahsusi kwa
				ajili ya wazungumzaji wa Kiswahili. Lengo letu kuu ni kuwawezesha vijana
				kujifunza, kuunda, na kujaribu mambo mapya katika lugha wanayoizungumza
				nyumbani.
			</p>

			<div className="mt-6 rounded-lg border border-border bg-secondary/50 p-4">
				<p className="break-words text-sm text-muted-foreground">
					<span className="font-semibold text-foreground">Kidokezo:</span> Tumia{" "}
					<code className="rounded bg-background px-1 py-0.5 font-mono text-xs">
						andika()
					</code>{" "}
					kuona matokeo.
				</p>
			</div>
		</div>
	),
};
