<template>
  <mm-atp v-loading="ui.loading">
    <template v-slot:action-right>
      <el-button @click="getList">刷新</el-button>
      <el-button @click="ui.dialog = true">新增</el-button>
    </template>
    <template v-slot:table>
			
      <el-tree
        :data="data"
        :props="{ label: 'ItemName', children: 'ChildList' }"
      >
        <div slot-scope="{ node, data }" :class="$style['treenode']">
          <span> {{ node.label }}-{{ node.data.ItemCode }} </span>
          <span> {{node.data.Enabled>0 ? '可用' : '不可用'}}</span>
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
          <el-form-item label="父集字典">
						<el-select
						  placeholder="请选择"
						  clearable
						  v-model="form.parentId"
						  style="width:100%"
						>
						  <el-option label="无" value=""> </el-option>
						  <el-option
						    v-for="(item, index) in menuFlat"
						    :key="index"
						    :label="item.ItemName"
						    :value="item.Id"
						  >
						  </el-option>
						</el-select>
            <!-- <el-input v-model="form.id"></el-input> -->
          </el-form-item>
          <el-form-item label="编号" required>
            <el-input v-model="form.itemCode"></el-input>
          </el-form-item>
          <el-form-item label="名称" required>
            <el-input v-model="form.itemName"></el-input>
          </el-form-item>
					<el-form-item label="排序">
					  <el-input-number
					    v-model="form.sortId"
					    :step="1"
					    :min="0"
					  ></el-input-number>
					</el-form-item>
					<el-form-item label="是否可用">
					  <el-radio-group v-model="form.enabled">
					    <el-radio :label="1">是</el-radio>
					    <el-radio :label="0">否</el-radio>
					  </el-radio-group>
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
    id: "",
    parentId: "",
    itemCode: "",
    itemName: "",
    enabled: 1,
    sortId: 0,
		childList: []
  };
};

export default {
  data() {
    return {
      data: [],
			menuTree: [],
      form: data_form(),
      ui: {
        loading: false,
        dialog: false
      }
    };
  },
	computed:{
		menuFlat() {
		  let result = [];
		
		  const treeflat = function(list) {
		    list.forEach(x => {
		      result.push(x);
		
		      if (x.child && x.child.length) {
		        treeflat(x.child);
		      }
		    });
		  };
		
		  treeflat(this.menuTree);
			console.log(result)
		  return result;
		}
	},
  methods: {
    async getList() {
      this.ui.loading = true;
      let res = await this.$_request({
        url: "/anan/DataItem/List",
        method: "post",
        data: {
          pageIndex: 1,
          pageSize: 9999,
          isShow: 1
        }
      });

      this.data = res.data.data;
			let setp = function(list, p) {
			  list.forEach(x => {
			    x._parent = p;
			    if (x.Child) {
			      setp(x.Child, x);
			    }
			  });
			};
			
			setp(res.data.data, null);
			this.menuTree = res.data.data;
			console.log(this.menuTree)
      this.ui.loading = false;
    },
    async onOk() {
      await this.$_request({
        url: "/anan/DataItem/Change",
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
        id: row.Id || "",
        parentId: row.ParentId || "",
        itemCode: row.ItemCode || "",
        itemName: row.ItemName || "",
				enabled: row.Enabled || "1",
        sortId: row.SortId || this.form.sortId,
				childList: row.childList || this.form.childList
      });
			this.ui.dialog = true;
    },
    async onRemove(row) {
      await this.$_request({
        url: "/anan/DataItem/Del",
        method: "post",
        data: [row.Id]
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
