import { IBridge } from '../interfaces'

let _id = 0

export default class WebView {
  id: number

  constructor(private bridge: IBridge, public url = '') {
    this.id = ++_id
    this.addJavascriptInterface()
  }

  loadUrl(url: string) {
    // native -> client
    if (url.startsWith('javascript:')) {
      eval(url.replace('javascript:', 'window.'))
      return
    }
    this.url = url
  }

  onDestroy() {
    this.removeJavascriptInterface()
  }

  addJavascriptInterface() {
    const that = this
    window.jsCore = {
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
    }
  }

  removeJavascriptInterface() {
    window.jsCore = null
  }
}
