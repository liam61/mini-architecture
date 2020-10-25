export class Deferred<T> {
  promise: Promise<T>
  resolve: (res: any) => void
  reject: (err: any) => void
  onComplete: () => void
  timer: NodeJS.Timeout

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
        this.reject('[friendlyError]: get frame timeout')
      }, 3 * 1000)
    })

    // for gc
    this.onComplete = () => {
      clearTimeout(this.timer)
      this.resolve = null
      this.reject = null
    }
  }
}

export function noop() {}
