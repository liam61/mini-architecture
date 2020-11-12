import path from 'path'
import { homedir } from 'os'
import nodemon from 'nodemon'
import { directories } from 'ignore-by-default'
import { includes, validate, Deferred } from './utils'
import { StaticServer } from '@mini-architecture/devtools'

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

  if (
    !validate('entry', entry, 'string') ||
    !includes('mode', mode, modes) ||
    !includes('platform', platform, platforms) ||
    !validate('framework', framework, 'string') ||
    !validate('install', install, ['string', 'boolean']) ||
    !validate('output', output, 'string')
  ) {
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
    let staticServer: StaticServer | Deferred | null = isDevtools ? new Deferred() : null

    nodemon({
      script: require.resolve('./pack'),
      // https://github.com/remy/nodemon/blob/master/lib/config/defaults.js#L15
      ignoreRoot: ignoreRoot.map(_ => `**/${_}/**`).filter(_ => !_.includes('node_modules')),
      watch: [
        process.env.MINI_ENTRY,
        options.platform !== 'devtools' && process.env.MINI_FRAMEWORK,
      ].filter(Boolean) as string[],
      ext: '*',
      delay: 200,
    })
      .on('restart', () => {})
      .on('message', ev => {
        const { type, event } = ev || {}
        if (isDevtools && type === 'pack' && event === 'packed') {
          if (staticServer instanceof Deferred) {
            staticServer.resolve()
          } else {
            staticServer && staticServer.send({ type: 'reload' })
          }
        }
      })
    // 设置完 env 再引入
    if (isDevtools) {
      const { default: launcher } = await import('@mini-architecture/devtools')

      // wait until packed
      if (staticServer && staticServer.promise) {
        await staticServer!.promise
      }
      const { server, cdp } = await launcher()
      staticServer = server
    }

    process.once('SIGINT', () => {
      console.log('\nprocess receive: SIGINT')

      // https://github.com/remy/nodemon/blob/master/lib/monitor/run.js#L465
      nodemon.emit('quit', 130)
    })
  } else {
    import('./pack')
  }
}
