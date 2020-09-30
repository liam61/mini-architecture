#! /usr/bin/env node
const program = require('commander')
const run = require('../src')

const commands = ['dev', 'build', 'devtools']

program.version('0.0.4')
program
  .requiredOption('-m, --mode [type]', `[required] "${commands.join('" / "')}"`)
  .requiredOption(
    '-e, --entry [path]',
    '[required] mini project path. Pass "@mini" to run example miniapp',
  )
  .option('-f, --framework [path]', 'mini framework path')
  .option('-i, --install [path]', 'android path. Use "-i" as bool to install with builtin android')
  .option(
    '-o, --output [path]',
    'output path (default: "~/.ma-dev" or "{install}/app/src/main/assets" when given `install` parameter)',
  )
  .option('--no-zip', 'not zip outputs')
program.parse(process.argv)

run(program)
