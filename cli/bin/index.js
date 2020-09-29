#! /usr/bin/env node
const path = require('path')
const { homedir } = require('os')
const program = require('commander')
const chalk = require('chalk')
const nodemon = require('nodemon')
const ignoreRoot = require('ignore-by-default').directories()
const { validate } = require('../src/utils')

// global add cli 和 mini、pack 在同一级目录
const maPath = path.join(__dirname, '../..')
const commands = ['dev', 'build']

program.version('0.0.3')
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

run()

function run() {
  const { mode, entry = '', framework = '', install = '', output = '', zip } = program

  if (!commands.includes(mode)) {
    console.log(chalk.red('invalid mode type...'))
    return
  }

  if (
    !validate('entry', entry, 'string') ||
    !validate('framework', framework, 'string') ||
    !validate('install', install, ['string', 'boolean']) ||
    !validate('output', output, 'string')
  ) {
    return
  }

  const isDev = mode === 'dev'
  process.env.NODE_ENV = isDev ? 'develop' : 'production'
  process.env.MINI_ENTRY = entry !== '@mini' ? entry : path.join(maPath, 'mini/dist')
  process.env.MINI_FRAMEWORK = framework || path.join(maPath, `framework/${isDev ? 'dev' : 'dist'}`)
  process.env.MINI_INSTALL = install !== true ? install : path.join(maPath, 'cli/android')
  process.env.MINI_OUTPUT =
    output ||
    (process.env.MINI_INSTALL
      ? path.join(process.env.MINI_INSTALL, 'app/src/main/assets')
      : `${homedir()}/.ma-dev`)
  process.env.MINI_ZIP = zip

  if (mode === 'dev') {
    nodemon({
      script: require.resolve('../src/index.js'),
      // https://github.com/remy/nodemon/blob/master/lib/config/defaults.js#L15
      ignoreRoot: ignoreRoot.map(_ => `**/${_}/**`).filter(_ => !_.includes('node_modules')),
      watch: [process.env.MINI_ENTRY, process.env.MINI_FRAMEWORK],
      ext: '*',
      delay: 600,
    })
  } else {
    require('../src/index.js')
  }
}
