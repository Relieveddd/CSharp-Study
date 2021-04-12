<!-- 薪酬方案/薪酬计划 -->

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
        @click="onEdit"
        :disabled="disabledEdit"
        v-if="checkButton('edit')"
        >修改</el-button
      >
      <el-popover placement="bottom" v-model="ui.remove">
        <el-button
          slot="reference"
          :disabled="disabledRemove"
          v-if="checkButton('remove')"
          :loading="ui.removeLoading"
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
        ref="table"
        highlight-current-row
        :data="tableData"
        @selection-change="onSelectionChange"
        @current-change="onCurrentChange"
        v-loading="ui.tableLoading"
      >
        <el-table-column
          show-overflow-tooltip
          type="selection"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          type="index"
          label="序号"
        ></el-table-column>
        <el-table-column show-overflow-tooltip prop="F_Name" label="方案名称">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="F_CycleTypeZName"
          label="发放周期"
        >
        </el-table-column>
        <el-table-column show-overflow-tooltip label="是否计算社保">
          <template slot-scope="scope">
            {{ scope.row.F_CalSocial ? "是" : "否" }}
          </template>
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
        <el-table-column show-overflow-tooltip label="是否可用">
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
    <template v-slot:bottom>
      <c-bf
        :visible.sync="ui.bf"
        @close="onClose"
        :currentRow="currentRow"
      ></c-bf>
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
import checkPermission from "@/utils/checkPermission";
import CAdd from "./components/add";
import CBf from "./components/bf";

export default {
  name: "salaryPlan",
  mixins: [checkPermission],
  components: {
    CAdd,
    CBf
  },
  data() {
    return {
      formType: "add",
      tableData: [],
      tableSelectionData: [],
      currentRow: null,
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
        tableLoading: false,
        bf: false,
        removeLoading: false
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
    onAdd() {
      this.ui.add = true;
    },
    async onEdit() {
      let row = this.tableSelectionData[0];

      let res = await this.$_request({
        url: "/HR/SalaryPlan/GetSingle",
        method: "get",
        params: {
          id: row.F_Id
        }
      });

      let data = res.data.data;

      Object.assign(this.$refs.form.form, {
        id: data.F_Id,
        name: data.F_Name,
        remark: data.F_Describe,
        cycleId: data.F_CycleType,
        type: data.F_PType,
        isEnable: data.F_EnableMark,
        salaryProjectList: data.F_Details.map(x => {
          return x.F_ItemID;
        })
      });

      if (data.F_PType === 3) {
        let va = (data.F_PValues || "").split(",");

        Object.assign(this.$refs.form.form, {
          departmentList: va
        });
      }

      if (data.F_PType === 2) {
        let va = (data.F_PValues || "").split(",");
        let na = (data.F_PNames || "").split(",");
        let a = [];

        va.forEach((e, i) => {
          a.push({
            F_EmpName: na[i],
            F_EmpID: e
          });
        });
        Object.assign(this.$refs.form.form, {
          personnelList: a
        });
      }

      this.formType = "edit";
      this.ui.add = true;
    },
    async onRemove() {
      this.ui.removeLoading = true;

      try {
        await this.$_request({
          url: "/HR/SalaryPlan/Del",
          method: "post",
          params: {
            ids: this.tableSelectionData.map(x => x.F_Id).join()
          }
        });

        this.ui.remove = false;
        this.getList();
      } finally {
        this.ui.removeLoading = false;
      }
    },
    async getList() {
      this.ui.tableLoading = true;

      try {
        let res = await this.$_request({
          url: "/HR/SalaryPlan/List",
          method: "post",
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
        this.ui.tableLoading = false;
      }
    },
    onSelectionChange(val) {
      this.tableSelectionData = val;
    },
    onClose() {
      this.$refs.table.setCurrentRow([]);
    },
    onCurrentChange(currentRow) {
      if (currentRow) {
        this.currentRow = currentRow;
        this.ui.bf = true;
      }
    },
    async onChange(a, b) {
      await this.$_request({
        url: "/HR/SalaryPlan/UpdateState",
        method: "post",
        params: {
          ids: b.F_Id,
          F_States: Number(a)
        }
      });

      this.$message({
        message: "状态修改成功",
        type: "success"
      });
    }
  },
  created() {
    this.getList();
  }
};
</script>

<style lang="scss" module></style>
