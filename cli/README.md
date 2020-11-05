# cli

want quick start? try me

## Install

```bash
yarn global add @mini-architecture/cli

ma-cli -h
```

## Commands

### ma-cli pack -h

```bash
Usage: ma-cli pack [options]

Options:
  -e, --entry [path]      [required] miniapp path. Pass "@mini" to run example miniapp
  -m, --mode [type]       pack mode: "dev" / "build" (default: "build")
  -p, --platform [path]   running on: "mobile" / "devtools" (default: "mobile")
  -f, --framework [path]  mini framework path
  -i, --install [path]    android path. Pass "-i" as bool to install with builtin android
  -o, --output [path]     output path (default: "~/.ma-dev" or "{install}/app/src/main/assets" when given `install` option)
  -w, --watch             watch files (default: process.env.NODE_ENV === "development")
  -h, --help              display help for command
```

### ma-cli devtools -h

```bash
Usage: ma-cli devtools [options]

Options:
  -e, --entry [path]   [required] mini project path. Pass "@mini" to run example miniapp
  -m, --mode [type]    pack mode: "dev" / "build" (default: "build")
  -o, --output [path]  output path (default: "~/.ma-dev" or "{install}/app/src/main/assets" when given `install` parameter)
  -h, --help           display help for command
```
