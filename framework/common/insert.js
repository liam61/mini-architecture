;(function (text) {
  function insert2html() {
    const styleEle = document.createElement('style')
    document
      .getElementsByTagName('head')[0]
      .insertBefore(styleEle, document.getElementsByTagName('head')[0].firstChild)
    if (styleEle.styleSheet) {
      styleEle.styleSheet.disabled || (styleEle.styleSheet.cssText = text)
    } else {
      try {
        styleEle.innerHTML = text
      } catch (e) {
        styleEle.innerText = text
      }
    }
  }
  insert2html()
})(__INSERT_TEXT__)
