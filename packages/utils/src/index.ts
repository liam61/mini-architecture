export function validate(key: string, value: any, types: string | string[]) {
  types = Array.isArray(types) ? types : [types]

  const vType = typeof value
  if (!types.includes(vType)) {
    return `option '${key}' should be ${types.join('/')} but received ${vType}...`
  }
  return null
}

export function includes(key: string, value: any, types: any) {
  types = Array.isArray(types) ? types : [types]

  if (!types.includes(value)) {
    return `option '${key}' should be ${types.join('/')} but received ${value}...`
  }
  return null
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
        this.reject!('defer timeout')
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

export function normalizePath(envName: string, localPath: string) {
  const envPath = process.env[envName]
  return typeof envPath === 'string' ? envPath : localPath
}

export function normalizeBoolean(envName: string, localBool: boolean): boolean {
  const envBool = process.env[envName]
  // 'true' | 'stringEnv'
  return typeof envBool === 'string'
    ? ['true', 'false'].includes(envBool)
      ? JSON.parse(envBool)
      : !!envBool
    : localBool
}

export function safeExec(fn: Function) {
  try {
    fn()
  } catch (err) {
    console.log(fn.name, err)
  }
}

// may run in webview or worker
export function nextTick(callback: Function, ...args: any[]) {
  if (typeof Promise !== 'undefined' && typeof Promise.resolve === 'function') {
    return Promise.resolve().then(() => callback(...args))
  } else if (typeof setTimeout !== 'undefined') {
    setTimeout(() => callback(...args))
  } else {
    callback(...args)
  }
}
