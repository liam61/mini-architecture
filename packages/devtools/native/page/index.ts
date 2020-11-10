import WebView from '../webview'
import { IBridge, OnEventListener } from '../interfaces'

/**
 * 小程序 View 层，加载相应的 xxxPage.html
 */
export default class MiniPage implements IBridge {
  openType = ''
  private webView: WebView

  constructor(url: string, openType: string, public listener: OnEventListener) {
    this.webView = new WebView(this)
    this.loadUrl(url, openType)
  }

  getId() {
    return this.webView.id
  }

  getName() {
    return this.webView.name
  }

  getUrl() {
    return this.webView.url
  }

  getPath() {
    return this.webView.path
  }

  getJsCore() {
    return this.webView.jsCore
  }

  destroy() {
    this.webView.onDestroy()
  }

  private loadUrl(url: string, openType: string) {
    if (!url) return
    this.openType = openType
    this.webView.loadUrl(url, openType === 'redirectTo')
    return true
  }

  /**
   * 返回到此界面
   */
  onRecover() {
    this.openType = 'navigateBack'
    return this.onDomContentLoaded()
  }

  onRedirectTo(url: string | undefined) {
    return this.loadUrl(url || this.getPath(), 'redirectTo')
  }

  onDomContentLoaded() {
    if (!this.listener) return false

    const name = 'onAppRoute'
    const params = {
      webviewId: this.getId(),
      openType: this.openType,
      path: this.getPath(),
    }

    try {
      this.listener.notifyServiceSubscribers(name, JSON.stringify(params), this.getId())
      return true
    } catch (err) {
      console.error('[devtools]: onDomContentLoaded assembly params exception', err)
      return false
    }
  }

  subscribeHandler(event: string, params: string, viewId: number) {
    console.log(
      `[devtools]: webView subscribeHandler is called! event=${event}, params=${params}, called by viewId=${viewId}`,
    )
    this.webView.loadUrl(`javascript:subscribeHandler('${event}', ${params}, ${viewId})`)
  }

  publish(event: string, params: string, _viewId: string) {
    if (event === 'custom_event_DOMContentLoaded') {
      this.onDomContentLoaded()
    } else {
      this.listener.notifyServiceSubscribers(event, params, this.getId())
    }
  }

  invoke(_event: string, _params: string, _callbackId: string) {}

  callback(_callbackId: string, _result: string) {}
}
