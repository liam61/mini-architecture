import { serviceApi, appRouteCallbacks, callbackMap } from './api'
import { getCurrentPages } from './page'

serviceApi.subscribe('navigateTo', (params) => {
  serviceApi.navigateTo(params)
})

serviceApi.subscribe('navigateBack', (params) => {
  serviceApi.navigateBack(params)
})

serviceApi.subscribe('invokeMethod', (params) => {
  const { eventName, ...args } = params
  serviceApi[eventName](args)
})

serviceApi.subscribe('pageEvent', (params) => {
  const { eventName, data } = params
  const curPages = getCurrentPages()
  const { page } = curPages[curPages.length - 1]
  const fn = page[eventName]
  typeof fn === 'function' && fn.apply(page, data)
})

serviceApi.on('onAppRoute', (params) => {
  appRouteCallbacks.forEach((cb) => cb(params))
})

serviceApi.subscribe('dataChangeCallback', (params) => {
  const { callbackId } = params
  const cb = callbackMap[callbackId]
  typeof cb === 'function' && cb()
})
