const chalk = require('chalk')

function validate(key, value, types) {
  types = Array.isArray(types) ? types : [types]

  const vType = typeof value
  if (!types.includes(vType)) {
    console.log(
      chalk.red(`parameter '${key}' should be ${types.join('/')} but received ${vType}...`),
    )
    return false
  }
  return true
}

module.exports = {
  validate,
}
