const program = require('commander')
const runAll = require('npm-run-all')
const stream = require('stream')

program.option('--cmd [command]', '...').parse(process.argv)
const { cmd } = program

const options = {
  arguments: [cmd],
  parallel: cmd !== 'build',
}

console.log(`\n${JSON.stringify(options)}\n\n`)

class BufferStream extends stream.Writable {
  constructor() {
    super()
    this.value = ''
  }

  _write(chunk, _encoding, callback) {
    this.value += chunk.toString()
    callback()
  }
}

const stdout = new BufferStream()

runAll([`run-* {1}`], { ...options, stdout }).then((res) => {
  // console.log(res)
  console.log(stdout.value)
})
