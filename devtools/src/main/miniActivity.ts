import MiniConfig from '../config/miniConfig'
import AppConfig from '../config/appConfig'
import ApiManager from '../api/apiManager'
import PageManager from './pageManager'
import AppService from '../service'
import OpenLink from '../hostapi/openLink'
import { OnEventListener } from '../interfaces'

class MiniActivity implements OnEventListener {
  static instance: MiniActivity

  miniConfig: MiniConfig
  appConfig: AppConfig
  apiManager: ApiManager
  pageManager: PageManager
  appService: AppService
  container: any

  static create() {
    if (!this.instance) {
      this.instance = new MiniActivity()
    }
    return this.instance
  }

  static getExtendsApi() {
    return MiniActivity.instance.miniConfig.getExtendsApi()
  }

  setContainer(container: any) {
    this.container = container
    return this
  }

  launch(appId: string, userId: string, appPath: string) {
    console.log(`[devtools]: ${userId} open ${appId}`)
    this.appConfig = new AppConfig(appId, userId, appPath)
    this.miniConfig = MiniConfig.create().loadExtendsApi(new OpenLink(this.pageManager))
    this.apiManager = new ApiManager(this, this.appConfig)

    this.loadPage()
  }

  // webview & service
  loadPage() {
    this.pageManager = new PageManager(this.container, this, this.appConfig)
    this.appService = new AppService(this, this.appConfig, this.apiManager)
  }

  // service publish serviceReady
  onServiceReady() {
    this.pageManager.launchHomePage()
  }

  notifyPageSubscribers(event: string, params: string, viewIds: number[]) {
    this.pageManager.subscribeHandler(event, params, viewIds)
  }

  notifyServiceSubscribers(event: string, params: string, viewId: number) {
    this.appService.subscribeHandler(event, params, viewId)
  }

  onPageEvent(event: string, params: string) {
    return this.pageManager.pageEventHandler(event, params)
  }

  onDestroy() {
    this.pageManager.onDestroy()
    this.apiManager.onDestroy()
    this.appService.onDestroy()
  }
}

export default MiniActivity
