<template>
  <el-dialog
    :title="title"
    :visible.sync="isShow"
    @open="onOpen"
    @closed="onClosed"
  >
    <mm-atp>
      <template v-slot:table>
        <el-table
          border
          :data="tableData"
          @selection-change="onSelectionChange"
          v-loading="ui.loading"
        >
          <el-table-column
            show-overflow-tooltip
            type="selection"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            type="index"
            label="序号"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="F_Name"
            label="项目"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="F_Describe"
            label="描述"
          ></el-table-column>
          <!-- <el-table-column show-overflow-tooltip label="操作">
            <template slot-scope="scope">
              <el-button @click="onRemove(scope)" size="mini">删除</el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </template>
    </mm-atp>
    <span slot="footer">
      <el-button @click="closeSelf">取消</el-button>
      <el-button type="primary" @click="onOk">确定</el-button>
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
      tableData: [],
      tableSelectionData: [],
      ui: {
        add: false,
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
      return "选择项目";
    }
  },
  methods: {
    onSelectionChange(val) {
      this.tableSelectionData = val;
    },
    onAdd() {
      this.ui.add = true;
    },
    async onRemove(scope) {
      await this.$_request({
        url: "/HR/SalaryItems/Del",
        method: "post",
        params: {
          ids: scope.row.F_Id
        }
      });

      this.getList();
    },
    onEdit(scope) {
      let row = scope.row;

      Object.assign(this.$refs.form.form, {
        id: row.F_Id,
        name: row.F_Name,
        remark: row.F_Describe,
        type: row.F_Type
      });

      this.ui.add = true;
    },
    onOpen() {
      this.getList();
    },
    closeSelf() {
      this.isShow = false;
    },
    onClosed() {},
    async onOk() {
      this.$emit("attach", this.tableSelectionData);
      this.closeSelf();
    },
    async getList() {
      this.ui.loading = true;

      try {
        let res = await this.$_request({
          url: "/HR/SalaryItems/List",
          method: "post",
          data: {
            queryJson_S: "",
            queryJson: "",
            orderJson: "",
            pageIndex: 1,
            pageSize: 9999
          }
        });
        this.tableData = res.data.data.filter(x => {
          return x.F_ItemType === 2 || x.F_ItemType === 3;
        });
      } finally {
        this.ui.loading = false;
      }
    }
  }
};
</script>
