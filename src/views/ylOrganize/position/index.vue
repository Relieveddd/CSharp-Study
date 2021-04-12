<!-- 职务管理 -->

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
          prop="F_JobName"
          label="职务名称"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="F_JobCode"
          label="职务编号"
        >
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="F_ReMark" label="备注">
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="f_Enabled" label="是否启用">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.F_Enabled"
              active-color="#409eff"
              inactive-color="#c4c4c4"
              :active-value="1"
              :inactive-value="0"
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
import { queryPosition } from "@/utils/api";
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
        id: row.F_JobId,
        name: row.F_JobName,
        number: row.F_JobCode,
        remark: row.F_Remark,
        department: {
          F_DepName: "",
          F_DepId: row.F_DepId
        },
        sort: row.F_SortId
      });

      this.formType = "edit";
      this.ui.add = true;
    },
    async onRemove() {
      let rowList = this.tableSelectionData.map(x => x.F_JobId).join();

      await this.$_request({
        url: "/HR/Job/Del",
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
        let resData = await queryPosition({
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
        this.ui.tableLoading = false;
      }
    },
    async onChange(event, val) {
      await this.$_request({
        url: "/HR/Job/UpdateState",
        method: "post",
        params: {
          ids: val.F_JobId,
          F_States: event
        }
      })
      this.$message({
        message: "状态修改成功",
        type: "success"
      })
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
