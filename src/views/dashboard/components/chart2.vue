<template>
  <c-box :title="title">
    <template v-slot:header>
      <el-select
        v-model="query.rylb"
        placeholder="人员类别"
        value-key="F_ItemDetailId"
        clearable
      >
        <el-option
          v-for="(item, index) in rylbList"
          :key="index"
          :label="item.F_ItemName"
          :value="item.F_ItemDetailId"
        >
        </el-option>
      </el-select>
    </template>
    <template v-slot:default>
      <div ref="chart"></div>
    </template>
  </c-box>
</template>

<script>
import CBox from "./box";
import G2 from "@antv/g2";

const titleList = {
  1: "学历分析",
  2: "婚姻状况分析",
  3: "年龄分析",
  4: "级别人数分析",
  5: "籍贯分析",
  6: "性别分析"
};

export default {
  props: {
    type: {
      type: String,
      default: ""
    },
    chartType: {
      type: String,
      default: "rect"
    },
    rylbList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  components: {
    CBox
  },
  data() {
    return {
      chart: null,
      data: [],
      query: {
        rylb: ""
      }
    };
  },
  computed: {
    title() {
      if (this.type) {
        return titleList[this.type] || "";
      } else {
        return "";
      }
    }
  },
  watch: {
    data() {
      this.setData();
    },
    query: {
      handler() {
        this.get();
      },
      deep: true
    }
  },
  methods: {
    initChart() {
      let chart = new G2.Chart({
        container: this.$refs.chart,
        forceFit: true,
        height: 200,
        padding: "auto"
      });

      chart.source([]);

      if (this.chartType === "rect") {
        chart.scale("sales", {
          tickInterval: 20
        });
        chart.scale("value", {
          alias: "人数"
        });
        chart.interval().position("type*value");
      } else {
        chart.coord("theta", {
          radius: 1,
          innerRadius: 0.6
        });

        chart.tooltip({
          showTitle: false
        });

        chart
          .intervalStack()
          .position("value")
          .color("type");
      }

      chart.render();

      this.chart = chart;
    },
    destroyChart() {
      if (this.chart) {
        this.chart.destroy();
      }
    },
    setData() {
      if (this.data.length) {
        this.chart.changeData(
          this.data.map(x => {
            return Object.assign(x, {
              value: Number(x.value)
            });
          })
        );
      }
    },
    async get() {
      if (!this.type) return;

      let res = await this.$_request({
        url: "/HR/Tip/GetIndexConditionTip",
        method: "post",
        params: {
          tipType: this.type
        },
        data: {
          pType: this.query.rylb
        }
      });

      this.data = res.data.data;
    }
  },
  async mounted() {
    this.initChart();
    this.get();
  },
  beforeDestroy() {
    this.destroyChart();
  }
};
</script>
