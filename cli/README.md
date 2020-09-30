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
  -m, --mode [type]       [required] "dev" / "build"
  -e, --entry [path]      [required] mini project path. Pass "@mini" to run example miniapp
  -f, --framework [path]  mini framework path (default: "@mini-architecture/framework")
  -i, --install [path]    android path. Use "-i" as bool to install with builtin android
  -o, --output [path]     output path (default: "~/.ma-dev" or "{install}/app/src/main/assets" when given `install` parameter)
  --no-zip                not zip outputs
  -h, --help              display help for command
```
