import jsBridge from '../common/bridge'
import { noop } from '../common/utils'

export const appRouteCallbacks = []
export const callbackMap = {}
let callbackIndex = 0

const serviceApi = {
  invoke: jsBridge.invoke,
  on: jsBridge.on,
  publish: jsBridge.publish,
  subscribe: jsBridge.subscribe,
  navigateTo(params) {
    if (params.url + '') {
      invokeRouteMethod('navigateTo', params)
    }
  },
  navigateBack(params) {
    if (typeof params.delta !== 'number' || +params.delta < 1) {
      params.delta = 1
    }
    invokeRouteMethod('navigateBack', params)
  },
  redirectTo(params) {},
  reLaunch(params) {},
  setNavigationBarTitle(title = '') {
    invokeRouteMethod('setNavigationBarTitle', { title })
  },
  getSystemInfo(params) {
    invokeRouteMethod('getSystemInfo', params)
  },
  alert(message) {
    const instance = serviceApi.getCurPageInstance()
    jsBridge.publish('nativeAlert', { message }, [instance.webviewId])
  },
  onAppRoute(callback = noop) {
    appRouteCallbacks.push(callback)
  },
  setAppData(params, webviewIds = []) {
    const { data, callback } = params || {}
    callbackMap[++callbackIndex] = callback

    jsBridge.publish(
      'appDataChange',
      {
        data,
        callbackId: callbackIndex,
      },
      webviewIds,
    )
  },
}

function invokeRouteMethod(eventName, params) {
  const { success = noop, fail = noop, complete = noop, ...restParams } = params || {}

  jsBridge.invoke(eventName, restParams, (res) => {
    const { success: isOk, status, ...restResult } = res
    const instance = serviceApi.getCurPageInstance()

    isOk ? success.call(instance, restResult) : fail.call(instance, restResult)
    complete.call(instance, restResult)
  })
}

export { serviceApi }

window.ns = serviceApi
