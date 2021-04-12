<template>
  <el-dialog
    title="明细"
    :visible.sync="isShow"
    @closed="onClosed"
    @open="onOpen"
    :fullscreen="true"
  >
    <mm-atp v-loading="ui.loading">
      <template v-slot:action-left>
        <el-input
          placeholder="关键词搜索"
          v-model="keyword"
          @keyup.enter.native="tableFilter"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="tableFilter"
          ></el-button>
        </el-input>
      </template>
      <template v-slot:action-right>
        <el-col style="width: 60px;margin-right: 10px;" v-if="hide">
          <el-button @click="download">查看附件</el-button>
        </el-col>
      </template>
      
      <template v-slot:table>
        <el-table
          border
          :data="currentTableData"
          @selection-change="onSelectionChange"
          default-expand-all
        >
          <el-table-column show-overflow-tooltip label="序号" type="index">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="F_EmpName" label="员工">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="F_DepName" label="部门">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="F_JobName" label="职务">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="F_PostName" label="岗位">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="F_OldJobLev"
            label="当前等级"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="F_NewJobLev"
            label="核定等级"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="F_ReMark" label="说明">
          </el-table-column>
        </el-table>
      </template>
    </mm-atp>
    <span slot="footer">
      <el-button @click="closeSelf" style="margin-right:16px;">关 闭</el-button>
      <el-popover placement="bottom" v-model="ui.audit" v-if="type === 'audit'">
        <el-button slot="reference" type="primary" :loading="ui.auditLoading"
          >审批</el-button
        >
        <p>确定审批吗？</p>
        <div style="text-align: right;">
          <el-button
            size="mini"
            type="danger"
            :loading="ui.auditLoading"
            @click="onAudit"
            >确定</el-button
          >
        </div>
      </el-popover>
      <el-popover
        placement="bottom"
        v-model="ui.revoke"
        v-if="type === 'revoke'"
      >
        <el-button slot="reference" type="primary" :loading="ui.revokeLoading"
          >作废</el-button
        >
        <p>确定作废吗？</p>
        <div style="text-align: right;">
          <el-button
            size="mini"
            type="danger"
            :loading="ui.revokeLoading"
            @click="onRevoke"
            >确定</el-button
          >
        </div>
      </el-popover>
      <el-popover
        placement="bottom"
        v-model="ui.remove"
        v-if="type === 'remove'"
      >
        <el-button slot="reference" type="primary" :loading="ui.removeLoading"
          >删除</el-button
        >
        <p>确定删除吗？</p>
        <div style="text-align: right;">
          <el-button
            size="mini"
            type="danger"
            :loading="ui.removeLoading"
            @click="onRemove"
            >确定</el-button
          >
        </div>
      </el-popover>
    </span>
  </el-dialog>
</template>

<script>
  import {FileGetSingle,FileGetFileList} from "@/utils/api";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    currentRow: {
      type: Object,
      default() {
        return {};
      }
    },
    type: {
      type: String,
      default: "detail"
    }
  },
  data() {
    return {
      tableData: [],
      tableSelectionData: [],
      currentTableData: [],
      keyword: "",
      ui: {
        loading: false,
        revokeLoading: false,
        auditLoading: false,
        audit: false,
        revoke: false,
        remove: false,
        removeLoading: false
      },
      f_Attach: '',
      hide: false,
      url: ''
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
    },
    disabledRemove() {
      return this.tableSelectionData.length > 0 ? false : true;
    }
  },
  methods: {
    tableFilter() {
      let keyword = this.keyword;

      if (keyword) {
        this.currentTableData = this.tableData.filter(x => {
          let vs = Object.values(x);
          return vs.some(x => {
            return String(x).includes(keyword);
          });
        });
      } else {
        this.currentTableData = this.tableData;
      }
    },
    async onOpen() {
      this.get();
    },
    closeSelf() {
      this.isShow = false;
    },
    onClosed() {
      this.keyword = "";
    },
    onSelectionChange(val) {
      this.tableSelectionData = val;
    },
    async get() {
      if (!this.currentRow || !this.currentRow.F_Id) return;

      this.ui.loading = true;
      let that = this;
      await this.$_request({
        url: "/HR/LevAdjust/GetSingle",
        method: "get",
        params: {
          id: this.currentRow.F_Id
        }
      }).then(function(res) {
        let resData = res.data.data;
        that.f_Attach = resData.F_Id;
        if(resData.F_Attach){
          that.hide = true
        };
        that.currentTableData = that.tableData = resData.F_Detail;
        that.ui.loading = false;
        //////查看附件//////
        that.find();
      });
      
    },
    async onAudit() {
      this.ui.auditLoading = true;

      try {
        await this.$_request({
          url: "/HR/LevAdjust/UpdateStates",
          method: "post",
          params: {
            ids: this.currentRow.F_Id,
            state: 1
          }
        });

        this.$message({
          message: "成功",
          type: "success"
        });
        this.$emit("ok");
        this.closeSelf();
      } finally {
        this.ui.audit = false;
        this.ui.auditLoading = false;
      }
    },
    async onRevoke() {
      this.ui.revokeLoading = true;

      try {
        await this.$_request({
          url: "/HR/LevAdjust/UpdateStates",
          method: "post",
          params: {
            ids: this.currentRow.F_Id,
            state: 9
          }
        });

        this.$message({
          message: "成功",
          type: "success"
        });
        this.$emit("ok");
        this.closeSelf();
      } finally {
        this.ui.revoke = false;
        this.ui.revokeLoading = false;
      }
    },
    async onRemove() {
      this.ui.removeLoading = true;

      try {
        await this.$_request({
          url: "/HR/LevAdjust/Del",
          method: "post",
          params: {
            ids: this.currentRow.F_Id
          }
        });

        this.$message({
          message: "成功",
          type: "success"
        });
        this.$emit("ok");
        this.closeSelf();
      } finally {
        this.ui.remove = false;
        this.ui.removeLoading = false;
      }
    },
    find() {
      if(this.f_Attach) {
        let that = this;
        FileGetFileList(this.f_Attach).then(function(res){
           if(res.code==200 && res.data.length>0){
             that.url = `${process.env.VUE_APP_API_BASEURL || ""}`+res.data[0].F_FilePath;
             that.hide = true;
           }
        });
      }
    },
    download() {
      window.open(this.url);
    }
  }
};
</script>
