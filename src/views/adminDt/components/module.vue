<template>
  <mm-atp v-loading="ui.loading">
    <template v-slot:action-right>
      <el-button @click="get">刷新列表</el-button>
      <el-button @click="ui.dialog = true">新增</el-button>
    </template>
    <template v-slot:table>
      <el-tree
        :data="menuTree"
        :props="{
          label: 'F_Name',
          children: 'Child'
        }"
        :expand-on-click-node="false"
        @node-click="onNodeClick"
      >
        <div slot-scope="{ node, data }" :class="$style['treenode']">
          <span>
            <mm-icon
              :icon="data.F_Icon"
              color="#000"
              style="display: inline-block;"
            ></mm-icon>
            {{ node.label }}
          </span>
          <span>排序：{{ data.F_SortId }}</span>
          <span :class="$style['buttons']">
            <el-button type="text" size="mini" @click="onEdit(data)"
              >修改
            </el-button>
            <el-button type="text" size="mini" @click="onRemove(data)">
              删除
            </el-button>
          </span>
        </div>
      </el-tree>
    </template>
    <template v-slot:other>
      <el-dialog :visible.sync="ui.dialog" @closed="reset" width="900px" @open="onOpen">
        <el-form label-width="6em">
          <el-form-item label="父级菜单">
            <el-select
							filterable
              placeholder="请选择"
              clearable
              v-model="form.f_TopId"
              style="width:100%"
            >
              <el-option label="无" value="0"> </el-option>
              <el-option
                v-for="(item, index) in menuFlat"
                :key="index"
                :label="item.F_Name"
                :value="item.F_ModuleId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="菜单ID">
            <el-input v-model="form.f_ModuleId"></el-input>
          </el-form-item>
          <el-form-item label="菜单名称" required>
            <el-input v-model="form.f_Name"></el-input>
          </el-form-item>
          <el-form-item label="排序">
            <el-input-number
              :disabled="type == 'xcx_module'"
              v-model="form.f_Sortid"
              :min="0"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="菜单图标">
            <el-select
              :disabled="type == 'xcx_module'"
              v-model="form.f_Icon"
              clearable
              placeholder="请选择"
              style="width:100%"
            >
              <el-option
                v-for="(item, index) in iconList"
                :key="index"
                :value="item"
              >
                <div
                  style="display:flex;justify-content: space-between;align-items: center;"
                >
                  <span>{{ item }}</span>
                  <mm-icon
                    :icon="item"
                    color="#000"
                    style="height: 100%;"
                  ></mm-icon>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="菜单路由">
            <el-select
              placeholder="请选择"
              clearable
							filterable
              v-model="form.f_Url"
              style="width:100%"
            >
              <el-option
                v-for="(item, index) in routesFlat"
                :key="index"
                :label="item.title"
                :value="item.routeName"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="操作权限">
            <el-select
              v-model="form.f_Operates"
              multiple
							filterable
              placeholder="请选择"
              style="width:100%"
              value-key="F_OperId"
            >
              <el-option
                v-for="(item, index) in operateList"
                :key="index"
                :label="item.F_OperName"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="平台">
            <el-radio-group v-model="form.f_ModuleType">
              <el-radio :label="1">PC</el-radio>
              <el-radio :label="2">APP</el-radio>
              <el-radio :label="3">微信小程序</el-radio>
              <el-radio :label="4">微信公众号(H5）</el-radio>
              <el-radio :label="5">钉钉小程序</el-radio>
              <el-radio :label="6">PDA手持终端</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button @click="onOk">提交</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </template>
  </mm-atp>
</template>

<script>
import routes from "@/router/routerCof";
console.log(routes , 7);
import requestService from "@/utils/serviceCfg";
let serviceId = requestService.dt
console.log(serviceId);
const data_routes = function() {
  let result = [];

  const treeflat = function(list) {
    list.forEach(x => {
      if (x.name === serviceId) {
        if (x.children && x.children.length) {
          treeflat(x.children);
        }
      }
      if (x.name && x.meta && x.meta.title) {
        result.push({
          title: x.meta.title,
          label: x.meta.title,
          icon: x.meta.icon || "",
          routeName: x.name
        });
      }
    });
  };
  treeflat(routes);
  return result;
};
const data_form = function() {
  return {
    f_ModuleId: "",
    f_TopId: "0",
    f_Code: "",
    f_Name: "",
    f_Url: "",
    f_Icon: "",
    f_Operates: [],
    f_Sortid: 0,
    f_IsModule: true,
    f_IsExpand: true,
    f_ModuleType: 1
  };
};

export default {
  props: {
    type: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      form: data_form(),
      routesFlat: data_routes(),
      iconList: [],
      menuTree: [],
      menuNode: {},
      operateList: [],
      ui: {
        loading: false,
        dialog: false
      },
      serviceList: {}
    };
  },
  computed: {
    menuFlat() {
      let result = [];

      const treeflat = function(list) {
        list.forEach(x => {
          result.push(x);

          if (x.Child && x.Child.length) {
            treeflat(x.Child);
          }
        });
      };
      treeflat(this.menuTree);
      return result;
    }
  },
  methods: {
    async onOk() {
      let data = Object.assign({}, this.form, {
        f_Operates: this.form.f_Operates.map(x => {
          return {
            f_OperId: x.F_OperId,
            f_OperName: x.F_OperName,
            f_OperCode: x.F_OperCode
          };
        })
      });
      data.f_Service = serviceId;
      await this.$_request({
        url: "/Base/Module/Change",
        method: "post",
        data
      });

      await this.get();

      this.$message({
        message: "成功",
        type: "success"
      });
      this.ui.dialog = false;
    },
    onSelectionChange(val) {
      this.tableSelectionData = val;
    },
    async onRemove(row) {
      await this.postRemove([row.F_ModuleId]);

      this.get();
      this.$message({
        message: "成功",
        type: "success"
      });
    },
    async postRemove(list = []) {
      await this.$_request({
        url: "/Base/Module/Del",
        method: "post",
        params: {
          ids: list.join()
        }
      });

      this.$message({
        message: "ok"
      });
    },
    onEdit(row) {
      this.form = data_form();
      Object.assign(this.form, {
        f_ModuleId: row.F_ModuleId || this.form.f_ModuleId,
        f_TopId: (row._parent && row._parent.F_ModuleId) || this.form.f_TopId,
        f_Code: row.F_Code || this.form.f_Code,
        f_Name: row.F_Name || this.form.f_Name,
        f_Url: row.F_Url || this.form.f_Url,
        f_Icon: row.F_Icon || this.form.f_Icon,
        f_Operates: row.F_Opers || this.form.f_Operates,
        f_Sortid: row.F_SortId || this.form.f_Sortid,
        f_IsModule: row.F_IsModule || this.form.f_IsModule,
        f_IsExpand: row.F_IsExpand || this.form.f_IsExpand,
        f_ModuleType: row.F_ModuleType || this.form.f_ModuleType
      });

      this.ui.dialog = true;
    },
    onNodeClick(a) {
      this.menuNode = a;
    },
    async get() {
      this.ui.loading = true;
      let type = 1;
      if (this.type == "xcx_module") {
        type = 3;
      }
			if(this.type == "dd_module") {
				type = 5;
			}
      let res = await this.$_request({
        url: "/Base/Module/GetModuleList",
        method: "get",
        params: {
          f_Service: serviceId,
          f_ModuleType: type
        }
      });

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
      this.ui.loading = false;
    },
    async getOperateList() {
      let res = await this.$_request({
        url: "/Base/Operate/List",
        method: "post",
        data: {
          pageIndex: 1,
          pageSize: 999
        }
      });

      this.operateList = res.data.data;
    },
    reset() {
      this.form = data_form();
    },
    getIconList() {
      let svg = document.querySelector("body > svg");
      if (svg) {
        let list = Array.from(svg.children).map(x => x.id);
        this.iconList = list;
      }
    },
    async getServiceList() {
      let res = await this.$_request({
        url: "/service/List",
        method: "post"
      });
      let serviceList = {};
      res.data.data.map(x => {
        serviceList[x.F_ServiceCode] = x.F_ServiceId;
      });
      this.serviceList = serviceList;
    },
		onOpen() {
			if(this.type == 'xcx_module') {
				this.form.f_ModuleType = 3
			}
		}
  },
  async created() {
    await Promise.all([this.get(), this.getOperateList(), this.getIconList()]);
  },
  mounted() {
    console.log(this.type);
    this.getServiceList();
  }
};
</script>

<style lang="scss" module>
.treenode {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  .buttons {
    text-align: right;
  }
}
</style>
