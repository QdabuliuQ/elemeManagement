import {request} from './request'

// 获取当天用户注册量
export function getUserCountToday(date) {
  return request({
    url: 'statis/user/'+ date +'/count'
  })
}

// 获取当天订单数量
export function getOrderCountToday(date) {
  return request({
    url: 'statis/order/'+date+'/count'
  })
}

// 获取当天管理员注册数量
export function getAdminCountToday(date) {
  return request({
    url: 'statis/admin/'+date+'/count'
  })
}

// 获取用户总数量
export function getUserCount() {
  return request({
    url: 'v1/users/count'
  })
}

// 获取总订单
export function getOrderCount() {
  return request({
    url: 'bos/orders/count'
  })
}

// 获取管理员数量
export function getAdminCount() {
  return request({
    url: 'admin/count'
  })
}