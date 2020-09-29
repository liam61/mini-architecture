const ChromeLauncher = require('chrome-launcher')
const getPort = require('get-port')

const ignoreFlags = ['--disable-extensions']
const newFlags = ChromeLauncher.Launcher.defaultFlags().filter(flag => !ignoreFlags.includes(flag))

getPort({ port: 50942 }).then(port => {
  ChromeLauncher.launch({
    port,
    startingUrl: 'https://google.com',
    ignoreDefaultFlags: true,
    chromeFlags: [
      '--lang=zh-CN',
      '--headless',
      '--disable-gpu',
      '--disable-features=IsolateOrigins,site-per-process',
    ].concat(newFlags),
  }).then(chrome => {
    console.log(`Chrome debugging port running on ${chrome.port}, get targets by ${1}`)
  })
})
