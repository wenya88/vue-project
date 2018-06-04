// 集中管理路由，所有的接口地址：
// 1.整个应用用到了哪些接口一目了然
// 2.接口地址可能变化，方便管理
const prefix = 'index.php?r='  // api地址前缀
export default(config => {
  return Object.keys(config).reduce((copy, name) => {
    copy[name] = `${prefix}$config[name]`
    return copy
  })
})({
  // example api
  "getPublicKey": "system/login/get-public-secret-key"
})