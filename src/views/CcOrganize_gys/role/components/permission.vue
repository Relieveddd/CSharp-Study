<!-- 权限管理 -->

<template>
  <el-dialog
    :visible.sync="isShow"
    title="授权管理"
    width="700px"
    @open="onOpen"
    @closed="onClosed"
  >
    <el-steps :active="step" simple>
      <el-step title="菜单/按钮"></el-step>
      <el-step title="数据"></el-step>
    </el-steps>
    <div
      style="max-height:40vh;overflow: auto;margin-top:16px;"
      v-loading="ui.loading"
    >
      <template v-if="step === 0">
        <c-tree :menuTree.sync="menuTree" ref="tree"></c-tree>
      </template>
      <template v-else-if="step === 1">
        <el-tree
          :data="departmentTree"
          node-key="F_Id"
          :check-strictly="true"
          :default-checked-keys="departmentDefaultCheckList"
          :props="{
            label: 'F_Name',
            children: 'Child'
          }"
          show-checkbox
          @check="onDepartmentCheck"
        >
        </el-tree>
      </template>
    </div>
    <span slot="footer">
      <el-button @click="closeSelf">取 消</el-button>
      <el-button @click="step = 0" v-if="step === 1">上一步</el-button>
      <el-button @click="step = 1" v-if="step === 0">下一步</el-button>
      <el-button
        type="primary"
        v-if="step === 1"
        @click="onOk"
        :loading="ui.okLoading"
        >完 成</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import CTree from "./tree";
import requestService from "@/utils/serviceCfg";
let serviceId = requestService.cc_gys;
export default {
  components: {
    CTree
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    currentRow: {},
    id: {
      type: String,
      default: ""
    },
    type: {},
    moduleType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      step: 0,
      menuTree: [],
      menuTreeAllHash: {},
      departmentTree: [],
      menuCheckList: [],
      departmentCheckList: [],
      departmentDefaultCheckList: [],
      ui: {
        loading: false,
        okLoading: false
      }
    };
  },
  computed: {
    isShow: {
      get() {
        return this.visible;
      },
      set(n) {
        this.$emit("update:visible", n);
      }
    }
  },
  methods: {
    closeSelf() {
      this.isShow = false;
    },
    onClosed() {
      this.step = 0;
    },
    async onOpen() {
      this.ui.loading = true;

      if (this.id) {
        await this.getMenuListAll();
        await this.getMenuList();

        // await this.getDepartmentTree();
      }

      this.ui.loading = false;
    },
    //取得所有权限
    async getMenuListAll() {
      let res = await this.$_request({
        url: "/Base/Module/GetModuleOperlist",
        method: "get",
        params: {
          objectid: this.id,
          f_Service: serviceId,
          f_ModuleType: 0
        }
      });
      let setp = function(list, p) {
        list.forEach(x => {
          x._parent = p;
          x._buttonList = [];
          if (x.Child) {
            setp(x.Child, x);
          }
        });
      };

      setp(res.data.data, null);
      res.data.data.map(x => {
        if (!this.menuTreeAllHash[x.F_Id]) {
          this.menuTreeAllHash[x.F_Id] = x;
        }
      });
    },
    async getMenuList() {
      let res = await this.$_request({
        url: "/Base/Module/GetModuleOperlist",
        method: "get",
        params: {
          objectid: this.id,
          f_Service: serviceId,
          f_ModuleType: this.moduleType
        }
      });
      let setp = function(list, p) {
        list.forEach(x => {
          x._parent = p;
          x._buttonList = [];
          if (x.Child) {
            setp(x.Child, x);
          }
        });
      };
      setp(res.data.data, null);
      this.menuTree = res.data.data;
    },
    async getDepartmentTree() {
      let res = await this.$_request({
        url: "/Base/Org/GetOrg",
        method: "get",
        params: {
          ObjectId: this.id
        }
      });

      this.departmentTree = res.data.data;

      let departmentDefaultCheckList = [];
      let loop = function(array) {
        array.forEach(x => {
          if (x.F_IsCheck === 1) {
            departmentDefaultCheckList.push(x.F_Id);
          }
          if (x.Child) {
            loop(x.Child);
          }
        });
      };
      loop(this.departmentTree);

      this.departmentDefaultCheckList = departmentDefaultCheckList;
    },
    async onOk() {
      this.menuTree.map(x => {
        this.menuTreeAllHash[x.F_Id] = x;
      });
      let tree = Object.values(this.menuTreeAllHash);
      let a = [];

      let loop = function(array) {
        array.forEach(x => {
          if (x.F_IsCheck === 1) {
            a.push(x);
          }

          if (x.Child) {
            loop(x.Child);
          }
        });
      };

      loop(tree);
      this.ui.okLoading = true;

      try {
        // await this.postForm2();
        await this.postForm1(
          a.map(x => {
            if (x.F_Type === 0) {
              return {
                f_moduleId: x.F_ModuleId,
                f_type: 0
              };
            } else {
              return {
                f_moduleId: x.F_ModuleId,
                f_operateID: x.F_OperId,
                f_type: 1
              };
            }
          })
        );

        this.closeSelf();
      } finally {
        this.ui.okLoading = false;
      }
    },
    async postForm1(list) {
      let data = list;
      await this.$_request({
        url: "/Base/Permission/Change",
        method: "post",
        data: {
          serviceId: serviceId,
          objectID: this.id,
          itemType: this.type,
          entryJson: JSON.stringify(data),
          sourceType: this.moduleType == 1 ? 1 : 2
        }
      });
    },
    async postForm2() {
      await this.$_request({
        url: "/Base/Org/SetOrg",
        method: "post",
        data: {
          objectID: this.id,
          itemType: this.type,
          OrgGuids: this.departmentCheckList.map(x => x.F_Id).join(",")
        }
      });
    },
    onMenuCheck(a, b) {
      this.menuCheckList = b.checkedNodes;
    },
    onDepartmentCheck(a, b) {
      this.departmentCheckList = b.checkedNodes;
    }
  }
};
</script>
