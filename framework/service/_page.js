import { serviceApi } from './api'
import { nextTick, noop } from '../common/utils'

let isBatching = false

// Page Component
export class _Page {
  constructor(options, webviewId, route) {
    options = options || {}
    const { data, ...restParams } = options
    this.route = route
    this.webviewId = webviewId
    this.data = JSON.parse(JSON.stringify(data || {}))
    registerEvent(this, restParams)
  }

  setData(data, callback) {
    batchStateChange(this, data, callback)
  }
}

function batchStateChange(instance, newState, callback = noop) {
  const state = instance._nextState
  // state
  if (!state) {
    instance._nextState = newState
  } else {
    Object.assign(state, newState)
  }

  // callback
  let cbs = instance._callbacks
  if (!cbs) {
    instance._callbacks = [callback]
  } else {
    cbs.push(callback)
  }

  if (!isBatching) {
    isBatching = true
    nextTick(() => doSyncData(instance))
  }
}

function doSyncData(instance) {
  const { _nextState: data, _callbacks: cbs, webviewId } = instance
  instance._nextState = null
  instance._callbacks = null
  isBatching = false

  serviceApi.setAppData(
    {
      data,
      callback(...args) {
        cbs.forEach((cb) => cb.apply(instance, args))
      },
    },
    [webviewId],
  )
}

function registerEvent(instance, obj) {
  Object.entries(obj).forEach(([event, fn]) => {
    typeof fn === 'function' && serviceApi.subscribe(event, fn.bind(instance))
  })
}
