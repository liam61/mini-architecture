#! /usr/bin/env node
const program = require('commander')
const run = require('../index')

const commands = ['dev', 'build']

program.version('0.0.4')
program
  .requiredOption('-m, --mode [type]', `(required) "${commands.join('" / "')}"`)
  .requiredOption(
    '-e, --entry [path]',
    '(required) mini project path. Pass "@mini" to run example miniapp',
  )
  .option('-f, --framework [path]', 'mini framework path (default: "@mini-architecture/framework")')
  .option('-i, --install [path]', 'android path. Use "-i" to install miniapp in example android')
  .option(
    '-o, --output [path]',
    'output path (default: "~/.ma-dev" or "{install}/app/src/main/assets" when given `install` parameter)',
  )
  .option('--no-zip', 'not zip outputs')
program.parse(process.argv)

run(program)
