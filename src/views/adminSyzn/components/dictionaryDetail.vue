<template>
  <mm-atp v-loading="ui.loading">
    <template v-slot:action-right>
      <el-button @click="getList">更新列表</el-button>
      <el-button @click="ui.dialog = true">新增</el-button>
    </template>
    <template v-slot:table>
      <el-tree
        :data="data"
        :props="{ label: 'F_ItemName', children: 'children' }"
      >
        <div slot-scope="{ node, data }" :class="$style['treenode']">
          <span> {{ node.label }}-{{ node.data.F_ItemValue }} </span>
          <span>
            <el-button type="text" size="mini" @click="onEdit(data)"
              >修改
            </el-button>
            <el-button type="text" size="mini" @click="onRemove(data)">
              删除
            </el-button>
          </span>
        </div></el-tree
      >
    </template>
    <template v-slot:other>
      <el-dialog :visible.sync="ui.dialog" @closed="onReset">
        <el-form>
          <el-form-item label="名称">
            <el-input v-model="form.f_ItemName"></el-input>
          </el-form-item>
          <el-form-item label="值">
            <el-input v-model="form.f_ItemValue"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="onOk">确认</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </template>
  </mm-atp>
</template>

<script>
const data_form = function() {
  return {
    f_ItemDetailId: "",
    f_ItemId: "",
    f_ParentId: "",
    f_ItemName: "",
    f_ItemValue: "",
    f_SortId: 0,
    f_Default: 0,
    f_Enable: 1,
    f_ReMark: ""
  };
};

export default {
  data() {
    return {
      data: [],
      form: data_form(),
      ui: {
        loading: false,
        dialog: false
      }
    };
  },
  methods: {
    async getList() {
      this.ui.loading = true;

      let res = await this.$_request({
        url: "/HR/DataItemDetail/List",
        method: "post",
        data: {
          pageIndex: 1,
          pageSize: 20
        }
      });

      this.data = res.data.data;
      this.ui.loading = false;
    },
    async onOk() {
      await this.$_request({
        url: "/HR/DataItem/Change",
        method: "post",
        data: this.form
      });

      this.getList();
      this.$message({
        message: "ok"
      });
    },
    onEdit(row) {
      this.form = data_form();
      Object.assign(this.form, {
        f_ItemId: row.F_ItemId || "",
        f_ParentId: row.F_ParentId || "",
        f_ItemCode: row.F_ItemCode || "",
        f_ItemName: row.F_ItemName || "",
        f_IsTree: row.F_IsTree || this.form.f_IsTree,
        f_SortId: row.F_Sortid || this.form.f_SortId
      });
    },
    async onRemove(row) {
      await this.$_request({
        url: "/HR/DataItemDetail/Del",
        method: "post",
        params: {
          ids: row.F_ItemDetailId
        }
      });

      this.getList();
      this.$message({
        message: "ok"
      });
    },
    onReset() {
      this.form = data_form();
    }
  },
  created() {
    this.getList();
  }
};
</script>

<style lang="scss" module>
.wrap {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 16px;
}
.view {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 16px;
  pre {
    height: 300px;
    overflow: auto;
  }
}
.treenode {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
