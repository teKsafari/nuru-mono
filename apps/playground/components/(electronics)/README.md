# Electronics Simulator Component Refactoring

## Overview

The electronics simulator has been refactored into modular, reusable components that can be called with necessary props.

## New Component Structure

### 1. **TerminalComponent** (`terminal-component.tsx`)

Handles all terminal-related functionality including output display, error messages, and direct command execution.

**Props:**

- `output: string[]` - Array of terminal output lines
- `error: string | null` - Current error message
- `programState: ProgramState` - Current state of the program
- `command: string` - Current command input
- `setCommand: (cmd: string) => void` - Command setter
- `executeDirectCommand: () => void` - Execute command handler
- `clearOutput: () => void` - Clear terminal output

**Usage:**

```tsx
<TerminalComponent
	output={output}
	error={error}
	programState={programState}
	command={command}
	setCommand={setCommand}
	executeDirectCommand={executeDirectCommand}
	clearOutput={clearOutput}
/>
```

### 2. **CodeEditorComponent** (`code-editor-component.tsx`)

Handles code editing and program execution controls.

**Props:**

- `code: string` - Current code content
- `setCode: (code: string) => void` - Code setter
- `programState: ProgramState` - Current state of the program
- `currentLine: number` - Current executing line
- `exampleCode: string` - Example code template
- `codeCleared: boolean` - Whether code has been cleared
- `setCodeCleared: (cleared: boolean) => void` - Code cleared state setter
- `startProgram: () => void` - Start program handler
- `stopProgram: () => void` - Stop program handler
- `resetComponents: () => void` - Reset components handler

**Usage:**

```tsx
<CodeEditorComponent
	code={code}
	setCode={setCode}
	programState={programState}
	currentLine={currentLine}
	exampleCode={exampleCode}
	codeCleared={codeCleared}
	setCodeCleared={setCodeCleared}
	startProgram={startProgram}
	stopProgram={stopProgram}
	resetComponents={resetComponents}
/>
```

### 3. **ElectronicsDisplayComponent** (`electronics-display-component.tsx`)

Displays all electronic components (LEDs, Buzzer, Motor) with their animations and states.

**Props:**

- `components: ComponentState[]` - Array of component states
- `programState: ProgramState` - Current state of the program
- `startProgram: () => void` - Start program handler
- `stopProgram: () => void` - Stop program handler
- `resetComponents: () => void` - Reset components handler

**Usage:**

```tsx
<ElectronicsDisplayComponent
	components={components}
	programState={programState}
	startProgram={startProgram}
	stopProgram={stopProgram}
	resetComponents={resetComponents}
/>
```

## Main Component

The main `ElectronicsSimulator` component now acts as a container that:

1. Manages all state (components, code, output, etc.)
2. Contains all business logic (command execution, preprocessor, etc.)
3. Delegates rendering to the three separate components

## Benefits

1. **Modularity**: Each component has a clear, single responsibility
2. **Reusability**: Components can be used independently in different contexts (e.g., lessons)
3. **Maintainability**: Easier to locate and fix bugs in specific functionality
4. **Testability**: Each component can be tested in isolation
5. **Flexibility**: Easy to swap out or modify individual components without affecting others

## File Structure

```
components/(electronics)/
  ├── electronics-simulator.tsx       # Main container component
  ├── terminal-component.tsx         # Terminal display & command input
  ├── code-editor-component.tsx      # Code editor & execution controls
  └── electronics-display-component.tsx  # LED, Buzzer, Motor display
```
