<template>
  <el-dialog
    title="选择人员"
    :visible.sync="isShow"
    @opened="onOpened"
    :append-to-body="appendToBody"
    width="800px"
  >
  <el-row>
    <el-col  :span="5">
      <el-input
        size="mini"
        placeholder="关键词搜索"
        v-model="query.keyword"
        @keyup.enter.native="getList"
        >
        <el-button 
        icon="el-icon-search" 
        slot="append"
        @click="getList">
        </el-button>
      </el-input>
    </el-col>
  </el-row>
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
              <el-table-column show-overflow-tooltip prop="F_Sex" label="性别">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="F_EducationZName"
                label="文化程度"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="F_NationZName"
                label="民族"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="F_BirthDay"
                label="出生日期"
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
import { queryPersonnel } from "@/utils/api";
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
      },
      query: {
        keyword: ''
      },
      localTableSelectionData: []
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
        url: "/HR/Emp/EmpList",
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
        return !this.preList.includes(x.F_EmpID);
      });

      await this.$nextTick();

      this.ui.loading = false;
    },
    onNodeClick(data) {
      this.getPersonnelList(data.F_DepName);
    },
    onSelectionChange(val) {
      // this.localTableSelectionData = this.localTableSelectionData.concat(val)
      this.tableSelectionData = this.tableSelectionData.concat(val);
    },
    closeSelf() {
      this.isShow = false;
    },
    async onOk() {  
      let hash = {};
      let arr=[]
      this.tableSelectionData = this.tableSelectionData.reduce(function(item, next) {
          hash[next.F_EmpID] ? '' : hash[next.F_EmpID] = true && item.push(next);
          return item
      }, [])
      this.$emit("ok", this.tableSelectionData);
      this.closeSelf();
      this.tableSelectionData = [];
    },
    async onOpened() {
      await this.$nextTick();

      this.$refs.table.clearSelection();

      this.tableData = this.resData.filter(x => {
        return !this.preList.includes(x.F_EmpID);
      });
    },
    //////////////////////渲染选中的列表//////
    showDepartment(depart) {
      if(depart&&depart.length>0){
        this.departmentList = depart;
      }
    },
    // 添加模糊搜索
    async getList() {
      this.ui.loading = true;
      try {
        let resData = await queryPersonnel({
          queryJson_S: JSON.stringify({
            query: this.query.keyword
          }),
          queryJson: "",
          orderJson: "",
          pageSize: 9999
        });
        this.tableData = resData.data;
      } finally {
        this.ui.loading = false;
      }
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
