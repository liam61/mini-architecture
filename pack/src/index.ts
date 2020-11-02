import path from 'path'
import fs from 'fs-extra'
import archiver from 'archiver'
import builder from './build'
import chalk from 'chalk'
import { normalizePath, normalizeBoolean } from './utils'
chalk.level = 3

const rootPath = path.join(__dirname, '../..')
const miniPath = normalizePath('MINI_ENTRY', path.join(rootPath, 'mini/dist'))
const frameworkPath = normalizePath('MINI_FRAMEWORK', path.join(rootPath, 'framework/dist'))
const outputPath = normalizePath('MINI_OUTPUT', path.join(rootPath, 'android/app/src/main/assets'))
const isZip = normalizeBoolean('MINI_INSTALL', true)
const isDev = process.env.MINI_ENV !== 'build'

export default async function pack() {
  try {
    await packFramework()
    await packMini()
  } catch (err) {
    console.log(isDev ? err : chalk.red(err.stack))
  }
}

async function packFramework() {
  const name = `framework${isZip ? '.zip' : ''}`
  const to = path.join(outputPath, name)

  // 第一次直接返回
  if (
    !fs.existsSync(path.join(frameworkPath, 'webview.js')) ||
    !fs.existsSync(path.join(frameworkPath, 'service.js'))
  ) {
    // by cli
    throw new Error(process.env.MINI_ENTRY ? 'invalid framework path...' : 'first pack...')
  }

  let config = null
  if (isZip) {
    // move from 'framework/_framework.zip' to 'android/app/src/main/assets/framework.zip'
    const fromPath = await zipFiles(frameworkPath, name)
    config = { from: fromPath, to }
  } else {
    // copy from 'framework/dist' to 'android/app/src/main/assets/framework'
    config = { from: frameworkPath, to, copy: true }
  }

  return handleFiles(config)
}

async function packMini() {
  const name = `miniDemo${isZip ? '.zip' : ''}`
  const temp = path.join(rootPath, 'pack/_temp')
  const to = path.join(outputPath, process.env.MINI_PLATFORM === 'devtools' ? 'apps' : '', name)
  const miniConfig = JSON.parse(fs.readFileSync(path.join(miniPath, 'app.json'), 'utf-8'))

  if (fs.existsSync(temp)) {
    fs.removeSync(temp)
  }

  builder.transform({
    miniPath,
    frameworkPath,
    templatePath: path.join(rootPath, 'pack/templates'),
    output: temp,
    miniConfig,
  })
  copyOthers(miniPath, temp)

  let config = null
  if (isZip) {
    // move from 'pack/_miniDemo.zip to 'android/app/src/main/assets/miniDemo.zip'
    const fromPath = await zipFiles(temp, name)
    config = { from: fromPath, to }
  } else {
    // move from 'pack/_temp' to 'android/app/src/main/assets/miniDemo'
    config = { from: temp, to }
  }

  return handleFiles(config)
}

function copyOthers(source: string, targetPath: string) {
  const exclude = ['.js', '.html', '.css']

  fs.copySync(source, targetPath, {
    filter(src) {
      if (fs.lstatSync(src).isDirectory()) return true
      if (src.includes('app.json')) return false
      return !exclude.some(ext => ext === path.extname(src))
    },
  })
}

function zipFiles(sourcePath: string, name: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const archive = archiver('zip', {
      zlib: { level: 9 },
    })
    const output = path.join(sourcePath, `../_${name}`)
    const stream = fs.createWriteStream(output)

    stream.on('close', () => {
      const size = archive.pointer()
      console.log(chalk.cyan(`\nsuccess zip ${name}, ${(size / 1024).toFixed(3)} kb...`))
      resolve(output)
    })

    archive.on('warning', err => {
      if (err.code === 'ENOENT') {
      } else {
        throw err
      }
    })

    archive.on('error', err => {
      reject(err)
      throw err
    })

    archive.pipe(stream)
    archive.directory(sourcePath, false)
    archive.finalize()
  })
}

async function handleFiles(config: {
  from: string
  to: string
  copy?: boolean
}): Promise<{ from: string; to: string }> {
  const { from, to, copy = false } = config
  fs.existsSync(to) && fs.removeSync(to)

  return fs[copy ? 'copy' : 'move'](from, to).then(() => {
    console.log(chalk.cyan(`\nsuccess create ${to}...`))
    return { from, to }
  })
}
