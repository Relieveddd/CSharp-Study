<template>
  <mm-atp v-loading="ui.loading">
    <template v-slot:action-right>
      <el-button @click="get">刷新列表</el-button>
      <el-button @click="ui.dialog = true">新增</el-button>
    </template>
    <template v-slot:table>
      <el-table border height="100%" :data="operateList">
        <el-table-column show-overflow-tooltip type="selection">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          type="index"
          label="序号"
        ></el-table-column>
        <el-table-column show-overflow-tooltip prop="F_OperName" label="名称">
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="F_OperCode" label="编码">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="F_OperId"
          label="ID"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="F_SortId"
          label="排序"
        ></el-table-column>
        <el-table-column>
          <template v-slot:default="scope">
            <el-button @click="onEdit(scope.row)">编辑</el-button>
            <el-button @click="onRemove(scope.row)">删除</el-button>
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
        @current-change="get"
      ></el-pagination>
    </template>
    <template v-slot:other>
      <el-dialog :visible.sync="ui.dialog" @closed="reset">
        <el-form label-width="6em">
          <el-form-item label="操作ID">
            <el-input v-model="form.f_OperId"></el-input>
          </el-form-item>
          <el-form-item label="操作名称" required>
            <el-input v-model="form.f_OperName"></el-input>
          </el-form-item>
          <el-form-item label="操作编码" required>
            <el-input v-model="form.f_OperCode"></el-input>
          </el-form-item>
          <el-form-item label="排序">
            <el-input-number v-model="form.f_SortId"></el-input-number>
          </el-form-item>
          <el-form-item>
            <el-button @click="onOk">提交</el-button>
            <el-button @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </template>
  </mm-atp>
</template>

<script>
const data_form = function() {
  return {
    f_OperId: "",
    f_OperName: "",
    f_OperCode: "",
    f_SortId: 0
  };
};

export default {
  data() {
    return {
      form: {
        f_OperId: "",
        f_OperName: "",
        f_OperCode: "",
        f_SortId: 0
      },
      operateList: [],
      pagination: {
        current: 1,
        total: 1,
        size: 20
      },
      ui: {
        loading: false,
        dialog: false
      }
    };
  },
  methods: {
    reset() {
      this.form = data_form();
    },
    async onOk() {
      let data = this.form;

      await this.$_request({
        url: "/Base/Operate/Change",
        method: "post",
        data
      });

      this.get();
      this.$message({
        message: "成功",
        type: "success"
      });
      this.ui.dialog = false;
    },
    async onEdit(row) {
      this.reset();

      Object.assign(this.form, {
        f_OperId: row.F_OperId || this.form.f_OperId,
        f_OperName: row.F_OperName || this.form.f_OperName,
        f_OperCode: row.F_OperCode || this.form.f_OperCode,
        f_SortId: row.F_SortId || this.form.f_SortId
      });

      this.ui.dialog = true;
    },
    async onRemove(row) {
      await this.postRemove([row.F_OperId]);

      this.$message({
        message: "成功",
        type: "success"
      });
      this.get();
    },
    async postRemove(list) {
      await this.$_request({
        url: "/Base/Operate/Del",
        method: "post",
        params: {
          ids: list.join()
        }
      });
    },
    async get() {
      this.ui.loading = true;

      let res = await this.$_request({
        url: "/Base/Operate/List",
        method: "post",
        data: {
          pageIndex: this.pagination.current,
          pageSize: this.pagination.size
        }
      });

      this.operateList = res.data.data;
      this.pagination.total = res.data.record;
      this.ui.loading = false;
    }
  },
  created() {
    this.get();
  }
};
</script>

<style lang="scss" module></style>
