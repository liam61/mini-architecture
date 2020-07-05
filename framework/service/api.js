import jsBridge from '../common/bridge'
import { safeExec, noop } from '../common/utils'

function invoke(...args) {
  safeExec(jsBridge.invoke(args))
}

function on(...args) {
  safeExec(jsBridge.on(args))
}

function publish(...args) {
  args[1] = { data: args[1] }
  safeExec(jsBridge.publish(args))
}

function subscribe(...args) {
  safeExec(jsBridge.subscribe(args))
}

function createPage(route, webviewId, query) {
  const page = new Page(route, webviewId)

  currentPage = {
    page,
    webviewId,
    route,
  }
  pageStack.push(currentPage)
}

function invokeMethod(event, params) {
  invoke(event, params, (res) => {
    const { success: isOk } = res
    const { success = noop, fail = noop, complete = noop } = params

    isOk ? success(res) : fail(res)
    complete(res)
  })
}

const serviceApi = {
  invoke,
  on,
  publish,
  subscribe,
  // service
  navigateTo(params = {}) {
    if (params.url + '') {
      invokeMethod('navigateTo', params)
    }
  },
  navigateBack(params = {}) {
    if (typeof params.delta !== 'number' || +params.delta < 1) {
      params.delta = 1
    }
    invokeMethod('navigateBack', params)
  },
  redirectTo(params = {}) {},
  reLaunch(params = {}) {},
  // for debug
  setData(data = {}, webviewIds = []) {
    publish('appDataChange', data, webviewIds)
  },
}

export default serviceApi
