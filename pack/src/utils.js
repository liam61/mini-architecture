function normalizePath(envName, localPath) {
  const envPath = process.env[envName]
  return typeof envPath === 'string' ? envPath : localPath
}
function normalizeBoolean(envName, localBool) {
  const envBool = process.env[envName]
  return typeof envBool === 'string' ? JSON.parse(envBool) : localBool
}

module.exports = {
  normalizePath,
  normalizeBoolean,
}
