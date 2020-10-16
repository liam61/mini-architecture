import Page from './builtin/page'
import SystemInfo from './builtin/systemInfo'
import MiniConfig from '../config/miniConfig'
import { IApi, OnEventListener, IBridge, ICallback, IEvent } from '../interfaces'

/**
 * 所有 api 统一入口
 */
export default class ApiManager {
  private apis = new Map<string, IApi>()

  constructor(public listener: OnEventListener, public miniConfig: MiniConfig) {
    this.initSdkApi()
  }

  onCreate() {
    this.apis.forEach(api => api.onCreate())
  }

  onDestroy() {
    this.apis.forEach(api => api.onDestroy())
    this.apis.clear()
  }

  initSdkApi() {
    this.load(new Page(this.listener))
    this.load(new SystemInfo())
    this.onCreate()
  }

  load(api: IApi) {
    if (!api || !api.apis().length) return

    api.apis().forEach(name => {
      name && this.apis.set(name, api)
    })
  }

  invokeApi(event: IEvent, bridge: IBridge) {
    const that = this
    const callback: ICallback = {
      onSuccess(result) {
        const res = that.assembleResult(result, event.name, 'ok')
        console.log(`[devtools]: call api success! event=${event.name}, result=${res}`)
        bridge && bridge.callback(event.callbackId, res)
      },
      onFail() {
        console.log(`[devtools]: call api fail! event=${event.name}`)
        bridge && bridge.callback(event.callbackId, that.assembleResult(null, event.name, 'fail'))
      },
      onCancel() {
        bridge && bridge.callback(event.callbackId, that.assembleResult(null, event.name, 'cancel'))
      },
    }

    let api = this.apis.get(event.name)

    if (!api) {
      // 看 extendsApi 中是否存在
      const extendsApi = this.miniConfig.getExtendsApi()
      api = extendsApi.get(event.name)
    }

    api && api.invoke(event.name, event.params, callback)
  }

  assembleResult(data: Record<string, any>, event: string, status: string) {
    data = Object.assign({}, data, {
      status: `${event}:${status}`,
      success: status === 'ok',
    })
    return JSON.stringify(data)
  }
}
