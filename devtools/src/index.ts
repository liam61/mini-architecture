import MiniActivity from './main/miniActivity'

window.addEventListener('containerReady', (ev: any) => {
  const { maContainer } = ev.detail

  const appId = 'mini1'
  const userId = 'lawler61'
  const appPath = 'http://localhost:3000/apps/miniDemo/'

  window.addEventListener('message', (ev: any) => {
    const { data, origin } = ev
    const { viewId, args = [], type } = data

    if (data.appId !== appId || data.userId !== userId) return
    const [event, params, rest] = args
    // console.log(data)

    MiniActivity.getContext().getJsCoreById(viewId)[type](event, params, rest)
  })

  MiniActivity.create().setContainer(maContainer).launch(appId, userId, appPath)
})
