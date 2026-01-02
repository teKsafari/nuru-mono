# @nuru/wasm

A high-performance WebAssembly (Wasm) interpreter for [Nuru](https://github.com/NuruProgramming/Nuru) — a Swahili-based programming language. This package enables Nuru code to run directly in the browser, powering the [Nuru Playground](https://github.com/Heracraft/nuru-playground) and other web-based Nuru tools.

## Overview

This project compiles the core Go-based Nuru interpreter into WebAssembly, allowing it to interface with JavaScript. It bridges the gap between Nuru's backend logic and frontend applications, providing a seamless execution environment on the web.

## Features

- **In-Browser Execution**: Run Nuru code client-side without a backend server.
- **JavaScript Interop**: Simple API to send code to the interpreter and receive output.
- **Custom Builtins**: Modified built-in functions optimized for the browser environment (e.g., handling input/output).

## Prerequisites

To build and develop this package, you need:

- **Go**: version 1.19.0 or higher
- **Node.js**: version 18.13 or higher
- **pnpm**: Package manager

```shell
# Install pnpm if not already installed
npm install -g pnpm
```

## Installation & Setup

> **Note:** This project is part of a monorepo managed by [Turborepo](https://turbo.build/). Use `turbo run <process>` from the root directory to execute tasks (e.g., `turbo run build:wasm`, `turbo run test`). This ensures proper caching and dependency management.

1. **Navigate to the package directory:**
   ```bash
   cd packages/wasm
   ```

2. **Install Go dependencies:**
   ```bash
   go mod tidy
   ```

3. **Vendor the dependencies:**
   We use vendoring to allow us to inject modified core files.
  ```bash
  pnpm run setup
  ```

4. **Apply Custom Modifications:**
   Copy the browser-optimized `builtins.go` into the vendored Nuru evaluator package.

   **macOS / Linux:**
   ```bash
   pnpm run replace
   ```

   **Windows:**
   ```powershell
   copy -r ./modified/* ./vendor/github.com/NuruProgramming/Nuru/
   ```

## Building the WASM Binary

To compile the Go code into a `.wasm` binary:

```bash
GOOS=js GOARCH=wasm go build -mod=vendor -o main.wasm
```

This generates a `main.wasm` file.

> **Note:** The `-mod=vendor` flag is essential to ensure the build uses our modified `builtins.go`.

## Usage

This package exports a TypeScript wrapper that handles the WASM initialization and execution.

### Installation

Since this is a workspace package, add it to your `package.json` in the monorepo:

```json
{
  "dependencies": {
    "@nuru/wasm": "workspace:*"
  }
}
```

### API

#### `init(config)`

Initializes the Nuru interpreter.

- **Arguments**:
  - `config` (object): Configuration object.
    - `outputReceiver` (function): Callback for handling output. `(text: string, isError: boolean) => void`.
    - `xssProtection` (boolean, optional): Whether to sanitize output. Default `true`.
    - `version` (string, optional): Version of the WASM binary to load. Default `"latest"`.

- **Returns**: `Promise<NuruInstance>`

#### `NuruInstance`

The object returned by `init`.

- `execute(code: string)`: Executes Nuru code.
- `initialized`: Boolean indicating if WASM is ready.

### Example

```javascript
import init from '@nuru/wasm';

// 1. Initialize the interpreter
const nuru = await init({
    outputReceiver: (text, isError) => {
        if (isError) {
            console.error("Nuru Error:", text);
        } else {
            console.log("Nuru Output:", text);
        }
    }
});

// 2. Execute code
nuru.execute('andika("Hujambo Dunia!")'); 
```

## Scripts

This project is part of a monorepo managed by **Turborepo**. You should run scripts from the **root of the monorepo** using specific filters or let turbo handle dependencies automatically.

### Common Commands

- **Test**:
  ```bash
  turbo run test --filter=@nuru/wasm
  ```

- **Build WASM Binary**:
  ```bash
  turbo run build --filter=@nuru/wasm
  ```

- **Vendor Replacements**:
  ```bash
  turbo run replace --filter=@nuru/wasm
  ```

> Note: The underlying npm scripts (e.g. running `npm run build:wasm` from this package directory) will also work, but they bypass Turborepo's caching and cross-package orchestration. For consistent monorepo workflows, prefer running these commands via `turbo` from the repository root.

## Contributing

Contributions are welcome! Please ensure you run `go mod vendor` and re-apply the `modified/builtins.go` patch if you update dependencies.