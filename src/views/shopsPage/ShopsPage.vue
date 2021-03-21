<template>
  <div id="ShopsPage">
    <el-card class="box-card">
      <el-table :data="shopsList" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="店铺名称 : ">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="店铺地址 : ">
                <span>{{ props.row.address }}</span>
              </el-form-item>
              <el-form-item label="店铺介绍 : ">
                <span>{{ props.row.description }}</span>
              </el-form-item>
              <el-form-item label="店铺 ID : ">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="联系电话 : ">
                <span>{{ props.row.phone }}</span>
              </el-form-item>
              <el-form-item label="评分 : ">
                <span>{{ props.row.rating }}</span>
              </el-form-item>
              <el-form-item label="销售量 : ">
                <span>{{ props.row.recent_order_num }}</span>
              </el-form-item>
              <el-form-item label="分类 : ">
                <span>{{ props.row.category }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="店铺名称" prop="name"> </el-table-column>
        <el-table-column label="店铺地址" prop="address"> </el-table-column>
        <el-table-column label="店铺介绍" prop="description"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="editShopDetail(scope.row)" size="mini" icon="el-icon-edit" type="primary"
              >编辑</el-button
            >
            <el-button
              @click="addShopDetail(scope.row)"
              size="mini"
              icon="el-icon-circle-plus-outline"
              type="success"
              >添加</el-button
            >
            <el-button @click="deleteShopDetail(scope.row.restaurant_id)" size="mini" icon="el-icon-delete" type="danger"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 7, 10, 15]"
        :page-size="shopsSetting.limit"
        layout="total, sizes, prev, pager, next"
        :total="shopsSetting.total"
      >
      </el-pagination>
    </el-card>
    <!-- 对话框 -->
    <el-dialog
      @close='closeDialog'
      title="编辑店铺信息"
      :visible.sync="shopVisible"
      width="40%">
      <!-- 编辑表单 -->
      <el-form :model="editForm" :rules="editFormRules" ref="shopEditForm" label-width="100px" class="demo-ruleForm">
        <el-form-item class="editFormItem" label="店铺编号：">
          <el-input :disabled="true" v-model="editForm.id"></el-input>
        </el-form-item>
        <el-form-item class="editFormItem" label="店铺分类：" prop="category">
          <el-input v-model="editForm.category"></el-input>
        </el-form-item>
        <el-form-item class="editFormItem" label="店铺名称：" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item class="editFormItem" label="店铺地址：" prop="address">
          <el-input v-model="editForm.address"></el-input>
        </el-form-item>
        <el-form-item class="editFormItem" label="店铺描述：" prop="description">
          <el-input v-model="editForm.description"></el-input>
        </el-form-item>
        <el-form-item class="editFormItem" label="联系电话：" prop="phone">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="店铺图片：">
          <div class="updateBox">
            <el-upload :on-success='success' class="avatar-uploader" action="https://elm.cangdu.org/v1/addimg/food" :show-file-list="false">
              <img v-if="editForm.imageUrl" :src="'https://elm.cangdu.org/img/' + imgUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="shopVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDetail">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getLocation, getShopsList, getShopsCount, editShopData, deleteShopData } from "network/ShopsPage";

export default {
  name: "ShopsPage",
  data() {
    return {
      shopsList: [],
      shopsSetting: {
        // 相关参数
        latitude: 0,
        longitude: 0,
        offset: 0,
        limit: 10,
        total: 0,
      },
      cityDetail: {
        // 城市信息
        id: 0,
        name: "",
        latitude: "",
        longitude: "",
      },
      editForm: {},  // 备份数据
      shopVisible: false,  // 编辑数据对话框
      editFormRules: {
        category: [
          { required: true, message: '店铺分类不能为空', trigger: 'blur' },
        ],
        name: [
          { required: true, message: '店铺名称不能为空', trigger: 'blur' },
        ],
        address: [
          { required: true, message: '店铺地址不能为空', trigger: 'blur' },
        ],
        description: [
          { required: true, message: '店铺描述不能为空', trigger: 'blur' },
        ],
        phone: [
          { required: true, message: '联系电话不能为空', trigger: 'blur' },
        ]
      },  // 表单验证规则
      imgUrl: '',
      isSuccess: true,
    };
  },
  methods: {
    location() {
      // 获取定位
      getLocation().then((res) => {
        console.log(res);
        if (res != undefined) {
          if (res.status == 200) {
            this.cityDetail.id = res.data.id;
            this.cityDetail.name = res.data.name;
            this.cityDetail.latitude = res.data.latitude;
            this.cityDetail.longitude = res.data.longitude;
            this.shopsDetail(
              this.cityDetail.latitude,
              this.cityDetail.longitude,
              this.shopsSetting.offset,
              this.shopsSetting.limit
            );
          }
        } else {
          this.isSuccess = false
        }
      });
    },
    shopsDetail(lat, lon, offset, limit) {
      // 获取店铺数据
      getShopsList(lat, lon, offset, limit).then((res) => {
        if (res.status == 200) {
          this.shopsList = res.data;
          this.$notify({
            title: "成功",
            message: "获取店铺数据成功",
            type: "success",
          });
        } else {
          this.$notify({
            title: "失败",
            message: "获取店铺数据失败",
            type: "success",
          });
        }
      });
    },
    handleSizeChange(limit) {
      if (this.isSuccess) {
        // 切换条数
        this.shopsSetting.limit = limit;
        this.shopsDetail(
          this.cityDetail.latitude,
          this.cityDetail.longitude,
          this.shopsSetting.offset,
          this.shopsSetting.limit
        );
      } 
    },
    handleCurrentChange(offset) {
      if (this.isSuccess) {
        // 切换页数
        this.shopsSetting.offset = offset;
        this.shopsDetail(
          this.cityDetail.latitude,
          this.cityDetail.longitude,
          this.shopsSetting.offset,
          this.shopsSetting.limit
        );
      }
    },

    editShopDetail(info) {  // 编辑店铺信息
      this.shopVisible = true  // 显示对话框
      this.editForm = {...info}  // 保存一份数据
      this.editForm.imageUrl = info.image_path
      this.imgUrl = info.image_path
    },

    editDetail() { // 提交数据
      this.$refs.shopEditForm.validate(res => {  // 表单验证
        if (res) {
          editShopData(
            this.editForm.id,
            this.editForm.name,
            this.editForm.address,
            this.editForm.description,
            this.editForm.phone,
            this.imgUrl,
            this.editForm.category,
            ).then(res => {
              if (res.data.status == 0) {
                this.$notify({
                  title: '失败',
                  message: '更新店铺信息失败',
                  type: 'error'
                })
              } else {
                this.shopsList = []  // 清空数据
                this.location(); // 获取定位
                this.shopVisible = false  // 隐藏弹窗
                this.$notify({
                  title: '成功',
                  message: '更新店铺信息成功',
                  type: 'success'
                })
              }
          })
        }
      })
    },

    deleteShopDetail(id) {  // 删除数据
      this.$confirm('将永久删除店铺信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteShopData(id).then(res => {
          if (res.data.status == 0) {
            this.$notify({
              title: '失败',
              message: '删除店铺信息失败',
              type: 'error'
            })
          } else {
            this.shopsList = []  // 清空数据
            this.location(); // 获取定位
            this.$notify({
              title: '成功',
              message: '删除店铺信息成功',
              type: 'success'
            })
          }
        })
      }).catch();
    },

    success(res) {  // 图片上传成功回调
      if (res.status == 1) {
        this.$notify({
          title: '成功',
          message: '上传图片成功',
          type: 'success'
        })
        this.editForm.imageUrl = res.image_path
        this.imgUrl = res.image_path
      }
    },

    closeDialog() {  // 关闭对话框回调
      this.$refs.shopEditForm.resetFields()  // 清空数据
    },

    addShopDetail(info) {  // 添加信息
      this.$router.push('/addFoodPage/' + info.id)
    }
  },
  created() {
    getShopsCount().then((res) => {
      // 获取商店数量
      this.shopsSetting.total = res.data.count;
    });
    this.$store.state.breadList = ["数据管理", "商家列表"];
    this.$store.state.tabbarIndex = '2-2'
    this.location(); // 获取定位
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
.editFormItem{
  width: 95%;
  margin-bottom: 20px;
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
.el-upload{
  width: 150px;
  height: 150px;
}
</style>