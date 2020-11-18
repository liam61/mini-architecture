import * as ChromeLauncher from 'chrome-launcher'
import CDP from 'chrome-remote-interface'
import getPort from 'get-port'
import fetch from 'node-fetch'
import { homedir } from 'os'
import chalk from 'chalk'
import startStaticServer, { ServerOptions } from './static'
import { normalizeBoolean } from '@mini-architecture/utils'

export * from './static'
export const staticServer = startStaticServer

export interface LaunchOptions extends ServerOptions {}

const isCli = normalizeBoolean('MINI_BY_CLI', false)
const isDev = process.env.DEVTOOLS_ENV === 'develop'

export default async function launcher(options?: LaunchOptions) {
  const { miniPath, port } = options || {}
  const [{ server, port: staticPort }, simulatorPort, devtoolsPort] = await Promise.all([
    startStaticServer({ miniPath, port }),
    !isDev ? getPort({ port: 9222 }) : Promise.resolve(9222),
    !isDev ? getPort({ port: 9232 }) : Promise.resolve(9232),
  ])

  const cacheDir = `${homedir()}/.ma-dev`
  const ignoreFlags = ['--disable-extensions', '--disable-features=TranslateUI']
  const newFlags = ChromeLauncher.Launcher.defaultFlags().filter(
    flag => !ignoreFlags.includes(flag),
  )

  const simulator = await ChromeLauncher.launch({
    port: simulatorPort,
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
      `--user-data-dir=${cacheDir}/simulator`,
      `--crash-dumps-dir=${cacheDir}/simulator`,
      ...newFlags,
    ],
  })
  console.log(`
    ${isCli ? chalk.cyan('\n[ma-cli]: ') : ''}simulator is running at http://localhost:${
    simulator.port
  }`)

  const targets = await fetch(`http://localhost:${simulatorPort}/json`).then(res => res.json())
  const { id, devtoolsFrontendUrl, url, webSocketDebuggerUrl } = targets[0]
  // /devtools/inspector.html?ws=localhost:9222/devtools/page/xxxx
  // console.log(targets)

  const devtools = await ChromeLauncher.launch({
    port: devtoolsPort,
    // startingUrl: `http://localhost:${simulatorPort}${devtoolsFrontendUrl}`,
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
  console.log(
    `${isCli ? chalk.cyan('\n[ma-cli]: ') : ''}devtools is running at http://localhost:${
      devtools.port
    }`,
  )

  const cdp = await CDP({ port: devtools.port })
  cdp.Page.navigate({
    // TODO: 定制化的 devtools
    url: `devtools://devtools/bundled/devtools_app.html${devtoolsFrontendUrl.slice(24)}`,
  })
  // cdp2.Page.reload({ ignoreCache: true })
  // setTimeout(() => {
  //   const aaa = cdp.Runtime.evaluate({
  //     expression: `const tabbedPane = window.UI.inspectorView._tabbedLocation._tabbedPane;
  //     console.log(tabbedPane.tabIds());
  //     tabbedPane.setTabEnabled('network', false);
  //     tabbedPane.closeTab('network')`,
  //   })
  //   console.log(aaa)
  // }, 3000)

  return {
    server,
    cdp,
    stopAll() {
      return ChromeLauncher.killAll().then(server.close)
    },
  }
}
