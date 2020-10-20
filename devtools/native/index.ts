import MiniActivity from './main/miniActivity'

window.addEventListener('containerReady', (ev: any) => {
  const { maContainer } = ev.detail

  const appId = 'miniDemo'
  const userId = 'lawler61'
  const appPath = `http://localhost:3000/mini/apps/${appId}/`

  window.addEventListener('message', (ev: any) => {
    const { data, origin } = ev
    const { viewId, args = [], type } = data

    if (data.appId !== appId || data.userId !== userId) return
    const [event, params, rest] = args
    // console.log(data)

    // 简单判断了，service -> native，不用再像 android 一样发到 webview
    if (event.includes('nativeAlert')) {
      const p = JSON.parse(params)
      alert(p.message)
    } else {
      const jsCore = MiniActivity.getContext().getJsCoreById(viewId)
      jsCore && jsCore[type](event, params, rest)
    }
  })

  MiniActivity.create().setContainer(maContainer).launch(appId, userId, appPath)
})
