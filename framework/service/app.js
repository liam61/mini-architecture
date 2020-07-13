let currentApp = null

class _App {
  constructor(options) {
    options = options || {}
    Object.entries(options).forEach(([k, v]) => {
      this[k] = v
    })
  }
}

function App(options) {
  currentApp = new _App(options)
}

window.App = App
