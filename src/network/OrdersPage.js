import {request} from "./request"

// 获取订单列表
export function getOrdersList(limit, offset) {
  return request({
    url: 'bos/orders',
    params: {
      limit, 
      offset
    }
  })
}