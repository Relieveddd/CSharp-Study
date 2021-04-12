<!-- 薪酬项目 -->

<template>
  <mm-atp palign="right" v-loading="ui.loading">
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
      >
        <el-table-column show-overflow-tooltip type="selection">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          type="index"
          label="序号"
        ></el-table-column>
        <el-table-column label="编号" show-overflow-tooltip prop="F_No"></el-table-column>
        <el-table-column show-overflow-tooltip prop="F_Name" label="名称">
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="F_ItemType" label="类型">
          <template slot-scope="scope">
            {{ itemTypeList[scope.row.F_ItemType] }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="计税类型">
          <template slot-scope="scope">
            {{ taxTypeList[scope.row.F_TaxModel] }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="计薪类型">
          <template slot-scope="scope">
            {{ scope.row.F_CalculationType === 0 ? "增加项" : "扣除项" }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="项规则类型">
          <template slot-scope="scope">
            {{ scope.row.F_RuleType === 1 ? "人工录入" : "薪酬标准" }}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="F_RuleValue"
          label="项规则值"
        ></el-table-column>
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
      <c-add
        :visible.sync="ui.add"
        ref="form"
        :formType="formType"
        @update="getList"
      ></c-add>
    </template>
  </mm-atp>
</template>

<script>
import { querySalaryProject } from "@/utils/api";
import checkPermission from "@/utils/checkPermission";

export default {
  name: "salaryProject",
  mixins: [checkPermission],
  components: {
    CAdd: () => import("./components/add")
  },
  data() {
    return {
      itemTypeList: {
        1: "普通薪酬项",
        2: "社保项",
        3: "公积金"
      },
      taxTypeList: {
        0: "计税",
        1: "扣税",
        2: "不计税"
      },
      formType: "add",
      tableData: [],
      tableSelectionData: [],
      query: {
        keyword: ""
      },
      pagination: {
        current: 1,
        total: 1,
        size: 20
      },
      ui: {
        add: false,
        remove: false,
        loading: false
      }
    };
  },
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
    onEdit() {
      let row = this.tableSelectionData[0];

      Object.assign(this.$refs.form.form, {
        id: row.F_Id,
        name: row.F_Name,
        countType: row.F_CalculationType,
        type: row.F_ItemType,
        ruleType: row.F_RuleType,
        ruleValue: row.F_RuleValue,
        sort: row.F_SortId
      });
      this.formType = "edit";
      this.ui.add = true;
    },
    onAdd() {
      this.formType = "add";
      this.ui.add = true;
    },
    async onRemove() {
      await this.$_request({
        url: "/HR/SalaryItems/Del",
        method: "post",
        params: {
          ids: this.tableSelectionData.map(x => x.F_Id).join()
        }
      });

      this.ui.remove = false;
      this.getList();
    },
    async getList() {
      this.ui.loading = true;

      try {
        let resData = await querySalaryProject({
          queryJson_S: JSON.stringify({
            query: this.query.keyword
          }),
          queryJson: "",
          orderJson: "",
          pageIndex: this.pagination.current,
          pageSize: this.pagination.size
        });

        this.tableData = resData.data;
        this.pagination.total = resData.record || 1;
      } finally {
        this.ui.loading = false;
      }
    }
  },
  created() {
    this.getList();
  }
};
</script>
