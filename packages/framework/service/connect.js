import { serviceApi, appRouteCallbacks, callbackMap } from './api'

serviceApi.subscribe('navigateTo', params => {
  serviceApi.navigateTo(params)
})

serviceApi.subscribe('navigateBack', params => {
  serviceApi.navigateBack(params)
})

serviceApi.subscribe('invokeMethod', params => {
  const { eventName, ...args } = params
  serviceApi[eventName](args)
})

serviceApi.subscribe('pageEvent', params => {
  const { eventName, data } = params
  const instance = serviceApi.getCurPageInstance()
  const fn = instance[eventName]
  typeof fn === 'function' && fn.call(instance, data)
})

serviceApi.on('onAppRoute', params => {
  appRouteCallbacks.forEach(cb => cb(params))
})

serviceApi.subscribe('dataChangeCallback', params => {
  const { callbackId } = params
  const cb = callbackMap[callbackId]
  typeof cb === 'function' && cb()
})
