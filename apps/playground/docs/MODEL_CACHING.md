# Model Caching Implementation

This implementation adds client-side caching for GLB/GLTF 3D models with server-side hash validation to ensure cached models are up-to-date.

## Features

1. **Client-side caching with IndexedDB**: Models are stored in IndexedDB to persist across sessions
2. **Hash-based validation**: Server calculates SHA-256 hash of models to detect changes
3. **Automatic cache invalidation**: Cached models are re-fetched when hash changes
4. **Background preloading**: Models are preloaded when the app loads for faster transitions
5. **Graceful fallback**: Falls back to direct URLs if caching fails

## Files Modified/Created

### New Files
- `lib/modelCache.ts` - Model cache utility class using IndexedDB
- `components/model-preloader.tsx` - Component for background model preloading
- `app/api/models/metadata/route.ts` - API route for model metadata and hash validation

### Modified Files
- `components/playground/simulation-panel-3d.tsx` - Updated to use model cache
- `app/layout.tsx` - Added ModelPreloader component

## How It Works

### 1. Model Cache Utility (`lib/modelCache.ts`)

The `ModelCache` class provides:
- `loadModel(url)` - Load a model with caching
  1. Fetches model hash from API
  2. Checks if cached version exists with matching hash
  3. Returns cached blob URL if valid, otherwise fetches fresh
  4. Stores new models in IndexedDB
  
- `preloadModel(url)` - Preload a model in the background
- `clearCache()` - Clear all cached models

### 2. Metadata API (`app/api/models/metadata/route.ts`)

Provides a GET endpoint `/api/models/metadata?url=/models/Arduino.glb` that returns:
```json
{
  "url": "/models/Arduino.glb",
  "hash": "sha256-hash-of-file",
  "size": 4921864,
  "timestamp": 1234567890
}
```

Security features:
- Only allows access to files in `/public/models/` directory
- Prevents directory traversal attacks

### 3. 3D Component Integration

The `ArduinoModel` component now:
1. Uses `useEffect` to load models through the cache
2. Manages blob URL lifecycle (creation and cleanup)
3. Falls back to direct URL if caching fails

### 4. Background Preloading

The `ModelPreloader` component:
1. Mounts early in the app lifecycle (in layout.tsx)
2. Waits 1 second after initial render to avoid blocking
3. Preloads all known models in the background

## Benefits

1. **Faster load times**: Models are cached locally after first load
2. **Reduced bandwidth**: Models aren't re-downloaded unless changed
3. **Offline capability**: Cached models work offline
4. **Better UX**: Instant model loading on subsequent views
5. **Smart updates**: Automatic cache invalidation when models change

## Usage

### Adding New Models to Preload

Edit `components/model-preloader.tsx`:

```typescript
const modelsToPreload = [
  "/models/Arduino.glb",
  "/models/NewModel.glb", // Add new models here
];
```

### Using Cache in Components

```typescript
import { modelCache } from "@/lib/modelCache";

// Load with caching
const blobUrl = await modelCache.loadModel("/models/Arduino.glb");

// Preload in background
await modelCache.preloadModel("/models/Arduino.glb");

// Clear cache if needed
await modelCache.clearCache();
```

## Browser Support

Requires:
- IndexedDB support (all modern browsers)
- Blob URL support (all modern browsers)
- Fetch API (all modern browsers)

## Performance Considerations

- IndexedDB is asynchronous and doesn't block the main thread
- Blob URLs are memory-efficient
- Hash calculation is done server-side to avoid blocking
- Preloading uses a delay to avoid blocking initial page load

## Future Enhancements

Potential improvements:
- Add cache size limits and LRU eviction
- Compress models before storing
- Add cache statistics/monitoring
- Support for multiple model versions
- Service Worker integration for offline-first
