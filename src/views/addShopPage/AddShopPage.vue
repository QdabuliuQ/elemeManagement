<template>
  <div id="AddShopPage">
    <el-card class="box-card">
      <el-form
        :model="addShopForm"
        :rules="addShopFormRules"
        ref="addShopForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <div class="flexBox">
          <div class="formItems">
            <el-form-item label="店铺名称：" prop="name">
              <el-input class="itemInput" v-model="addShopForm.name"></el-input>
            </el-form-item>
            <el-form-item label="联系电话：" prop="phone">
              <el-input class="itemInput" v-model="addShopForm.phone"></el-input>
            </el-form-item>
            <el-form-item label="店铺标语：">
              <el-input class="itemInput" v-model="addShopForm.promotion_info"></el-input>
            </el-form-item>
          </div>
          <div class="formItems">
            <el-form-item label="详细地址：" prop="address">
              <el-autocomplete
                v-model="addShopForm.address"
                :fetch-suggestions="querySearchAsync"
                :trigger-on-focus="false"
              ></el-autocomplete>
            </el-form-item>
            <el-form-item label="店铺简介：">
              <el-input v-model="addShopForm.description"></el-input>
            </el-form-item>
            <el-form-item label="店铺分类：">
              <el-cascader
              v-model="addShopForm.category"
              :options="categoryOptions"></el-cascader>
            </el-form-item>
          </div>
        </div>
        <!-- switch开关 -->
        <div class="flexBox">
          <el-form-item label="品牌保证：">
            <el-switch v-model="addShopForm.is_premium"></el-switch>
          </el-form-item>
          <el-form-item label="蜂鸟专送：">
            <el-switch v-model="addShopForm.delivery_mode"></el-switch>
          </el-form-item>
          <el-form-item label="新开店铺：">
            <el-switch v-model="addShopForm.new"></el-switch>
          </el-form-item>
          <el-form-item label="外卖保险：">
            <el-switch v-model="addShopForm.bao"></el-switch>
          </el-form-item>
          <el-form-item label="准时达：">
            <el-switch v-model="addShopForm.zhun"></el-switch>
          </el-form-item>
          <el-form-item label="开发票：">
            <el-switch v-model="addShopForm.piao"></el-switch>
          </el-form-item>
        </div>
        <!-- 费用/营业时间 -->
        <div class="flexBox2">
          <el-form-item class="flex1" label="包装费：">
            <el-input-number size="small" v-model="addShopForm.float_delivery_fee" :min="0" :max="100"></el-input-number>
          </el-form-item>
          <el-form-item class="flex1" label="起送价：">
            <el-input-number size="small" v-model="addShopForm.float_minimum_order_amount" :min="0" :max="100"></el-input-number>
          </el-form-item>
          <el-form-item class="flex2" label="营业时间：">
            <el-time-select
              v-model="addShopForm.startTime"
              :picker-options="{
                start: '00:00',
                step: '00:15',
                end: '23:45'
              }"
              placeholder="开始营业时间">
            </el-time-select>
            <el-time-select
              v-model="addShopForm.endTime"
              :picker-options="{
                start: '00:00',
                step: '00:15',
                end: '23:45'
              }"
              placeholder="停止营业时间">
            </el-time-select>
          </el-form-item>
        </div>
        <!-- 上传图片 -->
        <div class="flexBox">
          <el-form-item class="flex1" label="店铺图片：">
            <div class="updateBox">
              <el-upload
                class="avatar-uploader"
                action="https://elm.cangdu.org/v1/addimg/food"
                :show-file-list="false"
                :on-success="image_pathSuccess">
                <img v-if="image_path" :src="'https://elm.cangdu.org/img/'+image_path" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item  class="flex1" label="营业执照：">
            <div class="updateBox">
              <el-upload
                class="avatar-uploader"
                action="https://elm.cangdu.org/v1/addimg/food"
                :show-file-list="false"
                :on-success="businessSuccess">
                <img v-if="business_license_image" :src="'https://elm.cangdu.org/img/'+business_license_image" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item  class="flex1" label="服务许可证：">
            <div class="updateBox">
              <el-upload
                class="avatar-uploader"
                action="https://elm.cangdu.org/v1/addimg/food"
                :show-file-list="false"
                :on-success="serviceSuccess">
                <img v-if="catering_service_license_image" :src="'https://elm.cangdu.org/img/'+catering_service_license_image" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
          </el-form-item>
        </div>
        <!-- 活动设置 -->
        <div class="flexBox2">
          <el-form-item class="flex3" label="优惠活动：">
            <el-select @change='changeSelect' v-model="activeValue" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="flex4" label="优惠活动：">
            <el-table
              class="tableClass"
              border
              :data="addShopForm.activities"
              stripe
              style="width: 100%">
              <el-table-column
                prop="icon_name"
                label="活动标题">
              </el-table-column>
              <el-table-column
                prop="name"
                label="活动名称">
              </el-table-column>
              <el-table-column
                prop="description"
                label="活动详情">
              </el-table-column>
              <el-table-column
                label="操作">
                <template slot-scope="scope">
                  <el-button @click="deleteActive(scope)" type="danger" size="mini">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </div>
        <div class="flexBox3">
          <el-button @click="submitShopDetail" type="primary">添加商店</el-button>
        </div>
      </el-form>
    </el-card>
    <el-dialog
      class="activeDialog"
      title="添加活动详情"
      :visible.sync="dialogVisible"
      @close='closeDialog'
      width="30%">
      <el-form :rules="activeDetailForm" style="width: 100%" ref="activeDetailForm" :model="activeDetail" label-width="100px">
        <el-form-item label="活动详情：" prop="description">
          <el-input v-model="activeDetail.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addActives">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {getLocation} from 'network/ShopsPage'
import {getPosition, addShopDetail, getShopsCategory} from 'network/AddShopsPage'

export default {
  name: "AddShopPage",
  data() {
    return {
      addShopForm: { 
        is_premium: true,
        delivery_mode: true,
        new: true,
        bao: true,
        zhun: true,
        piao: true,
        float_delivery_fee: 0,
        float_minimum_order_amount: 0,
        activities: []
      }, // 添加表单数据
      addShopFormRules: {
        name: [
          { required: true, message: "店铺名称不能为空", trigger: "blur" },
        ],
        phone: [
          { required: true, message: "联系电话不能为空", trigger: "blur" },
        ],
        address: [
          { required: true, message: "详细地址不能为空", trigger: "blur" },
        ]
      }, // 验证表单

      options: [  // 下拉选择
        {value: 0, label: '满减优惠'},
        {value: 1, label: '优惠大酬宾'},
        {value: 2, label: '新用户立减'},
        {value: 3, label: '进店领券'},
      ],
      activeValue: '',  // 激活状态
      image_path: null,  // 店铺图片
      business_license_image: null,  // 营业执照
      catering_service_license_image: null,  // 服务许可
      dialogVisible: false,  // 对话框
      activeDetail: {  // 活动描述表单
        description: ''  
      },
      activeDetailForm: {  // 表单验证
        description: [ 
          { required: true, message: "活动详情不能为空", trigger: "blur" },
        ]
      },
      activeIndex: '',
      cityDetail: {},  // 城市信息
      suggestionList: [],  // 推荐地址
      categoryOptions: [],  // 分类
    };
  },
  methods: {
    image_pathSuccess(res) {  // 上传图片成功回调
      this.image_path = res.image_path
    },

    businessSuccess(res) {  // 上传图片成功回调
      this.business_license_image = res.image_path
    },

    serviceSuccess(res){  // 上传图片成功回调
      this.catering_service_license_image = res.image_path
    },

    changeSelect(index) {  // 下拉列表改变回调函数
      this.dialogVisible = true  // 显示对话框
      this.activeIndex = index
    },

    addActives() {  // 提交活动
      this.$refs.activeDetailForm.validate(res => {  // 表单验证
        if (res) {
          switch (this.activeIndex) {  // 分支语句
            case 0:
              this.addShopForm.activities.push({
                icon_name:'减', name:'满减优惠', description: this.activeDetail.description
              })
              break;
            case 1:
              this.addShopForm.activities.push({
                icon_name:'特', name:'优惠大酬宾', description: this.activeDetail.description
              })
              break;
            case 2:
              this.addShopForm.activities.push({
                icon_name:'新', name:'新用户立减', description: this.activeDetail.description
              })
              break;
            case 3:
              this.addShopForm.activities.push({
                icon_name:'领', name:'进店领券', description: this.activeDetail.description
              })
              break;
            default:
              break;
          }
          this.dialogVisible = false  // 隐藏对话框
          this.$notify({
            title: '成功',
            message: '添加活动成功',
            type: 'success'
          })
        }
      })
    },

    closeDialog() {  // 监听对话框关闭
      this.$refs.activeDetailForm.resetFields()  // 清空数据
    },

    deleteActive(info) {  // 删除活动
      this.addShopForm.activities.splice(info.$index, 1)
    },

    querySearchAsync(queryString, cb) {  // 搜索建议回调函数
      this.suggestionList = []  // 清空上一次数据
      getPosition(this.cityDetail.id, queryString).then(res =>{  // 发送数据
        for (const item of res.data) {
          this.suggestionList.push({  // 添加到数组中
            value: `${item.name}(${item.address})`,
          })
        }
        cb(this.suggestionList)
      })
    },

    submitShopDetail() {  // 提交店铺信息
      this.$refs.addShopForm.validate(res => {
        if (res) {
          addShopDetail({
            name: this.addShopForm.name,
            address: this.addShopForm.address,
            phone: this.addShopForm.phone,
            latitude: this.cityDetail.latitude,
            longitude: this.cityDetail.longitude,
            category: this.addShopForm.category,
            image_path: this.image_path,
            float_delivery_fee: this.addShopForm.float_delivery_fee,
            float_minimum_order_amount: this.addShopForm.float_minimum_order_amount,
            description: this.addShopForm.description,
            promotion_info: this.addShopForm.promotion_info,
            is_premium: this.addShopForm.is_premium,
            delivery_mode: this.addShopForm.delivery_mode,
            new: this.addShopForm.zhun,
            bao: this.addShopForm.bao,
            zhun: this.addShopForm.zhun,
            piao: this.addShopForm.piao,
            startTime: this.addShopForm.startTime,
            endTime: this.addShopForm.endTime,
            business_license_image: this.business_license_image,
            catering_service_license_image: this.catering_service_license_image,
            activities: this.addShopForm.activities
          }).then(res => {
            if (res.data.status == 0) {
              this.$notify({
                title: '失败',
                message: '您的等级权限不够',
                type: 'error'
              })
            } else {
              this.$notify({
                title: '成功',
                message: '添加店铺成功',
                type: 'succuss'
              })
            }
          })
        } else {
          this.$notify({
            title: '失败',
            message: '*号的内容不能为空',
            type: 'error'
          })
        }
      })
      
    },

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
  },
  created() {
    this.$store.state.breadList = ["添加数据", "添加商店"];
    this.$store.state.tabbarIndex = "3-1";
    getLocation().then(res => {  // 获取经纬度
      this.cityDetail.id = res.data.id
      this.cityDetail.latitude = res.data.latitude
      this.cityDetail.longitude = res.data.longitude
      this.cityDetail.name = res.data.name
    })
    getShopsCategory().then(res => {  // 获取所有分类
      this.categoryOptions = this.setCategory(res.data)
    })
  },
};
</script>
<style scoped>
.el-form {
  width: 85%;
  margin: 0 auto;
}
.flexBox{
  display: flex;
}
.flexBox .el-form-item{
  flex: 1;
}
.formItems {
  flex: 1;
}
.itemInput {
  width: 95%;
}
.el-autocomplete{
  width: 100%;
}
.flexBox2{
  display: flex;
}
.flex1{
  flex: 2;
}
.flex2 {
  flex: 4;
}
.flex3{
  flex: 3.5;
}
.flex4{
  flex: 6.5;
}
.el-date-editor{
  width: 190px;
  margin-right: 15px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
}
.avatar {
  width: 150px;
  height: 150px;
  display: block;
}
.updateBox{
  width: 150px;
  height: 150px;
  border: 1px dashed #bebebe; 
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.updateBox:hover {
  border-color: #409eff;
}
.flexBox3{
  height: 40px;
  position: relative;
}
.flexBox3 .el-button{
  position: absolute;
  left: 48%;
  transform: translateX(-50%);
}
</style>