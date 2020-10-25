import * as ChromeLauncher from 'chrome-launcher'
// import CDP from 'chrome-remote-interface'
import getPort from 'get-port'
import fetch from 'node-fetch'
import { homedir } from 'os'
import startStaticServer from './index'
import { Deferred } from '../utils'

init()

async function init() {
  const deferred = new Deferred<number[]>()
  Promise.all([startStaticServer(), getPort({ port: 9222 }), getPort({ port: 9232 })]).then(
    deferred.resolve,
  )

  const cacheDir = `${homedir()}/.ma-dev`
  const ignoreFlags = ['--disable-extensions', '--disable-features=TranslateUI']
  const newFlags = ChromeLauncher.Launcher.defaultFlags().filter(
    flag => !ignoreFlags.includes(flag),
  )

  const [staticPort, clientPort, devtoolsPort] = await deferred.promise

  const clientChrome = await ChromeLauncher.launch({
    port: clientPort,
    startingUrl: `http://localhost:${staticPort}`,
    ignoreDefaultFlags: true,
    // https://github.com/GoogleChrome/chrome-launcher/blob/master/docs/chrome-flags-for-tools.md
    chromeFlags: [
      '--lang=zh-CN',
      '--window-size=500,826',
      '--window-position=260,100',
      // '--custom-devtools-frontend=file:///Users/lawler/out/Default/resources/inspector',
      // '--headless', // 带上则不能直接弹出 chrome
      '--disable-gpu',
      '--disable-features=IsolateOrigins,site-per-process,TranslateUI',
      `--user-data-dir=${cacheDir}/client`,
      `--crash-dumps-dir=${cacheDir}/client`,
      ...newFlags,
    ],
  })

  const targets = await fetch(`http://localhost:${clientPort}/json`).then(res => res.json())
  const { id, devtoolsFrontendUrl, url, webSocketDebuggerUrl } = targets[0]
  console.log(targets)

  // const devtoolsChrome = await ChromeLauncher.launch({
  //   port: devtoolsPort,
  //   // /devtools/inspector.html?ws=localhost:9222/devtools/page/xxxx
  //   startingUrl: `http://localhost:${clientPort}${devtoolsFrontendUrl}`,
  //   ignoreDefaultFlags: true,
  //   chromeFlags: [
  //     '--lang=zh-CN',
  //     '--window-size=830,826',
  //     '--window-position=760,100',
  //     `--user-data-dir=${cacheDir}/devtools`,
  //     `--crash-dumps-dir=${cacheDir}/devtools`,
  //     ...newFlags,
  //   ],
  // })

  // const version = await CDP.Version({ port: clientChrome.port })
  console.log(`client is running at http://localhost:${clientChrome.port}`)
  // console.log(version)

  // console.log(`devtools is running at http://localhost:${devtoolsChrome.port}`)
}
