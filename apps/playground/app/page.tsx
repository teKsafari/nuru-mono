"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Wand2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function Home() {
	const router = useRouter();
	const [prompt, setPrompt] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!prompt.trim()) return;

		setLoading(true);
		setError("");

		try {
			const res = await fetch("/api/imagine", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ prompt }),
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || "Something went wrong");
			}

            if (!data.isRelevant) {
                setError(data.refusalMessage || "Samahani, siwezi kuelewa ombi hilo.");
                setLoading(false);
                return;
            }

			// Store result in localStorage and redirect
			localStorage.setItem("wazia_result", JSON.stringify(data));
			router.push("/wazia");
		} catch (err) {
			console.error(err);
			setError("Kuna tatizo limetokea. Tafadhali jaribu tena.");
			setLoading(false);
		}
	};

	return (
		<main className="relative flex items-center justify-center overflow-hidden bg-background font-mono">
			{/* Hero Content */}
			<div className="relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] max-w-4xl flex-col justify-center px-4 text-center">
				{/* Main Headline */}
				<h1 className="mb-2 font-serif text-5xl font-bold leading-tight text-foreground text-yellow-500 md:text-6xl lg:text-7xl">
					Nuru
				</h1>
				<h2 className="mb-8 text-2xl font-bold leading-tight text-foreground md:text-3xl lg:text-3xl">
					Jifunze programming kwa <span className="text-blue-500">Kiswahili</span>
				</h2>

				{/* Imagine Input Section */}
				<div className="mx-auto mb-12 w-full max-w-lg">
					<Card className="border-border/50 bg-secondary/30 p-1">
						<form onSubmit={handleSubmit} className="relative flex items-center">
							<Input
								type="text"
								placeholder="Unataka kujifunza nini leo? (mfano: 'Taa za trafiki')"
								className="h-14 border-0 bg-transparent pr-32 text-lg text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0"
								value={prompt}
								onChange={(e) => setPrompt(e.target.value)}
								disabled={loading}
							/>
							<div className="absolute right-1">
								<Button
									type="submit"
									size="lg"
									disabled={loading || !prompt.trim()}
									className="group h-12 gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 px-6 font-bold text-white transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(234,179,8,0.5)]"
								>
									{loading ? (
										<div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
									) : (
										<>
											<span>Wazia</span>
											<Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12" />
										</>
									)}
								</Button>
							</div>
						</form>
					</Card>
                    {error && (
                        <p className="mt-3 text-sm text-red-500 animate-in fade-in slide-in-from-top-1">{error}</p>
                    )}
					<p className="mt-3 text-xs text-muted-foreground">
						Inatumia AI kutengeneza somo na simulation papo hapo ⚡
					</p>
				</div>

				{/* CTA Button */}
				<div className="flex flex-col items-center gap-4">
					<Link
						href="/anza"
						className="group relative inline-flex items-center gap-3 overflow-hidden rounded-lg border border-border/50 bg-secondary/50 px-8 py-3 text-base text-muted-foreground transition-all hover:bg-secondary hover:text-foreground"
					>
						<span>Au anza na masomo ya kawaida</span>
						<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
					</Link>
				</div>
			</div>
		</main>
	);
}
