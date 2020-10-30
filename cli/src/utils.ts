import chalk from 'chalk'

export function validate(key: string, value: any, types: string | string[]) {
  types = Array.isArray(types) ? types : [types]

  const vType = typeof value
  if (!types.includes(vType)) {
    console.log(
      chalk.red(`option '${key}' should be ${types.join('/')} but received ${vType}...`),
    )
    return false
  }
  return true
}
