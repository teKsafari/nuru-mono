import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { AppLogo } from "@/components/app-logo";

export default function Home() {
	return (
		<main className="relative flex items-center justify-center overflow-hidden bg-background font-mono">
			{/* Hero Content */}
			<div className="relative flex flex-col justify-center h-svh z-10 mx-auto max-w-4xl px-4 text-center">
				{/* Main Headline */}
				<h1 className="font-serif mb-2 text-5xl font-bold text-yellow-500 leading-tight text-foreground md:text-6xl lg:text-7xl">
					Nuru
				</h1>
				<h2 className="mb-4 text-2xl font-bold leading-tight text-foreground md:text-3xl lg:text-3xl">
   					Jifunze programming kwa{" "}
					<span className="text-blue-500">Kiswahili</span>
				</h2>

		
				{/* CTA Button */}
				<div className="flex flex-col items-center gap-4">
					<Link
						href="/play"
						className="group relative inline-flex items-center gap-3 overflow-hidden rounded-lg border-2 border-yellow-500 bg-yellow-500 px-8 py-4 text-lg font-bold text-black transition-all hover:scale-105"
					>
						<span>Anza Kujifunza</span>
						<ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
					</Link>
				</div>

				

			
			</div>
		</main>
	);
}
