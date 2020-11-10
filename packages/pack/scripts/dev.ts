#!/usr/bin/env ts-node-script

import nodemon from 'nodemon'

// with nodemon.json
// lerna 并发启动退出有问题
nodemon({})

process.once('SIGINT', () => {
  console.log('process receive: SIGINT')

  // https://github.com/remy/nodemon/blob/master/lib/monitor/run.js#L465
  nodemon.emit('quit', 130)
  process.exit()
})
