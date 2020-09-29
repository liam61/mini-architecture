const pack = require('@mini-architecture/pack')
const chalk = require('chalk')

const isDev = process.env.NODE_ENV !== 'production'

pack()
  .then(() => {
    process.env.MINI_INSTALL && require('./install')
  })
  .catch(err => {
    console.log(isDev ? err : chalk.red(err.stack))
  })
