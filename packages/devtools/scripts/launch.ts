#!/usr/bin/env ts-node-script

process.env.DEVTOOLS_ENV = 'develop'

import chokidar from 'chokidar'
import path from 'path'
import onExit from 'signal-exit'
import launcher from '../server/launch'

start()

async function start() {
  let onStop: (() => any) | null = null

  const watcher = chokidar.watch(
    [path.join(__dirname, '../server'), path.join(__dirname, '../*.ts')],
    { interval: 300 },
  )
  watcher
    .on('ready', async () => {
      const { stopAll } = await launcher()
      onStop = stopAll
    })
    .on('change', async _pathname => {
      // console.log('change', pathname)
      if (onStop) {
        await onStop()
        // 动态加载更新后的文件
        delete require.cache[require.resolve('../server/launch')]
        const { default: nextLauncher } = await import('../server/launch')
        onStop = (await nextLauncher()).stopAll
      }
    })

  onExit((_code, signal) => {
    console.log(`\nprocess receive: ${signal}`)
    watcher.close()
    onStop && onStop()
  })
}
