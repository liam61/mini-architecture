import * as ChromeLauncher from 'chrome-launcher'
import CDP from 'chrome-remote-interface'
import getPort from 'get-port'
import fetch from 'node-fetch'
import { homedir } from 'os'
import startStaticServer, { ServerOptions } from './static'

export * from './static'
export const staticServer = startStaticServer

export interface LaunchOptions extends ServerOptions {}

const isDev = process.env.DEVTOOLS_ENV === 'develop'

export default async function launcher(options?: LaunchOptions) {
  const { miniPath, port } = options || {}
  const [{ server, port: staticPort }, clientPort, devtoolsPort] = await Promise.all([
    startStaticServer({ miniPath, port }),
    !isDev ? getPort({ port: 9222 }) : Promise.resolve(9222),
    !isDev ? getPort({ port: 9232 }) : Promise.resolve(9232),
  ])

  const cacheDir = `${homedir()}/.ma-dev`
  const ignoreFlags = ['--disable-extensions', '--disable-features=TranslateUI']
  const newFlags = ChromeLauncher.Launcher.defaultFlags().filter(
    flag => !ignoreFlags.includes(flag),
  )

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
  console.log(`client is running at http://localhost:${clientChrome.port}`)

  const targets = await fetch(`http://localhost:${clientPort}/json`).then(res => res.json())
  const { id, devtoolsFrontendUrl, url, webSocketDebuggerUrl } = targets[0]
  // /devtools/inspector.html?ws=localhost:9222/devtools/page/xxxx
  // console.log(targets)

  const devtoolsChrome = await ChromeLauncher.launch({
    port: devtoolsPort,
    // startingUrl: `http://localhost:${clientPort}${devtoolsFrontendUrl}`,
    ignoreDefaultFlags: true,
    chromeFlags: [
      '--lang=zh-CN',
      '--window-size=830,826',
      '--window-position=760,100',
      `--user-data-dir=${cacheDir}/devtools`,
      `--crash-dumps-dir=${cacheDir}/devtools`,
      ...newFlags,
    ],
  })
  console.log(`devtools is running at http://localhost:${devtoolsChrome.port}\n`)

  const cdp = await CDP({ port: devtoolsChrome.port })
  cdp.Page.navigate({
    // TODO: 定制化的 devtools
    url: `devtools://devtools/bundled/devtools_app.html${devtoolsFrontendUrl.slice(24)}`,
  })
  // cdp2.Page.reload({ ignoreCache: true })

  return {
    server,
    cdp,
    stopAll() {
      return ChromeLauncher.killAll().then(server.close)
    },
  }
}
