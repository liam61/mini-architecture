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
    wsPath: string
  }

  maContainer: any
  pageManager: any
  wsClient: {
    ws?: WebSocket
    send(data: Record<string, any>): void
    close(): void
  }
}
