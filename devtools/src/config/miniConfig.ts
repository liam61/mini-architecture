import { IApi } from '../interfaces'

export default class MiniConfig {
  static version = '0.0.5-beta1'
  static instance: MiniConfig
  private extendsApi: Map<string, IApi>

  static create() {
    if (!this.instance) {
      this.instance = new MiniConfig()
    }
    return this.instance
  }

  constructor() {
    this.extendsApi = new Map<string, IApi>()
  }

  getExtendsApi() {
    return this.extendsApi
  }

  loadExtendsApi(api: IApi) {
    if (!api || !api.apis().length) return

    api.apis().forEach(name => {
      name && this.extendsApi.set(name, api)
    })
    return MiniConfig.instance
  }
}
