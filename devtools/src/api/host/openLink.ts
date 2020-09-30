import PageManager from '../../main/pageManager'
import { ICallback, IApi } from '../../interfaces'

export default class OpenLink implements IApi {
  constructor(public pageManager: PageManager) {}

  apis() {
    return ['openLink']
  }

  invoke(event: string, params: string, callback: ICallback) {
    let res = false
    try {
      const p = JSON.parse(params)
      res = this.pageManager.navigateToPage(p.url)
    } catch {}

    if (res) {
      callback.onSuccess({})
      return
    }
    callback.onFail()
  }

  onCreate() {}

  onDestroy() {}
}
