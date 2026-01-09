import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { readFile } from "fs/promises";
import { join } from "path";

/**
 * API Route: GET /api/models/metadata
 * Returns metadata about a model including its hash for cache validation
 */
export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const url = searchParams.get("url");

		if (!url) {
			return NextResponse.json(
				{ error: "Missing url parameter" },
				{ status: 400 },
			);
		}

		// Extract the file path from the URL
		// Expected format: /models/Arduino.glb
		const filePath = url.startsWith("/") ? url.slice(1) : url;

		// Security: Only allow access to files in the public directory
		if (filePath.includes("..") || !filePath.startsWith("models/")) {
			return NextResponse.json(
				{ error: "Invalid file path" },
				{ status: 403 },
			);
		}

		// Read the file from the public directory
		const fullPath = join(process.cwd(), "public", filePath);
		
		try {
			const fileBuffer = await readFile(fullPath);

			// Calculate hash
			const hash = createHash("sha256").update(fileBuffer).digest("hex");

			// Get file size
			const size = fileBuffer.length;

			return NextResponse.json({
				url,
				hash,
				size,
				timestamp: Date.now(),
			});
		} catch (readError) {
			// Don't log detailed error to avoid leaking file system information
			// readError is intentionally not used to prevent information disclosure
			console.error("[ModelMetadata] Failed to read model file");
			return NextResponse.json(
				{ error: "Model file not found or cannot be read" },
				{ status: 404 },
			);
		}
	} catch (error) {
		console.error("[ModelMetadata] Error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch model metadata" },
			{ status: 500 },
		);
	}
}
