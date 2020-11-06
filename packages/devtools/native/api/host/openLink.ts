import { ICallback, IApi } from '../../interfaces'
import MiniActivity from '../../main/miniActivity'

export default class OpenLink implements IApi {
  constructor(public context: MiniActivity) {}

  apis() {
    return ['openLink']
  }

  invoke(event: string, params: string, callback: ICallback) {
    let res = false
    try {
      const p = JSON.parse(params)
      if (!p.url || !p.url.startsWith('http')) {
        throw new Error('invalid params')
      }
      res = this.context.pageManager.navigateToPage(p.url)
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
