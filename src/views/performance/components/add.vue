<template>
  <el-dialog
    :title="title"
    :visible.sync="isShow"
    @closed="onClosed"
    @open="onOpen"
    :fullscreen="ui.fullscreen"
  >
    <el-form label-width="6em" v-if="!ui.fullscreen" v-loading="ui.loading">
      <el-form-item label="部门">
        <el-cascader
          style="width:100%"
          v-model="department"
          :options="departmentList"
          :props="{
            emitPath: false,
            multiple: true,
            checkStrictly: true,
            expandTrigger: 'hover'
          }"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="绩效成员">
        <el-radio-group v-model="type">
          <el-radio :label="1">全员</el-radio>
          <el-radio :label="2">部分</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="绩效类型"
        required
        :error="$v.form.type.$error ? '必填' : ''"
      >
        <el-select
          v-model="form.type"
          value-key="F_ItemDetailId"
          style="width:100%"
        >
          <el-option
            v-for="(item, index) in performanceTypeList"
            :key="index"
            :label="item.F_ItemName"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="评定年月"
        required
        :error="$v.form.yearMonth.$error ? '必填' : ''"
      >
        <el-date-picker
          v-model="form.yearMonth"
          type="month"
          placeholder="选择日期"
          value-format="yyyy,MM"
          style="width:100%"
        >
        </el-date-picker>
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
    <mm-atp v-else>
      <template v-slot:action-right>
        <g-thai @ok="onThaiOk" :headerList="thaiHeaderList"></g-thai>
        <el-button @click="ui.sp = true" v-if="!isDisabled">导入员工</el-button>
      </template>
      <template v-slot:table>
        <el-table border :data="form.detailList">
          <el-table-column label="部门">
            <template v-slot="scope">
              <el-autocomplete
                v-model="scope.row.departmentName"
                :fetch-suggestions="queryDepartmentName"
                placeholder=""
                :disabled="true"
              ></el-autocomplete>
            </template>
          </el-table-column>
          <el-table-column label="姓名">
            <template v-slot="scope">
              <el-input
                v-model="scope.row.personalName"
                :disabled="true"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="级别">
            <template v-slot="scope">
              <el-autocomplete
                v-model="scope.row.levelName"
                :fetch-suggestions="queryLevelName"
                placeholder=""
                :disabled="true"
              ></el-autocomplete>
            </template>
          </el-table-column>
          <el-table-column label="职务">
            <template v-slot="scope">
              <el-autocomplete
                v-model="scope.row.positionName"
                :fetch-suggestions="queryPositionName"
                placeholder=""
                :disabled="true"
              ></el-autocomplete>
            </template>
          </el-table-column>
          <el-table-column label="绩效结果">
            <template v-slot="scope">
              <el-input v-model="scope.row.result"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="绩效奖金">
            <template v-slot="scope">
              <el-input v-model="scope.row.bonus"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="评定说明">
            <template v-slot="scope">
              <el-input v-model="scope.row.remark"></el-input>
            </template>
          </el-table-column>
          <el-table-column align="right">
            <template v-slot:header> </template>
            <template v-slot:default="scope">
              <el-button
                @click="onRemove(scope)"
                type="danger"
                icon="el-icon-delete"
                v-if="!isDisabled"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </mm-atp>
    <span slot="footer">
      <el-button @click="closeSelf">取 消</el-button>
      <el-button type="primary" @click="onOk" :loading="ui.okLoading"
        >确 认</el-button
      >
    </span>
    <g-sp
      
      :visible.sync="ui.sp"
      :preTable="form.detailList.map(x => x.personalId)"
      @ok="onPersonneSelect"
      append-to-body
    ></g-sp>
  </el-dialog>
</template>

<script>
import { required } from "@/utils/validator";
import { queryDictionaryDetailByCode, queryPosition } from "@/utils/api";
import { set } from "lodash";

const data_form = function() {
  return {
    id: "",
    type: null,
    yearMonth: "",
    personnelTypeId: "",
    detailList: []
  };
};

export default {
  components: {},
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
      type: {
        required
      },
      yearMonth: {
        required
      },
      personnelTypeId: {
        required
      }
    },
    group: ["form"]
  },
  data() {
    return {
      department: [],
      type: 1,
      form: data_form(),
      ui: {
        fullscreen: false,
        tree: false,
        loading: false,
        okLoading: false,
        sp: false
      },
      departmentList: [],
      personalList: [],
      performanceTypeList: [],
      levelList: [],
      positionList: [],
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
    title() {
      return `${this.formType === "add" ? "新增" : "修改"}条件`;
    },
    isDisabled() {
      if (this.type === 1 && this.department.length > 0) {
        return true;
      } else {
        return false;
      }
    },
    thaiHeaderList() {
      return [
        {
          label: "绩效结果",
          prop: "result"
        },
        {
          label: "绩效奖金",
          prop: "bonus"
        },
        {
          label: "评定说明",
          prop: "remark"
        }
      ];
    }
  },
  methods: {
    onThaiOk(data) {
      let { prop, content } = data;

      this.form.detailList.forEach(element => {
        set(element, prop, content);
      });
    },
    async onOpen() {
      this.ui.loading = true;

      await Promise.all([
        this.getDepartmentList(),
        this.getPerformanceType(),
        this.getLevel(),
        this.queryPosition(),
        this.getDictionaryData()
      ]);

      this.ui.loading = false;
    },
    closeSelf() {
      this.isShow = false;
    },
    onClosed() {
      this.form = data_form();
      this.department = [];
      this.ui.fullscreen = false;
      this.$v.$reset();
    },
    onAdd() {
      this.form.detailList.push({
        personalId: "",
        personalName: "",
        departmentName: "",
        positionName: "",
        levelName: "",
        result: "",
        bonus: "",
        overtimePay: "",
        deduction: "",
        remark: ""
      });
    },
    onRemove(scope) {
      this.form.detailList.splice(scope.$index, 1);
    },
    async onOk() {
      this.ui.okLoading = true;
      try {
        if (this.ui.fullscreen === false) {
          this.$v.group.$touch();
          if (this.$v.group.$error) return;

          if (this.type === 1 && this.department.length > 0) {
            await this.getPersonal();
          }
          this.ui.fullscreen = true;
        } else {
          await this.postForm();

          this.closeSelf();
          this.$message({
            message: "成功",
            type: "success"
          });
          this.$emit("ok");
        }
      } finally {
        this.ui.okLoading = false;
      }
    },
    async postForm() {
      let data = {
        f_Id: this.form.id,
        f_ProType: this.form.type.F_ItemDetailId,
        f_Year: Number((this.form.yearMonth || "").split(",")[0]),
        f_Month: Number((this.form.yearMonth || "").split(",")[1]),
        f_PType: this.form.personnelTypeId,
        f_DepIds: this.department.map(x => {
          return x.F_DepId
        }).join(','),
        f_Detail: this.form.detailList.map(x => {
          return {
            f_EmpId: x.personalId,
            f_DepName: x.departmentName,
            f_Job: x.positionName,
            f_Lev: x.levelName,
            f_Result: x.result,
            f_Bonus: x.bonus,
            f_ReMark: x.remark
          };
        })
      };
      let res = await this.$_request({
        url: "/HR/SalaryProperty/Change",
        method: "post",
        data
      });
      console.log(res)
      if (res.data.code === 500) {
        this.$message({
          message: res.data.mes,
          type: "warning"
        })
      }
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
    async getPerformanceType() {
      let resData = await queryDictionaryDetailByCode("jxlx");
      this.performanceTypeList = resData.data;
    },
    async getPersonal() {
      let resList = await Promise.all(
        this.department.map(x => {
          return this.$_request({
            url: "/HR/Emp/EmpList",
            method: "post",
            data: {
              queryJson_S: "",
              queryJson: JSON.stringify({
                f_DepName: x.F_DepName
              }),
              orderJson: "",
              pageIndex: 1,
              pageSize: 9999
            }
          });
        })
      );

      let personalList = [];
      let detailList = [];

      resList.forEach(x => {
        personalList.push(...x.data.data);
        detailList.push(
          ...x.data.data.map(x => {
            return {
              personalId: x.F_EmpID,
              personalName: x.F_EmpName,
              departmentName: x.F_DepName,
              positionName: x.F_JobName,
              levelName: x.F_JobLevelZName || "",
              result: "",
              bonus: "",
              overtimePay: "",
              deduction: "",
              remark: ""
            };
          })
        );
      });

      this.personalList = personalList;
      this.form.detailList = detailList;
    },
    async getLevel() {
      let resData = await queryDictionaryDetailByCode("dj");
      this.levelList = resData.data;
    },
    async queryPosition() {
      let resData = await queryPosition({
        queryJson_S: "",
        queryJson: "",
        orderJson: "",
        pageIndex: 1,
        pageSize: 9999
      });

      this.positionList = resData.data;
    },
    queryLevelName(queryString, cb) {
      let list = this.levelList.map(x => {
        return x.F_ItemName;
      });

      cb(
        list
          .filter(x => {
            return x.includes(queryString);
          })
          .map(x => {
            return {
              value: x
            };
          })
      );
    },
    queryPositionName(queryString, cb) {
      let list = this.positionList.map(x => {
        return x.F_JobName;
      });

      cb(
        list
          .filter(x => {
            return x.includes(queryString);
          })
          .map(x => {
            return {
              value: x
            };
          })
      );
    },
    queryDepartmentName(queryString, cb) {
      let list = this.departmentList.map(x => {
        return x.F_DepNamex || x.label;
      });

      cb(
        list
          .filter(x => {
            return x.includes(queryString);
          })
          .map(x => {
            return {
              value: x
            };
          })
      );
    },
    onPersonneSelect(list) {
      console.log(list)
      this.form.detailList.push(
        ...list.map(x => {
          return {
            personalId: x.F_EmpID,
            personalName: x.F_EmpName,
            departmentName: x.F_DepName,
            positionName: x.F_JobName,
            levelName: x.F_JobLevelZName,
            result: "",
            bonus: "",
            overtimePay: "",
            deduction: "",
            remark: ""
          };
        })
      );
    },
    async getDictionaryData() {
      let resData = await queryDictionaryDetailByCode("rylb");

      this.dictionaryData.rylb = resData.data;
    }
  }
};
</script>
