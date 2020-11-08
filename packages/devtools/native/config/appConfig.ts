export default class AppConfig {
  config: {
    window: {
      navigationBarTitleText: string
      pages: Record<string, any>
    }
    [k: string]: any
  } = {} as any

  constructor(public appId: string, public userId: string, public appPath: string) {}

  init(config: string) {
    let json: Record<string, any> = {}
    try {
      json = JSON.parse(config)
      json.config = JSON.parse(json.config)
    } catch {}
    this.config = json.config || { window: {} }
  }

  getPagePath = (url: string): string => {
    return url === 'root' ? this.config.root : url
  }

  getUrl = (path: string) => {
    return this.appPath + (path !== 'service' ? this.getPagePath(path) : 'service') + '.html'
  }

  getTitle = (url: string): string => {
    const { window: cfg } = this.config
    if (!cfg.pages) return cfg.navigationBarTitleText || ''
    return cfg.pages[this.getPagePath(url)] || cfg.navigationBarTitleText || ''
  }
}
