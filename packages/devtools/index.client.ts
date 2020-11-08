import path from 'path'
import open from 'open'
import startStaticServer from './server/static'

// https://github.com/sindresorhus/open#app
const appNames = {
  darwin: 'google chrome',
  linux: 'google-chrome',
  win32: 'chrome',
}

;(async () => {
  const { port } = await startStaticServer({ miniPath: path.join(__dirname, './dist/mini') })

  if (process.env.NODEMON_PROCESS_STAGE === '1') {
    open(`http://localhost:${port}`, {
      // wait: true,
      app: appNames[process.platform],
    })
  }
})()
