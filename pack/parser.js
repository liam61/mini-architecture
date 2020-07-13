// const path = require('path')
const babel = require('@babel/core')
const parser = require('@babel/parser')
const t = require('@babel/types')
const generator = require('@babel/generator').default
const traverse = require('@babel/traverse').default
const fs = require('fs-extra')
const Concat = require('concat-with-sourcemaps')

const isDev = process.env.NODE_ENV !== 'production'
const PREFIX_ELEMENT = 'my-'
const PREFIX_BIND = 'bind'
const PREFIX_EVENT = '_bind'
const REG_DYNAMIC = /\{\{([^}]+)\}\}/g
const dynamicMap = {}

function parse(params) {
  const { fullPath, page } = params
  const output = fs.readFileSync(fullPath, 'utf-8')
  const isJsx = /\.html$/.test(fullPath)
  let result = null

  if (isJsx) {
    const ast = parser.parse(output, {
      plugins: ['jsx'],
    })

    traverse(ast, {
      JSXIdentifier(path) {
        const { parent, node } = path
        // 1. tags <view> or </view>
        if (t.isJSXOpeningElement(parent) || t.isJSXClosingElement(parent)) {
          if (['view', 'button'].includes(node.name)) {
            node.name = PREFIX_ELEMENT + node.name
          } else {
            node.name = PREFIX_ELEMENT + 'view'
          }
        } else if (t.isJSXAttribute(parent)) {
          // 2. attrs

          // attr value is object or boolean attr
          if (!t.isStringLiteral(parent.value) || !parent.value) return
          const attr = node.name
          const { value } = parent.value

          if (REG_DYNAMIC.test(value)) {
            const newValue = value.replace(REG_DYNAMIC, (_s, cnt) => {
              cnt = cnt.replace(/\s/g, '')
              addDynamicValue(page, 'data', cnt)
              return `{{${cnt}}}`
            })
            // NOTE: 懒得判断是 attr or property
            parent.name.name += '$'
            parent.value.value = newValue
          } else if (attr.startsWith(PREFIX_BIND)) {
            // 3. event
            const name = PREFIX_EVENT + value
            addDynamicValue(page, 'event', name)
            // https://polymer-library.polymer-project.org/3.0/docs/devguide/data-binding
            parent.value.value = `[[${name}]]`
          }
        }
      },
      JSXExpressionContainer(path) {
        // 4. children

        if (
          // attr value is object
          !t.isJSXElement(path.parent) ||
          // {}
          !path.node.expression.properties ||
          // {{ a, b }}
          path.node.expression.properties.length > 1
        )
          return

        const property = path.node.expression.properties[0]
        const value = property.value.name
        // {{ a: b }}
        if (property.key.name !== value) return

        addDynamicValue(page, 'data', value)
        // path.replaceWith(t.JSXText(key))
      },
    })

    const { code } = generator(ast, { minified: !isDev, comments: isDev })
    const jsCode = genJsCode(dynamicMap[page].event)
    // why you end with ";"
    result = { code: code.slice(0, -1), js: jsCode }
  } else {
    const source = babel.transform(output, {
      presets: ['@babel/preset-env', !isDev && 'minify'], // isJsx && ['@babel/preset-react', { pragma: '_l' }]
      plugins: [],
      sourceMaps: isDev,
      sourceRoot: process.cwd(),
      sourceFileName: fullPath,
      babelrc: false,
    })

    const concat = new Concat(true, fullPath, '\n')
    concat.add(
      null,
      `define("${fullPath}", function(require,module,exports,window,document,frames,self,location,navigator,localStorage,history,Caches,screen,alert,confirm,prompt,fetch,XMLHttpRequest,WebSocket,webkit,jsCore,jSBridge) {`,
    )
    concat.add(fullPath, source.code, source.map)
    // concat.add(null, '});' + (isModule ? '' : `require("${full_path}")`))
    concat.add(null, '});' + `require("${fullPath}");`)

    result = {
      code: concat.content,
      map: concat.sourceMap,
    }
  }

  // console.log(result.code)
  return result
}

function addDynamicValue(page, type, value) {
  if (!dynamicMap[page]) {
    dynamicMap[page] = {
      data: new Set(),
      event: new Set(),
    }
  }
  dynamicMap[page][type].add(value)
}

function genJsCode(events) {
  return [...events].reduce((tpl, name, i, arr) => {
    tpl += `_binder["${name}"] = function(ev) {
      window.ns.publishPageEvent("${name.slice(PREFIX_EVENT.length)}", ev)
    };`
    if (i === arr.length - 1) {
      tpl += `Object.assign(_binder, window.ns.data || {});}`
    }
    return tpl
  }, `;window._binder = document.getElementById("_binder"); function _bindData() {`)
}

// parse({
//   fullPath: path.join(rootPath, 'mini/dist/pages/index/index.html'),
//   page: 'pages/index/index',
// })

module.exports = parse
