import {request} from './request'

// 登录
export function login(user_name, password) {
  return request({
    url: 'admin/login',
    method: 'post',
    data: {
      user_name, 
      password
    }
  })
}

