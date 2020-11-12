import chalk from 'chalk'

export function validate(key: string, value: any, types: string | string[]) {
  types = Array.isArray(types) ? types : [types]

  const vType = typeof value
  if (!types.includes(vType)) {
    console.log(chalk.red(`option '${key}' should be ${types.join('/')} but received ${vType}...`))
    return false
  }
  return true
}

export function includes(key: string, value: any, types: any) {
  types = Array.isArray(types) ? types : [types]

  if (!types.includes(value)) {
    console.log(chalk.red(`option '${key}' should be ${types.join('/')} but received ${value}...`))
    return false
  }
  return true
}

export function wait(delay = 500, data?: any) {
  return new Promise(resolve => setTimeout(() => resolve(data), delay))
}

export function noop() {}

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
