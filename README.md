# eleme-manage-system(饿了么后台管理系统)

### 接口根路径：`https://elm.cangdu.org/`，[点击查看API接口](https://github.com/bailicangdu/node-elm/blob/master/API.md)

#### 项目技术栈：
* Vue：构建用户界面的渐进式框架
* Vue-CLI：构建整个项目的基础
* vue-router：Vue路由导航
* Vuex：应用程序开发的状态管理模式
* axios：用于发送AJAX网络请求
* ehcarts：数据可视化处理
* element-ui：Vue全家桶UI组件
* nprogress：进度条加载(根据网络请求进行显示)

#### 项目分析：
* 1、在使用到`element-ui`的`el-cascader`组件的时候，需要对数据转换成一个二维数组的方式，传给`options`才能生成对应的多级联动下拉列表
  * 1-1、但由于从后端请求回来的数据并非复合组件数据要求，需要对数据进行处理
  * 1-2、对返回的数据进行`递归调用`，创建一个函数，接收items数组，先对传入的`items`进行判断，判断是否为空
  * 1-3、遍历循环`items`数组，提取每一个`id`和`name`push到detail临时数组中，并且获取`children`的元素(子菜单)
  * 1-4、在`children`中调用重新调用`this.setCategory(当前循环items的子菜单)`方法，实现递归调用
  * 1-5、当递归调用结束后的第一层`setCategory`方法会返回一个全部数据的数组，并传入`el-cascader`组件当中
  ```js
  setCategory(items) {  // 递归函数
    if (items) {  // 判断是否为空
      let detail = []  // 创建一个空数组
      for (let i = 0; i < items.length; i++) {  // 遍历每一项
        detail.push({  // 添加到临时数组中中
          value: items[i].id,
          label: items[i].name,
          // 进行递归调用  传入当前元素的子元素
          children: this.setCategory(items[i].sub_categories)
        })
      }
      return detail  // 返回临时数组
    }
  },
  ```


