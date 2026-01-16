// Gpio is the base interface for I/O hardware pins
export interface Gpio {
	pin: number;
	isEnabled: boolean;
	isInput: boolean;
}

// Component types
export type ComponentType = "led" | "buzzer" | "motor";

// ComponentState extends Gpio, adding only type and color
export interface ComponentState extends Gpio {
	type: ComponentType;
	color?: string;
}

export type ProgramState = "idle" | "running" | "paused";

export type OutputType = "info" | "error" | "success";

export interface ExecutorCallbacks {
	onComponentChange: (index: number, isEnabled: boolean) => void;
	onOutput: (message: string, type: OutputType) => void;
	onLineChange: (line: number) => void;
	onStateChange: (state: ProgramState) => void;
	onError: (error: string | null) => void;
}

export interface ExecutorConfig {
	componentCount: number;
	loop?: boolean;
}
