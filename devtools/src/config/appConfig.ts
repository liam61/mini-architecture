export default class AppConfig {
  config: {
    window: {
      navigationBarTitleText: string
      pages: Record<string, any>
    }
    [k: string]: any
  }

  constructor(public appId: string, public userId: string, public appPath: string) {}

  init(config: string) {
    let json: Record<string, any> = {}
    try {
      json = JSON.parse(config)
    } catch {}

    this.config = json.config || { window: {} }
  }

  getPageUrl(url: string) {
    return this.appPath + (url === 'root' ? this.config.root : url) + '.html'
  }

  getTitle(url: string) {
    const { window } = this.config
    if (!window.pages) return window.navigationBarTitleText || ''
    return window.pages[url] || window.navigationBarTitleText || ''
  }
}
