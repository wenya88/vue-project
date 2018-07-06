// 截屏粘贴功能模块
const screenshot = function () {
  var imgReader = function (item) {
    const blob = item.getAsFile()
    const reader = new FileReader()
    reader.onload = function (e) {
      const img = new Image()
      img.src = e.target.result
      img.class = 'img_screenshot'
      document.getElementById('testInput').appendChild(img)
    }
    reader.readAsDataURL(blob)
  }
  document.getElementById('testInput').addEventListener('paste', function (e) {
    const clipboardData = e.clipboardData // 谷歌
    var items = []
    var item = []
    var types = []
    if (clipboardData) {
      items = clipboardData.items
      if (!items) {
        return
      }
      item = items[0]
      types = clipboardData.types || []
      for (let i = 0; i < types.length; i++) {
        if (types[i] === 'Files') {
          item = items[i]
          break
        }
      }
      if (item && item.kind === 'file' && item.type.match(/^image\//i)) {
        imgReader(item)
      }
    }
  }, false)
}
export {
  screenshot
}
