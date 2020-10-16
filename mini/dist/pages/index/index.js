function getHello() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(Math.random().toString(36).slice(-8))
    }, 600)
  })
}

Page({
  data: {
    loading: false,
    hello: 'v8 lack of setTimeout',
  },
  loadData() {
    this.setData({ loading: true, hello: '...' })
    getHello().then(hello => {
      this.setData({ hello, loading: false })
    })
  },
  goDemoPage() {
    ma.navigateTo({
      url: 'pages/demo/index',
      success() {
        console.log('success navigateTo demo page')
      },
    })
  },
  jsAlert() {
    ma.alert('这是利用 jsAlert 建立的 jsBridge')
  },
  openLink() {
    ma.openLink('https://www.omyleon.com')
  },
})
