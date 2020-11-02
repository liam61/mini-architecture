# mini

an example of mini-app

## example

```js
// index.html
<view>
  <button bindtap="bindEvent" class="btn">click me</button>
  <view class="{{bindCls}}">bind-data: {{hello}}</view>
  <button bindtap="goNext">go next page</button>
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

find more at [@mini-architecture/framework](https://github.com/lawler61/mini-architecture/tree/master/framework)
