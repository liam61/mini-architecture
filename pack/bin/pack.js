#! /usr/bin/env node
const program = require('commander')

program.version('0.0.1')
program
  .option('-d, --dev', 'pack in develop mode')
  .option('-e, --entry [path]', 'mini project path')
  .option('-f, --framework [path]', 'mini framework path')
  .option('-a, --android [path]', 'android project path')
  .option('-o, --output [path]', 'outputs path')
  .option('--no-zip', 'not zip outputs')
program.parse(process.argv)

const { dev, entry = '', framework = '', android = '', output = '', zip } = program
// console.log(program)

process.env.NODE_ENV = dev ? 'develop' : 'production'
process.env.MINI_ENTRY = entry
process.env.MINI_FRAMEWORK = framework
process.env.MINI_ANDROID = android
process.env.MINI_OUTPUT = output
process.env.MINI_ZIP = zip

run()

function run() {
  require('../index')
}
