Page({
  data: {
    system: 'unknown',
    screenWidth: 'unknown',
    screenHeight: 'unknown',
    pixelRatio: 'unknown',
  },
  goBack() {
    ns.navigateBack({
      delta: 1,
      success() {
        console.log('success navigateTo demo page')
      },
    })
  },
  getSystemInfo() {
    ns.getSystemInfo({
      success(info) {
        this.setData(info)
      },
      fail() {
        console.log('get systemInfo fail')
      },
    })
  },
  setPageTitle() {
    ns.setNavigationBarTitle(`you changed title ${Math.random().toFixed(3)}`)
  },
})
