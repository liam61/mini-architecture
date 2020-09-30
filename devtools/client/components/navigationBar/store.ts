import { LayoutStore } from '../layout'

export class NavigationBarStore {
  title: string

  constructor(private layout: LayoutStore) {
    this.title = layout.length !== 0 ? layout.getTopPage().title : 'demo'
  }

  get canGoBack() {
    return this.layout.length > 1
  }

  setTitle = (title = 'demo') => {
    this.title = title
  }

  onBack() {
    this.layout.removeViewsByDelta(1)
  }

  onMore() {
    alert('onMore not implement')
  }

  onExit() {
    alert('onExit not implement')
  }
}
