<!-- 工资表 -->

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
      <el-button
        @click="onGenerate"
        type="primary"
        v-if="checkButton('generate')"
        >生 成</el-button
      >
      <el-button
        v-if="checkButton('audit')"
        @click="onAudit"
        :disabled="disabledReview"
        >审核</el-button
      >
      <el-button
        @click="onExport"
        type="primary"
        :loading="ui.exportLoading"
        v-if="checkButton('export')"
        >导 出</el-button
      >
      <el-button
        v-if="checkButton('give')"
        @click="onConfirm"
        :disabled="disabledEdit"
        >发放</el-button
      >
      <el-button
        v-if="checkButton('revoke')"
        @click="onRevoke"
        :disabled="disabledRemove"
        >作废</el-button
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
        ref="table"
        @selection-change="onSelectionChange"
        size="small"
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
          prop="F_State_text"
          label="状态"
        ></el-table-column>
        <el-table-column show-overflow-tooltip prop="F_PType" label="人员类别">
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="F_YearMonth" label="年月">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="F_CreateDate"
          label="创建时间"
        >
          <template v-slot="scope">
            {{ scope.row.F_CreateDate | date("YYYY-MM-DD HH:mm:ss") }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="onCurrentChange(scope.row)"
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
      <c-generate :visible.sync="ui.generate" @ok="getList"></c-generate>
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
import checkPermission from "@/utils/checkPermission";
import CGenerate from "./components/generate";
import CDetail from "./components/detail";

export default {
  name: "generateWage",
  mixins: [checkPermission],
  components: {
    CGenerate,
    CDetail
  },
  data() {
    return {
      query: {
        year: "",
        month: ""
      },
      tableData: [],
      tableSelectionData: [],
      currentRow: null,
      detailType: "",
      pagination: {
        current: 1,
        total: 1,
        size: 20
      },
      ui: {
        generate: false,
        tableLoading: false,
        detail: false,
        bf: false,
        loading: false,
        remove: false,
        removeLoading: false,
        exportLoading: false
      }
    };
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
      let disabled = true
      if(this.tableSelectionData.length === 1){
        disabled = this.tableSelectionData[0].F_State === 1 ? false : true
        if(this.tableSelectionData[0].F_State === 2){
          disabled = true
        }
      }
      return disabled
    },
    disabledReview() {
      let disabled = true
      if(this.tableSelectionData.length === 1){
          disabled = this.tableSelectionData[0].F_State === 1 || this.tableSelectionData[0].F_State === 2 ? true : false
      }
      return disabled
    },
    disabledRemove() {
      let tableSelectionData = this.tableSelectionData
      let disabled = true
      if(tableSelectionData.length>0){
        disabled = false
        tableSelectionData.some(item=>{
          disabled = item.F_State === 1 || item.F_State === 2 ? true :false
          if(disabled){
            return disabled;
          }
        })
      }
      return disabled
    }
  },
  watch: {
    query: {
      handler: function() {
        this.getList();
      },
      deep: true
    }
  },
  methods: {
    onSelectionChange(val) {
      this.tableSelectionData = val;
    },
    onCurrentChange(currentRow) {
      if (currentRow) {
        this.currentRow = currentRow;
        this.detailType = "detail";
        this.ui.detail = true;
      }
    },
    async onExport() {
      this.ui.exportLoading = true;

      try {
        let res = await this.$_request({
          url: "/HR/Export/SalaryExport",
          method: "post",
          responseType: "blob",
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

        let url = URL.createObjectURL(res.data);
        let a = document.createElement("a");
        a.setAttribute("href", url);
        a.setAttribute("download", "工资表.xlsx");
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } finally {
        this.ui.exportLoading = false;
      }
    },
    onCreate() {
      this.ui.generate = true;
    },
    async onGenerate() {
      this.ui.generate = true;
    },
    async onRemove() {
      this.ui.removeLoading = true;

      try {
        await this.$_request({
          url: "/HR/SalarySlip/Del",
          method: "post",
          params: {
            ids: this.tableSelectionData.map(x => x.F_Id).join(",")
          }
        });

        this.getList();
        this.ui.remove = false;
        this.$message({
          message: "成功",
          type: "success"
        });
      } finally {
        this.ui.removeLoading = false;
      }
    },
    async getList() {
      this.ui.loading = true;

      try {
        let res = await this.$_request({
          url: "/HR/SalarySlip/List",
          method: "post",
          data: {
            queryJson_S: "",
            queryJson: JSON.stringify({
              f_Year: this.query.year || "",
              f_Month: this.query.month,
              _type: 1
            }),
            orderJson: "",
            pageIndex: this.pagination.current,
            pageSize: this.pagination.size,           
          }
        });
        res.data.data.map(item=>{
          switch (item.F_State){
            case 0:
              item.F_State_text='待审核'
              break;
            case 1:
              item.F_State_text='已审核'
              break;
            case 2:
              item.F_State_text='已发放'
              break;
            case 9:
              item.F_State_text='作废'
              break;
            default:
              break;
          }
        })
        this.tableData = res.data.data;
        this.pagination.total = res.data.record || 1;
      } finally {
        this.ui.loading = false;
      }
    },
    onClose() {
      this.$refs.table.setCurrentRow([]);
    },
    onAudit() {
      this.currentRow = this.tableSelectionData[0];
      this.detailType = "audit";
      this.ui.detail = true;
    },
    onConfirm() {
      this.currentRow = this.tableSelectionData[0];
      this.detailType = "confirm";
      this.ui.detail = true;
    },
    onRevoke() {
      this.currentRow = this.tableSelectionData[0];
      this.detailType = "revoke";
      this.ui.detail = true;
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
.date {
  width: 100px;
}
.info {
  background: #f4f4f5;
  display: flex;
  justify-content: space-evenly;
  padding: 8px 0;
  border-radius: 4px;
}
</style>
