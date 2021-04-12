<template>
  <g-bf :visible.sync="isShow" @close="onClose" v-loading="ui.loading">
    <el-table border :data="tableData">
      <el-table-column show-overflow-tooltip label="序号" type="index">
      </el-table-column>
      <el-table-column show-overflow-tooltip label="社保项" prop="F_ItemName">
      </el-table-column>
      <el-table-column show-overflow-tooltip label="计算类型" prop="F_Type">
        <template slot-scope="scope">
          {{ scope.row.F_Type === 0 ? "固定值" : "公式" }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="计算公式" prop="F_Formulas">
      </el-table-column>
      <el-table-column show-overflow-tooltip label="缴纳基数" prop="F_PayBase">
      </el-table-column>
      <el-table-column show-overflow-tooltip label="基数下限" prop="F_MinValue">
      </el-table-column>
      <el-table-column show-overflow-tooltip label="基数上限" prop="F_MaxValue">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="单位缴纳比例"
        prop="F_ComPayRatio"
      >
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="个人缴纳笔记"
        prop="F_PerPayRatio"
      >
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="公司调整值"
        prop="F_ComAdjust"
      >
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="个人调整值"
        prop="F_PerAdjust"
      >
      </el-table-column>
    </el-table>
  </g-bf>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    currentRow: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  computed: {
    isShow: {
      get() {
        return this.visible;
      },
      set(n) {
        this.$emit("update:visible", n);
      }
    }
  },
  data() {
    return {
      tableData: [],
      ui: {
        loading: false
      }
    };
  },
  watch: {
    currentRow() {
      this.get();
    }
  },
  methods: {
    onClose() {
      this.ui.loading = false;
      this.$emit("close");
    },
    async get() {
      if (!this.currentRow || !this.currentRow.F_Id) return;

      this.ui.loading = true;

      let res = await this.$_request({
        url: "/HR/InsurancePlan/GetSingle",
        method: "get",
        params: {
          id: this.currentRow.F_Id
        }
      });

      this.tableData = res.data.data.F_Detail;
      this.ui.loading = false;
    }
  }
};
</script>
