A web interpreter for [Nuru](https://github.com/NuruProgramming/Nuru) -- A Swahili Programming Language built from the ground up -- powered by WebAssembly.  

### Getting started

**Prerequisites**
+ Go (^1.19.0)
+ Node.js (^18.13)
+ pnpm

```shell
# Install pnpm if not already installed
npm install -g pnpm
```

#### Working with the Wasm Interpreter
To build the wasm binary from the go interpreter: 

1. Change directories to `/wasm`

```shell
cd wasm
```

2. Install the required go dependencies
   
``` shell
   go mod tidy
```

3. Create a go vendor folder
```shell
go mod vendor
```

and copy the modified `builtins.go` into the evaluator package

```shell
cp ./modified/builtins.go ./vendor/github.com/NuruProgramming/Nuru/evaluator/
```

or if you are on **Windows**

```shell
copy ./modified/builtins.go ./vendor/github.com/NuruProgramming/Nuru/evaluator/
```

4. To build the wasm binary

```shell
wasm && GOOS=js GOARCH=wasm go build -mod=vendor -o main.wasm
```

or if you are on **Windows**:

```shell
$env:GOOS="js"; $env:GOARCH="wasm"; go build -mod=vendor -o main.wasm
```

> notice the `-mod=vendor` flag in the wasm build. This is to build the project using the vendored dependencies (which now includes the modified builtins).

#### Web app
Powered by [Svelte](https://svelte.dev/). To work with it:

1. Change directories to `/app`
   
```shell
   cd app
```

2. Install dependencies

```shell
npm i
```

3. To start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab

npm run dev -- --open
```

#### Workspace scripts
[/package.json](https://github.com/Heracraft/nuru-playground/blob/main/package.json#L6) redefines the above commands as scripts you can run from the root folder.

```shell
npm run dev #runs the dev server
npm run build:wasm #Builds the wasm binary and copies it over to the web app
npm run replace #Replaces the default Nuru builtins with browser friendly versions
```

> If you are on windows, edit the [build:wasm](https://github.com/Heracraft/nuru-playground/blob/main/package.json#L11C18-L11C101) & [replace](https://github.com/Heracraft/nuru-playground/blob/main/package.json#L12) scripts to replace `cp` with `copy` or `Copy-Item`

**Coming soon**
- [x] Support for user inputs (`jaza()`)
- [ ] Syntax highlighting for Nuru code