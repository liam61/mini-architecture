import { serviceApi } from './api'
import { _Page } from './_page'

const pageOptionsMap = {}
let pageStack = []
let currentPage = null

function Page(options) {
  // 打包时注进来
  pageOptionsMap[window.__path__] = options || {}
}

window.Page = Page

function createPage(route, webviewId, query) {
  const options = pageOptionsMap[route]
  const page = new _Page(options, webviewId, route)

  currentPage = {
    page,
    webviewId,
    route,
  }
  pageStack.push(currentPage)

  serviceApi.setAppData({ data: page.data }, [webviewId])
}

function recoverPage(route, webviewId) {
  for (let i = pageStack.length - 1; i >= 0; i -= 1) {
    const p = pageStack[i]

    if (p.webviewId === webviewId) {
      currentPage = p
      pageStack.splice(i + 1, pageStack.length)

      serviceApi.setAppData({ data: p.data }, [webviewId])
      break
    }
  }
}

function updatePage(route, webviewId, query) {
  const options = pageOptionsMap[route]
  const page = new _Page(options, webviewId, route)

  currentPage = {
    page,
    webviewId,
    route,
  }
  const index = pageStack.findIndex(page => page.webviewId === webviewId)
  pageStack.splice(index, 1, currentPage)

  serviceApi.setAppData({ data: page.data }, [webviewId])
}

function reLaunchApp(route, webviewId, query) {
  const options = pageOptionsMap[route]
  const page = new _Page(options, webviewId, route)

  currentPage = {
    page,
    webviewId,
    route,
  }
  pageStack = [currentPage]

  serviceApi.setAppData({ data: page.data }, [webviewId])
}

export function getCurrentPages() {
  return [...pageStack]
}

export function getCurPageInstance() {
  const { page } = pageStack[pageStack.length - 1] || {}
  return page
}

serviceApi.getCurrentPages = getCurrentPages
serviceApi.getCurPageInstance = getCurPageInstance

serviceApi.onAppRoute(params => {
  const { webviewId, path, query, openType } = params

  switch (openType) {
    case 'appLaunch':
    case 'navigateTo':
      createPage(path, webviewId, query)
      break
    case 'navigateBack':
      recoverPage(path, webviewId)
      break
    case 'redirectTo':
      updatePage(path, webviewId, query)
      break
    case 'reLaunch':
      reLaunchApp(path, webviewId, query)
      break
  }
})
