<!-- 人事档案 -->

<template>
  <mm-atp palign="right" v-loading="ui.loading">
    <template v-slot:action-left>
      <el-col :span="18">
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
      </el-col>
      <el-col :span="4">
        <el-checkbox style="line-height: 32px;" @change="checkedChange" v-model="checked">显示离职</el-checkbox>
      </el-col>
      
    </template>
    <template v-slot:action-right>
      
      <el-button @click="onAdd" type="primary" v-if="checkButton('add')"
        >新增</el-button
      >
      <el-button
        @click="onEdit"
        :disabled="disabledEdit"
        v-if="checkButton('edit')"
        >修改</el-button
      >
      <el-button @click="download" type="primary" v-if="checkButton('templatetoupload')"
        >合同模板下载</el-button
      >
      <el-button
        :disabled="disabledEdit"
        @click="onPermission"
        v-if="checkButton('authorize')"
        >授权</el-button
      >
      <el-popover placement="bottom" v-model="ui.resetPassword">
        <el-button
          slot="reference"
          :disabled="disabledEdit"
          :loading="ui.resetPasswordLoading"
          v-if="checkButton('resetPassword')"
          >重置密码</el-button
        >
        <p>确定重置密码吗？</p>
        <div style="text-align: right;">
          <el-button
            size="mini"
            type="danger"
            :disabled="disabledEdit"
            @click="onResetPassword"
            :loading="ui.resetPasswordLoading"
            >确定</el-button
          >
        </div>
      </el-popover>
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
      <template v-if="false">
        <el-button
          :disabled="false"
          @click="onTransfer"
          v-if="checkButton('transferAdministrator')"
          >转移管理员</el-button
        >
      </template>
    </template>
    <template v-slot:table>
      <el-table
        border
        height="100%"
        ref="table"
        :data="tableData"
        highlight-current-row
        @selection-change="onSelectionChange"
        @current-change="onCurrentChange"
      >
        <el-table-column show-overflow-tooltip type="selection">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          type="index"
          label="序号"
        ></el-table-column>
        <el-table-column show-overflow-tooltip prop="F_EmpCode" label="编号">
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="F_EmpName" label="姓名">
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="F_Sex" label="性别">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="F_EducationZName"
          label="文化程度"
        >
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="F_IdCard" label="身份证号">
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="F_Nation" label="民族">
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="F_SkillZName" label="技能">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="F_BirthDay"
          label="出生日期"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="F_WorkDate"
          label="入职日期"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="F_DepName"
          label="所属部门"
        >
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="F_PostName" label="岗位">
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="F_JobName" label="职位">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="F_JobLevelZName"
          label="职位级别"
        >
        </el-table-column>
        <!-- <el-table-column show-overflow-tooltip prop="F_RoleType" label="角色">
          <template v-slot="scope">
            {{ roleTypeList[scope.row.F_RoleType] }}
          </template>
        </el-table-column> -->
        
        <!-- <el-table-column show-overflow-tooltip prop="F_Status" label="在职状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.F_Status"
              active-color="#409eff"
              inactive-color="#c4c4c4"
              :active-value="1"
              :inactive-value="0"
              @click.stop.native
              @change="onChange($event, scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column> -->
        <el-table-column show-overflow-tooltip prop="F_StatusName" label="在职状态"></el-table-column>
        
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
      <c-bf :visible.sync="ui.bf" :id="currentId" @close="onClose"></c-bf>
    </template>
    <template v-slot:other>
      <c-permission
        :visible.sync="ui.permission"
        :id="(currentRow && currentRow.F_EmpID) || ''"
        :type="1"
      ></c-permission>
      <c-transfer :visible.sync="ui.transfer"></c-transfer>
    </template>
  </mm-atp>
</template>

<script>
import { queryPersonnel,FileGetSingle } from "@/utils/api";
import CBf from "./components/bf";
import CPermission from "@/views/companyStructure/role/components/permission";
import checkPermission from "@/utils/checkPermission";
import CTransfer from "./components/transfer";
export default {
  name: "personnelProfile",
  mixins: [checkPermission],
  components: {
    CBf,
    CPermission,
    CTransfer
  },
  data() {
    return {
      checked: false,
      currentId: "",
      query: {
        year: "",
        month: "",
        keyword: ""
      },
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
        bf: false,
        loading: false,
        permission: false,
        removeLoading: false,
        resetPassword: false,
        resetPasswordLoading: false,
        transfer: false
      },
      roleTypeList: {
        1: "平台管理员",
        2: "公司管理员",
        3: "普通员工"
      }
    };
  },
  computed: {
    monthList() {
      let array = [];

      for (let index = 1; index <= 12; index++) {
        array.push({
          label: `${index}月`,
          value: `${index}`.padStart(2, 0)
        });
      }

      return array;
    },
    disabledEdit() {
      return this.tableSelectionData.length === 1 ? false : true;
    },
    disabledRemove() {
      return this.tableSelectionData.length > 0 ? false : true;
    }
  },
  watch: {
    query() {
      this.getList();
    }
  },
  methods: {
    async getList() {
      this.ui.loading = true;
      try {
        let resData = await queryPersonnel({
          queryJson_S: JSON.stringify({
            query: this.query.keyword
          }),
          queryJson: "",
          orderJson: "",
          pageIndex: this.pagination.current,
          pageSize: this.pagination.size,
          isShow: this.checked ? 1 : 0
        });
        this.tableData = resData.data;
        this.pagination.total = resData.record || 1;
      } finally {
        this.ui.loading = false;
      }
    },
    async onAdd() {
      this.closeAddTab();
      await this.$nextTick();

      this.$router.replace({
        name: "personnelProfileAdd"
      });
    },
    async download() {
      let id = this.$store.state.SysConfig.f_ContractTemplate;
      await FileGetSingle(id).then(function(res){
         if(res.code==200){
           let url = `${process.env.VUE_APP_API_BASEURL || ""}`+res.data.F_FilePath;
           window.open(url);
         }
      });
    },
    async onChangeStatus() {},
    async onEdit() {
      this.closeAddTab();
      await this.$nextTick();

      this.$router.replace({
        name: "personnelProfileEdit",
        query: {
          id: this.tableSelectionData[0].F_EmpID
        }
      });
    },
    async onChange(a, b) {
      await this.$_request({
        url: "/HR/Emp/UpdateState",
        method: "post",
        params: {
          F_EmpId: b.F_EmpID,
          F_States: a
        }
      });

      this.$message({
        message: "状态修改成功",
        type: "success"
      });
    },
    async onResetPassword() {
      let row = this.tableSelectionData[0];

      try {
        await this.$_request({
          url: "/HR/Emp/ResetPwd",
          method: "post",
          params: {
            F_EmpId: row.F_EmpID
          }
        });

        this.$message({
          message: "成功",
          type: "success"
        });
      } finally {
        this.ui.resetPassword = false;
        this.ui.resetPasswordLoading = false;
      }
    },
    onPermission() {
      this.currentRow = this.tableSelectionData[0];
      this.ui.permission = true;
    },
    onClose() {
      this.$refs.table.setCurrentRow([]);
    },
    closeAddTab() {
      this.$store.commit("tabView/removeTab", {
        tab: {
          name: "personnelProfileAdd"
        }
      });

      this.$store.commit("tabView/removeTab", {
        tab: {
          name: "personnelProfileEdit"
        }
      });
    },
    async onRemove() {
      this.ui.removeLoading = true;

      try {
        await this.$_request({
          url: "/HR/Emp/Del",
          method: "post",
          params: {
            ids: this.tableSelectionData.map(x => x.F_EmpID).join(",")
          }
        });

        this.ui.remove = false;
        this.getList();
      } finally {
        this.ui.removeLoading = false;
      }
    },
    async onEnable() {
      await this.$_request({
        url: "/HR/Emp/UpdateState",
        method: "post",
        params: {
          F_EmpId: this.tableSelectionData[0].F_EmpID,
          F_States: 0
        }
      });
    },
    async onDisable() {},
    onSelectionChange(val) {
      this.tableSelectionData = val;
    },
    async onCurrentChange(currentRow) {
      if (currentRow) {
        this.currentId = currentRow.F_EmpID;
        this.ui.bf = true;
      }
    },
    onTransfer() {
      this.ui.transfer = true;
    },
    checkedChange(val) {
      this.getList();
    }
  },
  created() {
    this.getList();
    this.$_eventBus.$on("personnelProfileAdd", this.getList);
  },
  beforeDestroy() {
    this.$_eventBus.$off("personnelProfileAdd", this.getList);
  }
};
</script>
