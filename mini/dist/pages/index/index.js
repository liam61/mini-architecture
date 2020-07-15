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
  goDemoPage() {
    ns.navigateTo({
      url: 'pages/demo/index',
      success() {
        console.log('success navigateTo demo page')
      },
    })
  },
  jsAlert() {
    ns.alert('这是利用 jsAlert 建立的 jsBridge')
  },
  openLink() {
    ns.openLink('https://www.omyleon.com')
  },
})
