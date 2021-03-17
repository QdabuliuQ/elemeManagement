import {request} from './request'

// 获取管理员列表
export function getAdminsList(limit,offset) {
  return request({
    url: 'admin/all',
    params: {
      limit,
      offset
    }
  })
}