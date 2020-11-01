import path from 'path'
import { homedir } from 'os'
import chalk from 'chalk'
import nodemon from 'nodemon'
import { directories } from 'ignore-by-default'
import { validate, wait } from './utils'

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
}

function initEnv(options: Options) {
  let { mode, entry = '', platform, framework = '', install = '', output = '', watch } = options
  watch = typeof watch === 'boolean' ? watch : process.env.NODE_ENV === 'development'

  if (!modes.includes(mode)) {
    console.log(chalk.red('invalid mode type...'))
    return
  }

  if (!platforms.includes(platform)) {
    console.log(chalk.red('invalid platform type...'))
    return
  }

  if (
    !validate('entry', entry, 'string') ||
    !validate('framework', framework, 'string') ||
    !validate('install', install, ['string', 'boolean']) ||
    !validate('output', output, 'string')
  ) {
    return
  }

  const isDev = mode === 'dev'
  process.env.MINI_ENV = mode
  process.env.MINI_ENTRY = entry !== '@mini' ? entry : path.join(maPath, 'mini/dist')
  process.env.MINI_PLATFORM = platform
  process.env.MINI_FRAMEWORK = framework || path.join(maPath, `framework/${isDev ? 'dev' : 'dist'}`)
  process.env.MINI_INSTALL =
    install !== true ? (install as string) : path.join(maPath, 'cli/android')
  process.env.MINI_OUTPUT =
    output ||
    (process.env.MINI_INSTALL
      ? path.join(process.env.MINI_INSTALL, 'app/src/main/assets')
      : `${homedir()}/.ma-dev`)
  process.env.MINI_WATCH = watch + ''

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

  if (JSON.parse(process.env.MINI_WATCH)) {
    const ignoreRoot = directories()
    nodemon({
      script: require.resolve('./pack'),
      // https://github.com/remy/nodemon/blob/master/lib/config/defaults.js#L15
      ignoreRoot: ignoreRoot.map(_ => `**/${_}/**`).filter(_ => !_.includes('node_modules')),
      watch: [
        process.env.MINI_ENTRY,
        options.platform !== 'devtools' && process.env.MINI_FRAMEWORK,
      ].filter(Boolean),
      ext: '*',
      delay: 500,
    })
      .on('start', () => {})
      .on('restart', () => {
        // TODO: server.send
        // options.platform === 'devtools'
      })
    // 设置完 env 再引入
    if (options.platform === 'devtools') {
      const { default: launcher } = await import('../../devtools')
      await wait(1500)
      console.log(launcher)
      // const { server, cdp } = await launcher()
    }
  } else {
    import('./pack')
  }
}
