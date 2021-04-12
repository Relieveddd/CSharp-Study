<!-- 绩效评定/绩效评定 -->

<template>
  <mm-atp palign="right" v-loading="ui.loading">
    <template v-slot:action-left>
      <el-date-picker
        v-model="query.year"
        value-format="yyyy"
        type="year"
        placeholder="选择年"
        :clearable="true"
        :class="$style['date']"
        style="width:100px;"
      >
      </el-date-picker>
      <el-select
        v-model="query.month"
        placeholder="选择月"
        :clearable="true"
        style="width:100px;"
      >
        <template v-slot:prefix>
          <span class="el-input__prefix"
            ><i class="el-input__icon el-icon-date"></i
          ></span>
        </template>
        <el-option
          v-for="(item, index) in monthList"
          :key="index"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </template>
    <template v-slot:action-right>
      <el-button type="primary" @click="onAdd" v-if="checkButton('add')"
        >新增</el-button
      >
      <el-button
        @click="onEdit"
        v-if="checkButton('edit')"
        :disabled="disabledEdit"
        >修改</el-button
      >
      <el-button
        @click="onAudit"
        v-if="checkButton('audit')"
        :disabled="disabledEdit"
        >审批</el-button
      >
      <el-button
        @click="onRevoke"
        v-if="checkButton('revoke')"
        :disabled="disabledEdit"
        >作废</el-button
      >
      <el-popover placement="bottom" v-model="ui.remove" v-if="false">
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
            :loading="ui.removeLoading"
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
        @current-change="onCurrentChange"
        @selection-change="onSelectionChange"
      >
        <el-table-column show-overflow-tooltip type="selection">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          type="index"
          label="序号"
        ></el-table-column>
        <el-table-column show-overflow-tooltip prop="F_Status" label="状态">
          <template slot-scope="scope">
            {{ stateList[scope.row.F_Status] }}
          </template>
        </el-table-column>
        <el-table-column
          prop="F_ProTypeZName"
          label="绩效类型"
        ></el-table-column>
        <el-table-column show-overflow-tooltip label="评定年月">
          <template slot-scope="scope">
            {{ scope.row.F_Year }}年 {{ scope.row.F_Month }}月
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="F_CreateDate"
          label="添加时间"
        >
          <template slot-scope="scope">
            {{ scope.row.F_CreateDate | date("YYYY-MM-DD") }}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="F_CreateName"
          label="添加人"
        ></el-table-column>
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
        ></el-table-column>
        <el-table-column show-overflow-tooltip label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="onDetail(scope.row)"
              >明细</el-button
            >
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
    <template v-slot:other>
      <c-add :visible.sync="ui.add" @ok="getList" ref="form"></c-add>
      <c-audit :visible.sync="ui.audit" @ok="getList"></c-audit>
      <c-detail
        :visible.sync="ui.detail"
        :currentRow="currentRow"
        :type="detailType"
        @ok="getList"
      ></c-detail>
    </template>
  </mm-atp>
</template>

<script>
import dayjs from "dayjs";
import CAdd from "./components/add";
import CAudit from "./components/audit";
import CDetail from "./components/detail";
import checkPermission from "@/utils/checkPermission";

export default {
  name: "performance",
  components: {
    CAdd,
    CAudit,
    CDetail
  },
  mixins: [checkPermission],
  data() {
    return {
      query: {
        year: "",
        month: ""
      },
      tableData: [],
      tableSelectionData: [],
      currentRow: null,
      detailType: "audit",
      pagination: {
        current: 1,
        total: 1,
        size: 20
      },
      ui: {
        add: false,
        remove: false,
        loading: false,
        removeLoading: false,
        audit: false,
        revoke: false,
        revokeLoading: false,
        auditLoading: false,
        detail: false
      },
      stateList: {
        "-1": "删除",
        0: "未审核",
        1: "已审核",
        9: "已作废"
      }
    };
  },
  watch: {
    query: {
      handler: function() {
        this.getList();
      },
      deep: true
    }
  },
  computed: {
    monthList() {
      let array = [];

      for (let index = 1; index <= 12; index++) {
        array.push({
          label: `${index}月`,
          value: `${index}`
        });
      }

      return array;
    },
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
    onAdd() {
      this.formType = "add";
      this.ui.add = true;
    },
    async onEdit() {
      let id = this.tableSelectionData[0].F_Id;

      let res = await this.$_request({
        url: "/HR/SalaryProperty/GetSingle",
        method: "get",
        params: {
          id: id
        }
      });

      let data = res.data.data;

      Object.assign(this.$refs.form.form, {
        id: data.F_Id,
        type: {
          F_ItemDetailId: data.F_ProType
        },
        yearMonth: `${data.F_Year},${data.F_Month}`,
        detailList: data.F_Detail.map(x => {
          return {
            personalId: x.F_EmpId,
            personalName: x.F_EmpName,
            departmentName: x.F_DepName,
            positionName: x.F_Job,
            levelName: x.F_Lev,
            result: x.F_Result,
            bonus: x.F_Bonus,
            overtimePay: x.F_OverTime,
            deduction: x.F_KouFa,
            remark: x.F_ReMark
          };
        })
      });
      this.formType = "edit";
      this.$refs.form.ui.fullscreen = true;
      this.ui.add = true;
    },
    async onDetail(row) {
      if (row) {
        this.currentRow = row;
        this.detailType = "detail";
        this.ui.detail = true;
      }
    },
    async onRemove() {
      this.ui.removeLoading = true;

      try {
        await this.$_request({
          url: "/HR/SalaryProperty/States",
          method: "post",
          params: {
            ids: this.tableSelectionData.map(x => x.F_Id).join(","),
            state: -1
          }
        });

        await this.getList();
      } finally {
        this.ui.remove = false;
        this.ui.removeLoading = false;
      }
    },
    async onRevoke() {
      this.currentRow = this.tableSelectionData[0];
      this.detailType = "revoke";
      this.ui.detail = true;
    },
    async onAudit() {
      this.currentRow = this.tableSelectionData[0];
      this.detailType = "audit";
      this.ui.detail = true;
    },
    async onCheck() {
      let id = this.tableSelectionData[0].F_Id;

      await this.$_request({
        url: "/HR/SalaryProperty/Audit",
        method: "post",
        params: {
          F_Id: id
        }
      });
    },
    async getList() {
      this.ui.loading = true;

      try {
        let res = await this.$_request({
          url: "/HR/SalaryProperty/List",
          method: "post",
          data: {
            queryJson_S: "",
            queryJson: JSON.stringify({
              f_Year: this.query.year || "",
              f_Month: this.query.month
            }),
            orderJson: "",
            pageIndex: this.pagination.current,
            pageSize: this.pagination.size
          }
        });

        this.tableData = res.data.data;
      } finally {
        this.ui.loading = false;
      }
    }
  },
  created() {
    let nowDate = dayjs().subtract(1, "month");

    Object.assign(this.query, {
      year: `${nowDate.year()}`,
      // month: `${nowDate.month() + 1}`
    });
  }
};
</script>

<style lang="scss" module>
.bottomInfo {
  display: flex;
  background: #e1e3e6;
  padding: 16px;
  justify-content: space-between;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 12px;
}
</style>
