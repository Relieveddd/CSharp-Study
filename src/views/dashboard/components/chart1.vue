<template>
  <c-box :title="title">
    <div ref="chart"></div>
  </c-box>
</template>

<script>
import CBox from "./box";
import G2 from "@antv/g2";

export default {
  props: {
    title: {
      type: String,
      default: ""
    },
    data: {
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
      chart: null
    };
  },
  watch: {
    data() {
      this.setData();
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
    }
  },
  mounted() {
    this.initChart();
  },
  beforeDestroy() {
    this.destroyChart();
  }
};
</script>
