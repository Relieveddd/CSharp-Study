<template>
  <el-dialog
    :title="title"
    :visible.sync="isShow"
    @closed="onClosed"
    @open="onOpen"
    width="700px"
  >
    <el-steps :active="step" simple style="margin-bottom:32px">
      <el-step title="基本信息"></el-step>
      <el-step title="薪酬项目"></el-step>
    </el-steps>
    <div v-loading="ui.loading" style="display:flex;justify-content: center;">
      <el-form label-width="6em" v-if="step === 0" style="width:100%;">
        <div :class="$style['form']">
          <el-form-item
            label="方案名称"
            required
            :error="$v.form.name.$error ? '必填' : ''"
          >
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="方案描述">
            <el-input v-model="form.remark"></el-input>
          </el-form-item>
          <el-form-item
            label="发放周期"
            required
            :error="$v.form.cycleId.$error ? '必填' : ''"
          >
            <el-select
              v-model="form.cycleId"
              placeholder="请选择"
              style="width:100%;"
            >
              <el-option
                v-for="(item, index) in cycleList"
                :key="index"
                :label="item.F_ItemName"
                :value="item.F_ItemDetailId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="缴纳社保">
            <el-radio-group v-model="form.isSocial">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="类型">
            <el-radio-group v-model="form.type">
              <el-radio :label="1">全部</el-radio>
              <el-radio :label="3">部门</el-radio>
              <el-radio :label="2">人员</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <el-form-item label="部门" v-if="form.type === 3">
          <el-cascader
            style="width:100%"
            v-model="form.departmentList"
            :options="departmentList"
            :props="{
              emitPath: false,
              multiple: true,
              checkStrictly: true,
              expandTrigger: 'hover'
            }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="" v-if="form.type === 2">
          <el-table border :data="form.personnelList">
            <el-table-column
              show-overflow-tooltip
              prop="F_EmpCode"
              label="编号"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="F_EmpName"
              label="姓名"
            >
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="F_Sex" label="性别">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="F_EducationZName"
              label="文化程度"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="F_DepName"
              label="所属部门"
            >
            </el-table-column>
            <el-table-column>
              <template slot="header">
                <el-button @click="ui.sp = true" size="mini"
                  >选择人员</el-button
                >
              </template>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="onRemovePersonne(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <el-transfer
        v-else-if="step === 1"
        v-model="form.salaryProjectList"
        :data="salaryProjectList"
        :props="{
          key: 'F_Id',
          label: 'F_Name'
        }"
        :titles="['可选薪酬项目', '已选薪酬项目']"
      ></el-transfer>
    </div>
    <span slot="footer">
      <el-button @click="closeSelf">取 消</el-button>
      <el-button @click="onPrev" v-if="step === 1">上一步</el-button>
      <el-button @click="onNext" v-if="step === 0">下一步</el-button>
      <el-button
        type="primary"
        @click="onOk"
        :loading="ui.okLoading"
        v-if="step === 1"
        >确 认</el-button
      >
    </span>
    <g-sp :visible.sync="ui.sp" @ok="onPersonneSelect" append-to-body></g-sp>
  </el-dialog>
</template>

<script>
import { required } from "@/utils/validator";
import { queryDictionaryDetailByCode } from "@/utils/api";

const data_form = function() {
  return {
    id: "",
    name: "",
    remark: "",
    isEnable: true,
    salaryProjectList: [],
    type: 1,
    departmentList: [],
    personnelList: [],
    cycleId: "",
    isSocial: true
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
    },
    currentRow: {}
  },
  validations: {
    form: {
      name: {
        required
      },
      cycleId: {
        required
      }
    }
  },
  data() {
    return {
      form: data_form(),
      list: [],
      salaryProjectList: [],
      departmentList: [],
      departmentHash: {},
      cycleList: [],
      step: 0,
      ui: {
        loading: false,
        sp: false,
        okLoading: false
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
      return `${this.formType === "add" ? "新增" : "修改"}薪酬方案`;
    }
  },
  methods: {
    async onOpen() {
      this.ui.loading = true;
      await Promise.all([
        this.querySalaryProject(),
        this.getDepartmentList(),
        this.getCycleList()
      ]);
      this.ui.loading = false;
    },
    closeSelf() {
      this.isShow = false;
    },
    onClosed() {
      this.form = data_form();
      this.step = 0;
      this.ui.okLoading = false;
    },
    async onOk() {
      this.$v.form.$touch();
      if (this.$v.form.$error) {
        this.$message({
          message: "请填写完整"
        });
        return;
      }

      this.ui.okLoading = true;

      try {
        await this.postForm();

        this.$emit("update");
        this.closeSelf();
        this.$message({
          message: "成功",
          type: "success"
        });
      } catch (error) {
        this.ui.okLoading = false;
      }
    },
    onPrev() {
      this.step = 0;
    },
    onNext() {
      this.step = 1;
    },
    async postForm() {
      let data = {
        f_Id: this.form.id,
        f_Name: this.form.name,
        f_Describe: this.form.remark,
        f_CycleType: this.form.cycleId,
        f_PType: this.form.type,
        f_EnableMark: true,
        f_CalSocial: this.form.isSocial,
        f_Details: this.form.salaryProjectList.map(x => {
          return {
            f_Id: "",
            f_Pid: "",
            f_ReName: "",
            f_ItemId: x,
            isCreate: true
          };
        })
      };
      if (this.form.type === 3) {
        Object.assign(data, {
          f_PValues: this.form.departmentList.join(","),
          f_PNames: this.form.departmentList
            .map(x => {
              return this.departmentHash[x];
            })
            .join(",")
        });
      }

      if (this.form.type === 2) {
        Object.assign(data, {
          f_PValues: this.form.personnelList.map(x => x.F_EmpID).join(","),
          f_PNames: this.form.personnelList.map(x => x.F_EmpName).join(",")
        });
      }

      await this.$_request({
        url: "/HR/SalaryPlan/Change",
        method: "post",
        data
      });
    },
    async querySalaryProject() {
      let res = await this.$_request({
        url: "/HR/SalaryItems/List",
        method: "post",
        data: {
          queryJson_S: "",
          queryJson: JSON.stringify({
            f_ItemType: 1
          }),
          orderJson: "",
          pageIndex: 1,
          pageSize: 9999
        }
      });

      this.salaryProjectList = res.data.data;
    },
    async getDepartmentList() {
      let res = await this.$_request({
        url: "/HR/Department/GetTreeStructure",
        method: "get"
      });

      let departmentHash = {};

      let loop = function(array = []) {
        return array.map(x => {
          let na = {
            label: x.F_DepName,
            value: x.F_DepId
          };

          departmentHash[x.F_DepId] = x.F_DepName;

          if (x.Child) {
            na.children = loop(x.Child);
          }
          return na;
        });
      };

      this.departmentList = loop(res.data.data);
      this.departmentHash = departmentHash;
    },
    onPersonneSelect(list) {
        let listFilter = list.filter(item => !this.form.personnelList.some(ele => ele.F_EmpID === item.F_EmpID));
        this.form.personnelList = this.form.personnelList.concat(listFilter);
    },
    onRemovePersonne(tag) {
      this.form.personnelList.splice(this.form.personnelList.indexOf(tag), 1);
    },
    async getCycleList() {
      let resData = await queryDictionaryDetailByCode("ffzq");
      this.cycleList = resData.data;
    }
  }
};
</script>

<style lang="scss" module>
.form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 16px;
}
.transfer-wrap {
  display: flex;
  justify-content: center;
}
</style>
