import axios from 'axios' // 导入axios
import NProgress from "nprogress"  // 导入进度条组件
import {Notification} from "element-ui"
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
  }, err=> {
    Notification({
      title: '失败',
      message: '网络或者服务器出了点问题',
      type: 'error'
    });
  })

  instance.interceptors.response.use(config => {
    NProgress.done()
    return config
  }, err=> {
    Notification({
      title: '失败',
      message: '网络或者服务器出了点问题',
      type: 'error'
    });
  })

  // 返回 实例对象
  return instance(config)
}