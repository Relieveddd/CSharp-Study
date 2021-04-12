<template>
  <el-dialog
    title="工资单明细"
    :visible.sync="isShow"
    @closed="onClosed"
    @open="onOpen"
    :fullscreen="true"
  >
    <mm-atp>
      <template v-slot:table>
        <el-table border :data="tableData" size="mini">
          <template v-for="(v, k) in tableHeaderTree">
            <el-table-column
              :key="k"
              v-if="v.list.length"
              :label="v.title"
              align="center"
            >
              <el-table-column
                v-for="(item, index) in v.list"
                :key="index"
                :label="item.f_title"
                align="center"
              >
                <template v-slot="scope">
                  <template>
                    {{ scope.row[item.f_columnId] }}
                  </template>
                </template>
              </el-table-column>
            </el-table-column>
          </template>
        </el-table>
      </template>
    </mm-atp>
    <span slot="footer">
      <el-alert
        v-if="type === 'audit'"
        title="特别说明"
        type="warning"
        :closable="false"
        show-icon
        style="margin-bottom:16px;text-align:start;"
      >
        1.如某个人员有异常，则请暂不审批并电话通知相关制单人员修改后再行审批
        <br />
        2.一旦审批确认后，则意味着本明细呈现的所有人员均审批通过，信息将不能修改
        <br />
        3.审批后如确实发现有人员薪酬有误，则在下月工资表中进行补发或扣发
      </el-alert>
      <el-button @click="closeSelf" style="margin-right:16px;">
        {{ type === "audit" ? "取消审批" : "取消" }}
      </el-button>
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
        v-model="ui.confirm"
        v-if="type === 'confirm'"
      >
        <el-button slot="reference" type="primary" :loading="ui.confirmLoading"
          >发放</el-button
        >
        <p>确定发放吗？</p>
        <div style="text-align: right;">
          <el-button
            size="mini"
            type="danger"
            :loading="ui.confirmLoading"
            @click="onConfirm"
            >确定</el-button
          >
        </div>
      </el-popover>
    </span>
  </el-dialog>
</template>

<script>
let data_tableHeaderTree = function() {
  return {
    1: {
      title: "个人信息",
      list: []
    },
    2: {
      title: "应发",
      list: []
    },
    3: {
      title: "扣发",
      list: []
    },
    4: {
      title: "社保",
      list: []
    },
    5: {
      title: "个税",
      list: []
    },
    6: {
      title: "实发",
      list: []
    },
    other: {
      title: "其他",
      list: []
    }
  };
};

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
      tableHeaderTree: data_tableHeaderTree(),
      ui: {
        loading: false,
        okLoading: false,
        revokeLoading: false,
        auditLoading: false,
        audit: false,
        revoke: false,
        confirm: false,
        confirmLoading: false
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
    async onOpen() {
      this.get();
    },
    closeSelf() {
      this.isShow = false;
    },
    onClosed() {
      this.tableHeaderTree = data_tableHeaderTree();
      this.ui.loading = false;
    },
    async onOk() {
      if (this.step === 0) {
        this.$v.form.$touch();
        if (this.$v.form.$error) return;

        this.ui.okLoading = true;

        try {
          await this.postForm1();
          this.step = 1;
        } finally {
          this.ui.okLoading = false;
        }
      } else if (this.step === 1) {
        this.ui.okLoading = true;

        try {
          await this.postForm2();
          this.closeSelf();
          this.$message({
            message: "成功",
            type: "success"
          });
          this.$emit("ok");
        } catch (error) {
          this.ui.okLoading = false;
        }
      }
    },
    async get() {
      if (!this.currentRow || !this.currentRow.F_Id) return;

      this.ui.loading = true;

      let res = await this.$_request({
        url: "/HR/SalarySlip/GetReport",
        method: "get",
        params: {
          id: this.currentRow.F_Id,
          pageIndex: 1,
          pageSize: 9999
        }
      });

      let resData = res.data.data;

      resData.F_GridHead.filter(x => x.f_show === 1).forEach(x => {
        this.tableHeaderTree[x.f_coltype || "other"].list.push(x);
      });
      this.tableData = resData.F_RowsData
        ? resData.F_RowsData.map(x => {
            return JSON.parse(x.F_SalaryJson);
          })
        : [];
      this.ui.loading = false;
    },
    async onAudit() {
      this.ui.auditLoading = true;

      try {
        await this.$_request({
          url: "/HR/SalarySlip/UpdateStates",
          method: "post",
          params: {
            id: this.currentRow.F_Id,
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
          url: "/HR/SalarySlip/UpdateStates",
          method: "post",
          params: {
            id: this.currentRow.F_Id,
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
    async onConfirm() {
      this.ui.confirmLoading = true;
      try {
        await this.$_request({
          url: "/HR/SalarySlip/UpdateStates",
          method: "post",
          params: {
            id: this.currentRow.F_Id,
            state: 2
          }
        });

        this.$message({
          message: "成功",
          type: "success"
        });
        this.$emit("ok");
        this.closeSelf();
      } finally {
        this.ui.confirm = false;
        this.ui.confirmLoading = false;
      }
    }
  }
};
</script>
