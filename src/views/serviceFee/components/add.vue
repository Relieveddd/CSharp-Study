<template>
  <el-dialog
    :title="title"
    :visible.sync="isShow"
    @closed="onClosed"
    @open="onOpen"
    width="550px"
  >
    <el-form label-width="6em" v-loading="ui.loading">
      <el-form-item label="结算方式" required>
        <el-select v-model="form.cycle" @change="selectCycle" placeholder="请选择" style="width:100%">
          <el-option
            v-for="(item, index) in cycleList"
            :key="index"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="日期范围"
        required
        :error="$v.form.dateRange.$error ? '必填' : ''"
      >
        <el-date-picker
          v-if="form.cycle === 1"
          v-model="form.dateRange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width:100%"
        >
        </el-date-picker>
        <el-date-picker
          v-else-if="form.cycle === 2"
          v-model="form.dateRange"
          format="yyyy-MM"
          value-format="yyyy-MM-dd"
          type="monthrange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width:100%"
        >
        </el-date-picker>
      </el-form-item>
    </el-form>
    <el-table border :data="form.tableData">
      <el-table-column show-overflow-tooltip label="费用类型">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.type"
            value-key="F_ItemDetailId"
            style="width:100%"
          >
            <el-option
              v-for="(item, index) in dictionaryData.fylx"
              :key="index"
              :label="item.F_ItemName"
              :value="item"
            >
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="费用">
        <template slot-scope="scope">
          <el-input-number
            v-model="scope.row.value"
            controls-position="right"
            style="width:100%"
          ></el-input-number>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="部门" v-if="departShow">
        <template slot-scope="scope">
          <el-cascader
            style="width:100%"
            v-model="scope.row.department"
            :options="departmentList"
            :props="{
              emitPath: false,
              checkStrictly: true,
              expandTrigger: 'hover'
            }"
          ></el-cascader>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="操作" align="right">
        <template slot="header">
          <el-button @click="onRowAdd" size="mini">添加</el-button>
        </template>
        <template slot-scope="scope">
          <el-button @click="onRowRemove(scope)" type="danger" size="mini"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer">
      <el-button @click="closeSelf">取 消</el-button>
      <el-button type="primary" @click="onOk" :loading="ui.okLoading"
        >确 认</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import dayjs from "dayjs";
import { required } from "@/utils/validator";
import { queryDictionaryDetailByCode } from "@/utils/api";

const data_form = function() {
  return {
    id: "",
    cycle: 1,
    dateRange: [],
    tableData: []
  };
};

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
  validations: {
    form: {
      cycle: {
        required
      },
      dateRange: {
        required
      }
    }
  },
  data() {
    return {
      form: data_form(),
      ui: {
        loading: false,
        okLoading: false
      },
      dictionaryData: {
        fylx: []
      },
      cycleList: [
        {
          label: "一次性",
          value: 1
        },
        {
          label: "每人每月",
          value: 2
        }
      ],
      departmentList: [],
      department: [],
      departShow: true
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
      return `${this.formType === "add" ? "新增" : "修改"}`;
    }
  },
  methods: {
    selectCycle(value) {
      if(value==1) {
        this.departShow = true
      }else{
        this.departShow = false
      }
    },
    closeSelf() {
      this.isShow = false;
    },
    onClosed() {
      this.form = data_form();
      this.$v.$reset();
    },
    async onOpen() {
      this.ui.loading = true;
      await Promise.all([
        this.getDictionaryData(),
        this.getDepartmentList()
      ]);
      
      this.ui.loading = false;
    },
    async onOk() {
      this.$v.form.$touch();
      if (this.$v.form.$error) return;
      let department = false;
      if(this.departShow){
        this.form.tableData.map(x => {
          if(x.department.length===0){
              department =true
          }
        })
      }
      if(department) {
        return this.$message({
          message: "请填写部门",
          type: "warning"
        });
      }
      if (!this.form.tableData.length) {
        
      }

      this.ui.okLoading = true;

      try {
        await this.postForm();

        this.$emit("ok");
        this.closeSelf();
        this.$message({
          message: "成功",
          type: "success"
        });
      } finally {
        this.ui.okLoading = false;
      }
    },
    async postForm() {
      let data = {
        f_Id: this.form.id,
        f_WeekType: this.form.cycle,
        f_StartDate: this.form.dateRange[0],
        f_EndDate: this.form.dateRange[1],
      };
      if(this.departShow) {
        data.f_Detail = this.form.tableData.map(x => {
          return {
            f_CostType: x.type.F_ItemDetailId,
            f_CostTypeZName: x.type.F_ItemName,
            f_CostValue: x.value,
            f_DepId:x.department.F_DepId
          };
        })
      }else {
        data.f_Detail = this.form.tableData.map(x => {
          return {
            f_CostType: x.type.F_ItemDetailId,
            f_CostTypeZName: x.type.F_ItemName,
            f_CostValue: x.value
          };
        })
      }

      if (this.form.cycle === 2) {
        data.f_EndDate = dayjs(this.form.dateRange[1])
          .endOf("month")
          .format("YYYY-MM-DD");
      }

      await this.$_request({
        url: "/HR/SalaryCost/Change",
        method: "post",
        data
      });
    },
    async getDictionaryData() {
      let resData = await queryDictionaryDetailByCode("fylx");

      Object.assign(this.dictionaryData, {
        fylx: resData.data
      });
    },
    onRowAdd() {
      this.form.tableData.push({
        type: {},
        value: "",
        department: []
      });
    },
    async onRowRemove(scope) {
      this.form.tableData.splice(scope.$index, 1);
    },
    async getDepartmentList() {
      let res = await this.$_request({
        url: "/HR/Department/GetTreeStructure",
        method: "get"
      });
    
      let loop = function(array = []) {
        return array.map(x => {
          let na = {
            label: x.F_DepName,
            value: x
          };
    
          if (x.Child) {
            na.children = loop(x.Child);
          }
          return na;
        });
      };
      this.departmentList = loop(res.data.data);
    },
  }
};
</script>

<style lang="scss" module></style>
