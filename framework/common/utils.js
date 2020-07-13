import _global from './global'

export function safeExec(fn) {
  try {
    fn()
  } catch (err) {
    console.log(fn.name, err)
  }
}

export function noop() {}

export const nextTick =
  Promise && typeof Promise.resolve === 'function'
    ? Promise.resolve().then.bind(Promise.resolve())
    : setTimeout.bind(_global)
