<template>
  <div id="AddFoodPage">
    <el-card class="box-card">
      <el-form
        :model="addFoodForm"
        :rules="addFoodFormRules"
        ref="addFoodForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <div class="flexBox">
          <el-form-item label="商品分类：" prop="category_name">
            <el-select @change="selectItem" v-model="addFoodForm.category_name" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
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
          <div class="leftBox">
            <el-form-item class="flexItem" label="食品特点：">
              <el-select
                v-model="addFoodForm.attributes"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="请选择特点标签"
                @change="attributesChange"
              >
                <el-option
                  v-for="item in attributesOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="flexItem" label="商品详情：">
              <div class="updateBox">
                <el-upload
                  class="avatar-uploader"
                  action="https://elm.cangdu.org/v1/addimg/food"
                  :show-file-list="false"
                  :on-success="serviceSuccess"
                >
                  <img
                    v-if="image_path"
                    :src="'https://elm.cangdu.org/img/' + image_path"
                    class="avatar"
                  />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </div>
            </el-form-item>
          </div>
          <div class="rightBox">
            <div class="btnBox">
              <el-button class="btn1" @click="dialogVisible = true" type="primary">添加规格</el-button>
              <el-button @click="categoryDialog = true" type="primary">添加商品分类</el-button>
            </div>
            <el-table
              border
              :data="specsList"
              stripe
              style="width: 100%">
              <el-table-column
                prop="specs"
                label="规格">
              </el-table-column>
              <el-table-column
                prop="packing_fee"
                label="包装费">
              </el-table-column>
              <el-table-column
                prop="price"
                label="价格">
              </el-table-column>
              <el-table-column
                label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" @click="deleteSpecs(scope)" type="danger">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="flexBox">
          <el-button @click="submitFoodInfo" type="primary">添加商品</el-button>
        </div>
      </el-form>
    </el-card>
    <!-- 添加规格对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="37%"
      :close="closeDialog">
      <el-form :model="addSpecs" :rules="addSpecsRules" ref="addSpecs" label-width="90px" class="demo-ruleForm">
        <el-form-item label="商品规格" prop="specs">
          <el-input v-model="addSpecs.specs"></el-input>
        </el-form-item>
        <el-form-item label="包装费">
          <el-input-number v-model="addSpecs.packing_fee" :min="0" :max="99999" label="描述文字"></el-input-number>
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input-number v-model="addSpecs.price" :min="0" :max="99999" label="描述文字"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSpecsClick">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="categoryDialog"
      width="37%"
      @close='closeCategory'>
      <el-form :model="categoryForm" :rules="categoryRuleForm" ref="categoryForm" label-width="90px" class="demo-ruleForm">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="categoryForm.name"></el-input>
        </el-form-item>
        <el-form-item label="分类描述" prop="description">
          <el-input v-model="categoryForm.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="categoryDialog = false">取 消</el-button>
        <el-button type="primary" @click="addCategoryDetail">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCategoryList, addFoodInfo, setCategoryList } from "network/AddFoodPage";

export default {
  name: "AddFoodPage",
  data() {
    return {
      addFoodForm: {
      },
      addFoodFormRules: {
        // 表单规则
        name: [
          { required: true, message: "商品名称不能为空", trigger: "blur" },
        ],
        category_name: [
          { required: true, message: "商品分类不能为空", trigger: "blur" },
        ],
      },
      options: [], // 分类数组
      image_path: null, // 图片路径
      attributesOptions: [
        { value: "新", label: "新品" },
        { value: "牌", label: "招牌" },
      ],
      specsList: [],  // 规格数组
      dialogVisible: false,  // 对话框
      addSpecs: {
        packing_fee: 0,
        price: 0
      },  // 添加规格表单
      addSpecsRules: {
        // 表单规则
        specs: [
          { required: true, message: "商品规格不能为空", trigger: "blur" },
        ],
      },
      attributesList: [],
      categoryDialog: false,  // 添加分类对话框
      categoryForm: {},  // 添加分类表单
      categoryRuleForm: {
        name: [
          { required: true, message: "分类名称不能为空", trigger: "blur" },
        ],
        description: [
          { required: true, message: "分类描述不能为空", trigger: "blur" },
        ]
      }
    };
  },
  methods: {
    serviceSuccess(res) {  // 上传成功回调
      this.image_path = res.image_path;
    },

    addSpecsClick() {  // 添加规格
      this.$refs.addSpecs.validate(res =>{
        if (res) {
          this.specsList.push({
            specs: this.addSpecs.specs,
            packing_fee: this.addSpecs.packing_fee,
            price: this.addSpecs.price,
          })
          
          this.dialogVisible = false  // 隐藏对话框
        }
      })
    },

    closeDialog() {  // 关闭对话框回调
      this.$refs.addSpecs.resetFields()  // 重置数据
    },

    deleteSpecs(info) {  // 删除规格
      this.specsList.splice(info.$index, 1)
    },

    submitFoodInfo() {  // 提交信息
      this.$refs.addFoodForm.validate(res => {
        if (res) {
          addFoodInfo({
            restaurant_id: this.$route.params.restID,
            category_id: this.addFoodForm.category_id,
            name: this.addFoodForm.name,
            image_path: this.image_path,
            specs: this.specsList,
            description: this.addFoodForm.description,
            activity: this.addFoodForm.activity,
            attributes: this.attributesList,
          }).then(res => {
            if (res.data.status == 0) {
              this.$notify({
                title: '失败',
                message: '添加商品失败',
                type: 'error'
              })
            } else {
              this.$notify({
                title: '成功',
                message: '添加商品成功',
                type: 'success'
              })
              this.$refs.addFoodForm.resetFields()  // 清空数据
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

    selectItem(id) {  // 下拉列表回调
      this.addFoodForm.category_id = id
    },

    attributesChange(info) {  // 下拉列表回调
      let index = ''
      let list = []
      for (const item of info) {
        for (let i = 0; i < this.attributesOptions.length; i++) {
          if (this.attributesOptions[i].value == item) {
            list.push(this.attributesOptions[i])
          }
        }
      }
      this.attributesList = list
    },

    addCategoryDetail() {  // 添加分类
      this.$refs.categoryForm.validate(res => {
        if (res) {
          setCategoryList(
            this.categoryForm.name,
            this.categoryForm.description,
            this.$route.params.restID).then(res => {
             if (res.data.status == 0) {
               this.$notify({
                title: '失败',
                message: '添加分类失败',
                type: 'error'
              })
            } else {
              this.$notify({
                title: '成功',
                message: '添加分类失败',
                type: 'success'
              })
              this.categoryDialog = false  // 隐藏对话框
            }
          })
        }
      })
    },

    closeCategory() {  // 关闭对话框回调函数
      this.$refs.categoryForm.resetFields()  // 清空数据
    }
  },
  created() {
    if (this.$route.params.restID == "null") {
      // 判断是否传入id
      this.$alert("需要选择店铺才可以添加商品", "提示", {
        confirmButtonText: "确定",
        callback: (action) => {
          this.$router.push("/shopsPage"); // 路由跳转
        },
      });
    } else {
      let id = this.$route.params.restID;
      getCategoryList(id).then((res) => {
        // 获取商品分类
        for (const item of res.data.category_list) {
          this.options.push({
            value: item.id,
            label: item.name,
          });
        }
      });
    }
    this.$store.state.breadList = ["添加数据", "添加商品"];
    this.$store.state.tabbarIndex = "3-2";
  },
};
</script>
<style scoped>
.flexBox {
  display: flex;
}
.el-form {
  width: 90%;
  margin: 0 auto;
  margin-top: 15px;
}
.flexBox .el-form-item {
  flex: 1;
}
.el-form-item {
  margin-left: 5px;
  margin-right: 5px;
}
.el-form-item .el-select {
  width: 100%;
}
.updateBox {
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
  border-color: #409eff;
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
.leftBox{
  flex: 1;
}
.rightBox{
  flex: 1;
}
.rightBox .el-button{
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}
.rightBox .el-table{
  margin-top: 15px;
}
.flexBox .el-button{
  position: relative;
  left: 40%;
  transform: translateX(-50%);
}
.el-dialog .el-form{
  width: 100%;
}
.btnBox .btn1{
  margin-right: 20px;
}
</style>