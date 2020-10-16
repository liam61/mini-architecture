import MiniPage from '../page'
import { OnEventListener } from '../interfaces'

export default class PageManager {
  constructor(public container: any, public listener: OnEventListener) {}

  private createPage(url: string, navigateType: string) {
    const page = new MiniPage(url, navigateType, this.listener)
    page.getPath() && this.setNavigationBarTitle(window.appConfig.getTitle(page.getPath()))
    this.container.addView(page)
    return page
  }

  getTopPage(): MiniPage {
    return this.container.getTopPage()
  }

  getJsCoreById(id: string) {
    const page: MiniPage = this.container
      .getWebViews()
      .find((page: MiniPage) => +id === page.getId())
    return page ? page.getJsCore() : {}
  }

  launchHomePage() {
    try {
      this.container.removeAllViews()
      this.createPage('root', 'appLaunch')
      return true
    } catch {
      return false
    }
  }

  navigateToPage(url: string) {
    try {
      this.createPage(url, 'navigateTo')
      return true
    } catch {
      return false
    }
  }

  navigateBackPage(delta: number) {
    try {
      this.container.removeViewsByDelta(delta)
      const page = this.getTopPage()
      // 获取 back 到的界面并显示
      page.onNavigateBack()
      return true
    } catch {
      return false
    }
  }

  redirectToPage(url: string) {
    return false
  }

  reLaunchPage(url: string) {
    return false
  }

  setNavigationBarTitle(title: string) {
    this.container.setTitle(title)
    return true
  }

  subscribeHandler(event: string, params: string, viewIds: number[]) {
    if (!viewIds.length) return

    this.container.getWebViews().forEach((page: MiniPage) => {
      viewIds.includes(page.getId()) && page.subscribeHandler(event, params, page.getId())
    })
  }

  pageEventHandler(event: string, params: string) {
    let p: any = {}
    try {
      p = JSON.parse(params)
    } catch {}

    if (event === 'navigateTo') {
      const path = p.url || ''
      return this.navigateToPage(path + '.html')
    } else if (event === 'navigateBack') {
      return this.navigateBackPage(p.delta || 1)
    } else if (event === 'redirectTo' || event === 'reLaunch') {
      return false
    } else if (event === 'setNavigationBarTitle') {
      return this.setNavigationBarTitle(p.title || '')
    }
    return false
  }

  onDestroy() {
    this.container.removeAllViews()
  }
}
