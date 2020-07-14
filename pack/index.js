const path = require('path')
const fs = require('fs-extra')
const { pack } = require('./pack')

const isDev = process.env.NODE_ENV !== 'production'
const rootPath = path.join(__dirname, '../')
let timer = null

pack()

if (isDev) {
  ;['pack', 'build', 'parser'].forEach((name) => {
    name = path.join(rootPath, `pack/${name}.js`)

    fs.watch(name, (event, filename) => {
      timer && clearTimeout(timer)
      timer = setTimeout(() => {
        pack()
      }, 1500)
    })
  })

  console.log('watching for pack changes...')
}
