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
      params.url = params.url + '.html' // 添上后缀
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
  onAppRoute(callback = noop) {
    appRouteCallbacks.push(callback)
  },
  setAppData(params, webviewIds = []) {
    const { data, path, callback } = params || {}
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

function invokeRouteMethod(event, params) {
  const { success = noop, fail = noop, complete = noop, ...restParams } = params || {}

  jsBridge.invoke(event, restParams, (res) => {
    const { success: isOk } = res

    isOk ? success(res) : fail(res)
    complete(res)
  })
}

export { serviceApi }

window.ns = serviceApi
