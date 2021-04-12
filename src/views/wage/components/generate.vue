<template>
  <el-dialog
    title="生成工资单"
    :visible.sync="isShow"
    @closed="onClosed"
    @open="onOpen"
    width="max-content"
    :fullscreen="step === 1 ? true : false"
  >
    <el-form label-width="6em" v-loading="ui.loading" v-if="step === 0">
      <el-form-item
        label="选择时间"
        required
        :error="$v.form.yearMonth.$error ? '必填' : ''"
      >
        <el-date-picker
          v-model="form.yearMonth"
          type="month"
          placeholder="选择月"
          style="width:100%;"
          value-format="yyyy,MM"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item
        label="薪酬方案"
        required
        :error="$v.form.salaryId.$error ? '必填' : ''"
      >
        <el-select
          v-model="form.salaryId"
          placeholder="请输入关键词"
          value-key="F_Id"
          multiple
          style="width:100%"
        >
          <el-option
            v-for="(item, index) in salaryList"
            :key="index"
            :label="item.F_Name"
            :value="item.F_Id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="部门"
        required
        :error="$v.form.departmentList.$error ? '必填' : ''"
      >
        <el-cascader
          style="width:100%"
          v-model="form.departmentList"
          :options="departmentList"
          :props="{
            emitPath: false,
            multiple: true,
            checkStrictly: true,
            value: 'F_DepId',
            label: 'F_DepName',
            children: 'Child',
            expandTrigger: 'hover'
          }"
        ></el-cascader>
      </el-form-item>
      <el-form-item
        label="人员类别"
        required
        :error="$v.form.personnelTypeId.$error ? '必填' : ''"
      >
        <el-select
          v-model="form.personnelTypeId"
          placeholder="请输入关键词"
          value-key="F_ItemDetailId"
          style="width:100%"
        >
          <el-option
            v-for="(item, index) in dictionaryData.rylb"
            :key="index"
            :label="item.F_ItemName"
            :value="item.F_ItemDetailId"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <mm-atp v-else-if="step === 1">
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
        <el-button @click="closeSelf">取 消</el-button>
        <el-button type="primary" @click="onOk" :loading="ui.okLoading"
          >确 认</el-button
        >
      </template>
      <template v-slot:table>
        <el-table border :data="currentTableData" size="mini">
          <template v-for="(v, k) in tableHeaderTree">
            <el-table-column
              :key="k"
              :label="v.title"
              v-if="v.list.length"
              align="center"
            >
              <el-table-column
                v-for="(item, index) in v.list"
                :key="index"
                :label="item.f_title"
                align="center"
              >
                <template v-slot="scope">
                  <template v-if="item.f_type === 1">
                    <input
                      v-if="typeof scope.row[item.f_columnId] === 'number'"
                      type="number"
                      v-model.number="scope.row[item.f_columnId]"
                      style="width:100%;"
                    />
                    <el-input
                      v-else
                      v-model="scope.row[item.f_columnId]"
                    ></el-input>
                  </template>
                  <template v-else>
                    {{ scope.row[item.f_columnId] }}
                  </template>
                </template>
              </el-table-column>
            </el-table-column>
          </template>
        </el-table>
      </template>
      <template v-slot:bottom>
        <div :class="$style['bottomInfo']">
          <div :class="$style['node']" v-for="(v, k) in bottomInfo" :key="k">
            {{ k }}：{{ v }}
          </div>
        </div>
      </template>
    </mm-atp>
    <span slot="footer" v-if="step === 0">
      <el-button @click="closeSelf">取 消</el-button>
      <el-button type="primary" @click="onOk" :loading="ui.okLoading"
        >确 认</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import math from "@/utils/math";
import { required } from "@/utils/validator";
import { queryDictionaryDetailByCode } from "@/utils/api";

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

const data_form = function() {
  return {
    yearMonth: "",
    salaryId: [],
    socialSecurityId: null,
    departmentList: [],
    personnelTypeId: null
  };
};

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  validations: {
    form: {
      yearMonth: {
        required
      },
      salaryId: {
        required
      },
      departmentList: {
        required
      },
      personnelTypeId: {
        required
      }
    }
  },
  data() {
    return {
      keyword: "",
      step: 0,
      form: data_form(),
      salaryList: [],
      socialSecurityList: [],
      departmentList: [],
      ui: {
        loading: false,
        okLoading: false
      },
      tableHeaderList: [],
      tableHeaderTree: data_tableHeaderTree(),
      tableData: [],
      currentTableData: [],
      dictionaryData: {
        rylb: []
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
    bottomInfo() {
      let info = {};

      this.tableHeaderList
        .filter(x => x.f_type === 3)
        .forEach(x => {
          info[x.f_title] = this.currentTableData.reduce(
            (accumulator, currentValue) => {
              return math
                .evaluate(`${accumulator}+${currentValue[x.f_columnId]}`)
                .toNumber();
            },
            0
          );
        });

      return info;
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
      this.ui.loading = true;

      try {
        await Promise.all([
          this.getDataList(),
          this.getDepartmentList(),
          this.getDictionaryData()
        ]);
      } finally {
        this.ui.loading = false;
      }
    },
    closeSelf() {
      this.isShow = false;
      this.keyword = "";
    },
    onClosed() {
      this.form = data_form();
      this.$v.$reset();
      this.step = 0;
      this.ui.okLoading = false;
      this.tableHeaderTree = data_tableHeaderTree();
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
    async postForm1() {
      let data = {
        F_Year: (this.form.yearMonth || "").split(",")[0],
        F_Month: (this.form.yearMonth || "").split(",")[1],
        F_SalaryPlanId: this.form.salaryId.join(","),
        F_Deps: this.form.departmentList.join(","),
        F_PType: this.form.personnelTypeId
      };

      let res = await this.$_request({
        url: "/HR/SalarySlip/Create",
        method: "get",
        params: data
      });

      let resData = res.data.data;

      resData.F_GridHead.filter(x => x.f_show === 1).forEach(x => {
        this.tableHeaderTree[x.f_coltype || "other"].list.push(x);
      });

      this.tableHeaderList = resData.F_GridHead;
      this.currentTableData = this.tableData = resData.F_RowsData || [];
    },
    async postForm2() {
      let data = {
        f_Id: "",
        f_Year: (this.form.yearMonth || "").split(",")[0],
        f_Month: (this.form.yearMonth || "").split(",")[1],
        f_SId: this.form.salaryId.join(","),
        f_Deps: this.form.departmentList.join(","),
        f_PType: this.form.personnelTypeId,
        f_RowData: this.tableData.map(x => {
          return {
            f_EmpId: "",
            f_SalaryJson: JSON.stringify(x)
          };
        })
      };

      await this.$_request({
        url: "/HR/SalarySlip/Change",
        method: "post",
        data
      });
    },
    async postForm() {
      let data = {
        f_Year: (this.form.yearMonth || "").split(",")[0],
        f_Month: (this.form.yearMonth || "").split(",")[1],
        f_SId: this.form.salaryId,
        f_InId: this.form.socialSecurityId
      };

      await this.$_request({
        url: "/HR/SalarySlip/Change",
        method: "post",
        data
      });
    },
    async getDataList() {
      let resList = await Promise.all([
        this.$_request({
          url: "/HR/SalaryPlan/List",
          method: "post",
          data: {
            queryJson_S: "",
            queryJson: "",
            orderJson: "",
            pageIndex: 1,
            pageSize: 9999
          }
        }),
        this.$_request({
          url: "/HR/InsurancePlan/List",
          method: "post",
          data: {
            queryJson_S: "",
            queryJson: "",
            orderJson: "",
            pageIndex: 1,
            pageSize: 9999
          }
        })
      ]);

      this.salaryList = resList[0].data.data;
      this.socialSecurityList = resList[1].data.data;
    },
    async getDepartmentList() {
      let res = await this.$_request({
        url: "/HR/Department/GetTreeStructure",
        method: "get"
      });

      this.departmentList = res.data.data;
    },
    async getDictionaryData() {
      let resData = await queryDictionaryDetailByCode("rylb");

      this.dictionaryData.rylb = resData.data;
    }
  }
};
</script>

<style lang="scss" module>
.bottomInfo {
  display: flex;
  background: #e1e3e6;
  padding: 16px;
  justify-content: space-between;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 12px;
}
</style>
