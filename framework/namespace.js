import jsBridge from './common/bridge'
import serviceApi from './service/bridge'
import webviewApi from './webview/bridge'

// webview -> service
jsBridge.subscribe('navigateTo', () => {
  serviceApi.navigateTo(arguments)
})

jsBridge.subscribe('navigateBack', () => {
  serviceApi.navigateBack(arguments)
})

// service -> webview
webviewApi.onAppDataChange(startRender)

function startRender(params) {
  console.log(params)
}
