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

// 编辑店铺信息
export function editShopData(id,name,address,description,phone,image_path,category) {
  return request({
    url: 'shopping/updateshop',
    data: {
      id,name,address,description,phone,image_path,category
    },
    method: 'post'
  })
}

// 删除店铺信息
export function deleteShopData(restaurant_id) {
  return request({
    url: 'shopping/restaurant/' + restaurant_id,
    method: 'delete'
  })
}