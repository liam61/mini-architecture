# devtools

a tool for developing, like [weixin devtools](https://developers.weixin.qq.com/miniprogram/dev/devtools/devtools.html)

1. build devtools client with React

2. load page by iframes and communicate with parent by `window.postMessage` 

3. launch browser by [chrome app api](https://github.com/GoogleChrome/chrome-launcher)

4. communicate with inspector by [CDP (Chrome DevTools Protocol)](https://chromedevtools.github.io/devtools-protocol/)

## Usage

```bash
yarn global add @mini-architecture/cli

ma-cli devtools -m build -e @mini
```

find more at [@mini-architecture/cli](https://github.com/lawler61/mini-architecture/tree/master/cli)
