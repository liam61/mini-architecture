import path from 'path'
import { homedir } from 'os'
import chokidar from 'chokidar'
import chalk from 'chalk'
import onExit from 'signal-exit'
import { directories } from 'ignore-by-default'
import { StaticServer } from '@mini-architecture/devtools'
import { includes, validate, Deferred } from '@mini-architecture/utils'

// global add cli 和 mini、pack 在同一级目录
const maPath = path.join(__dirname, '../..')
export const modes = ['dev', 'build'] as const
export const platforms = ['mobile', 'devtools'] as const

export interface Options {
  mode: typeof modes[number]
  entry: string
  platform: typeof platforms[number]
  framework?: string
  install?: string | boolean
  output?: string
  watch?: boolean
  zip?: boolean
}

function initEnv(options: Options) {
  const {
    entry = '',
    mode,
    platform,
    framework = '',
    install = '',
    output = '',
    watch: _watch,
    zip = false,
  } = options
  const watch = typeof _watch === 'boolean' ? _watch : process.env.NODE_ENV === 'development'

  const err =
    validate('entry', entry, 'string') ||
    includes('mode', mode, modes) ||
    includes('platform', platform, platforms) ||
    validate('framework', framework, 'string') ||
    validate('install', install, ['string', 'boolean']) ||
    validate('output', output, 'string')

  if (err) {
    console.log(chalk.red(err))
    return
  }

  process.env.MINI_ENV = mode
  process.env.MINI_ENTRY = entry !== '@mini' ? entry : path.join(maPath, 'mini/dist')
  process.env.MINI_PLATFORM = platform
  process.env.MINI_FRAMEWORK = framework || path.join(maPath, `framework/dist`)
  process.env.MINI_INSTALL = install !== true ? install + '' : path.join(maPath, 'cli/android')
  process.env.MINI_OUTPUT =
    output ||
    (process.env.MINI_INSTALL
      ? path.join(process.env.MINI_INSTALL, 'app/src/main/assets')
      : `${homedir()}/.ma-dev`)
  process.env.MINI_WATCH = watch + ''
  process.env.MINI_ZIP = (process.env.MINI_INSTALL ? true : zip) + ''

  return true
}

export default async function bootstrap(type = 'pack', options: Options) {
  options = options || ({} as any)
  if (type === 'devtools') {
    options = {
      ...options,
      platform: 'devtools',
      watch: true,
    }
  }

  if (!initEnv(options)) return

  if (JSON.parse(process.env.MINI_WATCH!)) {
    const ignoreRoot = directories()
    const isDevtools = options.platform === 'devtools'
    const packDefer: Deferred | null = isDevtools ? new Deferred() : null
    let staticServer: StaticServer | null = null

    // 不用 nodemon 是因为使用 api 不好操作
    const watcher = chokidar.watch(
      [
        process.env.MINI_ENTRY,
        options.platform !== 'devtools' && process.env.MINI_FRAMEWORK,
      ].filter(Boolean) as string[],
      {
        interval: isDevtools ? 0 : 200,
        ignored: ignoreRoot.map(_ => `**/${_}/**`).filter(_ => !_.includes('node_modules')),
      },
    )
    watcher
      .on('ready', async () => {
        // 设置完 env 再第一次执行
        ;(await import('./pack')).default().then(() => {
          packDefer && packDefer.resolve()
        })
      })
      .on('change', async pathname => {
        console.log('change', pathname)
        ;(await import('./pack')).default().then(() => {
          staticServer && staticServer.send({ type: 'reload' })
        })
      })

    // 设置完 env 再引入
    if (isDevtools) {
      const { default: launcher } = await import('@mini-architecture/devtools')

      // wait until packed
      if (packDefer) {
        await packDefer.promise
      }
      const { server, cdp } = await launcher()
      staticServer = server
    }

    onExit((_code, signal) => {
      console.log(`\nprocess receive: ${signal}`)
      watcher.close()
      staticServer && staticServer.close()
    })
  } else {
    ;(await import('./pack')).default()
  }
}
