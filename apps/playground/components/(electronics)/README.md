# Electronics Simulator Component Architecture

## Overview

The electronics simulator has been refactored into modular, reusable components with a decoupled execution engine that can be reused anywhere in the program.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    ElectronicsSimulator                      │
│                    (UI Container)                            │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ uses
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                  ElectronicsExecutor                         │
│                  (Execution Engine)                          │
│  - preprocessCode()   - executeCommand()                     │
│  - startProgram()     - stopProgram()                        │
│  - resetAllComponents()                                      │
└─────────────────────────────────────────────────────────────┘
```

## Core Files

### 1. **ElectronicsExecutor** (`lib/electronicsExecutor.ts`)

The decoupled execution engine that handles all command execution logic. Can be imported and used anywhere.

**Key Features:**

- Command parsing (washa, zima, subiri)
- rudia() block preprocessing (loop expansion)
- Program execution control
- Callback-based communication with UI

**Usage:**

```typescript
import {
	ElectronicsExecutor,
	createElectronicsExecutor,
} from "@/lib/electronicsExecutor";

const executor = new ElectronicsExecutor(
	{
		onComponentChange: (index, active) => {
			/* update component */
		},
		onOutput: (message, type) => {
			/* add to terminal */
		},
		onLineChange: (line) => {
			/* highlight line */
		},
		onStateChange: (state) => {
			/* update program state */
		},
		onError: (error) => {
			/* show error */
		},
	},
	{
		componentCount: 5,
		loop: false,
	},
);

// Execute a program
await executor.startProgram(code);

// Execute a single command
await executor.executeCommand("washa(1)");

// Stop execution
executor.stopProgram();

// Reset all components
executor.resetAllComponents();
```

### 2. **Types** (`types/electronics.ts`)

Shared types for the electronics system.

```typescript
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
```

## UI Components

### 1. **TerminalComponent** (`terminal-component.tsx`)

Terminal display & command input

### 2. **CodeEditorComponent** (`code-editor-component.tsx`)

Code editor & execution controls

### 3. **ElectronicsDisplayComponent** (`electronics-display-component.tsx`)

LED, Buzzer, Motor display

### 4. **ElectronicsSimulator** (`electronics-simulator.tsx`)

Main container that wires up executor with UI components

## File Structure

```
apps/playground/
├── components/(electronics)/
│   ├── electronics-simulator.tsx     # Main container
│   ├── terminal-component.tsx        # Terminal UI
│   ├── code-editor-component.tsx     # Code editor UI
│   ├── electronics-display-component.tsx  # Components display
│   └── README.md
├── lib/
│   └── electronicsExecutor.ts        # Execution engine (reusable!)
└── types/
    └── electronics.ts                # Shared types
```

## Benefits

1. **Decoupled Logic**: Execution logic is separate from UI, can be reused in lessons, tests, etc.
2. **Testability**: ElectronicsExecutor can be unit tested in isolation
3. **Flexibility**: Use executor in different UI contexts (simulator, lessons, embedded)
4. **Maintainability**: Changes to execution logic don't affect UI components
5. **Type Safety**: Shared types ensure consistency across the codebase

## Commands Supported

| Command            | Description              | Example                 |
| ------------------ | ------------------------ | ----------------------- |
| `washa(n)`         | Turn on component n      | `washa(1)`              |
| `zima(n)`          | Turn off component n     | `zima(2)`               |
| `subiri(ms)`       | Wait for ms milliseconds | `subiri(500)`           |
| `rudia(n) { ... }` | Repeat block n times     | `rudia(3) { washa(1) }` |
