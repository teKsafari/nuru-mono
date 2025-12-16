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

				<div className="flex max-w-2xl flex-col justify-center gap-6 md:flex-row">
					<Link
						href="/electronics"
						className="logo-pulse group flex flex-1 flex-col items-center justify-center gap-4 rounded-lg border p-10 text-accent-foreground transition-all hover:bg-accent hover:shadow-lg"
					>
						<CircuitBoard
							size={24}
							className="transform transition-transform group-hover:scale-[1.3]"
						/>
						<div>
							<div className="text-lg font-bold">Electronics Playground</div>
							<div className="text-sm italic">Program Hardware</div>
						</div>
					</Link>

					<Link
						href={"/software"}
						className="group flex w-full flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-accent p-10 transition-all hover:bg-accent hover:shadow-lg"
					>
						<Code2
							size={24}
							className="transform transition-transform group-hover:scale-[1.3]"
						/>
						<div>
							<div className="text-lg font-bold">Software Playground </div>
							<div className="text-sm italic">Build Software Programs</div>
						</div>
					</Link>
				</div>
			</div>
		</main>
	);
}
