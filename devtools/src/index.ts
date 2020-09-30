import MiniActivity from './main/miniActivity'

window.addEventListener('containerReady', (ev: any) => {
  const { maContainer } = ev.detail
  console.log(maContainer)

  const appId = 'mini1'
  const userId = 'lawler61'
  const appPath = 'http://localhost:3000/apps/miniDemo/'

  MiniActivity.create().setContainer(maContainer).launch(appId, userId, appPath)
})
