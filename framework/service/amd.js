var statusDefineFlag = 1,
  statusRequireFlag = 2,
  moduleArr = {}
const define = function (r, e) {
  moduleArr[r] = { status: statusDefineFlag, factory: e }
}
var getPathPrefix = function (r) {
    var e = r.match(/(.*)\/([^\/]+)?$/)
    return e && e[1] ? e[1] : './'
  },
  getRequireFun = function (r) {
    var e = getPathPrefix(r)
    return function (r) {
      if ('string' != typeof r) throw new Error('require args must be a string')
      for (var t = [], i = (e + '/' + r).split('/'), n = i.length, s = 0; s < n; ++s) {
        var u = i[s]
        if ('' != u && '.' != u)
          if ('..' == u) {
            if (0 == t.length) throw new Error("can't find module : " + r)
            t.pop()
          } else s + 1 < n && '..' == i[s + 1] ? s++ : t.push(u)
      }
      try {
        var o = t.join('/')
        return /\.js$/.test(o) || (o += '.js'), require(o)
      } catch (r) {
        throw r
      }
    }
  }
const require = function (r) {
  if ('string' != typeof r) throw new Error('require args must be a string')
  var e = moduleArr[r]
  if (!e) throw new Error('module "' + r + '" is not defined')
  if (e.status === statusDefineFlag) {
    var t,
      i = e.factory,
      n = { exports: {} }
    i && (t = i(getRequireFun(r), n, n.exports)),
      (e.exports = n.exports || t),
      (e.status = statusRequireFlag)
  }
  return e.exports
}
;(window.define = define), (window.require = require)
