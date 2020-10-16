import jsBridge from '../common/bridge'

const webviewApi = {
  data: {},
  invoke: jsBridge.invoke,
  on: jsBridge.on,
  publish: jsBridge.publish,
  subscribe: jsBridge.subscribe,
  navigateTo(params) {
    // for my-navigator component, but not implement
    jsBridge.publish('invokeMethod', {
      eventName: 'navigateTo',
      ...params,
    })
  },
  publishPageEvent(eventName, ev) {
    jsBridge.publish(eventName, ev)
  },
}

export { webviewApi }

window.ma = webviewApi
