import { IBridge } from '../interfaces'

let _id = 0

export default class WebView {
  id: number
  name: string
  path = ''
  url: string // 实际 url
  jsCore: {
    publish: (...args: any[]) => void
    invoke: (...args: any[]) => void
    subscribeHandler: (event: string, params: string, viewId: number) => void
    callbackHandler: (callbackId: string, result: string) => void
  }

  constructor(private bridge: IBridge, public type: 'webView' | 'service' = 'webView') {
    this.id = ++_id
    this.name = `view${this.id}`
    this.addJavascriptInterface()
  }

  /**
   * @param url
   * - pages/index/index | root
   * - service
   * - javascript:xxx
   * - http://xxx
   */
  loadUrl(url: string) {
    // native -> view
    if (url.startsWith('javascript:')) {
      return eval(url.replace('javascript:', 'this.jsCore.'))
    } else if (url.startsWith('http')) {
      this.url = url
      return
    }

    const { appId, userId, getPagePath, getUrl } = window.appConfig
    this.path = getPagePath(url)
    this.url = concatQuery(getUrl(this.path), { appId, userId, viewId: this.id })
  }

  onDestroy() {
    this.removeJavascriptInterface()
  }

  // client
  addJavascriptInterface() {
    const that = this
    // client window.addEventListener('message') 调用
    // 每个 webview 一个隔离的 jsCore
    this.jsCore = {
      publish(event: string, params: string, viewIds: string) {
        console.log(
          `[devtools]: publish bridge is called! event=${event}, params=${params}, viewIds=${viewIds}`,
        )
        that.bridge.publish(event, params, viewIds)
      },
      invoke(event: string, params: string, callbackId: string) {
        console.log(
          `[devtools]: invoke bridge is called! event=${event}, params=${params}, callbackId=${callbackId}`,
        )
        that.bridge.invoke(event, params, callbackId)
      },
      subscribeHandler(event: string, params: string, viewId: number) {
        const { appId, userId } = window.appConfig
        window[that.name].postMessage(
          {
            args: [event, params, viewId],
            type: 'subscribeHandler',
            appId,
            userId,
            viewId: that.id,
          },
          '*',
        )
      },
      callbackHandler(callbackId: string, result: string) {
        const { appId, userId } = window.appConfig
        window[that.name].postMessage(
          { args: [callbackId, result], type: 'callbackHandler', appId, userId, viewId: that.id },
          '*',
        )
      },
    }
  }

  removeJavascriptInterface() {
    this.jsCore = null
  }
}

function concatQuery(url: string, query: Record<string, any> = {}) {
  return Object.entries(query).reduce(
    (res, [k, v], i) => `${res}${i === 0 ? '?' : '&'}${k}=${v}`,
    url,
  )
}
