import { OnEventListener, ICallback, IApi } from '../../interfaces'

export default class Page implements IApi {
  constructor(public listener: OnEventListener) {}

  apis() {
    return ['navigateTo', 'navigateBack', 'redirectTo', 'reLaunch', 'setNavigationBarTitle']
  }

  invoke(event: string, params: string, callback: ICallback) {
    let res = false

    if (this.listener) {
      res = this.listener.onPageEvent(event, params)
    }

    if (res) {
      callback.onSuccess({})
      return
    }
    callback.onFail()
  }

  onCreate() {}

  onDestroy() {}
}
