export interface IBridge {
  /**
   * 发布事件，由 Service 层或 View 层的 jSBridge 调用
   */
  publish: (event: string, params: string, viewId: string) => void

  /**
   * 调用事件，由 Service 层或 View 层的 jSBridge 调用
   */
  invoke: (event: string, params: string, callbackId: string) => void

  /**
   * 事件处理完成后的回调
   */
  callback: (callbackId: string, result: string) => void
}

export interface IApi {
  /**
   * module 可调用的 api
   */
  apis: () => string[]

  /**
   * 唤起 api
   */
  invoke: (event: string, params: string, callback: ICallback) => void

  /**
   * Activity onCreate 时回调
   */
  onCreate: () => void

  /**
   * Activity onDestroy 时回调
   */
  onDestroy: () => void
}

export interface ICallback {
  onSuccess: (result: Record<string, any>) => void
  onFail: () => void
  onCancel: () => void
}

export interface IEvent {
  name: string
  params: string
  callbackId: string
}

export interface OnEventListener {
  /**
   * Service 层触发，表示自己已准备完
   */
  onServiceReady: () => void

  /**
   * Service 层触发，通知 View 层的 Subscriber
   */
  notifyPageSubscribers: (event: string, params: string, viewId: number) => void

  /**
   * Page 层触发，通知 Service 层的 Subscriber
   */
  notifyServiceSubscribers: (event: string, params: string, viewId: number) => void

  /**
   * Service 层触发，通知 Page 层处理界面相关 api 事件
   */
  onPageEvent: (event: string, params: string) => boolean
}
