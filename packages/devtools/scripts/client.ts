#!/usr/bin/env ts-node-script

process.env.DEVTOOLS_ENV = 'develop'

import chokidar from 'chokidar'
import Bundler from 'parcel-bundler'
import path from 'path'
import open from 'open'
import onExit from 'signal-exit'
import startServer, { StaticServer } from '../server/static'

start()

async function start() {
  let staticServer: StaticServer | null = null

  // https://en.parceljs.org/api.html
  const bundler = new Bundler('./client/index.html', {
    watch: true,
    outDir: 'dist/client',
    cacheDir: 'dist/.cache',
  })
  bundler.on('bundled', () => {
    staticServer && staticServer.send({ type: 'reload' })
  })
  // bundler.on('buildEnd', () => {})

  // index.html 需要输出模板，所以没用 serve 和 middleware
  const bundlePromise = bundler.bundle()

  const watcher = chokidar.watch(
    [path.join(__dirname, '../server'), path.join(__dirname, '../*.ts')],
    { interval: 300 },
  )
  watcher
    .on('ready', async () => {
      await bundlePromise
      const { server, port } = await startServer()
      staticServer = server

      // https://github.com/sindresorhus/open#app
      const appNames = {
        darwin: 'google chrome',
        linux: 'google-chrome',
        win32: 'chrome',
      }

      open(`http://localhost:${port}`, {
        // wait: true,
        app: appNames[process.platform],
      }).then(_child => {})
    })
    .on('change', async pathname => {
      console.log('change', pathname)
      if (staticServer) {
        await staticServer.close()
        // 动态加载更新后的文件
        delete require.cache[require.resolve('../server/static')]
        const { default: nextStaticServer } = await import('../server/static')
        staticServer = (await nextStaticServer()).server
      }
    })

  onExit((_code, signal) => {
    console.log(`\nprocess receive: ${signal}`)
    watcher.close()
    // https://github.com/parcel-bundler/parcel/blob/v2/packages/core/parcel-bundler/src/Bundler.js#L356
    ;(bundler as any).stop()
    staticServer && staticServer.close()
  })
}
