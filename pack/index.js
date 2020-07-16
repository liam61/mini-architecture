const path = require('path')
const fs = require('fs-extra')
const archiver = require('archiver')
const childProcess = require('child_process')
const { execSync, spawnSync } = childProcess
const { transformView, transformService } = require('./build')

const rootPath = path.join(__dirname, '../')
const outputDir = path.join(rootPath, 'android/app/src/main/assets')

pack()

function pack() {
  packFramework()
    .then(packMini)
    .then(installApp)
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

function installApp() {
  process.chdir(path.join(rootPath, 'android'))
  execSync('adb start-server')
  const deviceInfo = execSync('adb devices', { encoding: 'utf-8' })
  const line = deviceInfo.trim().split(/\r?\n/)[1]
  const words = line.split(/[ ,\t]+/).filter((w) => w !== '')

  let device = words[0]
  if (words[1] !== 'device') {
    console.log('\nno device found...')
    return
  }
  console.log(`\nsuccess get device ${device}...`)

  if (!fs.existsSync('local.properties')) {
    const escapePath = (text) => {
      return text.replace(/[-[\]{}()*+?.,\\^$|#:\s]/g, '\\$&')
    }
    fs.writeFileSync('local.properties', `sdk.dir=${escapePath(process.env.ANDROID_HOME)}`)
  }
  const cmd = process.platform === 'win32' ? 'gradlew.bat' : './gradlew'
  spawnSync(cmd, ['clean', 'assemble'], { encoding: 'utf-8', shell: true })
  console.log('\nsuccess build app...')

  const apkName = 'app/build/outputs/apk/debug/app-debug.apk'
  const manifestFile = 'app/src/main/AndroidManifest.xml'
  const mainActivity = 'MainActivity'
  execSync(`adb -s ${device} install -t -r ${apkName}`, { encoding: 'utf-8' })
  console.log('\nsuccess install app...')

  const packageName = fs.readFileSync(manifestFile, 'utf-8').match(/package="(.+?)"/)[1]
  execSync(`adb -s ${device} shell am start -n ${packageName}/.${mainActivity} -e debug true`, {
    encoding: 'utf-8',
  })
  console.log('\nsuccess start app...')
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
