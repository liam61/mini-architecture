Page({
  data: {
    system: 'unknown',
    screenWidth: 'unknown',
    screenHeight: 'unknown',
    pixelRatio: 'unknown',
  },
  goBack() {
    ma.navigateBack({
      delta: 1,
      success() {
        console.log('success navigateTo demo page')
      },
      fail() {
        ma.alert('fail navigateBack index page')
      },
    })
  },
  getSystemInfo() {
    ma.getSystemInfo({
      success(info) {
        this.setData(info)
      },
      fail() {
        console.log('get systemInfo fail')
      },
    })
  },
  setPageTitle() {
    ma.setNavigationBarTitle(`title changed: ${Math.random().toFixed(3)}`)
  },
})
