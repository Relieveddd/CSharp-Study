<template>
  <mm-atp v-loading="ui.loading">
    <template v-slot:action-right>
      <el-button @click="getList">刷新</el-button>
      <el-button @click="ui.dialog = true">新增</el-button>
    </template>
    <template v-slot:table>
      <el-tree
        :data="data"
        :props="{ label: 'F_ItemName', children: 'children' }"
      >
        <div slot-scope="{ node, data }" :class="$style['treenode']">
          <span> {{ node.label }}-{{ node.data.F_ItemCode }} </span>
          <span> {{node.data.F_Enabled>0 ? '可用' : '不可用'}}</span>
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
				<el-form label-width="6em">
				  <el-form-item label="编号" required>
				    <el-input v-model="form.f_ItemCode"></el-input>
				  </el-form-item>
				  <el-form-item label="名称" required>
				    <el-input v-model="form.f_ItemName"></el-input>
				  </el-form-item>
				  <el-form-item label="排序">
				    <el-input-number
				      v-model="form.f_SortId"
				      :step="1"
				      :min="0"
				    ></el-input-number>
				  </el-form-item>
				  <el-form-item label="是否可用">
				    <el-radio-group v-model="form.f_Enabled">
				      <el-radio :label="1">是</el-radio>
				      <el-radio :label="0">否</el-radio>
				    </el-radio-group>
				  </el-form-item>
					<el-form-item>
					  <el-button @click="onOk">确认</el-button>
					</el-form-item>
				</el-form>
				
				
        <!-- <el-form label-width="4em">
          <el-form-item label="ID">
            <el-input v-model="form.f_ItemId"></el-input>
          </el-form-item>
          <el-form-item label="编号" required>
            <el-input v-model="form.f_ItemCode"></el-input>
          </el-form-item>
          <el-form-item label="名称" required>
            <el-input v-model="form.f_ItemName"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="onOk">确认</el-button>
          </el-form-item>
        </el-form> -->
      </el-dialog>
    </template>
  </mm-atp>
</template>

<script>
const data_form = function() {
  return {
    f_ItemId: "",
    f_ParentId: "0",
    f_ItemCode: "",
    f_ItemName: "",
    f_Enabled: 1,
    f_IsTree: true,
    f_SortId: 0
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
        url: "/HR/DataItem/List",
        method: "post",
        data: {
          pageIndex: 1,
          pageSize: 9999,
          isShow: 1
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
        message: "成功",
        type: "success"
      });
      this.ui.dialog = false;
    },
    onEdit(row) {
      this.form = data_form();
      Object.assign(this.form, {
        f_ItemId: row.F_ItemId || "",
        f_ParentId: row.F_ParentId || "",
        f_ItemCode: row.F_ItemCode || "",
        f_ItemName: row.F_ItemName || "",
				f_Enabled: row.f_Enabled || 1,
        f_IsTree: row.F_IsTree || this.form.f_IsTree,
        f_SortId: row.F_Sortid || this.form.f_SortId
      });
			this.ui.dialog = true;
    },
    async onRemove(row) {
      await this.$_request({
        url: "/HR/DataItem/Del",
        method: "post",
        params: {
          ids: row.F_ItemId
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
