import {request} from "./request"

// 添加分类
export function setCategoryList(name, description, restaurant_id) {
  return request({
    url: 'shopping/addcategory',
    method: 'post',
    data: {
      name, 
      description, 
      restaurant_id
    }
  })
}

// 获取分类
export function getCategoryList(restaurant_id) {
  return request({
    url: 'shopping/getcategory/' + restaurant_id,
  })
}