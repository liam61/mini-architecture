import global from './global'

// const ua = global.navigator.userAgent.toLowerCase()
const isWebview = global.webkit
const EVENT_PREFIX = 'custom_event_'

const callbackMap = {}
let callbackIndex = 0

// default event
const eventMap = {}

// custom event
const customEventMap = {}

function invoke(event, params = {}, callback) {
  const paramStr = JSON.stringify(params)
  callbackMap[++callbackIndex] = callback

  if (isWebview) {
    global.webkit.messageHandlers.invoke.postMessage({
      event,
      paramsString: paramStr,
      callbackId,
    })
  } else {
    let result = global.jsCore.invoke(event, params, callbackId)

    if (result && typeof callbackMap[callbackId] === 'function') {
      try {
        result = JSON.parse(result)
      } catch (error) {
        result = {}
      }
      callbackMap[callbackId](result)
      delete callbackMap[callbackId]
    }
  }
}

function on(event, handler) {
  eventMap[event] = handler
}

function subscribe(event, handler) {
  customEventMap[EVENT_PREFIX + event] = handler
}

function subscribeHandler(event, data, webviewId, reportParams) {
  const handler = event.startsWith(EVENT_PREFIX) ? customEventMap[event] : eventMap[event]

  typeof handler === 'function' && handler(data, webviewId, reportParams)
}

function publish(event, params, webviewIds = []) {
  const paramStr = JSON.stringify(params)
  event = EVENT_PREFIX + event
  webviewIds = JSON.stringify(webviewIds)

  if (isWebview) {
    global.webkit.messageHandlers.publish.postMessage({
      event: event,
      paramsString: paramStr,
      webviewIds: webviewIds,
    })
  } else {
    global.jsCore.publish(event, paramsString, webviewIds)
  }
}

const jsBridge = {
  invoke,
  on,
  publish,
  subscribe,
  subscribeHandler,
}

export default jsBridge
