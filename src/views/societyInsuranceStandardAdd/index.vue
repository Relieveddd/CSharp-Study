<template>
  <mm-atp palign="right" v-loading="ui.loading">
    <template v-slot:action-left>
      <el-form :inline="true" label-width="6em">
        <el-form-item label="标准名称" required>
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="参保类型" required>
          <el-select v-model="form.type" placeholder="请选择">
            <el-option :value="1" label="全公司"> </el-option>
            <el-option :value="2" label="个别人员"> </el-option>
            <el-option :value="3" label="部门"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参保对象" v-if="form.type !== 1">
          <div v-if="form.type === 2">
            <el-button
              @click="ui.sp = true"
              size="mini"
              style="margin-right:8px;"
              >选择</el-button
            >
            <el-tag
              v-for="(tag, index) in form.itemList"
              :key="index"
              closable
              :disable-transitions="false"
              @close="onRemovePersonne(tag)"
            >
              {{ tag.name }}
            </el-tag>
          </div>
          <el-cascader
            v-if="form.type === 3"
            key="type3"
            :options="departmentTree"
            :props="formType3Props"
            v-model="form.itemList"
            multiple
          ></el-cascader>
        </el-form-item>
        <el-form-item label="备注" label-width="4em">
          <el-input v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template v-slot:action-right> </template>
    <template v-slot:table>
      <el-table
        border
        height="100%"
        :data="tableData"
        show-summary
        :summary-method="getSummaries"
      >
        <el-table-column
          show-overflow-tooltip
          label="序号"
          type="index"
        ></el-table-column>
        <el-table-column show-overflow-tooltip label="*项目">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.item"
              placeholder="请选择"
              value-key="F_Id"
              disabled
            >
              <el-option
                v-for="(item, index) in itemList"
                :key="index"
                :label="item.F_Name"
                :value="item"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="计算类型">
          <template slot-scope="scope">
            <el-select v-model="scope.row.type" placeholder="请选择">
              <el-option :value="0" label="固定值"> </el-option>
              <el-option :value="1" label="公式"> </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="计算公式">
          <template slot-scope="scope">
            <el-input v-model="scope.row.formula"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="缴纳基数"
          align="center"
          header-align="left"
        >
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.base"
              controls-position="right"
              :min="0"
              style="width:100%;"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column
          label="*基数下限（元）"
          align="center"
          header-align="left"
        >
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.min"
              controls-position="right"
              :min="0"
              style="width:100%;"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column
          label="*基数上限（元）"
          align="center"
          header-align="left"
        >
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.max"
              controls-position="right"
              :min="0"
              style="width:100%;"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column
          label="单位缴纳比例（%）"
          align="center"
          header-align="left"
        >
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.comPayRatio"
              controls-position="right"
              :min="0"
              style="width:100%;"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column
          label="个人缴纳比例（%）"
          align="center"
          header-align="left"
        >
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.perPayRatio"
              controls-position="right"
              :min="0"
              style="width:100%;"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="单位调整值"
          align="center"
          header-align="left"
        >
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.comAdjust"
              controls-position="right"
              :min="0"
              style="width:100%;"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="个人调整值"
          align="center"
          header-align="left"
        >
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.perAdjust"
              controls-position="right"
              :min="0"
              style="width:100%;"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="right">
          <template slot="header">
            <el-button @click="ui.attach = true">选择项目</el-button>
          </template>
          <template slot-scope="scope">
            <el-button
              @click="onRemove(scope)"
              size="mini"
              type="danger"
              icon="el-icon-delete"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <template v-slot:pagination>
      <el-button type="primary" @click="onOk" :loading="ui.okLoading"
        >保存</el-button
      >
    </template>
    <template v-slot:other>
      <g-sp
        :visible.sync="ui.sp"
        :preTable="form.itemList.map(x => x.id)"
        @ok="onPersonneSelect"
      ></g-sp>
      <c-attach :visible.sync="ui.attach" @attach="onAttach"></c-attach>
    </template>
  </mm-atp>
</template>

<script>
import { required } from "@/utils/validator";
import CAttach from "./components/attach";
import { queryDepartment, queryPersonnel } from "@/utils/api";

const data_form = function() {
  return {
    id: "",
    name: "",
    type: 1,
    itemList: [],
    remark: ""
  };
};

export default {
  name: "societyInsuranceStandardAdd",
  components: {
    CAttach
  },
  provide() {
    return {
      elFormItem: {
        elFormItemSize: "mini"
      }
    };
  },
  validations: {
    form: {
      name: {
        required
      },
      date: {
        required
      }
    }
  },
  data() {
    return {
      form: data_form(),
      tableData: [],
      ui: {
        attach: false,
        loading: false,
        okLoading: false,
        sp: false
      },
      formType2Props: {
        lazy: false,
        emitPath: false,
        multiple: true,
        checkStrictly: true,
        async lazyLoad(node, resolve) {
          const { level } = node;

          if (level === 0) {
            let resData = await queryDepartment({
              queryJson_S: "",
              queryJson: "",
              orderJson: "",
              pageIndex: 1,
              pageSize: 9999
            });
            resolve(
              resData.data.map(x => {
                return {
                  value: {
                    id: x.F_DepId,
                    name: x.F_DepName
                  },
                  label: x.F_DepName,
                  disabled: true,
                  leaf: false
                };
              })
            );
          } else {
            let depName = node.label;
            let resData = await queryPersonnel({
              queryJson_S: "",
              queryJson: JSON.stringify({
                f_DepName: depName
              }),
              orderJson: "",
              pageIndex: 1,
              pageSize: 9999
            });
            resolve(
              resData.data.map(x => {
                return {
                  value: {
                    id: x.F_EmpID,
                    name: x.F_EmpName
                  },
                  label: x.F_EmpName,
                  leaf: true
                };
              })
            );
          }
        }
      },
      formType3Props: {
        multiple: true,
        emitPath: false,
        expandTrigger: "hover"
      },
      departmentTree: [],
      personnelList: [],
      itemList: []
    };
  },
  methods: {
    onAddRow() {
      this.tableData.push({});
    },
    onRemove(scope) {
      this.tableData.splice(scope.$index, 1);
    },
    onAttach(list) {
      this.tableData.push(
        ...list.map(x => {
          return {
            item: x,
            type: "",
            formula: "",
            base: "",
            max: "",
            min: "",
            comPayRatio: "",
            perPayRatio: "",
            comAdjust: "",
            perAdjust: ""
          };
        })
      );
    },
    async onOk() {
      this.ui.okLoading = true;

      try {
        let data = {
          f_Id: this.form.id,
          f_Name: this.form.name,
          f_PType: this.form.type,
          f_PValues: this.form.itemList.map(x => x.id).join(","),
          f_PNames: this.form.itemList.map(x => x.name).join(","),
          f_Describe: this.form.remark,
          f_Detail: this.tableData.map(x => {
            return {
              f_ItemId: x.item.F_Id,
              f_Type: x.type,
              f_Formulas: x.formula,
              f_PayBase: x.base,
              f_MaxValue: x.max,
              f_MinValue: x.min,
              f_ComPayRatio: x.comPayRatio,
              f_PerPayRatio: x.perPayRatio,
              f_ComAdjust: x.comAdjust,
              f_PerAdjust: x.perAdjust
            };
          })
        };

        await this.$_request({
          url: "/HR/InsurancePlan/Change",
          method: "post",
          data
        });

        this.$_eventBus.$emit("societyInsuranceStandardAdd");
        this.$message({
          message: "成功",
          type: "success"
        });
      } finally {
        this.ui.okLoading = false;
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
            value: {
              id: x.F_DepId,
              name: x.F_DepName
            }
          };

          if (x.Child) {
            na.children = loop(x.Child);
          }
          return na;
        });
      };

      this.departmentTree = loop(res.data.data);
    },
    async getPersonnelList() {
      let resData = await queryPersonnel({
        queryJson_S: "",
        queryJson: "",
        orderJson: "",
        pageIndex: 1,
        pageSize: 9999
      });

      this.personnelList = resData.data.map(x => {
        return {
          value: {
            id: x.F_EmpID,
            name: x.F_EmpName
          },
          label: x.F_EmpName
        };
      });
    },
    async getItemList() {
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
      this.itemList = res.data.data.filter(x => {
        return x.F_ItemType === 2 || x.F_ItemType === 3;
      });
    },
    onPersonneSelect(list) {
      this.form.itemList = list.map(x => {
        return {
          id: x.F_EmpID,
          name: x.F_EmpName
        };
      });
    },
    onRemovePersonne(tag) {
      this.form.itemList.splice(this.form.itemList.indexOf(tag), 1);
    },
    getSummaries(param) {
      const { data } = param;
      const sums = ["合计", "", "", "", 0, 0, 0, 0, 0, 0, 0];

      data.forEach(x => {
        let ks = [
          "base",
          "min",
          "max",
          "comPayRatio",
          "perPayRatio",
          "comAdjust",
          "perAdjust"
        ];

        ks.forEach((k, i) => {
          sums[i + 4] += x[k];
        });
      });

      return sums;
    }
  },
  watch: {
    "form.type": function() {
      this.form.itemList = [];
    }
  },
  async created() {
    this.ui.loading = true;

    try {
      await Promise.all([
        this.getDepartmentList(),
        this.getPersonnelList(),
        this.getItemList()
      ]);

      if (this.$route.query.id) {
        let res = await this.$_request({
          url: "/HR/InsurancePlan/GetSingle",
          method: "get",
          params: {
            id: this.$route.query.id
          }
        });

        let data = res.data.data;

        Object.assign(this.form, {
          id: data.F_Id,
          name: data.F_Name,
          type: data.F_PType,
          remark: data.F_Describe
        });

        this.tableData = data.F_Detail.map(x => {
          return {
            item: {
              F_Id: x.F_ItemId
            },
            type: x.F_Type,
            formula: x.F_Formulas,
            base: x.F_PayBase,
            max: x.F_MaxValue,
            min: x.F_MinValue,
            comPayRatio: x.F_ComPayRatio,
            perPayRatio: x.F_PerPayRatio,
            comAdjust: x.F_ComAdjust,
            perAdjust: x.F_PerAdjust
          };
        });

        await this.$nextTick();

        let PNameList = (data.F_PNames || "").split(",");
        let itemList = (data.F_PValues || "").split(",").map((x, i) => {
          return {
            id: x,
            name: PNameList[i]
          };
        });

        Object.assign(this.form, {
          itemList: itemList
        });
      }
    } finally {
      this.ui.loading = false;
    }
  }
};
</script>

<style lang="scss" module></style>
