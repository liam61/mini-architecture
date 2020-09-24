import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import image from '@rollup/plugin-image'
import replace from '@rollup/plugin-replace'
import { terser } from 'rollup-plugin-terser'
// import analyzer from "rollup-plugin-analyzer";
import path from 'path'
import config from './package.json'
import fs from 'fs-extra'
import chalk from 'chalk'
chalk.level = 3

const rootPath = path.join(__dirname, '../')
const isDev = process.env.ROLLUP_WATCH
const bootFromRoot = process.env.BOOT_ENV === 'root'

const plugins = [
  resolve(),
  json(),
  image(),
  commonjs(),
  babel({
    babelHelpers: 'bundled',
    exclude: 'node_modules/**',
    presets: [
      [
        '@babel/preset-env',
        {
          corejs: 3,
          modules: false,
          // global usage
          useBuiltIns: 'usage',
          targets: {
            browsers: ['Android >= 4.4', 'ChromeAndroid >= 62', 'iOS >= 9'],
          },
        },
      ],
    ],
    // pure usage
    // plugins: [
    //   '@babel/transform-runtime',
    //   {
    //     corejs: 3,
    //     ...
    //   },
    // ],
  }),
  replace({
    __INSERT_TEXT__: JSON.stringify(
      fs.readFileSync(__dirname + '/webview/components/reset.css', 'utf-8'),
    ),
    __VERSION__: config.version,
  }),
  !isDev && terser(),
  myPlugin(),
]

export default [
  {
    input: 'webview/index.js',
    output: {
      file: 'dist/webview.js',
      format: 'iife',
      sourcemap: isDev ? 'inline' : true,
    },
    plugins,
  },
  {
    input: 'service/index.js',
    output: {
      file: 'dist/service.js',
      format: 'iife',
      sourcemap: isDev ? 'inline' : true,
    },
    plugins,
  },
]

let count = 0

function myPlugin() {
  return {
    name: 'my-plugin',
    options(options) {
      bootFromRoot &&
        console.log(
          chalk.cyan(`[rollup] bundles ${options.input} → ${options.output[0].file}...\n`),
        )
    },
    buildEnd() {
      if (!isDev) return
      const dev = path.join(rootPath, 'pack/_dev.js')
      if (!fs.existsSync(dev)) {
        fs.createFile(dev)
      }
      if (count++ !== 0) {
        fs.writeFileSync(dev, `var update;`, { encoding: 'utf-8' })
      } else {
        count++
      }
    },
    outputOptions(options) {
      if (!bootFromRoot) return
      console.log(chalk.cyan(`[rollup] created ${options.file}\n`))
      isDev && count > 2 && console.log('[rollup] waiting for changes...\n')
    },
  }
}
