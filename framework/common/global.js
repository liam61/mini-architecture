import 'core-js/stable'
import 'regenerator-runtime/runtime'

const _global = new Function('return this;')()

// devtools
if (_global.env === 'devtools') {
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
