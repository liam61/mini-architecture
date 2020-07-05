import { noop, nextTick } from '../common/utils'

function batchStateChange(instance, newState, callback = noop) {
  const pState = instance._pendingState
  // state
  if (!pState) {
    instance._pendingState = newState
  } else {
    for (const key in newState) {
      pState[key] = newState[key]
    }
  }

  // callback
  let cbs = instance._callbacks
  callback = callback.bind(instance)
  if (!cbs) {
    instance._callbacks = [callback]
  } else {
    cbs.push(callback)
  }

  if (!isBatching) {
    isBatching = true
    nextTick(doSyncData)
  }
}

function doSyncData(instance) {
  const { _pendingState: nextState, _callbacks: cbs, _webviewId_: wvId } = instance
  instance._pendingState = null
  instance._callbacks = null
  isBatching = false

  invokeWebviewMethod(
    {
      name: 'appDataChange',
      args: {
        data: nextState,
        complete() {
          cbs.forEach(cb.bind(instance))
        },
      },
    },
    wvId,
  )
}

function invokeWebviewMethod(params) {
  const { name, args = {}, webviewIds } = params

  serviceCallbackMap[++callbackId] = {
    success: args.success || noop,
    fail: args.fail || noop,
    complete: args.complete || noop,
  }

  publish(
    'invokeWebviewMethod',
    {
      name,
      args,
      callbackId,
    },
    webviewIds,
  )
}
