#!/usr/bin/env ts-node-script

import nodemon from 'nodemon'

// https://github.com/remy/nodemon/pull/1077. Why you didn't merge
process.env.NODEMON_PROCESS_STAGE = '1'
// with nodemon.json
nodemon({
  exec: 'ts-node index.launch.ts',
}).once('restart', () => {
  process.env.NODEMON_PROCESS_STAGE = '2'
})
