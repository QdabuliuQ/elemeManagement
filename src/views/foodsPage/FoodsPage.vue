<template>
  <div id="FoodsPage">
    <el-card class="box-card">
      <el-table :data="foods" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="食品名称 : ">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="食品编号 : ">
                <span>{{ props.row.item_id }}</span>
              </el-form-item>
              <el-form-item label="餐馆编号 : ">
                <span>{{ props.row.restaurant_id }}</span>
              </el-form-item>
              <el-form-item label="食品介绍 : ">
                <span>{{ props.row.shopId }}</span>
              </el-form-item>
              <el-form-item label="食品评分 : ">
                <span>{{ props.row.rating }}</span>
              </el-form-item>
              <el-form-item label="月销量 : ">
                <span>{{ props.row.month_sales }}</span>
              </el-form-item>
              <el-form-item label="分类编号 : ">
                <span>{{ props.row.category_id }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="食品名称" prop="name"> </el-table-column>
        <el-table-column label="食品介绍" prop="description"> </el-table-column>
        <el-table-column label="食品评分" prop="rating"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="editGoods(scope.row)" size="mini" icon="el-icon-edit" type="primary"
              >编辑</el-button
            >
            <el-button @click="deleteGoods(scope.row)" size="mini" icon="el-icon-delete" type="danger"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 7, 10, 15]"
        :page-size="foodsSetting.limit"
        layout="total, sizes, prev, pager, next"
        :total="foodsSetting.total"
      ></el-pagination>
    </el-card>
    <!-- 对话框 -->
    <el-dialog title="修改食品信息" @close='closeOuterDialog' :visible.sync="outerVisible">
      <!-- 内部对话框 -->
      <el-dialog
        width="40%"
        title="添加规格"
        :visible.sync="innerVisible"
        append-to-body
      >
        <el-form :model="innerFormDetail" :rules="innerForm" ref="innerForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="商品规格" prop="name">
            <el-input v-model="innerFormDetail.name"></el-input>
          </el-form-item>
          <el-form-item label="包装费">
            <el-input-number v-model="innerFormDetail.packfree"  :min="1" :max="100" label="描述文字"></el-input-number>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input-number v-model="innerFormDetail.free"  :min="1" :max="100" label="描述文字"></el-input-number>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="innerVisible = false">取 消</el-button>
          <el-button type="primary" @click="editGoodsInfoInner"
            >确 定</el-button
          >
        </div>
      </el-dialog>
      <!-- 内部表单 -->
      <!-- 外部表单 -->
      <el-form ref="editGoodsDetail" :model="editForm" :rules="editGoodsRule" label-width="80px">
        <el-form-item label="食品名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="食品介绍" prop="description">
          <el-input v-model="editForm.description"></el-input>
        </el-form-item>
        <el-form-item label="食品图片">
          <div class="updateBox">
            <el-upload :on-success='success' class="avatar-uploader" action="https://elm.cangdu.org/v1/addimg/food" :show-file-list="false">
              <img v-if="editForm.imageUrl" :src="editForm.imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </el-form-item>
      </el-form>
      <!-- 商品规格表格 -->
      <el-table
        class="editGoodsRuleBox"
        :data="goodsData"
        stripe
        border
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
            <el-button @click="deleteGoodsInfo(scope)" size="mini" icon="el-icon-delete" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="addGoodsRuleBox">
        <el-button @click="setGoodsRule" class="addGoodsRule" size="medium" type="primary" icon="el-icon-circle-plus-outline">添加商品规格</el-button>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="outerVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGoodsInfo"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getFoodsList, getFoodsCount, setGoodsInfo } from "network/FoodsPage";

export default {
  name: "FoodsPage",
  data() {
    return {
      foods: [],  // 
      foodsSetting: {  // 参数设置
        offset: 0,
        limit: 10,
        total: 0,
      },
      outerVisible: true, // 外部的对话框
      innerVisible: false, // 内部的对话框
      editForm: {}, // 编辑商品表单
      goodsData: [],  // 商品规格数组 
      editGoodsRule: {  // 编辑商品规则
        name: [
          { required: true, message: '食品名称不能为空', trigger: 'blur' },
        ],
        description: [
          { required: true, message: '食品介绍不能为空', trigger: 'blur' },
        ]
      },
      image_path: '',  // 图片路径
      innerForm: {  // 内部表格规则
        name: [
          { required: true, message: '食品规格不能为空', trigger: 'blur' },
        ],
      },
      innerFormDetail: { // 编辑规格表单
        packfree: 0,
        free: 0
      },
    };
  },
  methods: {
    foodsList(limit, offset, rid) {
      getFoodsList(limit, offset, rid).then((res) => {
        this.foods = res.data;
        this.$notify({
          title: "成功",
          message: "获取食品数据成功",
          type: "success",
        });
      });
    },

    handleSizeChange(limit) {  // 切换条数
      this.foodsSetting.limit = limit;
      this.foodsList(
        this.foodsSetting.limit,
        this.foodsSetting.offset,
        this.$route.params.restID
      );
    },

    handleCurrentChange(offset) {  // 切换页数
      this.foodsSetting.offset = offset;
      this.foodsList(
        this.foodsSetting.limit,
        this.foodsSetting.offset,
        this.$route.params.restID
      );
    },

    success(response) {  // 上传图片成功回调
      this.editForm.imageUrl = 'https://elm.cangdu.org/img/' +response.image_path
      this.image_path = response.image_path
    },

    editGoods(info){  // 编辑商品信息
      this.outerVisible = true  // 显示对话框
      this.editForm = {...info}  // 浅拷贝
      for (const item of info.specfoods) {  // 遍历商品规格
        this.goodsData.push({
          specs: item.name,
          packing_fee: item.packing_fee,
          price: item.price,
        })
      }
      this.editForm.imageUrl = 'https://elm.cangdu.org/img/' + info.image_path
      this.image_path = info.image_path
    },

    deleteGoods(info) {  // 删除商品
      console.log(info);
    },

    closeOuterDialog() {  // 关闭外面的对话框
      this.goodsData = [] 
      this.$refs.editGoodsDetail.resetFields();  // 重置数据
    },

    editGoodsInfo() {  // 修改商品信息
      this.$refs.editGoodsDetail.validate(res => {
        if (res) {
          this.$notify({
            title: '成功',
            message: '修改商品信息成功',
            type: 'success'
          })
          this.outerVisible = false
        }
      })
    },

    setGoodsRule() {  // 弹出内部窗口
      this.innerVisible = true
    },

    editGoodsInfoInner() {  // 编辑商品规格
      this.$refs.innerForm.validate(res => {  // 表单验证
        if (res) {
          this.goodsData.push({
            specs: this.innerFormDetail.name,
            packing_fee: this.innerFormDetail.packfree,
            price: this.innerFormDetail.free,
          })
          this.$notify({
            title: '成功',
            message: '添加商品规格成功',
            type: 'success'
          })
          this.$refs.innerForm.resetFields()  // 清空数据
          this.innerFormDetail.packfree = 0
          this.innerFormDetail.free = 0
          this.innerVisible = false  // 隐藏对话框
        } 
      })
    },

    deleteGoodsInfo(info) {  // 删除商品规格
      this.goodsData.splice(info.$index, 1)
    }
  },
  created() {
    (this.$store.state.breadList = ["数据管理", "食品列表"]),
      (this.$store.state.tabbarIndex = "2-3");
    getFoodsCount().then((res) => {
      this.foodsSetting.total = res.data.count;
    });
    this.foodsList(
      this.foodsSetting.limit,
      this.foodsSetting.offset,
      this.$route.params.restID
    );
  },
};
</script>
<style scoped>
.el-form-item {
  width: 50%;
  margin-right: 0;
  margin-bottom: 10px;
}
.el-pagination {
  margin-top: 15px;
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
.avatar {
  width: 150px;
  height: 150px;
  display: block;
}
.el-form-item{
  width: 90%;
}
.el-form-item__content{
  width: 100%;
}
.el-input{
  width: 100%;
}
.addGoodsRule{
  margin: 20px auto 0;
}
.editGoodsRuleBox{
  margin-top: 20px;
}
.addGoodsRuleBox{
  display: flex;
  align-items: center;
  justify-content: center;
}
.el-form-item{
  margin-bottom: 20px;
}
</style>