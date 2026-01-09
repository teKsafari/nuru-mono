"use client";

import { useEffect, useMemo, Suspense, useRef, useState } from "react";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { OrbitControls, Center, Html } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import type { OrbitControls as OrbitControlsType } from "three-stdlib";
import type { Node } from "@xyflow/react";
import { modelCache } from "@/lib/modelCache";

interface SimulationPanel3DProps {
	nodes: Node[];
	onToggleView: () => void;
	modelPath?: string;
}

const LED_CONFIG = {
	RED: { color: 0xff0000, offColor: 0x440000 },
	BLUE: { color: 0x22c55e, offColor: 0x0a3d1f }, // Middle LED, renders green, pin 2
	YELLOW: { color: 0x3b82f6, offColor: 0x0f1e3d }, // Right LED, renders blue, pin 3
} as const;

function ZoomTracker({
	controlsRef,
	onZoomChange,
}: {
	controlsRef: React.RefObject<OrbitControlsType | null>;
	onZoomChange: (scale: number) => void;
}) {
	const baseDistance = 18.5;

	useFrame(() => {
		if (controlsRef.current) {
			const distance = controlsRef.current.object.position.distanceTo(
				controlsRef.current.target,
			);
			onZoomChange(distance / baseDistance);
		}
	});

	return null;
}

function SceneLoader() {
	return (
		<Html center>
			<div className="flex flex-col items-center gap-4">
				<div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-500" />
				<p className="whitespace-nowrap font-mono text-sm text-slate-400">
					Loading 3D model...
				</p>
			</div>
		</Html>
	);
}

function ArduinoModel({
	nodes,
	modelPath,
}: {
	nodes: Node[];
	modelPath: string;
}) {
	const [cachedModelUrl, setCachedModelUrl] = useState<string | null>(null);

	// Load model through cache
	useEffect(() => {
		let mounted = true;
		let blobUrl: string | null = null;

		modelCache.loadModel(modelPath).then((url) => {
			if (mounted) {
				blobUrl = url;
				setCachedModelUrl(url);
			}
		});

		return () => {
			mounted = false;
			// Clean up blob URL if it was created
			if (blobUrl && blobUrl.startsWith("blob:")) {
				URL.revokeObjectURL(blobUrl);
			}
		};
	}, [modelPath]);

	const dracoLoader = useMemo(() => {
		const loader = new DRACOLoader();
		loader.setDecoderPath(
			"https://www.gstatic.com/draco/versioned/decoders/1.5.6/",
		);
		loader.setDecoderConfig({ type: "js" });
		return loader;
	}, []);

	const gltf = useLoader(
		GLTFLoader,
		cachedModelUrl || modelPath,
		(loader) => {
			loader.setDRACOLoader(dracoLoader);
		},
	);

	const clonedScene = useMemo(() => gltf.scene.clone(), [gltf.scene]);

	useEffect(() => {
		const ledStates: Record<string, boolean> = {
			RED: nodes.find((n) => n.data?.pin === 1)?.data?.isEnabled ?? false,
			BLUE: nodes.find((n) => n.data?.pin === 2)?.data?.isEnabled ?? false, // Middle, green
			YELLOW: nodes.find((n) => n.data?.pin === 3)?.data?.isEnabled ?? false, // Right, blue
		};

		clonedScene.traverse((child) => {
			if (child instanceof THREE.Mesh) {
				const nodeName = child.name.toUpperCase();
				if (nodeName in LED_CONFIG) {
					const config = LED_CONFIG[nodeName as keyof typeof LED_CONFIG];
					const isOn = ledStates[nodeName];

					if (!child.userData.materialCloned) {
						child.material = (child.material as THREE.Material).clone();
						child.userData.materialCloned = true;
					}

					const mat = child.material as THREE.MeshStandardMaterial;
					mat.color.setHex(isOn ? config.color : config.offColor);
					mat.emissive.setHex(config.color);
					mat.emissiveIntensity = isOn ? 5 : 0;
					mat.roughness = isOn ? 0.2 : 0.6;
					mat.toneMapped = false;
				}
			}
		});
	}, [clonedScene, nodes]);

	return (
		<Center>
			<primitive object={clonedScene} scale={200} />
		</Center>
	);
}

function Scene({
	nodes,
	modelPath,
	controlsRef,
	onZoomChange,
}: {
	nodes: Node[];
	modelPath: string;
	controlsRef: React.RefObject<OrbitControlsType | null>;
	onZoomChange: (scale: number) => void;
}) {
	const anyLedOn = [1, 2, 3].some(
		(pin) => nodes.find((n) => n.data?.pin === pin)?.data?.isEnabled,
	);

	return (
		<>
			<ambientLight intensity={1.5} />
			<hemisphereLight args={["#ffffff", "#666666", 1.0]} />
			<directionalLight position={[0, -10, 0]} intensity={0.3} />
			<directionalLight position={[-10, 0, 10]} intensity={0.2} />
			<directionalLight position={[10, 10, 5]} intensity={0.5} />
			<ZoomTracker controlsRef={controlsRef} onZoomChange={onZoomChange} />
			<Suspense fallback={<SceneLoader />}>
				<ArduinoModel nodes={nodes} modelPath={modelPath} />
			</Suspense>
			<EffectComposer>
				<Bloom
					luminanceThreshold={0.5}
					luminanceSmoothing={0.9}
					intensity={anyLedOn ? 1.5 : 0}
					mipmapBlur
				/>
			</EffectComposer>
		</>
	);
}

export function SimulationPanel3D({
	nodes,
	onToggleView,
	modelPath = "/models/Arduino.glb",
}: SimulationPanel3DProps) {
	const controlsRef = useRef<OrbitControlsType>(null);
	const cameraRef = useRef<THREE.PerspectiveCamera>(null);
	const [zoomScale, setZoomScale] = useState(1);
	const initialCamera = { position: [12, 8, 12] as const, fov: 45 };

	const handleZoomIn = () => {
		if (controlsRef.current) {
			const controls = controlsRef.current;
			const zoomFactor = 0.8;
			const direction = new THREE.Vector3()
				.subVectors(controls.target, controls.object.position)
				.normalize();
			const distance = controls.object.position.distanceTo(controls.target);
			controls.object.position.addScaledVector(
				direction,
				distance * (1 - zoomFactor),
			);
			controls.update();
		}
	};

	const handleZoomOut = () => {
		if (controlsRef.current) {
			const controls = controlsRef.current;
			const zoomFactor = 1.25;
			const direction = new THREE.Vector3()
				.subVectors(controls.target, controls.object.position)
				.normalize();
			const distance = controls.object.position.distanceTo(controls.target);
			controls.object.position.addScaledVector(
				direction,
				distance * (1 - zoomFactor),
			);
			controls.update();
		}
	};

	const handleFitView = () => {
		if (controlsRef.current && cameraRef.current) {
			cameraRef.current.position.set(...initialCamera.position);
			controlsRef.current.target.set(0, 0, 0);
			controlsRef.current.update();
		}
	};

	const handleLock = () => {
		if (controlsRef.current) {
			controlsRef.current.enabled = !controlsRef.current.enabled;
		}
	};

	const gap = 24 / zoomScale;

	return (
		<div
			className="relative h-full w-full"
			style={{
				backgroundColor: "#020617",
				backgroundImage: `radial-gradient(#1e293b 1px, transparent 1px)`,
				backgroundSize: `${gap}px ${gap}px`,
			}}
		>
			<Canvas
				camera={{ position: initialCamera.position, fov: initialCamera.fov }}
				gl={{ antialias: true, alpha: true }}
				onCreated={({ camera }) => {
					cameraRef.current = camera as THREE.PerspectiveCamera;
				}}
			>
				<Scene
					nodes={nodes}
					modelPath={modelPath}
					controlsRef={controlsRef}
					onZoomChange={setZoomScale}
				/>
				<OrbitControls
					ref={controlsRef}
					enablePan
					enableZoom
					enableRotate
					minDistance={5}
					maxDistance={30}
				/>
			</Canvas>

			<div className="absolute bottom-[9px] left-[9px] flex flex-col border border-slate-700 bg-slate-800">
				<button
					onClick={handleZoomIn}
					className="flex h-[27px] w-[27px] items-center justify-center border-b border-slate-700 text-slate-300 hover:bg-slate-700"
					title="Zoom in"
				>
					<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
						<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
					</svg>
				</button>
				<button
					onClick={handleZoomOut}
					className="flex h-[27px] w-[27px] items-center justify-center border-b border-slate-700 text-slate-300 hover:bg-slate-700"
					title="Zoom out"
				>
					<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
						<path d="M19 13H5v-2h14v2z" />
					</svg>
				</button>
				<button
					onClick={handleFitView}
					className="flex h-[27px] w-[27px] items-center justify-center border-b border-slate-700 text-slate-300 hover:bg-slate-700"
					title="Fit view"
				>
					<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
						<path d="M15 3l2.3 2.3-2.89 2.87 1.42 1.42L18.7 6.7 21 9V3h-6zM3 9l2.3-2.3 2.87 2.89 1.42-1.42L6.7 5.3 9 3H3v6zm6 12l-2.3-2.3 2.89-2.87-1.42-1.42L5.3 17.3 3 15v6h6zm12-6l-2.3 2.3-2.87-2.89-1.42 1.42 2.89 2.87L15 21h6v-6z" />
					</svg>
				</button>
				<button
					onClick={handleLock}
					className="flex h-[27px] w-[27px] items-center justify-center border-b border-slate-700 text-slate-300 hover:bg-slate-700"
					title="Toggle lock"
				>
					<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
						<path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
					</svg>
				</button>
				<button
					onClick={onToggleView}
					className="flex h-[27px] w-[27px] items-center justify-center text-xs font-medium text-slate-300 hover:bg-slate-700"
					title="2D view"
				>
					2D
				</button>
			</div>
		</div>
	);
}
