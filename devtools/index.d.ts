interface Window {
  jsCore: {
    publish: (...args: any[]) => void
    invoke: (...args: any[]) => void
  }
}
