const path = require('path')
const fs = require('fs-extra')
const ejs = require('ejs')
const glob = require('glob')
const parse = require('./parser')
const Concat = require('concat-with-sourcemaps')
const { minify } = require('html-minifier')

const isDev = process.env.NODE_ENV !== 'production'
const minifyConfig = {
  preserveLineBreaks: true,
  collapseWhitespace: true,
  minifyCSS: true,
  minifyJS: {
    compress: {
      evaluate: false,
    },
    output: {
      semicolons: false,
    },
  },
}
const transformConfig = {}

function transformView() {
  const { miniPath, output, miniConfig } = transformConfig
  const viewTpl = loadTemplate('view')
  const appCssPath = path.join(miniPath, 'app.css')
  let appCss = fs.existsSync(appCssPath) ? fs.readFileSync(appCssPath, 'utf-8') : ''

  miniConfig.pages.forEach(page => {
    const { code, js } = parse({ fullPath: path.join(miniPath, page + '.html'), page })
    const cssPath = path.join(miniPath, page + '.css')
    const css = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf-8') : ''
    const content = viewTpl({
      __ENV__: process.env.MINI_ENV,
      __APP_CSS__: appCss,
      __HTML__: code,
      __JS__: js,
      __CSS__: css,
    })

    // 默认以 /index 结束
    const targetDir = path.join(output, page.slice(0, -6))
    fs.mkdirSync(targetDir, { recursive: true })
    fs.writeFileSync(targetDir + '/index.html', isDev ? content : minify(content, minifyConfig))
  })
}

function transformService() {
  const { miniPath, output, frameworkPath, miniConfig } = transformConfig
  const jsFiles = glob.sync(`${miniPath}/**/*.js`, { ignore: [] })
  const serviceHtmlTpl = loadTemplate('service')
  const serviceTpl = loadTemplate('service-worker')
  const frameworkJs = fs.readFileSync(path.join(frameworkPath, 'service.js'), 'utf-8')

  const sourceArr = jsFiles.map(file => {
    if (file.includes('app.js')) {
      const res = parse({ fullPath: file })
      return Object.assign(res, { path: '' })
    }
    // NOTE: 其他 js 懒得处理了
    let path = ''
    miniConfig.pages.some(p => {
      path = file.includes(p) ? p : false
      return path
    })

    if (path) {
      const res = parse({ fullPath: file })
      return Object.assign(res, { path })
    }
  })

  const jsCode = concatFiles(sourceArr)
  miniConfig.root = miniConfig.root || miniConfig.pages[0]

  if (process.env.MINI_ENV === 'devtools') {
    const content = serviceHtmlTpl({
      __ENV__: 'devtools',
      __CONFIG__: `'${JSON.stringify(miniConfig)}'`,
    })

    fs.writeFileSync(path.join(output, 'app-service.js'), jsCode)
    fs.writeFileSync(path.join(output, 'service.html'), content)
  } else {
    const content = serviceTpl({
      __SERVICE__: frameworkJs,
      __JS__: isDev ? jsCode : minify(jsCode, minifyConfig),
      __CONFIG__: `'${JSON.stringify(miniConfig)}'`,
    })

    fs.writeFileSync(path.join(output, 'app-service.js'), content)
  }
}

function loadTemplate(name) {
  const { templatePath } = transformConfig
  const template = fs.readFileSync(path.join(templatePath, `${name}.ejs`), 'utf-8')
  return ejs.compile(template, { cache: true, filename: name })
}

function concatFiles(sourceArr) {
  const concat = new Concat(true, 'service.js', '\n')

  sourceArr.forEach(({ code, map, path }) => {
    concat.add(null, `window.__path__ = "${path}";`)
    concat.add(path, code, map)
  })

  return concat.content.toString()
}

module.exports = {
  transform(config) {
    Object.assign(transformConfig, config)
    transformView()
    transformService()
  },
}
