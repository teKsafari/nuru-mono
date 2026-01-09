"use client";

import { useEffect } from "react";
import { modelCache } from "@/lib/modelCache";

/**
 * Component that preloads 3D models in the background
 * This should be mounted early in the app to start preloading
 */
export function ModelPreloader() {
	useEffect(() => {
		// List of models to preload
		const modelsToPreload = [
			"/models/Arduino.glb",
			// Add more models here as needed
		];

		// Preload models in the background
		const preloadModels = async () => {
			for (const modelUrl of modelsToPreload) {
				try {
					await modelCache.preloadModel(modelUrl);
				} catch (error) {
					console.warn(`Failed to preload ${modelUrl}:`, error);
				}
			}
		};

		// Start preloading after a short delay to not block initial render
		const timeoutId = setTimeout(() => {
			preloadModels();
		}, 1000);

		return () => clearTimeout(timeoutId);
	}, []);

	// This component doesn't render anything
	return null;
}
