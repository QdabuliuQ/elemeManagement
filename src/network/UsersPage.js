import {request} from "./request"

// 获取用户列表
export function getUsersList(limit, offset) {
  return request({
    url: 'v1/users/list',
    params: {
      limit,
      offset
    }
  })
}