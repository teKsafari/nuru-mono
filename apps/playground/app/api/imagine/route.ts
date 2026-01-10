import { NextResponse } from "next/server";
import { AzureOpenAI } from "openai";
import { SIMULATIONS } from "@/lib/simulations";

const endpoint = process.env.AZURE_ENDPOINT;
const apiKey = process.env.AZURE_API_KEY;
const apiVersion = "2024-04-01-preview";
const deployment = "gpt-4.1-mini"; // Using the deployment name from user request

export async function POST(req: Request) {
	try {
		const { prompt } = await req.json();

		if (!prompt) {
			return NextResponse.json(
				{ error: "Prompt is required" },
				{ status: 400 },
			);
		}

		// Check for Azure credentials
		if (!endpoint || !apiKey) {
			console.warn("Azure credentials missing. Using fallback mock.");
			return NextResponse.json(mockResponse(prompt));
		}

		const client = new AzureOpenAI({
			endpoint,
			apiKey,
			apiVersion,
			deployment,
		});

		const systemPrompt = `
You are an expert computer science teacher for Swahili speakers.
Your goal is to take a user's idea (in Swahili or English) and create a short lesson and code example using the "Nuru" programming language.
You must select the most appropriate simulation from the provided list to visualize the concept.

available_simulations: ${JSON.stringify(
			SIMULATIONS.map((s) => ({
				id: s.id,
				name: s.name,
				description: s.description,
				keywords: s.keywords,
			})),
		)}

Nuru Language Reference:
- \`washa(pin)\`: Turn on LED/device at pin. Argument \`pin\` MUST be an integer (e.g., \`washa(1)\`), NOT a string.
- \`zima(pin)\`: Turn off LED/device at pin. Argument \`pin\` MUST be an integer (e.g., \`zima(1)\`), NOT a string.
- \`subiri(ms)\`: Wait for milliseconds.
- \`rudia(n) { ... }\`: Repeat n times.
- \`andika(text)\`: Print text.
- Variables are defined without keywords (e.g., \`x = 10\`).

IMPORTANT: 
- Always use NUMBERS for pin arguments, never strings like "RED" or "1". Example: \`washa(1)\` is correct, \`washa("RED")\` is WRONG.
- DO NOT include comments in the code (lines starting with //). The code should be clean.

Output format: JSON object with the following structure:
{
    "isRelevant": boolean, // true if the prompt is related to electronics/coding
    "simulationId": string, // One of the available simulation IDs
    "code": string, // Valid Nuru code to demonstrate the concept on the selected simulation
    "lesson": {
        "title": string, // Catchy title in Swahili
        "description": string, // 2-3 sentences explaining the concept in Swahili
        "steps": string[] // 3-4 bullet points in Swahili explaining how the code works
    },
    "refusalMessage": string // (Optional) Polite refusal in Swahili if isRelevant is false
}

If the user prompt is "traffic light", "taa za barabarani", etc., use "traffic-lights" simulation.
If the prompt is about blinking, use "basic-blink".
If the prompt is about motors, use "motor-control".
if the prompt is about police, siren or alarm use "police-siren".

Keep the code simple and educational.
`;

		const response = await client.chat.completions.create({
			messages: [
				{ role: "system", content: systemPrompt },
				{ role: "user", content: prompt },
			],
			model: deployment,
			response_format: { type: "json_object" },
			max_completion_tokens: 1000,
		});

		const content = response.choices[0].message.content;
		if (!content) {
			throw new Error("No content from LLM");
		}

		const result = JSON.parse(content);
		return NextResponse.json(result);
	} catch (error) {
		console.error("Error in imagine route:", error);
		// Return a generic error or fallback
		return NextResponse.json(
			{ error: "Failed to generate lesson" },
			{ status: 500 },
		);
	}
}

function mockResponse(prompt: string) {
	const p = prompt.toLowerCase();
	// Simple keyword matching for fallback
	if (
		p.includes("taa") ||
		p.includes("traffic") ||
		p.includes("barabarani") ||
		p.includes("red")
	) {
		return {
			isRelevant: true,
			simulationId: "traffic-lights",
			code: `// Taa za Trafiki
washa(1) // Washa Nyekundu
subiri(1000)
zima(1)

washa(2) // Washa Njano
subiri(500)
zima(2)

washa(3) // Washa Kijani
subiri(1000)
zima(3)`,
			lesson: {
				title: "Taa za Trafiki",
				description:
					"Huu ni mfano wa jinsi taa za barabarani zinavyofanya kazi. Tunatumia taa tatu: nyekundu, njano, na kijani.",
				steps: [
					"Tunaanza kwa kuwasha taa nyekundu.",
					"Tunasubiri kidogo kisha tunazima.",
					"Tunawasha taa ya njano, kisha kijani.",
				],
			},
		};
	}

	// Default to blink
	return {
		isRelevant: true,
		simulationId: "basic-blink",
		code: `// Kuwasha na Kuzima Taa
rudia(5) {
    washa(1)
    subiri(500)
    zima(1)
    subiri(500)
}`,
		lesson: {
			title: "Kuwasha na Kuzima",
			description:
				"Hapa tunajifunza jinsi ya kuwasha na kuzima taa (LED) kwa kutumia programu.",
			steps: [
				"Tunatumia amri ya 'washa(1)' kuwasha taa.",
				"Tunatumia 'subiri(500)' kusubiri nusu sekunde.",
				"Tunatumia 'zima(1)' kuzima taa.",
			],
		},
	};
}
