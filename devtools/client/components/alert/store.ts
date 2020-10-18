export class AlertStore {
  forceUpdate: () => void

  isOpen = false
  message = ''
  timer: any = null

  init(fn: () => void) {
    this.forceUpdate = fn
  }

  setOpen(flag: boolean) {
    this.isOpen = flag
    this.forceUpdate()
  }

  show = (message: string, delay = 1800) => {
    this.message = message
    this.timer = setTimeout(() => {
      this.isOpen && this.close()
    }, delay)
    this.setOpen(true)
  }

  close = () => {
    this.message = ''
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
    this.setOpen(false)
  }
}

export const alertStore = new AlertStore()

window.alert = alertStore.show
