const path = require('path')
const fs = require('fs-extra')
const archiver = require('archiver')
const builder = require('./build')
const chalk = require('chalk')
const { normalizePath, normalizeBoolean } = require('./utils')
chalk.level = 3

const rootPath = path.join(__dirname, '../..')
const miniPath = normalizePath('MINI_ENTRY', path.join(rootPath, 'mini/dist'))
const frameworkPath = normalizePath('MINI_FRAMEWORK', path.join(rootPath, 'framework/dist'))
const outputPath = normalizePath('MINI_OUTPUT', path.join(rootPath, 'android/app/src/main/assets'))
const isZip = normalizeBoolean('MINI_ZIP', true)
const isDev = process.env.NODE_ENV !== 'production'

module.exports = function pack() {
  return packFramework()
    .then(packMini)
    .catch(err => {
      console.log(isDev ? err : chalk.red(err.stack))
    })
}

function packFramework() {
  return new Promise((resolve, reject) => {
    const name = `framework${isZip ? '.zip' : ''}`
    const to = path.join(outputPath, name)

    // 第一次直接返回
    if (
      !fs.existsSync(path.join(frameworkPath, 'webview.js')) ||
      !fs.existsSync(path.join(frameworkPath, 'service.js'))
    ) {
      // by cli
      return reject(
        process.env.MINI_ENTRY ? new Error('invalid framework path...') : 'first pack...',
      )
    }

    if (isZip) {
      // move from 'framework/_framework.zip' to 'android/app/src/main/assets/framework.zip'
      return zipFiles(frameworkPath, name, from => resolve({ from, to }))
    }

    // copy from 'framework/dist' to 'android/app/src/main/assets/framework'
    resolve({ from: frameworkPath, to, copy: true })
  }).then(handlerFiles)
}

function packMini({}) {
  return new Promise(resolve => {
    const name = `miniDemo${isZip ? '.zip' : ''}`
    const temp = path.join(rootPath, 'pack/_temp')
    const to = path.join(outputPath, process.env.MINI_ENV === 'devtools' ? 'apps' : '', name)
    const miniConfig = JSON.parse(fs.readFileSync(path.join(miniPath, 'app.json'), 'utf-8'))

    if (fs.existsSync(temp)) {
      fs.removeSync(temp)
    }

    builder.transform({
      miniPath,
      frameworkPath,
      templatePath: path.join(rootPath, 'pack/template'),
      output: temp,
      miniConfig,
    })
    copyOthers(miniPath, temp)

    if (isZip) {
      // move from 'pack/_miniDemo.zip to 'android/app/src/main/assets/miniDemo.zip'
      return zipFiles(temp, name, from => resolve({ from, to }))
    }

    // move from 'pack/_temp' to 'android/app/src/main/assets/miniDemo'
    resolve({ from: temp, to })
  }).then(handlerFiles)
}

function copyOthers(source, targetPath) {
  const exclude = ['.js', '.html', '.css']

  fs.copySync(source, targetPath, {
    filter(src) {
      if (fs.lstatSync(src).isDirectory()) return true
      if (src.includes('app.json')) return false
      return !exclude.some(ext => ext === path.extname(src))
    },
  })
}

function zipFiles(sourcePath, name, callback) {
  const archive = archiver('zip', {
    zlib: { level: 9 },
  })
  const output = path.join(sourcePath, `../_${name}`)
  const stream = fs.createWriteStream(output)

  stream.on('close', () => {
    const size = archive.pointer()
    console.log(chalk.cyan(`\nsuccess zip ${name}, ${(size / 1024).toFixed(3)} kb...`))
    callback && callback(output)
  })

  archive.on('warning', err => {
    if (err.code === 'ENOENT') {
    } else {
      throw err
    }
  })

  archive.on('error', err => {
    throw err
  })

  archive.pipe(stream)
  archive.directory(sourcePath, false)
  archive.finalize()
}

function handlerFiles({ from, to, copy }) {
  fs.existsSync(to) && fs.removeSync(to)

  return fs[copy ? 'copy' : 'move'](from, to).then(() => {
    console.log(chalk.cyan(`\nsuccess create ${to}...`))
    return { from, to }
  })
}