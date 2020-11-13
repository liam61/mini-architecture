#!/usr/bin/env ts-node-script

process.env.MINI_ENV = 'dev'

import chokidar from 'chokidar'
import path from 'path'
import onExit from 'signal-exit'
import pack from '../src'

const watcher = chokidar.watch(
  [
    path.join(__dirname, '../src'),
    path.join(__dirname, '../templates'),
    path.join(__dirname, '../../framework/dist'),
  ],
  {
    interval: 300,
  },
)
watcher
  .on('ready', () => {
    pack()
  })
  .on('change', pathname => {
    console.log('change', pathname)
    pack()
  })

onExit((_code, signal) => {
  console.log(`\nprocess receive: ${signal}`)
  watcher.close()
})
