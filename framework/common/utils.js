import _global from './global'

export function safeExec(fn) {
  try {
    fn()
  } catch (error) {
    console.err(err)
  }
}

export function noop() {}

const nextTick =
  Promise && typeof Promise.resolve === 'function'
    ? Promise.resolve().then.bind(Promise.resolve())
    : setTimeout.bind(_global)

export { nextTick }
