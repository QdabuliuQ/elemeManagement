<template>
  <div id="UserDetail">
    <el-card class="box-card">
      <div class="title">数据统计</div>
      <div class="detailBox">
        <div class="today">
          <div class="titleBox">当天数据：</div>
          <div class="dataBox">
            <span>{{ detail.userAdd }}</span>
            新增用户
          </div>
          <div class="dataBox">
            <span>{{ detail.orderNum }}</span>
            新增订单
          </div>
          <div class="dataBox">
            <span>{{ detail.adminNum }}</span>
            新增管理员
          </div>
        </div>
        <div class="sum">
          <div class="titleBox">总数据：</div>
          <div class="dataBox">
            <span>{{ detail.userSum }}</span>
            注册用户
          </div>
          <div class="dataBox">
            <span>{{ detail.orderSum }}</span>
            订单总量
          </div>
          <div class="dataBox">
            <span>{{ detail.adminSum }}</span>
            管理员总数
          </div>
        </div>
      </div>
      <div class="echartsView">
        <div class="eachrts"></div>
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  getUserCountToday,
  getOrderCountToday,
  getAdminCountToday,
  getUserCount,
  getOrderCount,
  getAdminCount,
} from "network/UserDetail";
export default {
  name: "UserDetail",
  data() {
    return {
      detail: {  // 基础数据
        userAdd: 0,
        orderNum: 0,
        adminNum: 0,
        userSum: 0,
        orderSum: 0,
        adminSum: 0
      },
      echartsDetail: {  // 图表数据
        xaxisDetail: [],
        userDetail: [],
        orderDetail: [],
        adminDetail: [],
      },
      setEchartsFlag: {
        index: 0
      }
    };
  },
  methods: {
    // 获取图表数据
    getEchartData() {
      let d = new Date(); // 获取日期发起请求
      let month = (d.getMonth() + 1 + "").padStart(2, "0");
      let day = (d.getDate() + "").padStart(2, "0");
      let time = d.getFullYear() + "-" + month + "-" + day;
      for (let i = 0; i < 12; i++) {  // 遍历查找12天前的数据
        this.echartsDetail.xaxisDetail.unshift(this.getTime(i))
        let time = this.getTime(i, true)
        getUserCountToday(time).then(res => {
          this.echartsDetail.userDetail.unshift(res.data.count)
        })
        getOrderCountToday(time).then(res => {
          this.echartsDetail.orderDetail.unshift(res.data.count)
        })
        getAdminCountToday(time).then(res => {
          this.echartsDetail.adminDetail.unshift(res.data.count)
        })
      }
    },

    // 获取当前日期的前n天
    getTime(length, showYear = false) {
      var time = new Date().getTime() - 24 * 60 * 60 * 1000 * length;
      var yesday = new Date(time); // 获取的是前几天日期
      if (showYear) {
        yesday = yesday.getFullYear() + "-" +  (yesday.getMonth() >= 9 ? yesday.getMonth() + 1 : "0" + (yesday.getMonth() + 1)) +
        "-" + (yesday.getDate() > 9 ? yesday.getDate() : "0" + yesday.getDate()); //字符串拼接转格式：例如2018-08-19
      } else {
        yesday = (yesday.getMonth() >= 9 ? yesday.getMonth() + 1 : "0" + (yesday.getMonth() + 1)) +
        "-" + (yesday.getDate() > 9 ? yesday.getDate() : "0" + yesday.getDate()); //字符串拼接转格式：例如2018-08-19
      }
      return yesday;
    },

    // 设置echarts属性
    setEcharts() {
      let echarts = require("echarts");
      let myChart = echarts.init(document.getElementsByClassName("eachrts")[0]);
      myChart.setOption({
        title: {
          text: "各项数据走势图",
        },
        grid: {
          top: "10%",
          left: "5%",
          right: "5%",
          bottom: "5%",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["新增用户", "新增订单", "新增管理员"],
        },
        toolbox: {
          show: true,
          feature: {
            magicType: { show: true, type: ["line", "bar"] },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        xAxis: [
          {
            type: "category",
            data: this.echartsDetail.xaxisDetail
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "新增用户",
            type: "bar",
            emphasis: {
              focus: "series",
            },
            data: this.echartsDetail.userDetail
          },
          {
            name: "新增订单",
            type: "bar",
            emphasis: {
              focus: "series",
            },
            data: this.echartsDetail.orderDetail
          },
          {
            name: "新增管理员",
            type: "bar",
            emphasis: {
              focus: "series",
            },
            data: this.echartsDetail.adminDetail
          },
        ],
      });
      this.$notify({
        title: '成功',
        message: '获取图表信息成功',
        type: 'success'
      });
    }
  },
  watch: {
    // 用监听属性监听三个数据是否全部获取完整，获取完整后再调用setEcharts方法创建图表
    "echartsDetail.userDetail": function(val) {
      if (val.length == 12) {
        this.setEchartsFlag.index += 12
      }
    },
    "echartsDetail.orderDetail": function(val) {
      if (val.length == 12) {
        this.setEchartsFlag.index += 12
      }
    },
    "echartsDetail.adminDetail": function(val) { 
      if (val.length == 12) {
        this.setEchartsFlag.index += 12
      }
    },
    // 监听索引 当索引==36的时候表示所有数据获取完毕
    "setEchartsFlag.index": function(val) {
      if (val == 36) {
        // 调用方法设置图表
        this.setEcharts()
      }
    }
  },
  created() {
    this.getEchartData()  // 获取图表数据

    this.$store.state.breadList = ['首页','数据统计']

    let d = new Date(); // 获取日期发起请求
    let month = (d.getMonth() + 1 + "").padStart(2, "0");
    let day = (d.getDate() + "").padStart(2, "0");
    let time = d.getFullYear() + "-" + month + "-" + day;
    getUserCountToday(time).then((res) => {
      // 获取当天用户注册量
      this.detail.userAdd = res.data.count;
    });

    getOrderCountToday(time).then((res) => {
      // 获取订单数量
      this.detail.orderNum = res.data.count;
    });

    getAdminCountToday(time).then((res) => {
      // 获取管理员数量
      this.detail.adminNum = res.data.count;
    });

    getUserCount().then((res) => {
      // 获取用户总数
      this.detail.userSum = res.data.count;
    });

    getOrderCount().then((res) => {
      // 获取订单总数
      this.detail.orderSum = res.data.count;
    });

    getAdminCount().then((res) => {
      // 获取管理员总数
      this.detail.adminSum = res.data.count;
    });
  },
  mounted() {
    
  },
};
</script>
<style scoped>
.title {
  font-size: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}
.today {
  width: 100%;
  height: 40px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}
.sum {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
}
.titleBox {
  width: 120px;
  height: 100%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background-color: var(--bgc);
  float: left;
  font-weight: 550;
}
.dataBox {
  padding: 5px 16px;
  background-color: rgb(255, 255, 255);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin-left: 20px;
  font-size: 13.5px;
}
.dataBox span {
  font-size: 30px;
  color: var(--bgc);
  font-weight: 550;
  margin-right: 4px;
  position: relative;
  top: 2px;
}
.echartsView {
  width: 100%;
  height: 400px;
  margin-top: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.eachrts {
  width: 850px;
  height: 100%;
}
</style>