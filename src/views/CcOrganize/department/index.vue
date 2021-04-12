<!-- 部门管理 -->

<template>
  <mm-atp palign="right">
    <template v-slot:action-left>
      <slot name="action-left" :onQuery="getList"></slot>
    </template>
    <template v-slot:action-right>
      <el-button
        type="primary"
        @click="onAdd"
        v-if="checkButton('add', 'companyStructure')"
        >新增</el-button
      >
      <el-button
        :disabled="disabledEdit"
        @click="onEdit"
        v-if="checkButton('edit', 'companyStructure')"
        >修改</el-button
      >
      <el-popover placement="bottom" v-model="ui.remove">
        <el-button
          slot="reference"
          :disabled="disabledRemove"
          v-if="checkButton('remove', 'companyStructure')"
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
        @selection-change="onSelectionChange"
        v-loading="ui.tableLoading"
        :tree-props="{ children: 'Child' }"
        row-key="F_DepId"
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
        <el-table-column
          show-overflow-tooltip
          prop="F_DepName"
          label="部门名称"
          min-width="150px"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="F_DepCode"
          label="部门编号"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="F_DepHeader"
          label="负责人"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="F_DepHeaderTel"
          label="电话"
        >
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="F_DepTel" label="部门电话">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="F_DepDutyZName"
          label="责任范围"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="F_DepMail"
          label="电子邮箱"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="F_FoundDate"
          label="成立时间"
        >
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="F_ExtNo" label="分机号">
        </el-table-column
        >f_
        <el-table-column show-overflow-tooltip prop="F_ShortName" label="简称">
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="F_Remark" label="备注">
        </el-table-column>
      </el-table>
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

export default {
  mixins: [checkPermission],
  components: {
    CAdd: () => import("./components/add.vue")
  },
  props: {
    query: {
      default: {
        keyword: ""
      }
    }
  },
  data() {
    return {
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
    onAdd() {
      this.formType = "add";
      this.ui.add = true;
    },
    onEdit() {
      let row = this.tableSelectionData[0];
      Object.assign(this.$refs.form.form, {
        id: row.F_DepId,
        superiorDepartmentId: row.F_TopDepId,
        departmentName: row.F_DepName,
        departmentNumber: row.F_DepCode,
        departmentType: {
          F_ItemDetailId: row.F_DepNatureId
        },
        contactName: row.F_DepHeader,
        contactPhone: row.F_DepHeaderTel,
        departmentPhone: row.f_DepTel,
        responsibilityRange: {
          F_ItemDetailId: row.F_DepDuty
        },
        email: row.F_DepMail,
        stablished: row.F_FoundDate,
        extensionNumber: row.F_ExtNo,
        address: row.F_Address,
        isSpecial: row.F_IsSpecial === 1 ? true : false,
        remark: row.F_Remark,
        sort: row.F_SortId
      });
      this.formType = "edit";
      this.ui.add = true;
    },
    async onRemove() {
      let rowList = this.tableSelectionData.map(x => x.F_DepId).join();

      await this.$_request({
        url: "/HR/Department/Del",
        method: "post",
        params: {
          ids: rowList
        }
      });

      this.ui.remove = false;
      this.getList();
      this.$message({
        message: "成功",
        type: "success"
      });
    },
    async getList() {
      this.ui.tableLoading = true;

      try {
        let res = await this.$_request({
          url: "/HR/Department/GetTreeStructure",
          method: "get"
        });

        let resData = res.data;

        this.tableData = resData.data;
        this.pagination.total = resData.record || 1;
      } finally {
        this.ui.tableLoading = false;
      }
    }
  },
  created() {
    this.getList();
  }
};
</script>

<style lang="scss" module>
.al {
  display: flex;
}
</style>
