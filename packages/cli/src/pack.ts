import chalk from 'chalk'
import pack from '@mini-architecture/pack'
import installApp from './install'

export default async function packer() {
  try {
    await pack()
    process.env.MINI_INSTALL && installApp()
  } catch (err) {
    console.log('\n[ma-cli]: ' + chalk.red(err))
  }
}
