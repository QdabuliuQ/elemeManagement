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
            <el-button size="mini" icon="el-icon-edit" type="primary"
              >编辑</el-button
            >
            <el-button
              size="mini"
              icon="el-icon-circle-plus-outline"
              type="success"
              >添加</el-button
            >
            <el-button size="mini" icon="el-icon-delete" type="danger"
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
  </div>
</template>

<script>
import { getLocation, getShopsList, getShopsCount } from "network/ShopsPage";

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
    };
  },
  methods: {
    location() {
      // 获取定位
      getLocation().then((res) => {
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
      // 切换条数
      this.shopsSetting.limit = limit;
      this.shopsDetail(
        this.cityDetail.latitude,
        this.cityDetail.longitude,
        this.shopsSetting.offset,
        this.shopsSetting.limit
      );
    },
    handleCurrentChange(offset) {
      // 切换页数
      this.shopsSetting.offset = offset;
      this.shopsDetail(
        this.cityDetail.latitude,
        this.cityDetail.longitude,
        this.shopsSetting.offset,
        this.shopsSetting.limit
      );
    },
  },
  created() {
    getShopsCount().then((res) => {
      // 获取商店数量
      this.shopsSetting.total = res.data.count;
    });
    this.$store.state.breadList = ["数据管理", "商家列表"];
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
</style>