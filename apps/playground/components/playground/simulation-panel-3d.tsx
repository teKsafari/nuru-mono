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
import type { RendererConfig } from "@/lib/simulations";

interface SimulationPanel3DProps {
	nodes: Node[];
	onToggleView: () => void;
	config?: RendererConfig;
}

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

function useBuzzerAudio(isEnabled: boolean) {
	const audioContextRef = useRef<AudioContext | null>(null);
	const oscillatorRef = useRef<OscillatorNode | null>(null);
	const gainNodeRef = useRef<GainNode | null>(null);

	useEffect(() => {
		// Only run in browser
		if (typeof window === "undefined") return;

		if (!audioContextRef.current) {
			try {
				audioContextRef.current = new (
					window.AudioContext ||
					(window as unknown as { webkitAudioContext: typeof AudioContext })
						.webkitAudioContext
				)();
			} catch {
				console.warn("Web Audio API not supported");
			}
		}

		if (isEnabled && audioContextRef.current) {
			try {
				if (audioContextRef.current.state === "suspended") {
					audioContextRef.current.resume();
				}

				const oscillator = audioContextRef.current.createOscillator();
				const gainNode = audioContextRef.current.createGain();

				oscillator.frequency.setValueAtTime(
					1200,
					audioContextRef.current.currentTime,
				);
				oscillator.type = "sine";
				gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);

				oscillator.connect(gainNode);
				gainNode.connect(audioContextRef.current.destination);
				oscillator.start();

				oscillatorRef.current = oscillator;
				gainNodeRef.current = gainNode;
			} catch (error) {
				console.warn("Could not create buzzer sound:", error);
			}
		} else if (!isEnabled && oscillatorRef.current) {
			try {
				oscillatorRef.current.stop();
				oscillatorRef.current = null;
				gainNodeRef.current = null;
			} catch {}
		}

		return () => {
			if (oscillatorRef.current) {
				try {
					oscillatorRef.current.stop();
				} catch {}
				oscillatorRef.current = null;
				gainNodeRef.current = null;
			}
		};
	}, [isEnabled]);
}

function useMotorAudio(isEnabled: boolean) {
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		// Only run in browser
		if (typeof window === "undefined") return;

		const fadeDuration = 300; // ms
		const fadeSteps = 15;
		const stepTime = fadeDuration / fadeSteps;
		const targetVolume = 0.3;

		if (isEnabled) {
			if (!audioRef.current) {
				audioRef.current = new Audio("/sounds/motor.mp3");
				audioRef.current.loop = true;
				audioRef.current.volume = 0;
			}

			if (fadeIntervalRef.current) {
				clearInterval(fadeIntervalRef.current);
			}

			audioRef.current.play().catch(() => {
				console.warn("Motor sound blocked by browser autoplay policy");
			});

			let step = 0;
			fadeIntervalRef.current = setInterval(() => {
				if (audioRef.current && step < fadeSteps) {
					audioRef.current.volume = (step / fadeSteps) * targetVolume;
					step++;
				} else if (fadeIntervalRef.current) {
					clearInterval(fadeIntervalRef.current);
				}
			}, stepTime);
		} else if (audioRef.current) {
			if (fadeIntervalRef.current) {
				clearInterval(fadeIntervalRef.current);
			}

			let step = fadeSteps;
			const currentVolume = audioRef.current.volume;

			fadeIntervalRef.current = setInterval(() => {
				if (audioRef.current && step > 0) {
					audioRef.current.volume = (step / fadeSteps) * currentVolume;
					step--;
				} else {
					if (fadeIntervalRef.current) {
						clearInterval(fadeIntervalRef.current);
					}
					if (audioRef.current) {
						audioRef.current.pause();
						audioRef.current.currentTime = 0;
					}
				}
			}, stepTime);
		}

		return () => {
			if (fadeIntervalRef.current) {
				clearInterval(fadeIntervalRef.current);
			}
		};
	}, [isEnabled]);
}

function ArduinoModel({
	nodes,
	config,
}: {
	nodes: Node[];
	config?: RendererConfig;
}) {
	const modelPath = config?.modelPath || "/models/Arduino-nuru.glb";

	const dracoLoader = useMemo(() => {
		const loader = new DRACOLoader();
		loader.setDecoderPath(
			"https://www.gstatic.com/draco/versioned/decoders/1.5.6/",
		);
		loader.setDecoderConfig({ type: "js" });
		return loader;
	}, []);

	const gltf = useLoader(GLTFLoader, modelPath, (loader) => {
		loader.setDRACOLoader(dracoLoader);
	});

	const clonedScene = useMemo(() => gltf.scene.clone(), [gltf.scene]);
	const shaftRef = useRef<THREE.Object3D | null>(null);

	// Derive audio states from mappings
	const mappings = config?.mappings || {};
	
	const motorOn = useMemo(() => {
		// Find any mapping of type MOTOR that corresponds to an enabled pin
		return Object.values(mappings).some(m => 
			m.type === "MOTOR" && nodes.find(n => n.data?.pin === m.pin)?.data?.isEnabled
		);
	}, [mappings, nodes]);

	const buzzerOn = useMemo(() => {
		return Object.values(mappings).some(m => 
			m.type === "BUZZER" && nodes.find(n => n.data?.pin === m.pin)?.data?.isEnabled
		);
	}, [mappings, nodes]);


	useBuzzerAudio(buzzerOn);
	useMotorAudio(motorOn);

	useEffect(() => {
		clonedScene.traverse((child) => {
			// Find shaft if any motor mapping uses it
            // Assuming SHAFT is the name for motor part in the model
            // If mapping key is SHAFT, we treat it as such.
			if (child.name.toUpperCase() === "SHAFT") {
				shaftRef.current = child;
			}
		});
	}, [clonedScene]);

	useFrame((_, delta) => {
		if (shaftRef.current && motorOn) {
			shaftRef.current.rotation.z += delta * 15;
		}
	});

	useEffect(() => {
		const getIsEnabled = (pin: number) =>
			nodes.find((n) => n.data?.pin === pin)?.data?.isEnabled ?? false;

        // Known controllable components that should be hidden if not used
        const KNOWN_COMPONENTS = ["RED", "GREEN", "BLUE", "BUZZER", "SHAFT"];

		clonedScene.traverse((child) => {
			if (child instanceof THREE.Mesh) {
				const nodeName = child.name.toUpperCase();
                
                // Visibility check: Hide known components if not in mappings
                if (KNOWN_COMPONENTS.includes(nodeName)) {
                    child.visible = !!mappings[nodeName];
                }

                const mapping = mappings[nodeName];

				if (mapping && mapping.type === "LED") {
					const pin = mapping.pin;
					const isOn = getIsEnabled(pin);

                    // Use colors from config or defaults
                    const onColor = mapping.colorHex ?? 0xff0000;
                    const offColor = mapping.offColorHex ?? 0x440000;

					if (!child.userData.materialCloned) {
						child.material = (child.material as THREE.Material).clone();
						child.userData.materialCloned = true;
					}

					const mat = child.material as THREE.MeshStandardMaterial;
					mat.color.setHex(isOn ? onColor : offColor);
					mat.emissive.setHex(onColor);
					mat.emissiveIntensity = isOn ? 5 : 0;
					mat.roughness = isOn ? 0.2 : 0.6;
					mat.toneMapped = false;
				}
			}
		});
	}, [clonedScene, nodes, mappings]);

	return (
		<Center>
			<primitive object={clonedScene} scale={200} />
		</Center>
	);
}

function Scene({
	nodes,
	config,
	controlsRef,
	onZoomChange,
}: {
	nodes: Node[];
    config?: RendererConfig;
	controlsRef: React.RefObject<OrbitControlsType | null>;
	onZoomChange: (scale: number) => void;
}) {
	// Bloom only for active LEDs
    // Check if any mapped LED is enabled
    const mappings = config?.mappings || {};
    const anyLedOn = Object.values(mappings).some(m => 
        m.type === "LED" && nodes.find(n => n.data?.pin === m.pin)?.data?.isEnabled
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
				<ArduinoModel nodes={nodes} config={config} />
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
    config,
}: SimulationPanel3DProps) {
	const controlsRef = useRef<OrbitControlsType>(null);
	const cameraRef = useRef<THREE.PerspectiveCamera>(null);
	const [zoomScale, setZoomScale] = useState(1);
    
    // Default camera position
	const initialCamera = { position: config?.initialCameraPosition || [12, 8, 12], fov: 45 };

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
            // @ts-ignore
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
                // @ts-ignore
				camera={{ position: initialCamera.position, fov: initialCamera.fov }}
				gl={{ antialias: true, alpha: true }}
				onCreated={({ camera }) => {
					cameraRef.current = camera as THREE.PerspectiveCamera;
				}}
			>
				<Scene
					nodes={nodes}
					config={config}
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

