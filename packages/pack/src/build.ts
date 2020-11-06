import path from 'path'
import fs from 'fs-extra'
import ejs from 'ejs'
import glob from 'glob'
import parser, { ParseResult } from './parser'
import Concat from 'concat-with-sourcemaps'
import { minify } from 'html-minifier'

export interface BuilderConfig {
  miniPath: string
  frameworkPath: string
  templatePath: string
  output: string
  miniConfig: Record<string, any>
}

interface SourceItem {
  code: string
  map: string
  path: string
}

const isDev = process.env.MINI_ENV !== 'build'
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
const transformConfig: BuilderConfig = {} as any

function transformView() {
  const { miniPath, output, miniConfig } = transformConfig
  const viewTpl = loadTemplate('view')
  const appCssPath = path.join(miniPath, 'app.css')
  let appCss = fs.existsSync(appCssPath) ? fs.readFileSync(appCssPath, 'utf-8') : ''

  miniConfig.pages.forEach((page: string) => {
    const { code, js } = parser({ fullPath: path.join(miniPath, page + '.html'), page })
    const cssPath = path.join(miniPath, page + '.css')
    const css = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf-8') : ''
    const content = viewTpl({
      __PLATFORM__: process.env.MINI_PLATFORM,
      __APP_CSS__: appCss,
      __HTML__: code,
      __JS__: js,
      __CSS__: css,
    })

    // 默认以 /index 结束
    const targetDir = path.join(output, page.slice(0, -6))
    fs.mkdirSync(targetDir, { recursive: true })
    fs.writeFileSync(targetDir + '/index.html', isDev ? content : minify(content, minifyConfig))

    if (process.env.MINI_PLATFORM === 'devtools') {
      // 拷贝 page 源文件
      // const html = fs.readFileSync(path.join(miniPath, page + '.html'), 'utf-8')
      // const originContent = `<style>${appCss}\n${css}</style>\n${html}`
      // fs.writeFileSync(targetDir + '/origin.html', originContent)
    }
  })
}

function transformService() {
  const { miniPath, output, frameworkPath, miniConfig } = transformConfig
  const jsFiles: string[] = glob.sync(`${miniPath}/**/*.js`, { ignore: [] })
  const serviceTpl = loadTemplate('service')
  const serviceWorkerTpl = loadTemplate('service-worker')
  const frameworkJs = fs.readFileSync(path.join(frameworkPath, 'service.js'), 'utf-8')

  const sourceArr = jsFiles.map(file => {
    if (file.includes('app.js')) {
      const res = parser({ fullPath: file })
      return Object.assign(res, { path: '' })
    }
    // NOTE: 其他 js 懒得处理了
    let path = ''
    miniConfig.pages.some(p => {
      path = file.includes(p) ? p : false
      return path
    })

    if (path) {
      const res = parser({ fullPath: file })
      return Object.assign(res, { path })
    }
  })

  const jsCode = concatFiles(sourceArr)
  miniConfig.root = miniConfig.root || miniConfig.pages[0]

  if (process.env.MINI_PLATFORM === 'devtools') {
    const content = serviceTpl({
      __PLATFORM__: process.env.MINI_PLATFORM,
      __CONFIG__: `'${JSON.stringify(miniConfig)}'`,
    })

    fs.writeFileSync(path.join(output, 'app-service.js'), jsCode)
    fs.writeFileSync(path.join(output, 'service.html'), content)
  } else {
    const content = serviceWorkerTpl({
      __SERVICE__: frameworkJs,
      __JS__: isDev ? jsCode : minify(jsCode, minifyConfig),
      __CONFIG__: `'${JSON.stringify(miniConfig)}'`,
    })

    fs.writeFileSync(path.join(output, 'app-service.js'), content)
  }
}

function loadTemplate(name: string) {
  const { templatePath } = transformConfig
  const template = fs.readFileSync(path.join(templatePath, `${name}.ejs`), 'utf-8')
  return ejs.compile(template, { cache: true, filename: name })
}

function concatFiles(sourceArr: (ParseResult & { path: string })[]) {
  const concat = new Concat(true, 'service.js', '\n')

  sourceArr.forEach(({ code, map, path }) => {
    concat.add(null, `window.__path__ = "${path}";`)
    concat.add(path, code, map)
  })

  return concat.content.toString()
}

export default {
  transform(config: BuilderConfig) {
    Object.assign(transformConfig, config)
    transformView()
    transformService()
  },
}
