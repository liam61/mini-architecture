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
      if (!this.container.removeViewsByDelta(delta)) return false
      const page = this.container.getTopPage()
      // 获取 back 到的界面并显示
      page.onRecover()
      return true
    } catch {
      return false
    }
  }

  /**
   * @param url 不传是刷新
   */
  redirectToPage(url: string | undefined) {
    try {
      const page = this.container.getTopPage()
      page.onRedirectTo(url)
      this.container.updateView(page)
      return true
    } catch {
      return false
    }
  }

  /**
   * @param url 不传是 root
   */
  reLaunchPage(url: string | undefined) {
    try {
      this.container.removeAllViews(false)
      this.createPage(url || 'root', 'reLaunch')
      return true
    } catch {
      return false
    }
  }

  setNavigationBarTitle(title: string) {
    this.container.setTitle(title)
    return true
  }

  subscribeHandler(event: string, params: string, viewId: number) {
    this.container.getWebViews().forEach((page: MiniPage) => {
      viewId === page.getId() && page.subscribeHandler(event, params, page.getId())
    })
  }

  pageEventHandler(event: string, params: string) {
    let p: any = {}
    try {
      p = JSON.parse(params)
    } catch {}

    if (event === 'navigateTo') {
      const path = p.url || ''
      return this.navigateToPage(path)
    } else if (event === 'navigateBack') {
      return this.navigateBackPage(p.delta || 1)
    } else if (event === 'redirectTo') {
      return this.redirectToPage(p.url)
    } else if (event === 'reLaunch') {
      return this.reLaunchPage(p.url)
    } else if (event === 'setNavigationBarTitle') {
      return this.setNavigationBarTitle(p.title)
    }
    return false
  }

  onDestroy() {
    this.container.removeAllViews()
  }
}
