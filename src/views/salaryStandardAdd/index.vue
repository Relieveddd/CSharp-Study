<!-- 新建薪酬标准 -->

<template>
  <div v-loading="ui.loading">
    <el-steps :active="step" finish-status="success" simple>
      <el-step
        v-for="(item, index) in stepList"
        :key="index"
        :title="item"
      ></el-step>
    </el-steps>
    <div :class="$style['content']">
      <keep-alive>
        <el-form
          v-if="step === 0"
          :key="'step0'"
          label-width="8em"
          style="width:416px;margin:auto"
        >
          <el-form-item label="标准名称" required>
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="影响薪酬项目" required>
            <el-select
              v-model="form.salaryProjectList"
              placeholder="请选择"
              multiple
              reserve-keyword
              filterable
              style="width:100%"
              value-key="F_ItemId"
            >
              <el-option
                v-for="(item, index) in salaryProjectList"
                :key="index"
                :label="item.F_ItemName"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <template v-if="form.salaryProjectList.length > 0">
            <el-form-item label="行项目"  required>
              <el-select
                v-model="form.row"
                placeholder="请选择"
                value-key="F_ItemId"
                style="width:100%;"
              >
                <el-option
                  v-for="(item, index) in rowAndColList"
                  :key="index"
                  :label="item.F_ItemName"
                  :value="item"
                  v-if="item.F_ItemName!='==无=='"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="列项目" v-if="isRow" >
              <el-select
                v-model="form.col"
                placeholder="请选择"
                value-key="F_ItemId"
                style="width:100%;"
              >
                <el-option
                  v-for="(item, index) in rowAndColList"
                  :key="index"
                  :label="item.F_ItemName"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-form>
        <table
          v-else-if="step === 1"
          :key="'step1'"
          class=""
          :class="$style['table']"
        >
          <thead>
            <tr>
              <th scope="col"></th>
              <th v-for="(col, index) in tableColList " :key="index">
                {{ col.F_ItemName }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in tableRowList" :key="index">
              <th>{{ row.F_ItemName }}</th>
              <td v-for="(col, index) in tableColList" :key="index">
                <el-input-number
                  v-if="form.detail[row.F_ItemId]"
                  v-model="form.detail[row.F_ItemId][col.F_ItemId]"
                  controls-position="right"
                  size="mini"
                  style="width:100px"
                ></el-input-number>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else :key="'step2'">
          <mm-icon icon="iconwancheng1" size="128px" color="#67c23a"></mm-icon>
          <div style="text-align:center;font-size:18px;line-height:4em;">
            完成
          </div>
        </div>
      </keep-alive>
    </div>
    <div :class="$style['bs']">
      <el-button @click="prev" :disabled="ui.prev" v-if="step === 1"
        >上一步</el-button
      >
      <el-button @click="next" v-if="step === 0" :loading="ui.nextLoading"
        >下一步</el-button
      >
      <el-button @click="onOk" v-if="step === 1" type="primary">确认</el-button>
      <template v-if="step === 2">
        <el-button @click="onClose">关 闭</el-button>
        <el-button @click="onNew" type="primary" style="margin-left:40px;"
          >继续新建</el-button
        >
      </template>
    </div>
  </div>
</template>

<script>
import { fromPairs as fromEntries } from "lodash";

const data_form = function() {
  return {
    id: "",
    name: "",
    salaryProjectList: [],
    // 行
    row: "",
    // 列
    col: "",
    // 表格
    detail: {}
  };
};

export default {
  name: "salaryStandardAdd",
  data() {
    return {
      step: 0,
      stepList: ["选择条件", "录入金额", "完成"],
      form: data_form(),
      salaryProjectList: [],
      rowAndColList: [],
      rowList: [],
      colList: [],
      ui: {
        prev: false,
        nextLoading: false,
        loading: false
      }
    };
  },
  computed: {
    isRow() {
      return this.form.salaryProjectList.length === 1;
    },
    tableRowList() {
      if (this.isRow) {
        if(this.form.col.F_ItemId) {
          return this.rowList;
        }else{
          return this.form.salaryProjectList;
        }
      } else {
        return this.form.salaryProjectList;
      }
    },
    rowHash() {
      return fromEntries(
        this.tableRowList.map(x => {
          return [x.F_ItemId, x.F_ItemName];
        })
      );
    },
    tableColList() {
      if(this.colList.length ===0 ) {
        return this.rowList;
      }else{
        return this.colList;
      }
      
    },
    colHash() {
      return fromEntries(
        this.tableColList.map(x => {
          return [x.F_ItemId, x.F_ItemName];
        })
      );
    }
  },
  methods: {
    async next() {
      if (
        !this.form.name ||
        this.form.salaryProjectList.length === 0 ||
        !this.form.row ||
        (this.form.salaryProjectList.length === 1 && !this.form.row) || (this.form.salaryProjectList.length > 1 && !this.form.row)
      ) {
        return this.$message({
          message: "请填写完整",
          type: "warning"
        });
      }
      this.ui.nextLoading = true;
      try {
        if (this.isRow) {
          let colF_ItemId = this.form.col.F_ItemId
          if(!colF_ItemId){
            colF_ItemId = this.form.row.F_ItemId
          }
          await Promise.all([
            this.queryColList(colF_ItemId),
            this.queryRowList(this.form.row.F_ItemId)
          ]);
        } else {
          await this.queryColList(this.form.row.F_ItemId);
        }

        let detail = {};

        this.tableRowList.forEach(row => {
          if (!detail[row.F_ItemId]) {
            detail[row.F_ItemId] = {};
          }

          this.tableColList.forEach(col => {
            detail[row.F_ItemId][col.F_ItemId] = "";
          });
        });
        this.form.detail = detail;
        this.step++;
      } finally {
        this.ui.nextLoading = false;
      }
    },
    prev() {
      this.step--;
    },
    async onOk() {
      let detail = this.tToA(this.form.detail);

      let data = {
        f_Id: this.form.id,
        f_Name: this.form.name,
        f_SalaryItemId: this.form.salaryProjectList.map(x => x.F_ItemId).join(),
        f_Row: this.form.row.F_ItemId,
        f_Col: this.form.col.F_ItemId,
        f_EnableMark: true,
        f_Detail: detail.map(x => {
          return {
            f_Id: "",
            f_TId: "",
            f_RowId: x.rowId,
            f_RowIdZName: this.rowHash[x.rowId],
            f_ColId: x.colId,
            f_ColIdZName: this.colHash[x.colId],
            f_Value: x.value,
            isCreate: true
          };
        })
      };

      this.ui.loading = true;

      try {
        await this.$_request({
          url: "/HR/Stand/Change",
          method: "post",
          data
        });

        this.$_eventBus.$emit("salaryStandardAdd");
        this.step = 2;
      } finally {
        this.ui.loading = false;
      }
    },
    async onNew() {
      this.step = 0;
      this.form = data_form();
    },
    onClose() {
      if(this.$route.name === "salaryStandardEdit") {
        this.$store.dispatch("tabView/closeTab", {
          tabName: "salaryStandardEdit"
        });
      }else{
        this.$store.dispatch("tabView/closeTab", {
          tabName: "salaryStandardAdd"
        });
      }
      
    },
    async querySalaryProject() {
      let res = await this.$_request({
        url: "/HR/SalaryItems/GetList",
        method: "get"
      });
      this.salaryProjectList = res.data.data;
    },
    async queryRowAndColList() {
      let res = await this.$_request({
        url: "/HR/Stand/GetRowAndCol",
        method: "get"
      });
      res.data.data.unshift({F_ItemId: '', F_ItemName: '==无=='})
      this.rowAndColList = res.data.data;
    },
    async queryRowList(id = "") {
      let res = await this.$_request({
        url: "/HR/Stand/GetRowAndColDetail",
        method: "get",
        params: {
          rcid: id
        }
      });
      
      this.rowList = res.data.data;
    },
    async queryColList(id = "") {
      let res = await this.$_request({
        url: "/HR/Stand/GetRowAndColDetail",
        method: "get",
        params: {
          rcid: id
        }
      });
      this.colList = res.data.data;
    },
    async queryForm(id = "") {
      let res = await this.$_request({
        url: "/HR/Stand/GetSingle",
        method: "get",
        params: {
          id
        }
      });

      let data = res.data.data;

      let salaryProjectHash = {};
      this.salaryProjectList.forEach(x => {
        salaryProjectHash[x.F_ItemId] = x.F_ItemName;
      });

      Object.assign(this.form, {
        id: data.F_Id,
        name: data.F_Name,
        salaryProjectList: (data.F_SalaryItemId || "").split(",").map(x => {
          return {
            F_ItemId: x,
            F_ItemName: salaryProjectHash[x] || x
          };
        }),
        // 行
        row: {
          F_ItemId: data.F_Row
        },
        // 列
        col: {
          F_ItemId: data.F_Col
        },
        // 表格
        detail: this.aToT(data.F_Detail)
      });

      if (this.isRow) {
        await Promise.all([
          this.queryColList(this.form.col.F_ItemId),
          this.queryRowList(this.form.row.F_ItemId)
        ]);
      } else {
        if(this.form.col.F_ItemId){
          await this.queryColList(this.form.col.F_ItemId);
        }else{
          await this.queryColList(this.form.row.F_ItemId);
        }
        
      }
    },
    aToT(array = []) {
      let t = {};

      array.forEach(x => {
        if (!t[x.F_RowId]) {
          t[x.F_RowId] = {};
        }
        t[x.F_RowId][x.F_ColId] = x.F_Value;
      });

      return t;
    },
    tToA(tree = {}) {
      let array = [];

      for (const rowId of Object.keys(tree)) {
        for (const colId of Object.keys(tree[rowId])) {
          array.push({
            rowId,
            colId,
            value: tree[rowId][colId]
          });
        }
      }

      return array;
    }
  },
  async created() {
    this.ui.loading = true;

    if (this.$route.query.id) {
      this.step = 1;
      this.ui.prev = true;
      await Promise.all([this.querySalaryProject(), this.queryRowAndColList()]);
      await this.queryForm(this.$route.query.id);
    } else {
      this.step = 0;
      this.ui.prev = false;
      this.form = data_form();
      await Promise.all([this.querySalaryProject(), this.queryRowAndColList()]);
    }

    this.ui.loading = false;
  }
};
</script>

<style lang="scss" module>
.content {
  margin: auto;
  margin-top: 56px;
  overflow: auto;
  .table {
    color: #909399;
    font-size: 12px;
    width: 100%;
    border-bottom: 1px solid #dee2e6;
    border: solid 1px #dee2e6;
    border-spacing: 0;
    th,
    td {
      padding: 8px 4px;
      border-top: 1px solid #dee2e6;
      min-width: 8em;
      text-align: start;
    }
    thead {
      th {
        border-top-color: transparent;
      }
    }
    .input {
      border: solid 1px #dcdfe6;
      border-radius: 2px;
      width: 100%;
      padding: 4px 8px;
    }
  }
}
.bs {
  margin-top: 56px;
  text-align: center;
}
</style>
