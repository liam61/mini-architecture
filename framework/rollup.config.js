import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import image from '@rollup/plugin-image'
import replace from '@rollup/plugin-replace'
import { terser } from 'rollup-plugin-terser'
import config from './package.json'
import fs from 'fs-extra'

const isDev = process.env.ROLLUP_WATCH

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
          useBuiltIns: 'usage',
          targets: {
            browsers: ['Android >= 4.4', 'ChromeAndroid >= 62', 'iOS >= 9'],
          },
        },
      ],
    ],
  }),
  replace({
    __INSERT_TEXT__: JSON.stringify(
      fs.readFileSync(__dirname + '/webview/components/reset.css', 'utf-8'), // webview only
    ),
    __VERSION__: config.version,
  }),
  !isDev && terser(),
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
