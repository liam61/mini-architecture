#! /usr/bin/env node
const program = require('commander')
const bootstrap = require('../dist')

const { modes, platforms } = bootstrap

program.version('0.0.6-beta2')

let options = {}
let type = 'pack'

program
  .command('pack')
  .requiredOption('-m, --mode [type]', `[required] pack mode: "${modes.join('" / "')}"`)
  .requiredOption(
    '-e, --entry [path]',
    '[required] miniapp path. Pass "@mini" to run example miniapp',
  )
  .option('-p, --platform', `running on: "${platforms.join('" / "')}" (default: "mobile")`)
  .option('-f, --framework [path]', 'mini framework path')
  .option('-i, --install [path]', 'android path. Pass "-i" as bool to install with builtin android')
  .option(
    '-o, --output [path]',
    'output path (default: "~/.ma-dev" or "{install}/app/src/main/assets" when given `install` option)',
  )
  .option('-w, --watch', 'watch files (default: process.env.NODE_ENV === "development")')
  .action((command, _) => {
    options = command
  })

program
  .command('devtools')
  .requiredOption('-m, --mode [type]', `[required] pack mode: "${modes.join('" / "')}"`)
  .requiredOption(
    '-e, --entry [path]',
    '[required] mini project path. Pass "@mini" to run example miniapp',
  )
  .option(
    '-o, --output [path]',
    'output path (default: "~/.ma-dev" or "{install}/app/src/main/assets" when given `install` parameter)',
  )
  .action((command, _) => {
    type = 'devtools'
    options = command
  })

program.parse(process.argv)
// console.log(type, options)

bootstrap.default(type, options)
