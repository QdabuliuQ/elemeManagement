import {request} from "./request"

// 定位
export function getLocation() {
  return request({
    url: 'v1/cities?type=guess'
  })
}

// 获取商店列表
export function getShopsList(latitude, longitude, offset, limit) {
  return request({
    url: 'shopping/restaurants',
    params: {
      latitude, 
      longitude,
      offset, 
      limit
    }
  })
}

// 获取店铺数量
export function getShopsCount() {
  return request({
    url: 'shopping/restaurants/count'
  })
}