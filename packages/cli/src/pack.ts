import chalk from 'chalk'
import pack from '@mini-architecture/pack'
import installApp from './install'

const isDev = process.env.MINI_ENV !== 'build'

export default async function packer() {
  try {
    await pack()
    process.env.MINI_INSTALL && installApp()
  } catch (err) {
    console.log(isDev ? err : chalk.red(err))
  }
}
