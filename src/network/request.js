import axios from 'axios' // 导入axios
import NProgress from "nprogress"  // 导入进度条组件

export function request(config){
  const instance = axios.create({
    // 根路径
    baseURL: 'https://elm.cangdu.org/',
    // 请求时间
    timeout: 5000,
  })

  instance.interceptors.request.use(config => {
    NProgress.start()
    return config
  })

  instance.interceptors.response.use(config => {
    NProgress.done()
    return config
  })

  // 返回 实例对象
  return instance(config)
}