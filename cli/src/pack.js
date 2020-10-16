const chalk = require('chalk')
// const pack = require(process.env.MINI_ENV === 'devtools' ? '../../pack' : '@mini-architecture/pack')
const pack = require('../../pack')
const isDev = process.env.NODE_ENV !== 'production'

pack()
  .then(() => {
    process.env.MINI_INSTALL && require('./install')
  })
  .catch(err => {
    console.log(isDev ? err : chalk.red(err.stack))
  })
