<!-- 补发扣发 -->

<template>
  <mm-atp palign="right" v-loading="ui.loading">
    <template v-slot:action-left>
      <el-date-picker
        v-model="query.year"
        value-format="yyyy"
        type="year"
        placeholder="选择年"
        :clearable="true"
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
      <el-input v-model="query.keyword" style="width: 170px;float: right;">
        <el-button @click="search" slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </template>
    <template v-slot:action-right>
      <el-button @click="onAdd" type="primary" v-if="checkButton('add')"
        >新增</el-button
      >
      <el-button
        @click="onEdit"
        :disabled="disabledReview"
        v-if="checkButton('edit')"
        >修改</el-button
      >
      <el-button
        @click="onAudit"
        :disabled="disabledReview"
        v-if="checkButton('audit')"
        >审核</el-button
      >
      <el-button
        @click="onRevoke"
        :disabled="disabledRemove"
        v-if="checkButton('revoke')"
        >作废</el-button
      >
      <el-col style="width: 57px;">
        <el-upload
          :action="uploadAction"
          multiple
          :on-success="upload"
          :headers="headers"
        >
          <el-button style="padding: 9px 15px;" size="mini">导入</el-button>
        </el-upload>
      </el-col>
      
      <el-popover
        placement="bottom"
        v-model="ui.remove"
        v-if="checkButton('remove')"
      >
        <el-button slot="reference" :disabled="disabledRemove">删除</el-button>
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
        @selection-change="onSelectionChange"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column show-overflow-tooltip width=45 label="序号" type="index"></el-table-column>
        <el-table-column show-overflow-tooltip width=150 prop="F_Id"  label="员工编号"></el-table-column>
        <el-table-column show-overflow-tooltip width=100 prop="F_EmpName"  label="姓名"></el-table-column>
        <el-table-column show-overflow-tooltip width=100 prop="F_EmpName"  label="考勤月份">
          <template slot-scope="scope">
            {{scope.row.F_Year+"-"+scope.row.F_Month}}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip width=80 prop="F_ShoudDays" label="应出勤天数"></el-table-column>
        <el-table-column show-overflow-tooltip width=80 prop="F_CheckDays"  label="实出勤天数"></el-table-column>
        <el-table-column show-overflow-tooltip width=80 prop="F_LeaveDays"  label="请假天数"></el-table-column>
        <el-table-column show-overflow-tooltip width=80 prop="F_LateDays"  label="迟到天数"></el-table-column>
        <el-table-column show-overflow-tooltip width=80 prop="F_EarlyDays" label="早退天数"></el-table-column>
        <el-table-column show-overflow-tooltip width=80 prop="F_SkipWorkDays" label="旷工天数"></el-table-column>
        <el-table-column show-overflow-tooltip width=80 prop="F_OverTime"  label="加班小时"></el-table-column>
        <el-table-column show-overflow-tooltip width=80 prop="F_AvgManHour" label="平时工时"></el-table-column>
        <el-table-column show-overflow-tooltip width=80 prop="F_CreateName"  label="录入人员"></el-table-column>
        <el-table-column show-overflow-tooltip width=80 prop="F_CreateDate" label="录入时间"></el-table-column>
        <el-table-column show-overflow-tooltip width=80 prop="F_ModifyName" label="修改人员"></el-table-column>
        <el-table-column show-overflow-tooltip width=80 prop="F_ModifyDate" label="修改时间"></el-table-column>
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
      <c-add
        :visible.sync="ui.add"
        :currentRow="currentRow"
        :formType="formType"
        @ok="getList"
        ref="form"
      ></c-add>
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
import CAdd from "./components/add";
import CDetail from "./components/detail";

export default {
  name: "attence",
  mixins: [checkPermission],
  components: {
    CAdd,
    CDetail
  },
  data() {
    return {
      query: {
        year: "",
        month: "",
        keyword: ""
      },
      tableData: [],
      tableSelectionData: [],
      currentRow: null,
      pagination: {
        current: 1,
        total: 1,
        size: 20
      },
      ui: {
        loading: false,
        add: false,
        detail: false,
        remove: false,
        removeLoading: false
      },
      statusList: {
        0: "未审核",
        1: "已审核",
        2: "已负荷",
        9: "作废"
      },
      detailType: "",
      formType: "add"
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
      let disabled = true
      if(this.tableSelectionData.length === 1){
        disabled = this.tableSelectionData[0].F_Status === 1 ? false : true
        if(this.tableSelectionData[0].F_Status === 2){
          disabled = true
        }
      }
      return disabled
    },
    disabledReview() {
      let disabled = true
      if(this.tableSelectionData.length === 1){
          disabled = this.tableSelectionData[0].F_Status === 1 || this.tableSelectionData[0].F_Status === 2 ? true : false
      }
      return disabled
    },
    disabledRemove() {
      let tableSelectionData = this.tableSelectionData
      let disabled = true
      if(tableSelectionData.length>0){
        disabled = false
        tableSelectionData.some(item=>{
          disabled = item.F_Status === 1 || item.F_Status === 2 ? true :false
          if(disabled){
            return disabled;
          }
        })
      }
      return disabled
    },
    uploadAction() {
      return `${process.env.VUE_APP_API_BASEURL || ""}/HR/Attence/import`;
    },
    headers() {
      return {Authorization: this.$store.state.user.token}
    }
    // disabledEdit() {
    //   return this.tableSelectionData.length === 1 ? false : true;
    // },
    // disabledRemove() {
    //   return this.tableSelectionData.length > 0 ? false : true;
    // }
  },
  methods: {
    search() {
      this.getList();
    },
    async getList() {
      this.ui.loading = true;

      try {
        let res = await this.$_request({
          url: "/HR/Attence/List",
          method: "POST",
          data: {
            queryJson_S: "",
            queryJson: JSON.stringify({
              f_Year: this.query.year || "",
              f_Month: this.query.month,
              f_EmpName: this.query.keyword || ""
            }),
            orderJson: "",
            pageIndex: this.pagination.current,
            pageSize: this.pagination.size
          }
        });
        this.tableData = res.data.data;
        this.pagination.total = res.data.record || 1;
      } finally {
        this.ui.loading = false;
      }
    },
    async onAdd() {
      return false
      this.currentRow = null;
      this.formType = "add";
      // this.ui.add = true;
      this.$refs.form.getSalaryProjectList();
    },
    async onAddjb() {
      this.currentRow = null;
      this.formType = "addjb";
      this.ui.add = true;
      
    },
    async onAddcj() {
      this.currentRow = null;
      this.formType = "addcj";
      this.ui.add = true;
    },
    closeAddTab() {
      this.$store.commit("tabView/removeTab", {
        tab: {
          name: "personnelProfileAdd"
        }
      });
    },
    onSelectionChange(val) {
      this.tableSelectionData = val;
    },
    async onDetail(row) {
      if (row) {
        this.currentRow = row;
        this.detailType = "detail";
        this.ui.detail = true;
      }
    },
    onAudit() {
      this.currentRow = this.tableSelectionData[0];
      this.detailType = "audit";
      this.ui.detail = true;
    },
    onRevoke() {
      this.currentRow = this.tableSelectionData[0];
      this.detailType = "revoke";
      this.ui.detail = true;
    },
    async onRemove() {
      this.ui.removeLoading = true;

      try {
        await this.$_request({
          url: "/HR/Attence/Del",
          method: "post",
          params: {
            ids: this.tableSelectionData.map(x => x.F_Id).join(","),
            state: -1
          }
        });

        this.ui.remove = false;
        this.getList();
      } finally {
        this.ui.removeLoading = false;
      }
    },
    async onEdit() {
      return false
      this.currentRow = this.tableSelectionData[0];
      this.formType = "edit";
      this.ui.add = true;
    },
    //导入
    upload(response, file, fileList) {
      if(response.code === 200) {
        this.$message({
          type: "success",
          message: "导入成功"
        })
        this.getList()
      }else{
        this.$message({
          type: "warning",
          message: "导入失败"
        })
      }
    }
  }, 
  created() {
    let nowDate = dayjs().subtract(1, "month");

    Object.assign(this.query, {
      year: `${nowDate.year()}`,
      // month: `${nowDate.month() + 1}`
    });

    this.getList();
  },
  beforeDestroy() {}
};
</script>
