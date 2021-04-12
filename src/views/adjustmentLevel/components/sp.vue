<template>
  <el-dialog
    title="选择人员"
    :visible.sync="isShow"
    @opened="onOpened"
    :append-to-body="appendToBody"
    width="800px"
  >
    <mm-atp v-loading="ui.loading">
      <template v-slot:table>
        <div :class="$style['wrap']">
          <div :class="$style['left']">
            <el-tree
              :data="departmentList"
              :props="{
                label: 'F_DepName',
                children: 'Child'
              }"
              @node-click="onNodeClick"
            ></el-tree>
          </div>
          <div :class="$style['right']">
            <el-table
              border
              :data="tableData"
              @selection-change="onSelectionChange"
              ref="table"
            >
              <el-table-column show-overflow-tooltip type="selection">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                type="index"
                label="序号"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="F_EmpName"
                label="姓名"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="F_DepName"
                label="部门名称"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="F_PostName"
                label="岗位名称"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="F_JobName"
                label="职务名称"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="F_OldJobLev"
                label="原职位等级"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="F_ProJobLev"
                label="建议职位等级"
              >
              </el-table-column>
            </el-table>
          </div>
        </div>
      </template>
    </mm-atp>
    <span slot="footer">
      <el-button @click="closeSelf">取 消</el-button>
      <el-button type="primary" @click="onOk">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "sp",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    preTable: {
      type: Array,
      default() {
        return [];
      }
    },
    appendToBody: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      departmentList: [],
      resData: [],
      tableData: [],
      tableSelectionData: [],
      pre: [],
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
    },
    preList() {
      return this.preTable;
    }
  },
  methods: {
    async getDepartmentList() {
      this.ui.loading = true;

      let res = await this.$_request({
        url: "/HR/Department/GetTreeStructure"
      });

      this.departmentList = res.data.data;
      this.ui.loading = false;
    },
    async getPersonnelList(dname) {
      this.ui.loading = true;

      let res = await this.$_request({
        url: "/HR/LevAdjust/GetEmpList",
        method: "post",
        data: {
          queryJson_S: "",
          queryJson: JSON.stringify({
            f_DepName: dname
          }),
          orderJson: "",
          pageIndex: 1,
          pageSize: 9999
        }
      });

      this.resData = res.data.data || [];
      this.tableData = this.resData.filter(x => {
        return !this.preList.includes(x.F_EmpId);
      });

      await this.$nextTick();

      this.ui.loading = false;
    },
    onNodeClick(data) {
      this.getPersonnelList(data.F_DepName);
    },
    onSelectionChange(val) {
      this.tableSelectionData = val;
    },
    closeSelf() {
      this.isShow = false;
    },
    async onOk() {
      this.$emit("ok", this.tableSelectionData);
      this.closeSelf();
    },
    async onOpened() {
      await this.$nextTick();

      this.$refs.table.clearSelection();

      this.tableData = this.resData.filter(x => {
        return !this.preList.includes(x.F_EmpId);
      });
    }
  },
  created() {
    this.getDepartmentList();
  }
};
</script>

<style lang="scss" module>
.wrap {
  display: flex;
  max-height: 50vh;
  .left {
    overflow: auto;
    flex: none;
    margin-right: 16px;
    padding-right: 16px;
    border-right: solid 1px #dcdfe6;
    width: 150px;
  }
  .right {
    overflow: auto;
    flex: 1;
  }
}
</style>
