#! /usr/bin/env ts-node-script

import nodemon from 'nodemon'
import Bundler from 'parcel-bundler'
import path from 'path'
;(async () => {
  // https://en.parceljs.org/api.html
  const bundler = new Bundler(path.resolve('./client/index.html'), {
    watch: true,
    outDir: 'dev/client',
    cacheDir: 'dev/.cache',
  })
  bundler.on('bundled', () => {})
  bundler.on('buildEnd', () => {})

  const _bundle = await bundler.bundle()

  // https://github.com/remy/nodemon/pull/1077. Why you didn't merge
  process.env.NODEMON_PROCESS_STAGE = '1'
  // with nodemon.json
  nodemon({
    exec: 'ts-node index.client.ts',
  }).once('restart', () => {
    process.env.NODEMON_PROCESS_STAGE = '2'
  })
})()
