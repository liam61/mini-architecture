import 'core-js/stable'
import 'regenerator-runtime/runtime'

const _global = new Function('return this;')()
_global.version = '__VERSION__'

if (_global.platform === 'devtools') {
  const config = _global.location.href
    .split('?')[1]
    .split('&')
    .reduce((obj, str) => {
      const [k, v] = str.split('=')
      obj[k] = v
      return obj
    }, {})

  // view -> native
  _global.jsCore = {
    publish(...args) {
      _global.parent.postMessage({ args, type: 'publish', ...config }, '*')
    },
    invoke(...args) {
      _global.parent.postMessage({ args, type: 'invoke', ...config }, '*')
    },
  }

  // native -> view
  _global.addEventListener('message', ev => {
    // console.log('call from devtools', ev)
    const { data, origin } = ev
    const { appId, userId, viewId, args = [], type } = data

    if (appId !== config.appId || userId !== config.userId) return
    if (!_global[type]) {
      throw new Error(`can not find ${type} of global in mini SDK`)
    }
    _global[type](...args)
  })
}

// android v8 worker
if (!_global.jsCore) {
  _global.jsCore = {
    publish: _global.publish,
    invoke: _global.invoke,
  }

  _global.console = {
    log(...args) {
      _global.log(args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : arg)).join(', '))
    },
    err(...args) {
      _global.log(args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : arg)).join(', '))
    },
  }

  // NOTE: not node environment, scheduler is not a function
  _global.setTimeout = function (fn, delay) {
    fn()
  }
}

export default _global
