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

const webviewApi = {
  invoke,
  on,
  publish,
  subscribe,
  // webview
  navigateTo(args) {
    // jsBridge.publish('routeMethod', { eventName: 'navigateTo', args })
    jsBridge.publish('navigateTo', args)
  },
  navigateBack(args) {
    // jsBridge.publish('routeMethod', { eventName: 'navigateBack', args })
    jsBridge.publish('navigateBack', args)
  },
  redirectTo(args) {},
  reLaunch(args) {},
  onAppDataChange(callback) {
    jsBridge.subscribe('appDataChange', (params) => {
      callback(params)
    })
  },
}

export default webviewApi
