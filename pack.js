const path = require('path')
const fs = require('fs-extra')
const archiver = require('archiver')
const childProcess = require('child_process')
const { exec } = childProcess

const outputDir = path.join(__dirname, 'android/app/src/main/assets')

pack()

function pack() {
  buildFramework()
  buildMini();
}

function buildFramework() {
  exec(`cd framework && yarn && yarn build`, (err, stdout, stderr) => {
    if (err) {
      console.log(err)
      console.log(stderr)
      return
    }

    const source = path.join(__dirname, 'framework/dist')
    const name = 'framework.zip'

    zipFiles(source, path.join(source, `../__${name}`), (s, output) => {
      const copyPath = path.join(outputDir, name)
      fs.copySync(output, copyPath)
      console.log(`文件已拷贝到：${copyPath}`)
    })
  })
}

function buildMini() {
  const source = path.join(__dirname, 'mini/dist')
  const name = 'miniDemo.zip'

  zipFiles(source, path.join(source, `../__${name}`), (s, output) => {
    const copyPath = path.join(outputDir, name)
    fs.copySync(output, copyPath)
    console.log(`文件已拷贝到：${copyPath}`)
  })
}

function zipFiles(source, output, callback) {
  const archive = archiver('zip', {
    zlib: { level: 9 },
  })
  const stream = fs.createWriteStream(output)

  stream.on('close', () => {
    const size = archive.pointer()
    console.log(`压缩完成：${(size / 1024).toFixed(3)} kb`)
    console.log(`文件已生成到：${output}`)
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
