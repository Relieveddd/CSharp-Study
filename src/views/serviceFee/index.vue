<!-- 补发扣发 -->

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
      <el-button @click="onAdd" type="primary" v-if="checkButton('add')"
        >新增</el-button
      >
      <el-button
        @click="onEdit"
        :disabled="disabledEdit"
        v-if="checkButton('edit')"
        >修改</el-button
      >
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
        <el-table-column show-overflow-tooltip type="selection">
        </el-table-column>
        <el-table-column show-overflow-tooltip type="index" label="序号">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="F_WeekType"
          label="结算周期"
        >
          <template v-slot="scope">
            {{ cycleType[scope.row.F_WeekType] }}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="F_StartDate"
          label="起始日期"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="F_EndDate"
          label="截止日期"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="F_CreateName"
          label="添加人"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="F_CreateDate"
          label="添加时间"
        >
          <template v-slot="scope">
            {{ scope.row.F_CreateDate | date("YYYY-MM-DD") }}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="F_ModifyName"
          label="修改人"
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
        @ok="getList"
      ></c-detail>
    </template>
  </mm-atp>
</template>

<script>
import checkPermission from "@/utils/checkPermission";
import CAdd from "./components/add";
import CDetail from "./components/detail";

export default {
  name: "serviceFee",
  components: {
    CAdd,
    CDetail
  },
  mixins: [checkPermission],
  data() {
    return {
      query: {
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
      formType: "add",
      cycleType: {
        1: "一次性",
        2: "按月",
        3: "按季",
        4: "按年"
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
    async getList() {
      this.ui.loading = true;

      try {
        let res = await this.$_request({
          url: "/HR/SalaryCost/List",
          method: "POST",
          data: {
            queryJson_S: JSON.stringify({
              query: this.query.keyword
            }),
            queryJson: "",
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
      this.currentRow = null;
      this.formType = "add";
      this.ui.add = true;
    },
    onSelectionChange(val) {
      this.tableSelectionData = val;
    },
    async onRemove() {
      this.ui.removeLoading = true;

      try {
        await this.$_request({
          url: "/HR/SalaryCost/Del",
          method: "post",
          params: {
            ids: this.tableSelectionData.map(x => x.F_Id).join(",")
          }
        });

        this.ui.remove = false;
        this.getList();
      } finally {
        this.ui.removeLoading = false;
      }
    },
    async onEdit() {
      let row = this.tableSelectionData[0];
      this.ui.editLoading = true;

      try {
        let res = await this.$_request({
          url: "/HR/SalaryCost/GetSingle",
          method: "get",
          params: {
            id: row.F_Id
          }
        });

        let resData = res.data.data;

        Object.assign(this.$refs.form.form, {
          id: resData.F_Id,
          cycle: resData.F_WeekType,
          dateRange: [resData.F_StartDate, resData.F_EndDate],
          tableData: (resData.F_Detail || []).map(x => {
            return {
              type: {
                F_ItemDetailId: x.F_CostType,
                F_ItemName: x.F_CostTypeZName
              },
              value: x.F_CostValue
            };
          })
        });

        this.formType = "edit";
        this.ui.add = true;
      } finally {
        this.ui.editLoading = false;
      }
    },
    onDetail(row) {
      if (row) {
        this.currentRow = row;
        this.detailType = "detail";
        this.ui.detail = true;
      }
    }
  },
  created() {
    this.getList();
  }
};
</script>

<style lang="scss" module></style>
