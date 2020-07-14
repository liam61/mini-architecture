const path = require('path')
const fs = require('fs-extra')
const program = require('commander')
const childProcess = require('child_process')
const { execSync } = childProcess

program.option('--t [typeName]', '...').parse(process.argv)
const { t } = program
const mode = process.env.NODE_ENV !== 'production' ? 'dev' : 'build'

if (t === 'bootstrap') {
  bootstrap()
} else {
  build()
}

function bootstrap() {
  execSync('yarn')
  execSync('cd framework && yarn')
  execSync('cd pack && yarn')
  console.log(`\nsuccess install dependence`)
}

function build() {
  try {
    // execSync(`cd framework && yarn && yarn ${mode}`)
    // console.log('\nsuccess build framework...')

    // execSync(`cd pack && yarn && yarn ${mode}`)
    // console.log('\nsuccess pack project...')

    process.chdir(path.join(__dirname, 'android'))
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
    execSync(process.platform === 'win32' ? `gradlew.bat` : `./gradlew`, { encoding: 'utf-8' })
    console.log('\nsuccess build app...')

    const apkName = 'app/build/outputs/apk/debug/app-debug.apk'
    const manifestFile = 'app/src/main/AndroidManifest.xml'
    const mainActivity = 'MainActivity'
    execSync(`adb -s ${device} install -r ${apkName}`, { encoding: 'utf-8' })
    console.log('\nsuccess install app...')

    const packageName = fs.readFileSync(manifestFile, 'utf-8').match(/package="(.+?)"/)[1]
    execSync(`adb -s ${device} shell am start -n ${packageName}/.${mainActivity} -e debug true`, {
      encoding: 'utf-8',
    })
    console.log('\nsuccess start app...')
  } catch (err) {
    console.error(err)
  }
}
