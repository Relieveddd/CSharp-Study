<template>
  <el-dialog
    :visible.sync="isShow"
    title="员工列表"
    @closed="onClosed"
    @open="onOpen"
    append-to-body
  >
    <div :class="$style['content']" v-loading="ui.loading">
      <el-tree :data="tree" @node-click="onNodeClick"></el-tree>
      <el-table border :data="tableData" @selection-change="onSelectionChange">
        <el-table-column show-overflow-tooltip type="selection">
        </el-table-column>
        <el-table-column show-overflow-tooltip type="index" label="序号">
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="F_EmpName" label="姓名">
        </el-table-column>
      </el-table>
    </div>
    <span slot="footer">
      <el-button @click="closeSelf">取 消</el-button>
      <el-button type="primary" @click="onOk">确 认</el-button>
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
    formType: {
      type: String,
      default: "add"
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
    },
    tableData() {
      return this.currentDepartmentName
        ? this.hash[this.currentDepartmentName] || []
        : [];
    }
  },
  data() {
    return {
      tree: [],
      hash: {},
      currentDepartmentName: "",
      tableSelectionData: [],
      ui: {
        loading: false
      }
    };
  },
  methods: {
    onSelectionChange(val) {
      this.tableSelectionData = val;
    },
    closeSelf() {
      this.isShow = false;
    },
    onClosed() {
      this.tableSelectionData = [];
      this.currentDepartmentName = "";
    },
    async onOpen() {
      this.ui.loading = true;
      await Promise.all([this.getHash(), this.getDepartmentList()]);
      this.ui.loading = false;
    },
    async onOk() {
      this.closeSelf();
      this.$emit("attach", this.tableSelectionData);
    },
    async getHash() {
      let res = await this.$_request({
        url: "/HR/Emp/EmpList",
        method: "post",
        data: {
          queryJson_S: "",
          queryJson: "",
          orderJson: "",
          pageIndex: 1,
          pageSize: 9999
        }
      });

      let hash = {};

      res.data.data.forEach(x => {
        if (!hash[x.F_DepName]) {
          hash[x.F_DepName] = [];
        }

        hash[x.F_DepName].push(x);
      });

      this.hash = hash;
    },
    async getDepartmentList() {
      let res = await this.$_request({
        url: "/HR/Department/List",
        method: "post",
        data: {
          queryJson_S: "",
          queryJson: "",
          orderJson: "",
          pageIndex: 0,
          pageSize: 9999
        }
      });

      this.tree = res.data.data.map(x => {
        return {
          label: x.F_DepName
        };
      });
    },
    async onNodeClick(row) {
      this.tableSelectionData = [];
      this.currentDepartmentName = row.label;
    }
  }
};
</script>

<style lang="scss" module>
.content {
  display: grid;
  grid-column-gap: 16px;
  grid-template-columns: auto 1fr;
}
</style>
