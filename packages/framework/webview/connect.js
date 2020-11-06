import { webviewApi } from './api'

// 是监听 native 触发的 appDataChange
webviewApi.subscribe('appDataChange', params => {
  const { data, callbackId } = params
  Object.assign(webviewApi.data, data || {})
  typeof _bindData === 'function' && _bindData()

  webviewApi.publish('dataChangeCallback', { callbackId })
})

webviewApi.subscribe('nativeAlert', params => {
  const { message } = params
  window.alert(`native::${message}`)
})

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    // first render: trigger onAppRoute and then appservice set data
    webviewApi.publish('DOMContentLoaded')
  }, 100)
})
