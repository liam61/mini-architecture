import chalk from 'chalk'
import pack from '../../pack'
import installApp from './install'

const isDev = process.env.MINI_ENV !== 'build'

pack()
  .then(() => {
    process.env.MINI_INSTALL && installApp()
  })
  .catch(err => {
    console.log(isDev ? err : chalk.red(err.stack))
  })
