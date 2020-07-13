Page({
  data: {
    info: {},
  },
  getSystemInfo() {},
  goBack() {
    ns.navigateBack({
      delta: 1,
      success() {
        console.log('success navigateTo demo page')
      },
    })
  },
})
