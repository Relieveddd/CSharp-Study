<template>
  <el-dialog
    title="明细"
    :visible.sync="isShow"
    @closed="onClosed"
    @open="onOpen"
  >
    <mm-atp v-loading="ui.loading">
      <template v-slot:table>
        <el-table border :data="tableData">
          <el-table-column show-overflow-tooltip label="序号" type="index">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="F_CostTypeZName"
            label="费用类型"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="F_id"
            label="部门"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="F_CostValue"
            label="费用"
          >
          </el-table-column>
        </el-table>
      </template>
    </mm-atp>
    <span slot="footer">
      <el-button @click="closeSelf" style="margin-right:16px;">关 闭</el-button>
    </span>
  </el-dialog>
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
  data() {
    return {
      tableData: [],
      ui: {
        loading: false
      }
    };
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
  methods: {
    async onOpen() {
      this.get();
    },
    closeSelf() {
      this.isShow = false;
    },
    onClosed() {
      this.keyword = "";
    },
    async get() {
      if (!this.currentRow || !this.currentRow.F_Id) return;

      this.ui.loading = true;

      let res = await this.$_request({
        url: "/HR/SalaryCost/GetSingle",
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
