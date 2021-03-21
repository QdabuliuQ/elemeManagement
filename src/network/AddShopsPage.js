import {request} from './request'

// 获取推荐地址
export function getPosition(city_id, keyword) {
  return request({
    url: 'v1/pois',
    params: {
      city_id, 
      keyword,
      type: 'search'
    }
  })
}

// 添加店铺信息
export function addShopDetail(paras) {
  return request({
    url: 'shopping/addshop',
    method: 'post',
    data: paras
  })
}

// 店铺分类
export function getShopsCategory(latitude = '', longitude = '') {
  return request({
    url: 'shopping/v2/restaurant/category'
  })
}