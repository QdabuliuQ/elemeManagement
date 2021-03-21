<template>
  <div id="ChartsDetail">
    <el-card class="box-card">
      <div class="chartView"></div>
    </el-card>
  </div>
</template>

<script>
import { getUserChart } from "network/ChartsDetail";
export default {
  name: "ChartsDetail",
  data() {
    return {
      list: [],
    };
  },
  created() {
    this.$store.state.breadList = ["图表", "用户分布"];
    this.$store.state.tabbarIndex = "4-1";
    getUserChart().then((res) => {
      let cityName = ''
      for (const item in res.data.user_city) {
        switch (item) {
          case 'beijing':
            cityName = '北京'
            break;
          case 'shanghai':
            cityName = '上海'
            break;
          case 'shenzhen':
            cityName = '深圳'
            break;
          case 'hangzhou':
            cityName = '杭州'
            break;
          case 'qita':
            cityName = '其他'
            break;
          default:
            break;
        }
        this.list.push({
          value: res.data.user_city[item],
          name: cityName,
        });
      }
      this.setChart();
    });
  },
  methods: {
    setChart() {
      let echarts = require("echarts");
      let myChart = echarts.init(
        document.getElementsByClassName("chartView")[0]
      );
      myChart.setOption({
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "5%",
          left: "center",
        },
        series: [
          {
            name: "用户分布",
            type: "pie",
            radius: ["40%", "80%"],
            avoidLabelOverlap: false,
            center: ['50%', '55%'],
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            labelLine: {
              show: false,
            },
            data: this.list,
          },
        ],
      });
    },
  },
  mounted() {},
};
</script>
<style scoped>
.chartView {
  width: 800px;
  height: 450px;
  margin: 0 auto;
}
</style>