import axios from 'axios'
axios.defaults.baseURL = 'http://192.168.2.19'
axios.defaults.withCredentials = true
axios.defaults.timeout = 100000
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

axios.interceptors.request.use( config => {
  // config.headers([
    // 设置请求体和携带token信息
  // ])
  return config
})

axios.interceptors.response.use(response => {
  // 判断后台返回数据携带的请求码
  if(response.data.retcode === 200 || response.data.retcode === '200') {
    return response.data.data || response.data
  } else {
    // 非200请求报错
    throw Error(response.data.msg || '服务异常')
  }
})

export default axios