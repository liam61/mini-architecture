import MiniConfig from '../../config/miniConfig'
import { ICallback, IApi } from '../../interfaces'

export default class SystemInfo implements IApi {
  model: string
  pixelRatio: number
  screenWidth: string
  screenHeight: string
  language: string
  version: string
  system: number
  platform: string
  SDKVersion: string

  apis() {
    return ['getSystemInfo']
  }

  onCreate() {
    this.model = ''
    this.pixelRatio = 2
    this.screenWidth = '375'
    this.screenHeight = '750'
    this.language = 'zh-CN'
    this.version = '0.0.2'
    this.system = 10
    this.platform = 'devtools'
    this.SDKVersion = MiniConfig.version
  }

  invoke(event: string, params: string, callback: ICallback) {
    const result = {
      model: this.model,
      pixelRatio: this.pixelRatio,
      screenWidth: this.screenWidth,
      screenHeight: this.screenHeight,
      language: this.language,
      version: this.version,
      system: this.system,
      platform: this.platform,
      SDKVersion: this.SDKVersion,
    }
    callback.onSuccess(result)
  }

  onDestroy() {}
}
