const path = require('path')
const fs = require('fs-extra')
const archiver = require('archiver')
const { transformView, transformService } = require('./build')

const rootPath = path.join(__dirname, '../')
const outputDir = path.join(rootPath, 'android/app/src/main/assets')

pack()

function pack() {
  packFramework()
    .then(packMini)
    .then(() => require('./install'))
    .catch((err) => {
      console.log(err)
    })
}

function packFramework() {
  return new Promise((resolve, reject) => {
    const source = path.join(rootPath, 'framework/dist')
    const name = 'framework.zip'

    // 第一次直接返回
    if (!fs.existsSync(source)) {
      return reject('\nfirst pack...')
    }

    zipFiles(source, name, path.join(source, `../__${name}`), (s, output) => {
      const targetPath = path.join(outputDir, name)

      if (fs.existsSync(targetPath)) {
        fs.removeSync(targetPath)
      }
      fs.move(output, targetPath, () => {
        console.log(`\nsuccess create ${targetPath}...`)
        resolve()
      })
    })
  })
}

function packMini() {
  return new Promise((resolve) => {
    const source = path.join(rootPath, 'mini/dist')
    const name = 'miniDemo.zip'
    const tmp = path.join(rootPath, 'pack/_tmp')

    const config = JSON.parse(fs.readFileSync(path.join(source, 'app.json'), 'utf-8'))
    const { pages = [] } = config

    if (fs.existsSync(tmp)) {
      fs.removeSync(tmp)
    }

    transformView(source, pages, tmp)
    transformService(source, pages, tmp, config)
    copyOther(source, tmp)

    zipFiles(tmp, name, path.join(tmp, `../__${name}`), (s, output) => {
      const targetPath = path.join(outputDir, name)

      if (fs.existsSync(targetPath)) {
        fs.removeSync(targetPath)
      }
      fs.move(output, targetPath, () => {
        console.log(`\nsuccess create ${targetPath}...`)
        resolve()
      })
    })
  })
}

function copyOther(source, targetPath) {
  const exclude = ['.js', '.html', '.css']

  fs.copySync(source, targetPath, {
    filter(src) {
      if (fs.lstatSync(src).isDirectory()) return true
      if (src.includes('app.json')) return false
      return !exclude.some((ext) => ext === path.extname(src))
    },
  })
}

function zipFiles(source, name, output, callback) {
  const archive = archiver('zip', {
    zlib: { level: 9 },
  })
  const stream = fs.createWriteStream(output)

  stream.on('close', () => {
    const size = archive.pointer()
    console.log(`\nsuccess zip ${name}, ${(size / 1024).toFixed(3)} kb...`)
    callback && callback(source, output)
  })

  archive.on('warning', (err) => {
    if (err.code === 'ENOENT') {
    } else {
      throw err
    }
  })

  archive.on('error', (err) => {
    throw err
  })

  archive.pipe(stream)
  archive.directory(source, false)
  archive.finalize()
}
