function getHello() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Math.random().toString(36).slice(-8))
    }, 600)
  })
}

Page({
  data: {
    loading: false,
    hello: 'hello',
  },
  loadData() {
    this.setData({ loading: true, hello: '...' })
    getHello().then((hello) => {
      this.setData({ hello, loading: false })
    })
  },
  jsAlert() {
    ns.alert()
  },
  goDemoPage() {
    ns.navigateTo({
      url: 'pages/demo/index',
      success() {
        console.log('success navigateTo demo page')
      },
    })
  },
})
