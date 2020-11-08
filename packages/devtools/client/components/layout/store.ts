import AppService from '@/native/service'
import MiniPage from '@/native/page'
import { NavigationBarStore } from '../navigationBar'

export class LayoutStore {
  layoutUpdate = () => {}
  navUpdate = () => {}

  webViews: MiniPage[] = []
  service!: AppService
  navBar: NavigationBarStore
  setTitle: (title: string) => void

  constructor() {
    this.navBar = new NavigationBarStore(this)
    this.setTitle = (title: string) => {
      this.navBar.setTitle(title)
      this.navUpdate()
    }
  }

  get length() {
    return this.webViews.length
  }

  setLayoutUpdate(fn: () => void) {
    this.layoutUpdate = fn
  }

  setNavUpdate(fn: () => void) {
    this.navUpdate = fn
  }

  forceUpdate() {
    this.navUpdate()
    this.layoutUpdate()
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

  updateView(page: MiniPage) {
    // handled by iframe self
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
    if (this.length <= delta) return false

    this.webViews = this.webViews.filter((page, i) => {
      const drop = i + delta >= this.length
      drop && page.destroy()
      return !drop
    })
    // this.webviews = this.webviews.slice(0, this.length - delta)
    this.forceUpdate()
    return true
  }

  removeAllViews(reRender = true) {
    if (!this.webViews.length) return

    this.webViews.forEach(page => page.destroy())
    this.webViews = []
    reRender && this.forceUpdate()
  }
}

export const layoutStore = new LayoutStore()

window.dispatchEvent(
  new CustomEvent('containerReady', {
    detail: { maContainer: layoutStore },
  }),
)
