<template>
  <div id="AddFoodPage">
    <el-card class="box-card">
      <el-form :model="addFoodForm" :rules="addFoodFormRules" ref="addFoodForm" label-width="100px" class="demo-ruleForm">
        <div class="flexBox">
          <el-form-item label="商品分类：">
            <el-select v-model="addFoodForm.category_name" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品名称：" prop="name">
            <el-input v-model="addFoodForm.name"></el-input>
          </el-form-item>
        </div>
        <div class="flexBox">
          <el-form-item label="商品详情：">
            <el-input v-model="addFoodForm.description"></el-input>
          </el-form-item>
          <el-form-item label="商品活动：">
            <el-input v-model="addFoodForm.activity"></el-input>
          </el-form-item>
        </div>
        <div class="flexBox">
          <el-form-item label="商品详情：">
            <div class="updateBox">
              <el-upload
                class="avatar-uploader"
                action="https://elm.cangdu.org/v1/addimg/food"
                :show-file-list="false"
                :on-success="serviceSuccess">
                <img v-if="image_path" :src="'https://elm.cangdu.org/img/'+ image_path " class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item label="食品特点：">
            <el-select
              v-model="addFoodForm.attributes"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="请选择特点标签">
              <el-option
                v-for="item in attributesOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {getCategoryList} from 'network/AddFoodPage'

export default {
  name: 'AddFoodPage',
  data () {
    return {
      addFoodForm: {},
      addFoodFormRules: {  // 表单规则
        name: [
          { required: true, message: '商品名称不能为空', trigger: 'blur' },
        ]
      },
      options: [],  // 分类数组
      image_path: null,  // 图片路径
      attributesOptions: [
        {value: '新',label: '新品'},
        {value: '牌',label: '招牌'}
      ]
    }
  },
  methods: {
    serviceSuccess(res) {
      this.image_path = res.image_path
    }
  },
  created () {
    console.log(this.$route.params.restID);
    if (this.$route.params.restID == 'null') {  // 判断是否传入id
      this.$alert('需要选择店铺才可以添加商品', '提示', {
        confirmButtonText: '确定',
        callback: action => {
          this.$router.push('/shopsPage')  // 路由跳转
        }
      });
    } else {
      let id = this.$route.params.restID
      getCategoryList(id).then(res => {  // 获取商品分类
        for (const item of res.data.category_list) {
          this.options.push({
            value: item.id,
            label: item.name
          })
        }
      }) 
    }
    this.$store.state.breadList = ["添加数据", "添加商品"];
    this.$store.state.tabbarIndex = "3-2";
  }
}

</script>
<style scoped>
.flexBox{
  display: flex;
}
.el-form{
  width: 90%;
  margin: 0 auto;
  margin-top: 15px;
}
.flexBox .el-form-item{
  flex: 1;
}
.el-form-item {
  margin-left: 5px;
  margin-right: 5px;
}
.el-form-item .el-select{
  width: 100%;
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
</style>