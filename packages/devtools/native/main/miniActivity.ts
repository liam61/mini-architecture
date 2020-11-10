import MiniConfig from '../config/miniConfig'
import AppConfig from '../config/appConfig'
import ApiManager from '../api/apiManager'
import PageManager from './pageManager'
import AppService from '../service'
import OpenLink from '../api/host/openLink'
import { OnEventListener } from '../interfaces'

class MiniActivity implements OnEventListener {
  static instance: MiniActivity

  miniConfig!: MiniConfig
  apiManager!: ApiManager
  pageManager!: PageManager
  appService!: AppService
  container: any

  static create() {
    if (!this.instance) {
      this.instance = new MiniActivity()
    }
    return this.instance
  }

  static getContext() {
    return MiniActivity.instance
  }

  setContainer(container: any) {
    this.container = container
    return this
  }

  launch(appId: string, userId: string, appPath: string) {
    console.log(`[devtools]: ${userId} open ${appId}`)
    window.appConfig = new AppConfig(appId, userId, appPath)
    this.miniConfig = MiniConfig.create().loadExtendsApi(new OpenLink(this))
    this.apiManager = new ApiManager(this, this.miniConfig)

    // webview & service
    this.appService = new AppService(this.container, this, this.apiManager)
    this.pageManager = new PageManager(this.container, this)
  }

  getJsCoreById(id: string) {
    if (+id === this.appService.getId()) return this.appService.getJsCore()
    return this.pageManager.getJsCoreById(id)
  }

  // service publish serviceReady
  onServiceReady() {
    this.pageManager.launchHomePage()
  }

  notifyPageSubscribers(event: string, params: string, viewId: number) {
    this.pageManager.subscribeHandler(event, params, viewId)
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
