import Link from "next/link";
import { CircuitBoard, Code2 } from "lucide-react";
import { AppLogo } from "@/components/app-logo";

export default function Home() {
	return (
		<main className="flex min-h-screen items-center justify-center bg-background p-4 pt-14 font-mono md:p-8">
			<div className="mx-auto max-w-4xl text-center">
				<div className="mb-6 flex items-center justify-center gap-3">
					<AppLogo
						size={48}
						className="animate-[logo-hover_1.5s_ease-in-out_infinite]"
					/>
					<h1 className="text-5xl font-bold text-foreground">
						<span className="text-yellow-500">Nuru</span> Playground
					</h1>
				</div>
				<p className="mx-auto mb-12 max-w-2xl text-xl text-muted-foreground">
					Nuru ni lugha ya programu na mfumo wa kujifunzia ulioundwa mahsusi kwa
					ajili ya wazungumzaji wa Kiswahili. Lengo letu kuu ni kuwawezesha
					vijana kujifunza, kuunda, na kujaribu mambo mapya katika lugha
					wanayoizungumza nyumbani. <br />
				</p>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 max-w-2xl w-full mx-auto">
					<Link
						href="/electronics"
						className="group relative w-full overflow-hidden border border-border rounded-[24px] md:rounded-[32px] min-h-[200px] md:min-h-[300px] flex flex-col items-center justify-center transition-colors duration-200 hover:border-orange-500 hover:shadow-lg"
						style={{ "--active-color": "#f97316" } as React.CSSProperties}
					>
				
						<div className="relative z-10 flex flex-col items-center justify-center gap-3 md:gap-4 p-4 md:p-6 text-center">
							<CircuitBoard
								className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground transition-all duration-300 ease-out group-hover:scale-110 group-hover:text-[var(--active-color)]"
							/>
							<div className="space-y-1">
								<h3 className="text-lg md:text-xl font-bold font-mono group-hover:text-[var(--active-color)] transition-colors">Electronics Playground</h3>
								<p className="text-sm text-muted-foreground italic">Program Hardware</p>
							</div>
						</div>
					</Link>

					<Link
						href="/software"
						className="group relative w-full overflow-hidden border border-border rounded-[24px] md:rounded-[32px] min-h-[200px] md:min-h-[300px] flex flex-col items-center justify-center transition-colors duration-200 hover:border-[#0ea5e9] hover:shadow-lg"
						style={{ "--active-color": "#0ea5e9" } as React.CSSProperties}
					>
				
						<div className="relative z-10 flex flex-col items-center justify-center gap-3 md:gap-4 p-4 md:p-6 text-center">
							<Code2
								className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground transition-all duration-300 ease-out group-hover:scale-110 group-hover:text-[var(--active-color)]"
							/>
							<div className="space-y-1">
								<h3 className="text-lg md:text-xl font-bold font-mono group-hover:text-[var(--active-color)] transition-colors">Software Playground</h3>
								<p className="text-sm text-muted-foreground italic">Build Software Programs</p>
							</div>
						</div>
					</Link>
				</div>
			</div>
		</main>
	);
}
