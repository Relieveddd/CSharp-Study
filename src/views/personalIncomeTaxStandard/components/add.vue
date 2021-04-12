<template>
  <el-dialog
    :title="title"
    :visible.sync="isShow"
    @closed="onClosed"
    width="900px"
  >
    <el-table border :data="tableData">
      <el-table-column show-overflow-tooltip type="index" label="序号">
      </el-table-column>
      <el-table-column show-overflow-tooltip label="条件">
        <template slot-scope="scope">
          <el-select v-model="scope.row.operator1" placeholder="请选择">
            <el-option
              v-for="(item, index) in operatorList"
              :key="index"
              :label="item"
              :value="Number(index)"
            >
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="金额" min-width="150px">
        <template slot-scope="scope">
          <div style="display: flex;align-items: center;">
            <el-input v-model="scope.row.value1"></el-input>
            <span style="margin:0 8px;">至</span>
            <el-input v-model="scope.row.value2"></el-input>
          </div>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="税率%">
        <template slot-scope="scope">
          <el-input v-model="scope.row.tariff"></el-input>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="速算扣除数">
        <template slot-scope="scope">
          <el-input v-model="scope.row.deduction"></el-input>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="操作">
        <template slot="header">
          <el-button @click="onAdd" size="mini">添加</el-button>
        </template>
        <template slot-scope="scope">
          <el-button @click="onRemove(scope)" type="danger" size="mini"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer">
      <el-button @click="closeSelf">取 消</el-button>
      <el-button type="primary" @click="onOk" :loading="ui.loading"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    formType: {
      type: String,
      default: "add"
    }
  },
  data() {
    return {
      operatorList: {
        0: "不超过",
        1: "超过"
      },
      tableData: [],
      pagination: {
        current: 1,
        total: 1,
        size: 20
      },
      ui: {
        loading: false
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
    },
    title() {
      return `${this.formType === "add" ? "新增" : "修改"}个税缴纳标准`;
    }
  },
  methods: {
    closeSelf() {
      this.isShow = false;
    },
    onClosed() {
      this.tableData = [];
    },
    async onOk() {
      this.ui.loading = true;

      try {
        await this.postForm();

        this.$emit("update");
        this.closeSelf();
        this.$message({
          message: "成功",
          type: "success"
        });
      } finally {
        this.ui.loading = false;
      }
    },
    async postForm() {
      let data = this.tableData.map(x => {
        return {
          f_Id: x.id,
          f_Operation: x.operator1,
          f_MinValue: x.value1,
          f_MaxValue: x.value2,
          f_Tax: x.tariff,
          f_Fast: x.deduction
        };
      });

      await this.$_request({
        url: "/HR/PersTax/BatchChange",
        method: "post",
        data
      });
    },
    onAdd() {
      this.tableData.push({
        id: null,
        operator1: null,
        value1: null,
        value2: null,
        tariff: null,
        deduction: null,
        remark: ""
      });
    },
    async onRemove(scope) {
      if (scope.row.id) {
        await this.$_request({
          url: "/HR/PersTax/Del",
          method: "post",
          params: {
            ids: scope.row.id
          }
        });

        this.$emit("update");
      }

      this.tableData.splice(scope.$index, 1);
    }
  }
};
</script>

<style lang="scss" module>
.condition {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 16px;
}
.other {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 16px;
}
</style>
