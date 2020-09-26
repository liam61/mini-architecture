#! /usr/bin/env node
const path = require('path')
const program = require('commander')
const chalk = require('chalk')
const nodemon = require('nodemon')
const ignoreRoot = require('ignore-by-default').directories()

// global add cli 和 mini、pack 在同一级目录
const maModule = path.join(__dirname, '../..')
// path.join(__dirname, '../node_modules/@mini-architecture')
const commands = ['dev', 'build']

program.version('0.0.2')
program
  .requiredOption('-m, --mode [type]', commands.join(' / '))
  .requiredOption('-e, --entry [path]', 'mini project path, you can pass "@mini" to run example')
  .option('-f, --framework [path]', 'mini framework path')
  .option('-a, --android [path]', 'android project path')
  .option('-o, --output [path]', 'outputs path')
  .option('--no-zip', 'not zip outputs')
program.parse(process.argv)

run()

function run() {
  const { mode, entry, framework, android, output, zip } = program
  // console.log(program)

  if (!commands.includes(mode)) {
    console.log(chalk.red('invalid mode type...'))
    return
  }

  process.env.NODE_ENV = mode === 'dev' ? 'develop' : 'production'
  process.env.MINI_ENTRY = entry !== '@mini' ? entry : path.join(maModule, 'mini/dist')
  process.env.MINI_FRAMEWORK = framework || path.join(maModule, 'framework/dist')
  process.env.MINI_ANDROID = android || path.join(maModule, 'pack/android')
  process.env.MINI_OUTPUT = output || path.join(process.env.MINI_ANDROID, 'app/src/main/assets')
  process.env.MINI_ZIP = zip

  if (mode === 'dev') {
    nodemon({
      script: require.resolve('@mini-architecture/pack'),
      // https://github.com/remy/nodemon/blob/master/lib/config/defaults.js#L15
      // [
      //   '**/.git/**',
      //   '**/.nyc_output/**',
      //   '**/.sass-cache/**',
      //   '**/bower_components/**',
      //   '**/coverage/**',
      //   '**/node_modules/**'
      // ]
      ignoreRoot: ignoreRoot.map(_ => `**/${_}/**`).filter(_ => !_.includes('node_modules')),
      watch: [process.env.MINI_ENTRY, process.env.MINI_FRAMEWORK],
      ext: '*',
      delay: 600,
    })
  } else {
    require('@mini-architecture/pack')
  }
}
