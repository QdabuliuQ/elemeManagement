<template>
  <div id="OrderPage">
    <el-card class="box-card">
      <el-table
        :data="ordersData"
        stripe
        style="width: 100%">
        <el-table-column
          prop="id"
          label="订单编号">
        </el-table-column>
        <el-table-column
          prop="total_amount"
          label="订单总价">
        </el-table-column>
        <el-table-column
          prop="restaurant_name"
          label="店铺名称">
        </el-table-column>
        <el-table-column
          prop="restaurant_id"
          label="店铺编号">
        </el-table-column>
        <el-table-column
          prop="formatted_created_at"
          label="下单时间">
        </el-table-column>
        <el-table-column
          prop="status_bar.title"
          label="订单状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status_bar.title == '支付超时'" type="danger">支付超时</el-tag>
            <el-tag v-else type="success">支付成功</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 7, 10, 15]"
        :page-size="ordersSetting.limit"
        layout="total, sizes, prev, pager, next"
        :total="ordersSetting.total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getOrdersList } from 'network/OrdersPage'
import { getOrderCount } from 'network/UserDetail'
export default {
  name: 'OrdersPage',
  data () {
    return {
      ordersSetting: {
        limit: 10,
        offset: 0,
        total: 0
      },
      ordersData: []  // 订单数据
    }
  },
  methods: {
    ordersList(limit, offset) {  // 获取订单列表
      getOrdersList(limit, offset).then(res => {
        console.log(res.data);
        if (res.status == 200) {
          this.ordersData = res.data
          this.$notify({
            title: "成功",
            message: "获取订单数据成功",
            type: "success",
          });
        } else {
          this.$notify({
            title: "失败",
            message: "获取订单数据失败",
            type: "error",
          });
        }
      })
    },

    handleSizeChange(limit) {  // 条数设置
      this.ordersSetting.limit = limit
      this.ordersList(this.ordersSetting.limit, this.ordersSetting.offset)
    },

    handleCurrentChange(offset) {  // 页数设置
      this.ordersSetting.offset = offset
      this.ordersList(this.ordersSetting.limit, this.ordersSetting.offset)
    }
  },
  created () {
    this.$store.state.breadList = ['数据管理','订单列表']
    this.$store.state.tabbarIndex = '2-4'
    getOrderCount().then(res => {  // 获取订单总数
      this.ordersSetting.total = res.data.count
    })
    this.ordersList(this.ordersSetting.limit, this.ordersSetting.offset)  // 获取订单列表
  }
}

</script>
<style scoped>
.el-pagination{
  margin-top: 15px;
}
</style>