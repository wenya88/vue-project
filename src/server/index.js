
import http from '../libs/http.js'  // 导入我们封装好的axios对象

import apis from '../libs/api.js'  // 导入我们封装好的apis对象

export function getPublicKey () {  // 从外包接受参数，没有参数默认为空对象
  return http.get(apis.getPublicKey)  // return对应的get/post方法，第一个填路径，第二个给参数对象
}