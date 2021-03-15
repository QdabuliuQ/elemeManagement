<template>
  <div id="UsersPage">
    <el-card class="box-card">
      <el-table
        :data="userDate"
        stripe
        style="width: 100%">
        <el-table-column type="index" label="#">
        </el-table-column>
        <el-table-column
          prop="registe_time"
          label="注册时间">
        </el-table-column>
        <el-table-column
          prop="user_id"
          label="用户编号">
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户名称">
        </el-table-column>
        <el-table-column
          prop="city"
          label="注册地址">
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 7, 10, 15]"
        :page-size="toggleSetting.limit"
        layout="total, sizes, prev, pager, next"
        :total="toggleSetting.total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import {getUsersList} from "network/UsersPage"
import {getUserCount} from "network/UserDetail"
export default {
  name: 'UsersPage',
  data () {
    return {
      userDate: [],  // 用户数据
      toggleSetting: {
        total: 10,
        limit: 10,
        size: 0
      }
    }
  },
  methods: {
    usersList(limit, offset) {
      getUsersList(limit, offset).then(res => {
        if (res.status == 200) {
          this.userDate = res.data
          this.$notify({
            title: '成功',
            message: '获取用户数据成功',
            type: 'success'
          })
        } else {
          this.$notify({
            title: '失败',
            message: '获取用户数据失败',
            type: 'error'
          })
        }
      })
    },

    // 每页数量切换
    handleSizeChange(limit) {
      this.toggleSetting.limit = limit
      this.usersList(this.toggleSetting.limit, this.toggleSetting.size)
    },
    
    // 页数切换
    handleCurrentChange(page) {
      this.toggleSetting.size = page
      this.usersList(this.toggleSetting.limit, this.toggleSetting.size)
    }
  },
  created () {
    this.$store.state.breadList = ["数据管理","用户列表"]
    getUserCount().then(res => {
      this.toggleSetting.total = res.data.count
    })
    this.usersList(this.toggleSetting.limit, this.toggleSetting.size)
  }
}

</script>
<style scoped>
.el-pagination{
  margin-top: 20px;
}
</style>