<!-- 角色管理 -->

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
      <el-button
        :disabled="disabledEdit"
        @click="onPermission(1)"
        v-if="checkButton('authorize', 'companyStructure')"
        >PC授权</el-button
      >
      <el-button
        :disabled="disabledEdit"
        @click="onPermission(3)"
        v-if="checkButton('authorize', 'companyStructure')"
        >小程序授权</el-button
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
          prop="F_RoleName"
          label="角色名称"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="F_RoleCode"
          label="角色编码"
        >
        </el-table-column>
				<el-table-column
				  show-overflow-tooltip
				  prop="F_SysCode"
				  label="系统标识"
				>
				</el-table-column>
				<el-table-column
				  show-overflow-tooltip
				  prop="F_Domain"
				  label="域名"
				>
				</el-table-column>
        <el-table-column show-overflow-tooltip prop="F_ReMark" label="备注">
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
      <c-permission
        :visible.sync="ui.permission"
        :id="(currentRow && currentRow.F_RoleId) || ''"
        :type="2"
        :moduleType="type"
      ></c-permission>
    </template>
  </mm-atp>
</template>

<script>
import CAdd from "./components/add";
import CPermission from "./components/permission";
import checkPermission from "@/utils/checkPermission";

export default {
  mixins: [checkPermission],
  components: {
    CAdd,
    CPermission
  },
  props: {
    query: {
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      formType: "add",
      tableData: [],
      tableSelectionData: [],
      currentRow: null,
      pagination: {
        current: 1,
        total: 1,
        size: 20
      },
      ui: {
        add: false,
        remove: false,
        removeLoading: false,
        permission: false,
        tableLoading: false
      },
      type: 1
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
    onPermission(type) {
      this.currentRow = this.tableSelectionData[0];
      this.type = type;
      this.ui.permission = true;
    },
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
        id: row.F_RoleId,
        name: row.F_RoleName,
        number: row.F_RoleCode,
        remark: row.F_ReMark,
				sysCode: row.F_SysCode,
				f_Domain: row.F_Domain
      });

      this.formType = "edit";
      this.ui.add = true;
    },
    async onRemove() {
      this.ui.removeLoading = true;

      try {
        await this.$_request({
          url: "/Base/Role/Del",
          method: "post",
          params: {
            ids: this.tableSelectionData.map(x => x.F_RoleId).join()
          }
        });
      } catch (error) {
        return;
      } finally {
        this.ui.removeLoading = false;
      }

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
          url: "/Base/Role/List",
          method: "post",
          data: {
            queryJson_S: JSON.stringify({
              query: this.query.keyword
            }),
						// f_SysCode: "智慧消防"
            queryJson: JSON.stringify({f_SysCode: "度见ERP"}),
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
