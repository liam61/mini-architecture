# mini

an example of mini-app

## [DSL](https://en.wikipedia.org/wiki/Domain-specific_language)

```js
// index.html
<view>
  <button bindtap="bindEvent" class="btn">click me</button>
  <view class="{{bindCls}}">bind-data: {{hello}}</view>
  <view bindtap="goNext">go next page</view>
</view>

// index.js
Page({
  data: {
    hello: 'hello world',
    bindCls: 'view',
  },
  bindEvent() {
    this.setData({ hello: 'hello again' })
  },
  goNext() {
    ma.navigateTo({
      url: 'pages/demo/index',
      success() {},
    })
  },
})
```

## API

1. TODO:
