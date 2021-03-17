<template>
  <div id="AdminsPage">
    <el-card class="box-card">
      <el-table
        :data="adminsData"
        stripe
        style="width: 100%">
        <el-table-column
          label="管理员头像">
          <template slot-scope="scope">
            <img class="userImg" :src="'https://elm.cangdu.org/img/'+scope.row.avatar" alt="">
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          label="管理员编号">
        </el-table-column>
        <el-table-column
          prop="user_name"
          label="管理员昵称">
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="注册时间">
        </el-table-column>
        <el-table-column
          prop="city"
          label="注册地点">
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 7, 10, 15]"
        :page-size="adminsSetting.limit"
        layout="total, sizes, prev, pager, next"
        :total="adminsSetting.total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import {getAdminsList} from 'network/AdminsPage'
import {getAdminCount} from 'network/UserDetail'
export default {
  name: 'AdminsPage',
  data () {
    return {
      adminsSetting: {  // 相关设置
        limit: 10,
        offset: 0,
        total: 0
      },
      adminsData: []  // 管理员数组
    }
  },
  methods: {
    adminsList(limit, offset) {  // 获取管理员数据
      getAdminsList(limit, offset).then(res => {
        if (res.status == 200) {
          console.log(res.data);
          this.adminsData = res.data.data
          this.$notify({
            title: "成功",
            message: "获取管理员数据成功",
            type: "success",
          });
        } else {
          this.$notify({
            title: "失败",
            message: "获取管理员数据失败",
            type: "error",
          });
        }
      })
    },

    handleSizeChange(limit) {  // 条数设置
      this.adminsSetting.limit = limit
      this.adminsList(this.adminsSetting.limit, this.adminsSetting.offset)
    },

    handleCurrentChange(offset) {  // 页数设置
      this.adminsSetting.offset = offset
      this.adminsList(this.adminsSetting.limit, this.adminsSetting.offset)
    }
  },
  created () {
    this.$store.state.breadList = ['数据管理','管理员列表']
    this.$store.state.tabbarIndex = '2-5'
    getAdminCount().then(res => {  // 获取总数
      this.adminsSetting.total = res.data.count
    })
    this.adminsList(this.adminsSetting.limit, this.adminsSetting.offset)
  }
}

</script>
<style scoped>
.userImg{
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
}
.el-pagination{
  margin-top: 15px;
}
</style>