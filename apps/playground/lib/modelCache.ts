/**
 * Model Cache Utility
 * Provides client-side caching for GLB/GLTF models using IndexedDB
 * with hash-based validation to ensure cached models are up-to-date
 */

const DB_NAME = "nuru-model-cache";
const DB_VERSION = 1;
const STORE_NAME = "models";

interface CachedModel {
	url: string;
	hash: string;
	blob: Blob;
	timestamp: number;
}

class ModelCache {
	private db: IDBDatabase | null = null;
	private initPromise: Promise<void> | null = null;

	/**
	 * Initialize the IndexedDB database
	 */
	private async init(): Promise<void> {
		if (this.db) return;
		if (this.initPromise) return this.initPromise;

		this.initPromise = new Promise((resolve, reject) => {
			const request = indexedDB.open(DB_NAME, DB_VERSION);

			request.onerror = () => reject(request.error);
			request.onsuccess = () => {
				this.db = request.result;
				resolve();
			};

			request.onupgradeneeded = (event) => {
				const db = (event.target as IDBOpenDBRequest).result;
				if (!db.objectStoreNames.contains(STORE_NAME)) {
					const store = db.createObjectStore(STORE_NAME, { keyPath: "url" });
					store.createIndex("timestamp", "timestamp", { unique: false });
				}
			};
		});

		return this.initPromise;
	}

	/**
	 * Fetch model hash from the server
	 */
	private async fetchModelHash(url: string): Promise<string> {
		try {
			const response = await fetch(
				`/api/models/metadata?url=${encodeURIComponent(url)}`,
			);
			if (!response.ok) {
				throw new Error(`Failed to fetch model metadata: ${response.status}`);
			}
			const data = await response.json();
			return data.hash;
		} catch (error) {
			console.warn("Failed to fetch model hash, skipping cache validation:", error);
			// Return a timestamp-based hash as fallback
			return `fallback-${Date.now()}`;
		}
	}

	/**
	 * Get a cached model if it exists and is valid
	 */
	private async getCached(url: string): Promise<CachedModel | null> {
		await this.init();
		if (!this.db) return null;

		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction(STORE_NAME, "readonly");
			const store = transaction.objectStore(STORE_NAME);
			const request = store.get(url);

			request.onsuccess = () => resolve(request.result || null);
			request.onerror = () => reject(request.error);
		});
	}

	/**
	 * Store a model in the cache
	 */
	private async setCached(model: CachedModel): Promise<void> {
		await this.init();
		if (!this.db) return;

		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction(STORE_NAME, "readwrite");
			const store = transaction.objectStore(STORE_NAME);
			const request = store.put(model);

			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});
	}

	/**
	 * Load a model with caching support
	 * @param url The URL of the model to load
	 * @returns A blob URL that can be used to load the model
	 */
	async loadModel(url: string): Promise<string> {
		try {
			// Fetch the current hash from server
			const currentHash = await this.fetchModelHash(url);

			// Check if we have a cached version
			const cached = await this.getCached(url);

			// If cached and hash matches, use cached version
			if (cached && cached.hash === currentHash) {
				console.log(`[ModelCache] Using cached model: ${url}`);
				return URL.createObjectURL(cached.blob);
			}

			// Fetch fresh model
			console.log(`[ModelCache] Fetching model: ${url}`);
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`Failed to fetch model: ${response.status}`);
			}

			const blob = await response.blob();

			// Store in cache
			await this.setCached({
				url,
				hash: currentHash,
				blob,
				timestamp: Date.now(),
			});

			// Return blob URL
			return URL.createObjectURL(blob);
		} catch (error) {
			console.error("[ModelCache] Error loading model:", error);
			// Fallback to direct URL if caching fails
			return url;
		}
	}

	/**
	 * Preload a model in the background
	 * @param url The URL of the model to preload
	 */
	async preloadModel(url: string): Promise<void> {
		try {
			await this.loadModel(url);
			console.log(`[ModelCache] Preloaded model: ${url}`);
		} catch (error) {
			console.warn(`[ModelCache] Failed to preload model: ${url}`, error);
		}
	}

	/**
	 * Clear the cache
	 */
	async clearCache(): Promise<void> {
		await this.init();
		if (!this.db) return;

		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction(STORE_NAME, "readwrite");
			const store = transaction.objectStore(STORE_NAME);
			const request = store.clear();

			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});
	}
}

// Export singleton instance
export const modelCache = new ModelCache();
