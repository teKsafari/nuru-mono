export interface Gpio {
	pin: number;
	isEnabled: boolean;
	isInput: boolean;
}

export type ComponentState = {
	active: boolean;
	type: "led" | "buzzer" | "motor";
	color?: string;
};

export type ProgramState = "idle" | "running" | "paused";

export type OutputType = "info" | "error" | "success";

export interface ExecutorCallbacks {
	onComponentChange: (index: number, active: boolean) => void;
	onOutput: (message: string, type: OutputType) => void;
	onLineChange: (line: number) => void;
	onStateChange: (state: ProgramState) => void;
	onError: (error: string | null) => void;
}

export interface ExecutorConfig {
	componentCount: number;
	loop?: boolean;
}
