interface Window {
  appConfig: {
    init(config: string): void
    getPagePath: (url: string) => string
    getUrl: (path: string) => string
    getTitle: (url: string) => string
    appId: string
    userId: string
    appPath: string
  }

  serverConfig: {
    host: string
    port: string
    path: string
  }
}
