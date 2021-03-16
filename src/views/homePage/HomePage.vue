<template>
  <div id="HomePage">
    <el-container>
      <el-aside width="200px">
        <el-col :span="24">
          <el-menu
            :default-active="$store.state.tabbarIndex"
            class="el-menu-vertical-demo"
            background-color="#242424"
            text-color="#fff"
            active-text-color="#3d98ff"
            :unique-opened='true'
          >
            <!-- 首页 -->
            <el-menu-item @click="homePage" index="1">
              <i class="el-icon-menu"></i>
              <span>首页</span>
            </el-menu-item>
            <!-- 数据管理 -->
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-tickets"></i>
                <span>数据管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item @click="usersPage" index="2-1">用户列表</el-menu-item>
                <el-menu-item @click="shopsPage" index="2-2">商家列表</el-menu-item>
                <el-menu-item @click="foodsPage" index="2-3">食品列表</el-menu-item>
                <el-menu-item index="2-4">订单列表</el-menu-item>
                <el-menu-item index="2-5">管理员列表</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <!-- 添加数据 -->
            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-circle-plus-outline"></i>
                <span>添加数据</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="3-1">添加商铺</el-menu-item>
                <el-menu-item index="3-2">添加商品</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="4">
              <template slot="title">
                <i class="el-icon-picture-outline"></i>
                <span>图表</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="4-1">用户分布</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-col>
      </el-aside>
      <el-main>
        <div class="navTitle">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="item,index in breads" :key="index">{{item}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "HomePage",
  data () {
    return {
      breads: [],
      activeIndex: '1'
    }
  },
  computed: {
    breadList: function(){
      return this.$store.state.breadList
    }
  },
  watch: {
    breadList: function(val) {
      this.breads = val
    }
  },
  methods: {
    usersPage(){  // 用户列表
      this.$router.push('/usersPage')
      this.$store.state.tabbarIndex = '2-1'
    },

    homePage(){  // 首页
      this.$router.push('/userDetial')
      this.$store.state.tabbarIndex = '1'
    },

    shopsPage() {  // 商店页面
      this.$router.push('/shopsPage')
      this.$store.state.tabbarIndex = '2-2'
    },

    foodsPage() {
      this.$router.push('/foodsPage/' + null)
      this.$store.state.tabbarIndex = '2-3'
    }
  },
  created () {
    if (sessionStorage.getItem('token') == null) {
      this.$router.push('/loginPage')
    }
  }
};
</script>
<style scoped>
#HomePage {
  height: 100vh;
}
.el-container{
  width: 100%;
  height: 100%;
}
.el-menu{
  width: 100%;
  overflow: hidden;
}
.el-aside{
  height: 100%;
  background-color: #242424;
  overflow: hidden;
}
.navTitle{
  width: 100%;
  height: 60px;
  background-color: #fff;
  box-shadow: 0 0 10px 2px rgba(0,0,0,.1);
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.el-breadcrumb{
  margin-left: 20px;
}
</style>