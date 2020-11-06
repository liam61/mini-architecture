export function normalizePath(envName: string, localPath: string) {
  const envPath = process.env[envName]
  return typeof envPath === 'string' ? envPath : localPath
}

export function normalizeBoolean(envName: string, localBool: boolean): boolean {
  const envBool = process.env[envName]
  // 'true' | 'other/string'
  return typeof envBool === 'string'
    ? ['true', 'false'].includes(envBool)
      ? JSON.parse(envBool)
      : !!envBool
    : localBool
}
