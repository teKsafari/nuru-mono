# 🚀 Nuru WASM Monorepo Guide

Welcome to the Nuru WASM monorepo! This guide will help you understand our transition to a Turborepo-powered monorepo and how to work effectively within it.

## 📚 Table of Contents

- [What is a Monorepo?](#what-is-a-monorepo)
- [Why Turborepo?](#why-turborepo)
- [Repository Structure](#repository-structure)
- [Understanding pnpm Workspaces](#understanding-pnpm-workspaces)
- [Working with Turborepo](#working-with-turborepo)
- [Managing Dependencies](#managing-dependencies)
- [Running Tasks](#running-tasks)
- [Caching & Performance](#caching--performance)
- [Code Generation with `turbo gen`](#code-generation-with-turbo-gen)
- [Best Practices](#best-practices)
- [Common Commands](#common-commands)
- [Troubleshooting](#troubleshooting)

---

## What is a Monorepo?

A **monorepo** (mono-repository) is a single repository that contains multiple distinct projects or packages. Instead of having separate repositories for your web app, WASM package, and shared utilities, everything lives together in one place.

### Benefits
- ✅ **Single source of truth** - All code in one place
- ✅ **Easier code sharing** - Reuse packages across apps
- ✅ **Atomic commits** - Change multiple packages in one commit
- ✅ **Simplified dependency management** - Shared dependencies across packages
- ✅ **Better tooling** - Unified CI/CD, linting, testing

---

## Why Turborepo?

[Turborepo](https://turborepo.com) is a high-performance build system for JavaScript/TypeScript monorepos. It provides:

### 🚄 **Speed**
- **Incremental builds** - Only rebuild what changed
- **Smart caching** - Never do the same work twice
- **Parallel execution** - Run tasks across packages simultaneously

### 🎯 **Developer Experience**
- **Simple configuration** - Single `turbo.json` file
- **Task pipelines** - Define task dependencies clearly
- **Remote caching** - Share cache across team and CI (optional)

### 🔧 **Flexibility**
- **Framework agnostic** - Works with any JavaScript tooling
- **Package manager agnostic** - Works with npm, yarn, pnpm, bun

---

## Repository Structure

Our monorepo follows Turborepo's recommended conventions:

```
nuru-wasm/
├── apps/                        # Deployable applications
│   └── nuru-svelte/            # SvelteKit web application
│       ├── src/
│       ├── static/
│       ├── package.json
│       └── vite.config.js
├── packages/                    # Shared, reusable packages
│   └── nuru-wasm/              # Go WASM interpreter package
│       ├── main.go
│       ├── go.mod
│       └── package.json
├── turbo.json                   # Turborepo configuration
├── pnpm-workspace.yaml          # pnpm workspace configuration
├── package.json                 # Root package.json (monorepo scripts)
└── pnpm-lock.yaml              # Unified lockfile
```

### Directory Purposes

| Directory | Purpose | Examples |
|-----------|---------|----------|
| `apps/` | Deployable applications that end users interact with | Web apps, mobile apps, desktop apps |
| `packages/` | Shared libraries and utilities used by apps | UI components, utilities, WASM modules |

---

## Understanding pnpm Workspaces

### What are Workspaces?

Workspaces are a feature of package managers (pnpm, npm, yarn) that allow you to manage multiple packages in one repository. Each folder with a `package.json` inside `apps/` or `packages/` is treated as a **workspace package**.

### How pnpm Handles Workspaces

In our monorepo:

- **`nuru-svelte`** is a package (name: `"nuru-svelte"`)
- **`nuru-wasm`** is a package (name: `"@nuru/wasm"`)

#### Key Concepts:

1. **Each workspace can have its own dependencies**
   ```json
   // apps/nuru-svelte/package.json
   {
     "dependencies": {
       "@nuru/wasm": "workspace:*",
       "svelte": "^5.0.0"
     }
   }
   ```

2. **Packages reference each other using `workspace:*` protocol**
   - This tells pnpm to link to the local workspace package
   - No need to publish to npm for local development

3. **pnpm creates symlinks between workspace packages**
   - Changes to `packages/nuru-wasm` are immediately available in `apps/nuru-svelte`

4. **Shared dependencies are hoisted to the root when possible**
   - Saves disk space
   - Ensures version consistency

### Workspace Configuration

Our `pnpm-workspace.yaml`:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

This tells pnpm to treat all directories in `apps/` and `packages/` as workspace packages.

---

## Working with Turborepo

### The `turbo.json` Configuration

Our `turbo.json` defines the **task pipeline** - how tasks relate to each other and what they cache:

```json
{
  "$schema": "https://turborepo.com/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [
        "dist/**",
        ".next/**",
        "!.next/cache/**",
        ".svelte-kit/**",
        "build/**",
        "public/build/**",
        "main.wasm",
        "main",
        "static/*.wasm"
      ]
    },
    "test": {
      "dependsOn": ["^test"],
      "cache": false
    },
    "dev": {
      "persistent": true,
      "cache": false
    },
    "lint": {
      "outputs": []
    }
  }
}
```

### Task Configuration Explained

#### `dependsOn`
Defines task dependencies. The `^` symbol means "dependencies in upstream packages":

```json
"build": {
  "dependsOn": ["^build"]
}
```

This means: "Before building this package, build all packages it depends on first."

#### `outputs`
Files/directories to cache when the task succeeds. **The beauty of Turborepo** is that you can define a **superset** of outputs. Turborepo will only cache what actually exists.

For example:
- **Next.js** outputs to `.next/**`
- **Vite/SvelteKit** outputs to `dist/**` or `.svelte-kit/**`
- **WASM builds** output to `main.wasm` or `static/*.wasm`
- **General Node apps** might output to `build/**`

You list **all** possible build artifact directories, and Turborepo caches only what exists for each workspace.

#### `cache`
Controls whether task outputs are cached:
- `true` (default) - Cache outputs for reuse
- `false` - Never cache (useful for dev servers, tests)

#### `persistent`
Marks long-running tasks (like dev servers) that shouldn't block other tasks:

```json
"dev": {
  "persistent": true,
  "cache": false
}
```

---

## Managing Dependencies

### Best Practices

Following [Turborepo's dependency management guidelines](https://turborepo.com/docs/crafting-your-repository/managing-dependencies):

#### 1. **Install dependencies where they're used**

Install packages directly in the workspace that needs them:

```bash
# ✅ Good - Install in specific workspace
cd apps/nuru-svelte
pnpm add svelte

# Or from root with filter
pnpm add svelte --filter nuru-svelte
```

```bash
# ❌ Bad - Don't install app dependencies in root
pnpm add svelte
```

**Why?**
- **Improved clarity** - Easy to see what each package depends on
- **Enhanced flexibility** - Different packages can use different versions
- **Better caching** - Fewer unnecessary cache misses
- **Pruning** - Turborepo can remove unused dependencies for Docker

#### 2. **Few dependencies in the root**

The root `package.json` should only contain:
- **Repository management tools** - `turbo`, `husky`, `lint-staged`
- **NOT** application dependencies

```json
// ✅ Good - Root package.json
{
  "devDependencies": {
    "turbo": "^2.7.1"
  }
}
```

```json
// ❌ Bad - Don't put app deps in root
{
  "dependencies": {
    "svelte": "^5.0.0",    // ❌ Belongs in apps/nuru-svelte
    "react": "^18.0.0"     // ❌ Belongs in specific app
  },
  "devDependencies": {
    "turbo": "^2.7.1"      // ✅ OK - repo tool
  }
}
```

### Installing Dependencies

```bash
# Install dependencies for ALL workspaces
pnpm install

# Add a dependency to a specific workspace
pnpm add <package> --filter <workspace-name>

# Examples:
pnpm add lodash --filter nuru-svelte
pnpm add -D @types/node --filter @nuru/wasm

# Add to multiple workspaces at once
pnpm add jest --save-dev --recursive --filter=nuru-svelte --filter=@nuru/wasm

# Add a workspace dependency
pnpm add @nuru/wasm --filter nuru-svelte --workspace
```

### Important Notes

- **Turborepo does NOT manage dependencies** - That's pnpm's job
- **Module resolution differs between package managers** - We use pnpm
- **Don't reference `node_modules` directly in code** - It's not part of the public API

---

## Running Tasks

### Basic Task Execution

```bash
# Run a task across all workspaces
pnpm dev            # Run dev servers
pnpm build          # Build all packages
pnpm test           # Run all tests
pnpm lint           # Lint all packages
```

### Using Filters

Target specific workspaces:

```bash
# Run dev only for nuru-svelte
turbo dev --filter nuru-svelte

# Build only nuru-wasm and its dependents
turbo build --filter @nuru/wasm...

# Run tests for everything except nuru-svelte
turbo test --filter '!nuru-svelte'
```

### Filter Syntax

| Filter | Meaning |
|--------|---------|
| `--filter nuru-svelte` | Only this workspace |
| `--filter @nuru/wasm...` | This workspace + all that depend on it |
| `--filter ...nuru-svelte` | This workspace + all its dependencies |
| `--filter '!nuru-svelte'` | Everything except this workspace |

### Running Multiple Tasks

```bash
# Run multiple tasks sequentially
turbo lint test build

# Tasks run in dependency order automatically
turbo build test    # Builds first, then tests
```

---

## Caching & Performance

### How Caching Works

Turborepo caches task outputs based on:
1. **Input files** - Source code, configs, etc.
2. **Environment variables** - Specified in `turbo.json`
3. **Dependencies** - From `package.json`
4. **Previous task outputs** - If using `dependsOn`

### Cache Hits

When you run a task:
1. Turbo computes a **hash** of all inputs
2. Checks if that hash exists in the cache
3. If yes (**cache hit**) → Replays output instantly ⚡
4. If no (**cache miss**) → Runs task and caches result

### Example

```bash
# First run - cache miss
$ turbo build
Tasks:    2 successful, 2 total
Cached:   0 cached, 2 total
Time:     15.3s

# Second run (no changes) - cache hit 🎉
$ turbo build
Tasks:    2 successful, 2 total
Cached:   2 cached, 2 total
Time:     142ms >>> FULL TURBO
```

### Cache Location

- **Local cache**: `.turbo/cache/` (gitignored)
- **Remote cache**: Optional (Vercel, custom server)

### Force Cache Bypass

```bash
# Ignore cache and re-run
turbo build --force
```

---

## Code Generation with `turbo gen`

Turborepo includes [`turbo gen`](https://turborepo.com/docs/reference/generate) - a code generation tool powered by [Plop.js](https://plopjs.com/) - to help you quickly scaffold new packages, components, or any code pattern.

### What is Plop.js?

Plop is a "micro-generator framework" that helps you generate code consistently. Instead of copying and pasting files and updating names manually, define the pattern once in code.

### Using `turbo gen`

```bash
# Run the generator CLI
turbo gen
```

You'll be prompted to:
1. Select an existing generator, or
2. Create a new one if none exist

### Creating Custom Generators

Generators are defined in `turbo/generators/config.ts` (or `.js`) at the repo root or within any workspace.

#### Example Generator Config

Create `turbo/generators/config.ts`:

```typescript
import type { PlopTypes } from "@turbo/gen";

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  // Create a generator for new packages
  plop.setGenerator("package", {
    description: "Create a new package",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is the name of the package?",
      },
      {
        type: "list",
        name: "type",
        message: "What type of package?",
        choices: ["app", "package"],
      },
    ],
    actions: [
      {
        type: "add",
        path: "{{type}}s/{{name}}/package.json",
        templateFile: "templates/package.json.hbs",
      },
      {
        type: "add",
        path: "{{type}}s/{{name}}/README.md",
        templateFile: "templates/README.md.hbs",
      },
    ],
  });

  // Generator for new components
  plop.setGenerator("component", {
    description: "Create a new Svelte component",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Component name?",
      },
    ],
    actions: [
      {
        type: "add",
        path: "apps/nuru-svelte/src/lib/components/{{kebabCase name}}.svelte",
        templateFile: "templates/component.svelte.hbs",
      },
    ],
  });
}
```

### Template Files (Handlebars)

Create templates in `turbo/generators/templates/`:

```handlebars
{{!-- templates/package.json.hbs --}}
{
  "name": "{{name}}",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "echo 'Dev server here'",
    "build": "echo 'Build here'"
  }
}
```

### Built-in Helpers

Plop provides case modifiers:
- `{{camelCase name}}` - `myComponent`
- `{{pascalCase name}}` - `MyComponent`
- `{{kebabCase name}}` - `my-component`
- `{{snakeCase name}}` - `my_component`

### Benefits

- ✅ Enforces consistent patterns
- ✅ Saves time on boilerplate
- ✅ Documents "the right way" in code
- ✅ Onboards new developers faster

---

## Best Practices

### 1. **Use Workspace Dependencies Properly**

When referencing another workspace:

```json
// apps/nuru-svelte/package.json
{
  "dependencies": {
    "@nuru/wasm": "workspace:*"
  }
}
```

The `workspace:*` protocol ensures you always use the local version.

### 2. **Keep Root Clean**

The root `package.json` should be minimal - only tooling, no app code.

### 3. **Define Precise Outputs**

List all possible build outputs in `turbo.json` for different frameworks:

```json
"outputs": [
  "dist/**",           // Vite
  ".next/**",          // Next.js
  ".svelte-kit/**",    // SvelteKit
  "build/**",          // Generic
  "*.wasm"             // WASM files
]
```

### 4. **Use Filters Effectively**

Don't run all tasks if you're only working on one package:

```bash
# Only dev the web app
turbo dev --filter nuru-svelte
```

### 5. **Commit `pnpm-lock.yaml`**

Always commit the lockfile to ensure reproducible builds.

### 6. **Use TUI Mode**

Our config enables Turbo's Terminal UI for better task visibility:

```json
{
  "ui": "tui"
}
```

---

## Common Commands

### Development

```bash
# Start all dev servers
pnpm dev

# Start specific workspace
turbo dev --filter nuru-svelte

# Start workspace and its dependencies
turbo dev --filter ...nuru-svelte
```

### Building

```bash
# Build everything
pnpm build

# Build specific workspace
turbo build --filter @nuru/wasm

# Build with force (ignore cache)
turbo build --force
```

### Testing

```bash
# Run all tests
pnpm test

# Test specific workspace
turbo test --filter nuru-svelte
```

### Linting

```bash
# Lint everything
pnpm lint

# Lint specific workspace
turbo lint --filter nuru-svelte
```

### Dependency Management

```bash
# Install all dependencies
pnpm install

# Add dependency to workspace
pnpm add <package> --filter <workspace>

# Remove dependency from workspace
pnpm remove <package> --filter <workspace>

# Update all dependencies
pnpm update --recursive

# Check for outdated dependencies
pnpm outdated --recursive
```

### Workspace Info

```bash
# List all workspaces
pnpm list --depth=0

# Show workspace dependency graph
pnpm list --recursive --depth=1

# Show why a package is installed
pnpm why <package>
```

---

## Troubleshooting

### Issue: "Workspace not found in lockfile"

**Symptoms:**
```
WARNING  Unable to calculate transitive closures: Workspace 'apps/nuru-svelte' not found in lockfile.
```

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Issue: Package Manager Mismatch

**Symptoms:**
```
WARNING: This project should be using pnpm, but was run with npm
```

**Solution:**
Our `preinstall` script enforces pnpm. Make sure you're using:
```bash
pnpm install  # ✅ Correct
npm install   # ❌ Will fail
```

### Issue: Module Not Found

**Symptoms:**
```
Error: Cannot find module '@nuru/wasm'
```

**Solution:**
```bash
# Rebuild symlinks
pnpm install

# Or manually link
cd packages/nuru-wasm
pnpm link
cd ../../apps/nuru-svelte
pnpm link @nuru/wasm
```

### Issue: Cache is Stale

**Symptoms:**
Latest changes not reflected despite cache hit.

**Solution:**
```bash
# Clear cache
rm -rf .turbo

# Or force re-run
turbo build --force
```

### Issue: Turbo Version Mismatch

**Symptoms:**
```
WARNING  No locally installed `turbo` found. Using global version.
```

**Solution:**
```bash
# Install turbo locally
pnpm add turbo -D -w

# Update to latest
pnpm update turbo -w
```

---

## Additional Resources

- 📖 [Turborepo Docs](https://turborepo.com)
- 📖 [pnpm Workspace Docs](https://pnpm.io/workspaces)
- 📖 [Plop.js Docs](https://plopjs.com/documentation)
- 🎓 [Turborepo Configuration Reference](https://turborepo.com/docs/reference/configuration)
- 🎓 [Managing Dependencies Guide](https://turborepo.com/docs/crafting-your-repository/managing-dependencies)
- 🔗 [Our PR Discussion](https://github.com/teKsafari/nuru-wasm/pull/11#discussion_r2637987831)

---

## Questions?

If you have questions about the monorepo setup, please:
1. Check this guide first
2. Review the [Turborepo documentation](https://turborepo.com)
3. Ask in our team chat or open a GitHub Discussion

Happy coding! 🚀
