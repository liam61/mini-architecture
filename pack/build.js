const path = require('path')
const fs = require('fs-extra')
const ejs = require('ejs')
const glob = require('glob')
const parse = require('./parser')
const Concat = require('concat-with-sourcemaps')
const minify = require('html-minifier').minify

const isDev = process.env.NODE_ENV !== 'production'
const rootPath = path.join(__dirname, '../')
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

function transformView(source, pages, output) {
  const viewTpl = loadTemplate('view')
  const appCssPath = path.join(source, 'app.css')
  let appCss = fs.existsSync(appCssPath) ? fs.readFileSync(appCssPath, 'utf-8') : ''
  if (appCss) {
    const insertTpl = fs.readFileSync(path.join(rootPath, 'framework/common/insert.js'), 'utf-8')
    appCss = insertTpl.replace('__INSERT_TEXT__', `'${appCss}'`).replace(/\n/g, '')
  }

  pages.forEach((page) => {
    const { code, js } = parse({ fullPath: path.join(source, page + '.html'), page })
    const cssPath = path.join(source, page + '.css')
    const css = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf-8') : ''
    const content = viewTpl({
      __TEMPLATE_HTML__: code,
      __TEMPLATE_JS__: appCss + js,
      __TEMPLATE_CSS__: css,
    })

    // 默认以 /index 结束
    const targetDir = path.join(output, page.slice(0, -6))
    fs.mkdirSync(targetDir, { recursive: true })
    fs.writeFileSync(targetDir + '/index.html', isDev ? content : minify(content, minifyConfig))
  })
}

function transformService(source, pages, output, config) {
  const jsFiles = glob.sync(`${source}/**/*.js`, { ignore: [] })
  const serviceTpl = loadTemplate('service')

  const sourceArr = jsFiles.map((file) => {
    // TODO:
    if (file.includes('app.js')) {
      return { code: '', map: '{}', path: '' }
    }
    // NOTE: 其他 js 懒得处理了
    let path = ''
    pages.some((p) => {
      path = file.includes(p) ? p : false
      return path
    })
    if (path) {
      const res = parse({ fullPath: file })
      return Object.assign(res, { path })
    }
  })

  const jsCode = concatFiles(sourceArr)
  config.root = config.root || pages[0]

  const content = serviceTpl({
    __CONFIG__: `\`${JSON.stringify(config)}\``,
  })

  fs.writeFileSync(path.join(output, 'app-service.js'), jsCode)
  fs.writeFileSync(
    path.join(output, 'service.html'),
    isDev ? content : minify(content, minifyConfig),
  )
}

function loadTemplate(name) {
  const template = fs.readFileSync(path.join(rootPath, `framework/template/${name}.ejs`), 'utf-8')
  return ejs.compile(template, { cache: true, filename: name })
}

function concatFiles(sourceArr) {
  const concat = new Concat(true, 'service.js', '\n')

  sourceArr.forEach(({ code, map, path }) => {
    concat.add(null, `var __path__ = "${path}";`)
    concat.add(path, code, map)
  })

  return concat.content.toString()
}

module.exports = {
  transformView,
  transformService,
}
