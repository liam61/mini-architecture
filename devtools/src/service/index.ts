import ApiManager from '../api/apiManager'
import { IBridge, OnEventListener } from '../interfaces'
import WebView from '../webview'

/**
 * 小程序 Service 层，加载 service.html
 */
export default class AppService implements IBridge {
  private service: WebView

  constructor(
    public container: any,
    public listener: OnEventListener,
    public apiManager: ApiManager,
  ) {
    this.service = new WebView(this, 'service')
    this.service.loadUrl('service')
    this.container.addView(this, 'service')
  }

  getId() {
    return this.service.id
  }

  getName() {
    return this.service.name
  }

  getUrl() {
    return this.service.url
  }

  getJsCore() {
    return this.service.jsCore
  }

  onDestroy() {
    this.service.onDestroy()
  }

  subscribeHandler(event: string, params: string, viewId: number) {
    console.log(
      `[devtools]: service subscribeHandler is called! event=${event}, params=${params}, called by viewId=${viewId}`,
    )
    this.service.loadUrl(`javascript:subscribeHandler('${event}', ${params}, ${viewId})`)
  }

  publish(event: string, params: string, viewIds: string) {
    if (!this.listener) return

    // prefix 在 framework 中拼接
    if (event === 'custom_event_serviceReady') {
      window.appConfig.init(params)
      this.listener.onServiceReady()
    } else {
      // custom_event_appDataChange | custom_event_nativeAlert
      this.listener.notifyPageSubscribers(event, params, JSON.parse(viewIds))
    }
  }

  invoke(event: string, params: string, callbackId: string) {
    const ev = { name: event, params, callbackId }
    this.apiManager.invokeApi(ev, this)
  }

  callback(callbackId: string, result: string) {
    console.log(
      `[devtools]: service callbackHandler is called! callbackId=${callbackId}, result=${result}`,
    )
    this.service.loadUrl(`javascript:callbackHandler(${callbackId}, ${result})`)
  }
}
