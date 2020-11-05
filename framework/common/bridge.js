import _global from './global'
import { safeExec, noop } from './utils'

const isIOS = _global.webkit
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

  if (isIOS) {
    _global.webkit.messageHandlers.invoke.postMessage({
      event,
      paramsString: paramStr,
      callbackIndex,
    })
  } else {
    _global.jsCore.invoke(event, paramStr, callbackIndex + '')
  }
}

function callbackHandler(callbackId, result) {
  const cb = callbackMap[callbackId]
  if (cb && typeof cb === 'function') {
    cb(result)
    delete callbackMap[callbackId]
  }
}

function on(event, handler = noop) {
  eventMap[event] = handler
}

function subscribe(event, handler = noop) {
  customEventMap[EVENT_PREFIX + event] = handler
}

function subscribeHandler(event, params, webviewId) {
  const handler = event.startsWith(EVENT_PREFIX) ? customEventMap[event] : eventMap[event]

  if (typeof handler === 'function') {
    try {
      typeof params === 'string' && (params = JSON.parse(params))
    } catch {
      params = {}
    }

    handler(params, webviewId)
  }
}

function publish(event, params, webviewId = 0) {
  const paramStr = JSON.stringify(params || {})
  event = EVENT_PREFIX + event

  if (isIOS) {
    _global.webkit.messageHandlers.publish.postMessage({
      event: event,
      paramsString: paramStr,
      webviewId,
    })
  } else {
    _global.jsCore.publish(event, paramStr, webviewId + '')
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
}

export default jsBridge

_global.jsBridge = jsBridge
_global.callbackHandler = callbackHandler
_global.subscribeHandler = subscribeHandler
