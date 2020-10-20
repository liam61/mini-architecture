#! /usr/bin/env node
const path = require('path')
const { homedir } = require('os')
const chalk = require('chalk')
const nodemon = require('nodemon')
const ignoreRoot = require('ignore-by-default').directories()
const { validate } = require('./utils')

// global add cli 和 mini、pack 在同一级目录
const maPath = path.join(__dirname, '../..')
const commands = ['dev', 'build', 'devtools']

module.exports = function run(config = {}) {
  const { mode, entry = '', framework = '', install = '', output = '', watch, zip = false } = config

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

  const isDev = ['dev', 'devtools'].includes(mode)
  process.env.NODE_ENV = isDev ? 'develop' : 'production'
  process.env.MINI_ENV = mode
  process.env.MINI_ENTRY = entry !== '@mini' ? entry : path.join(maPath, 'mini/dist')
  process.env.MINI_FRAMEWORK = framework || path.join(maPath, `framework/${isDev ? 'dev' : 'dist'}`)
  process.env.MINI_INSTALL = install !== true ? install : path.join(maPath, 'cli/android')
  process.env.MINI_OUTPUT =
    output ||
    (process.env.MINI_INSTALL
      ? path.join(process.env.MINI_INSTALL, 'app/src/main/assets')
      : `${homedir()}/.ma-dev`)
  process.env.MINI_ZIP = zip

  if (watch) {
    nodemon({
      script: require.resolve('./pack.js'),
      // https://github.com/remy/nodemon/blob/master/lib/config/defaults.js#L15
      ignoreRoot: ignoreRoot.map(_ => `**/${_}/**`).filter(_ => !_.includes('node_modules')),
      watch: [process.env.MINI_ENTRY, process.env.MINI_FRAMEWORK],
      ext: '*',
      delay: 600,
    })
  } else {
    require('./pack.js')
  }
}
