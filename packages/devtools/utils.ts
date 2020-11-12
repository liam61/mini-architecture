export class Deferred<T = any> {
  promise: Promise<T>
  resolve!: (res?: any) => void
  reject!: (err?: any) => void
  private onComplete: () => void
  private timer!: NodeJS.Timeout

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = res => {
        resolve(res)
        this.onComplete()
      }

      this.reject = err => {
        reject(err)
        this.onComplete()
      }

      this.timer = setTimeout(() => {
        this.reject!('[friendlyError]: get frame timeout')
      }, 3 * 1000)
    })

    // for gc
    this.onComplete = () => {
      clearTimeout(this.timer)
      this.resolve = noop
      this.reject = noop
    }
  }
}

export function noop() {}

export function wait(delay = 500, data?: any) {
  return new Promise(resolve => setTimeout(() => resolve(data), delay))
}

export function normalizePath(envName: string, localPath: string) {
  const envPath = process.env[envName]
  return typeof envPath === 'string' ? envPath : localPath
}

export function normalizeBoolean(envName: string, localBool: string) {
  const envBool = process.env[envName]
  // 'true' | 'other/string'
  return typeof envBool === 'string'
    ? ['true', 'false'].includes(envBool)
      ? JSON.parse(envBool)
      : !!envBool
    : localBool
}
