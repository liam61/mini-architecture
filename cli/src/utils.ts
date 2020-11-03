import chalk from 'chalk'

export function validate(key: string, value: any, types: string | string[]) {
  types = Array.isArray(types) ? types : [types]

  const vType = typeof value
  if (!types.includes(vType)) {
    console.log(chalk.red(`option '${key}' should be ${types.join('/')} but received ${vType}...`))
    return false
  }
  return true
}

export function includes(key: string, value: any, types: any) {
  types = Array.isArray(types) ? types : [types]

  if (!types.includes(value)) {
    console.log(chalk.red(`option '${key}' should be ${types.join('/')} but received ${value}...`))
    return false
  }
  return true
}

export function wait(delay = 500, data?: any) {
  return new Promise(resolve => setTimeout(() => resolve(data), delay))
}
