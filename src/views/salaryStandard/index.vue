<!-- 薪酬标准/套档 -->

<template>
  <mm-atp palign="right">
    <template v-slot:action-left>
      <el-input
        placeholder="关键词搜索"
        v-model="query.keyword"
        @keyup.enter.native="getList"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="getList"
        ></el-button>
      </el-input>
    </template>
    <template v-slot:action-right>
      <el-button type="primary" @click="onAdd" v-if="checkButton('add')"
        >新增</el-button
      >
      <el-button
        :disabled="disabledEdit"
        @click="onEdit"
        v-if="checkButton('edit')"
        >修改</el-button
      >
      <el-popover placement="bottom" v-model="ui.remove">
        <el-button
          slot="reference"
          :disabled="disabledRemove"
          v-if="checkButton('remove')"
          >删除</el-button
        >
        <p>确定要删除吗？</p>
        <div style="text-align: right;">
          <el-button
            size="mini"
            type="danger"
            :disabled="disabledRemove"
            @click="onRemove"
            >确定</el-button
          >
        </div>
      </el-popover>
    </template>
    <template v-slot:table>
      <el-table
        border
        height="100%"
        :data="tableData"
        highlight-current-row
        @current-change="onCurrentChange"
        @selection-change="onSelectionChange"
        v-loading="ui.tableLoading"
      >
        <el-table-column show-overflow-tooltip type="expand">
          <template slot-scope="props">
            <div style="overflow:auto;">
              <table style="width:100%;">
                <thead>
                  <tr>
                    <th></th>
                    <th v-for="(c, ci) in props.row._detailCol" :key="ci">
                      {{ c }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(r, ri) in props.row._detailRow" :key="ri">
                    <td>{{ r }}</td>
                    <td v-for="(c, ci) in props.row._detailCol" :key="ci">
                      {{ props.row._detail[ri][ci] }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip type="selection">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          type="index"
          label="序号"
        ></el-table-column>
        <el-table-column show-overflow-tooltip prop="F_Name" label="名称">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="F_SalaryItemName"
          label="影响薪酬项目"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="F_CreateDate"
          label="创建时间"
        >
          <template slot-scope="scope">
            {{ scope.row.F_CreateDate | date("YYYY-MM-DD") }}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="F_CreateName"
          label="创建人"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="F_ModifyDate"
          label="修改时间"
        >
          <template slot-scope="scope">
            {{ scope.row.F_ModifyDate | date("YYYY-MM-DD") }}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="F_ModifyName"
          label="修改人"
        >
        </el-table-column>
        <el-table-column show-overflow-tooltip label="是否启用">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.F_EnableMark"
              active-color="#409eff"
              inactive-color="#c4c4c4"
              :active-value="true"
              :inactive-value="false"
              @click.stop.native
              @change="onChange($event, scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <template v-slot:pagination>
      <el-pagination
        background
        layout="prev, pager, next,jumper"
        :page-size.sync="pagination.size"
        :current-page.sync="pagination.current"
        :total.sync="pagination.total"
        @current-change="getList"
      ></el-pagination>
    </template>
  </mm-atp>
</template>

<script>
import { querySalaryStandard } from "@/utils/api";
import checkPermission from "@/utils/checkPermission";

export default {
  name: "salaryStandard",
  data() {
    return {
      query: {
        keyword: ""
      },
      formType: "add",
      tableData: [],
      tableSelectionData: [],
      pagination: {
        current: 1,
        total: 1,
        size: 20
      },
      ui: {
        add: false,
        remove: false,
        tableLoading: false
      }
    };
  },
  mixins: [checkPermission],
  computed: {
    disabledEdit() {
      return this.tableSelectionData.length === 1 ? false : true;
    },
    disabledRemove() {
      return this.tableSelectionData.length > 0 ? false : true;
    }
  },
  methods: {
    onSelectionChange(val) {
      this.tableSelectionData = val;
    },
    onCurrentChange() {},
    async onEdit() {
      this.closeAddTab();
      await this.$nextTick();

      this.$router.replace({
        name: "salaryStandardEdit",
        query: {
          id: this.tableSelectionData[0].F_Id
        }
      });
    },
    async onAdd() {
      this.closeAddTab();
      await this.$nextTick();

      this.$router.replace({
        name: "salaryStandardAdd"
      });
    },
    async onChange(a, b) {
      await this.$_request({
        url: "/HR/Stand/UpdateState",
        method: "post",
        params: {
          ids: b.F_Id,
          F_States: a === true ? 1 : 0
        }
      });

      this.$message({
        message: "状态修改成功",
        type: "success"
      });
    },
    closeAddTab() {
      this.$store.commit("tabView/removeTab", {
        tab: {
          name: "salaryStandardAdd"
        }
      });

      this.$store.commit("tabView/removeTab", {
        tab: {
          name: "salaryStandardEdit"
        }
      });
    },
    async onRemove() {
      await this.$_request({
        url: "/HR/Stand/Del",
        method: "post",
        params: {
          ids: this.tableSelectionData.map(x => x.F_Id).join()
        }
      });

      this.ui.remove = false;
      this.getList();
    },
    async getList() {
      this.ui.tableLoading = true;

      try {
        let resData = await querySalaryStandard({
          queryJson_S: JSON.stringify({
            query: this.query.keyword
          }),
          queryJson: "",
          orderJson: "",
          pageIndex: this.pagination.current,
          pageSize: this.pagination.size
        });

        this.tableData = resData.data.map(x => {
          let d = {};
          let dc = {};
          let dr = {};

          (x.F_Detail || []).forEach(e => {
            if (!d[e.F_RowId]) {
              d[e.F_RowId] = {};
            }
            d[e.F_RowId][e.F_ColId] = e.F_Value;
            dr[e.F_RowId] = e.F_RowIdZName || "（不存在）";
            dc[e.F_ColId] = e.F_ColIdZName || "（不存在）";
          });

          x._detail = d;
          x._detailRow = dr;
          x._detailCol = dc;

          return x;
        });
        this.pagination.total = resData.record || 1;
      } finally {
        this.ui.tableLoading = false;
      }
    }
  },
  created() {
    this.getList();
    this.$_eventBus.$on("salaryStandardAdd", this.getList);
  },
  beforeDestroy() {
    this.$_eventBus.$off("salaryStandardAdd", this.getList);
  }
};
</script>

<style lang="scss" module>
.table {
  empty-cells: show;
  border: 1px solid #cbcbcb;
  border-collapse: collapse;
  border-spacing: 0;
  thead {
    color: #000;
    text-align: left;
    vertical-align: bottom;
    th {
      background-color: #e0e0e0;
    }
  }
  th:first-child {
    border-left-width: 0;
  }
  th {
    padding: 0.5em 1em;
    border-left: 1px solid #cbcbcb;
    border-width: 0 0 0 1px;
    font-size: inherit;
    margin: 0;
    overflow: visible;
  }
  td:first-child {
    border-left-width: 0;
  }
  td {
    padding: 0.5em 1em;
    background-color: transparent;
    border-left: 1px solid #cbcbcb;
    border-width: 0 0 0 1px;
    font-size: inherit;
    margin: 0;
    overflow: visible;
  }
}
</style>
