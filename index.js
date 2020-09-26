const program = require('commander')
const runAll = require('npm-run-all')
const stream = require('stream')

program.option('--cmd [command]', 'install, dev, build').parse(process.argv)
const { cmd } = program

const options = {
  arguments: [cmd],
  parallel: cmd !== 'build',
}

console.log(`\n${JSON.stringify(options)}\n`)

class BufferStream extends stream.Writable {
  constructor() {
    super()
    this.value = ''
  }

  _write(chunk, _encoding, callback) {
    this.value += chunk.toString()
    console.log(chunk.toString())
    callback()
  }
}

options.stdout = new BufferStream()

runAll([`run-* {1}`, cmd === 'install' && 'i-cli'].filter(Boolean), options).then(res => {
  // console.log(res)
  // console.log(stdout.value)
})
