# Vendor fresh deps

go mod vendor

# create deps && copy over the vendored deps into ./deps

mkdir deps

cp -r ./vendor/github.com/NuruProgramming/Nuru ./deps/

# Copy over the go.mod contents

echo "module github.com/NuruProgramming/Nuru" > ./deps/Nuru/go.mod
echo "go 1.23.4" >> ./deps/Nuru/go.mod

# replace parts of the interpreter with custom versions

pnpm run replace