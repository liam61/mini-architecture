# cli

want quick start? try me

## Usage

```bash
yarn global add @mini-architecture/cli

ma-cli -h

ma-cli -m build -e @mini --no-zip
```

## Parameters

```bash
Usage: ma-cli [options]

Options:
  -V, --version           output the version number
  -m, --mode [type]       (required) dev / build
  -e, --entry [path]      (required) mini project path, you can pass "@mini" to run example
  -f, --framework [path]  mini framework path
  -a, --android [path]    android project path
  -o, --output [path]     outputs path
  --no-zip                not zip outputs
  -h, --help              display help for command
```
