import AppService from '../../../src/service'
import MiniPage from '../../../src/page'
import { NavigationBarStore } from '../navigationBar'

export class LayoutStore {
  forceUpdate: () => void

  webViews: MiniPage[] = []
  service: AppService
  navBar: NavigationBarStore
  setTitle: (title?: string) => void

  constructor() {
    this.navBar = new NavigationBarStore(this)
    this.setTitle = this.navBar.setTitle
  }

  init(fn: () => void) {
    this.forceUpdate = fn
  }

  get length() {
    return this.webViews.length
  }

  getWebViews() {
    return this.webViews
  }

  addView(page: MiniPage | AppService, type = 'webview') {
    if (type === 'webview') {
      this.webViews.push(page as MiniPage)
      this.forceUpdate()
    } else {
      this.service = page as AppService
    }
  }

  getChildAt(index: number) {
    if (index < 0) {
      index += this.length
    }

    return this.webViews[index]
  }

  getTopPage() {
    return this.getChildAt(this.length - 1)
  }

  removeViewsByDelta(delta: number) {
    this.webViews = this.webViews.filter((page, i) => {
      const drop = i + delta >= this.length
      drop && page.destroy()
      return drop
    })
    // this.webviews = this.webviews.slice(0, this.length - delta)
    this.forceUpdate()
  }

  removeAllViews() {
    if (!this.webViews.length) return

    this.webViews.forEach(page => page.destroy())
    this.webViews = []
    this.forceUpdate()
  }
}

export const layoutStore = new LayoutStore()

window.dispatchEvent(
  new CustomEvent('containerReady', {
    detail: { maContainer: layoutStore },
  }),
)
