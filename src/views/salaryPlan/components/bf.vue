<template>
  <g-bf :visible.sync="isShow" @close="onClose" v-loading="ui.loading">
    <el-table border :data="tableData">
      <el-table-column show-overflow-tooltip label="序号" type="index">
      </el-table-column>
      <el-table-column show-overflow-tooltip label="名称" prop="F_Name">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="项类型"
        prop="F_ItemTypeName"
      >
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="计薪类型"
        prop="F_CalculationTypeName"
      >
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="小数点格式"
        prop="F_DecFormat"
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
        url: "/HR/SalaryPlan/GetSingle",
        method: "get",
        params: {
          id: this.currentRow.F_Id
        }
      });

      this.tableData = res.data.data.F_Details;
      this.ui.loading = false;
    }
  }
};
</script>
