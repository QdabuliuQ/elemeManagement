import {request} from "./request"

// 获取食品列表
export function getFoodsList(limit, offset, restaurant_id) {
  return request({
    url: 'shopping/v2/foods',
    params: {
      limit,
      offset,
      restaurant_id
    }
  })
}

// 获取食品总数
export function getFoodsCount() {
  return request({
    url: 'shopping/v2/foods/count'
  })
}

// 上传图片
export function updateImg(type) {
  return request({
    url: 'v1/addimg/',
    data: {
      type
    },
    methods: 'post'
  })
}

// 更新食品
export function setGoodsInfo(item_id, name, description, image_path, restaurant_id, category_id, specfoods) {
  return request({
    url: 'shopping/v2/updatefood',
    data: {
      item_id, 
      name, 
      description, 
      image_path,
      restaurant_id, 
      category_id, 
      specfoods
    },
    method: 'post'
  })
}

// 删除食品
export function deleteGooodsInfo(food_id) {
  return request({
    url: '/shopping/v2/food/' + food_id,
    method: 'delete'
  })
}