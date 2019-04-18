if (module.hot) {
  // 实现热更新
  module.hot.accept()
}
import 'babel-polyfill'

import './css/style.less' // 引入less
import './css/reset.less' // 引入less

const first = () => {
  console.log('这里是打包文件入口-index.js')
}
first()

let ul = document.querySelector('ul')
ul.onclick = function(e) {
  var e = e || window.event
  let target = e.target || e.srcElement
  if (target.nodeName.toLowerCase() === 'li') {
    console.log(target.textContent)
  }
}

import './js/main.js'
