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
    if (params.url) {
      invokeRouteMethod('navigateTo', params)
    }
  },
  navigateBack(params) {
    if (typeof params.delta !== 'number' || +params.delta < 1) {
      params.delta = 1
    }
    invokeRouteMethod('navigateBack', params)
  },
  redirectTo(params) {
    if (params.url) {
      invokeRouteMethod('redirectTo', params)
    }
  },
  reLaunch(params) {
    if (params.url) {
      invokeRouteMethod('reLaunch', params)
    }
  },
  setNavigationBarTitle(title = '') {
    invokeRouteMethod('setNavigationBarTitle', { title })
  },
  getSystemInfo(params) {
    invokeRouteMethod('getSystemInfo', params)
  },
  alert(message) {
    const instance = serviceApi.getCurPageInstance()
    jsBridge.publish('nativeAlert', { message }, instance.webviewId)
  },
  openLink(url) {
    invokeRouteMethod('openLink', { url })
  },
  onAppRoute(callback = noop) {
    appRouteCallbacks.push(callback)
  },
  setAppData(params, webviewId) {
    const { data, callback } = params || {}
    callbackMap[++callbackIndex] = callback

    jsBridge.publish(
      'appDataChange',
      {
        data,
        callbackId: callbackIndex,
      },
      webviewId,
    )
  },
}

function invokeRouteMethod(eventName, params) {
  const { success = noop, fail = noop, complete = noop, ...restParams } = params || {}

  jsBridge.invoke(eventName, restParams, res => {
    try {
      typeof res === 'string' && (res = JSON.parse(res))
    } catch {
      res = {}
    }

    const { success: isOk, status, ...result } = res
    const instance = serviceApi.getCurPageInstance()

    isOk ? success.call(instance, result) : fail.call(instance, result)
    complete.call(instance, result)
  })
}

export { serviceApi }

window.ma = serviceApi
