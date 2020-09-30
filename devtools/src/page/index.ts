import WebView from '../webview'
import { IBridge, OnEventListener } from '../interfaces'

/**
 * 小程序 View 层，加载相应的 xxxPage.html
 */
export default class MiniPage implements IBridge {
  openType: string
  private webView: WebView

  constructor(public url: string, openType: string, public listener: OnEventListener) {
    this.webView = new WebView(this)
    this.loadUrl(url, openType)
  }

  getId() {
    return this.webView.id
  }

  getName() {
    return `maWebview${this.getId()}`
  }

  getUrl() {
    return this.webView.url
  }

  destroy() {
    this.webView.onDestroy()
  }

  /**
   * 导航回到此界面
   */
  onNavigateBack() {
    this.openType = 'navigateBack'
    return this.onDomContentLoaded()
  }

  onRedirectTo(url: string) {
    return false
  }

  onReLaunch(url: string) {
    return false
  }

  loadUrl(url: string, openType: string) {
    if (!url) return
    this.url = url
    this.openType = openType
    this.webView.loadUrl(url)
  }

  onDomContentLoaded() {
    if (!this.listener) return false

    const name = 'onAppRoute'
    const params = {
      webviewId: this.getId(),
      openType: this.openType,
      path: this.url,
    }

    try {
      this.listener.notifyServiceSubscribers(name, JSON.stringify(params), this.getId())
      return true
    } catch (err) {
      console.error('[devtools]: onDomContentLoaded assembly params exception')
      return false
    }
  }

  subscribeHandler(event: string, params: string, viewIds: number[]) {
    console.log(
      `[devtools]: subscribeHandler is called by native! event=${event}, params=${params}, viewIds=${viewIds}`,
    )
    this.webView.loadUrl(`javascript:subscribeHandler('${event}', ${params})`)
  }

  publish(event: string, params: string, viewIds: string) {
    if (event === 'custom_event_DOMContentLoaded') {
      this.onDomContentLoaded()
    } else {
      this.listener.notifyServiceSubscribers(event, params, this.getId())
    }
  }

  invoke(event: string, params: string, callbackId: string) {}

  callback(callbackId: string, result: string) {}
}
