<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style>
#app {
  min-width: 1200px;
  overflow-x: hidden !important;
  height: 100vh;
  width: 100vw;
}
.el-dialog{
  min-width: 550px;
}
.el-table__header tr,
.el-table__header th {
padding: 0;
height: 18px;
line-height: 18px;
}
.el-table__body tr,
.el-table__body td {
padding: 0;
height: 18px;
line-height: 18px;
}
.el-table__empty-block{
  min-height: 50px !important;
  height: 50px !important;
}
</style>
