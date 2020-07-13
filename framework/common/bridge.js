import _global from './global'
import { safeExec, noop } from './utils'

// const ua = _global.navigator.userAgent.toLowerCase()
const isWebview = _global.webkit
const EVENT_PREFIX = 'custom_event_'

const callbackMap = {}
let callbackIndex = 0

// default event
const eventMap = {}

// custom event
const customEventMap = {}

function invoke(event, params, callback = noop) {
  const paramStr = JSON.stringify(params || {})
  callbackMap[++callbackIndex] = callback

  if (isWebview) {
    _global.webkit.messageHandlers.invoke.postMessage({
      event,
      paramsString: paramStr,
      callbackIndex,
    })
  } else {
    let result = _global.jsCore.invoke(event, paramStr, callbackIndex)
    const cb = callbackMap[callbackIndex]

    if (result && typeof cb === 'function') {
      try {
        result = JSON.parse(result)
      } catch (error) {
        result = {}
      }
      cb(result)
      delete callbackMap[callbackIndex]
    }
  }
}

function callbackHandler(callbackId, params) {
  const cb = callbackMap[callbackId]
  typeof cb === 'function' && cb(params || {})
}

function on(event, handler = noop) {
  eventMap[event] = handler
}

function subscribe(event, handler = noop) {
  customEventMap[EVENT_PREFIX + event] = handler
}

function subscribeHandler(event, params, webviewId) {
  const handler = event.startsWith(EVENT_PREFIX) ? customEventMap[event] : eventMap[event]
  typeof handler === 'function' && handler(params, webviewId)
}

function publish(event, params, webviewIds = []) {
  const paramStr = JSON.stringify(params || {})
  event = EVENT_PREFIX + event
  webviewIds = JSON.stringify(webviewIds)

  if (isWebview) {
    _global.webkit.messageHandlers.publish.postMessage({
      event: event,
      paramsString: paramStr,
      webviewIds: webviewIds,
    })
  } else {
    _global.jsCore.publish(event, paramStr, webviewIds)
  }
}

const jsBridge = {
  invoke(...args) {
    safeExec(invoke.bind(jsBridge, ...args))
  },
  on(...args) {
    safeExec(on.bind(jsBridge, ...args))
  },
  publish(...args) {
    safeExec(publish.bind(jsBridge, ...args))
  },
  subscribe(...args) {
    safeExec(subscribe.bind(jsBridge, ...args))
  },
  subscribeHandler,
  callbackHandler,
}

export default jsBridge

_global.jsBridge = jsBridge
