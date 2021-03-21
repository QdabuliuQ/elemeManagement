import {request} from './request'

// 获取用户数据
export function getUserChart() {
  return request({
    url: 'v1/user/city/count'
  })
}