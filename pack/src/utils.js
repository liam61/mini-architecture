function normalizePath(envName, localPath) {
  const envPath = process.env[envName]
  return typeof envPath === 'string' ? envPath : localPath
}

function normalizeBoolean(envName, localBool) {
  const envBool = process.env[envName]
  // 'true' | 'other/string'
  return typeof envBool === 'string'
    ? ['true', 'false'].includes(envBool)
      ? JSON.parse(envBool)
      : !!envBool
    : localBool
}

module.exports = {
  normalizePath,
  normalizeBoolean,
}
