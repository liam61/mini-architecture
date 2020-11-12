#! /usr/bin/env node

const program = require('commander')
const bootstrap = require('../dist')
const config = require('../package.json')
const { modes, platforms } = bootstrap

program.version(config.version)

let options = {}
let type = 'pack'

program
  .command('pack')
  .requiredOption(
    '-e, --entry [path]',
    '[required] miniapp path. Pass "@mini" to run example miniapp',
  )
  .option('-m, --mode [type]', `pack mode: "${modes.join('" / "')}"`, 'build')
  .option('-p, --platform [path]', `running on: "${platforms.join('" / "')}"`, 'mobile')
  .option('-f, --framework [path]', 'mini framework path')
  .option(
    '-i, --install [path]',
    'android path. Pass "-i" as bool to install using builtin android',
  )
  .option(
    '-o, --output [path]',
    'output path (default: "~/.ma-dev" or "{install}/app/src/main/assets" when given `-i` option)',
  )
  .option('-w, --watch', 'watch files (default: process.env.NODE_ENV === "development")')
  .option('-z, --zip', 'zip outputs (default: `false` or `true` when given `-i` option)')
  .action((command, _) => {
    options = command
  })

program
  .command('devtools')
  .requiredOption(
    '-e, --entry [path]',
    '[required] mini project path. Pass "@mini" to run example miniapp',
  )
  .option('-m, --mode [type]', `pack mode: "${modes.join('" / "')}"`, 'build')
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
