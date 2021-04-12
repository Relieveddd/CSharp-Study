<template>
  <el-dialog
    :title="title"
    :visible.sync="isShow"
    @closed="onClosed"
    @open="onOpen"
  >
    <el-form label-width="7em" :class="$style['form']">
      <el-form-item
        label="部门名称"
        required
        :error="$v.form.departmentName.$error ? '必填' : ''"
      >
        <el-input v-model="form.departmentName"></el-input>
      </el-form-item>
      <el-form-item label="部门编号">
        <el-input v-model="form.departmentNumber"></el-input>
      </el-form-item>
      <el-form-item label="部门性质">
        <el-select
          v-model="form.departmentType.F_ItemDetailId"
          placeholder="请选择"
          style="width:100%"
        >
          <el-option
            v-for="(item, index) in dictionaryData.bmxz"
            :key="index"
            :label="item.F_ItemName"
            :value="item.F_ItemDetailId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="负责人">
        <el-input v-model="form.contactName"></el-input>
      </el-form-item>
      <el-form-item label="负责人电话">
        <el-input v-model="form.contactPhone"></el-input>
      </el-form-item>
      <el-form-item label="部门电话">
        <el-input v-model="form.departmentPhone"></el-input>
      </el-form-item>
      <el-form-item label="责任范围">
        <el-select
          v-model="form.responsibilityRange.F_ItemDetailId"
          placeholder="请选择"
          style="width:100%"
        >
          <el-option
            v-for="(item, index) in dictionaryData.zrfw"
            :key="index"
            :label="item.F_ItemName"
            :value="item.F_ItemDetailId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="电子邮箱">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item label="成立时间">
        <el-date-picker
          v-model="form.stablished"
          type="date"
          value-format="yyyy-MM-dd"
          style="width:100%"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="分机号">
        <el-input v-model="form.extensionNumber"></el-input>
      </el-form-item>
      <el-form-item label="上级部门">
        <el-select
          v-model="form.superiorDepartmentId"
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="queryDepartment"
          style="width:100%"
        >
          <el-option label="无" :value="0"> </el-option>
          <el-option
            v-for="(item, index) in departmentList"
            :key="index"
            :label="item.F_DepName"
            :value="item.F_DepId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="form.address"></el-input>
      </el-form-item>
      <el-form-item label="特殊薪酬部门">
        <el-checkbox v-model="form.isSpecial"></el-checkbox>
      </el-form-item>
      <el-form-item label="备注" :class="$style['g1']">
        <el-input v-model="form.remark"></el-input>
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number v-model="form.sort"></el-input-number>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="closeSelf">取 消</el-button>
      <el-button type="primary" @click="onOk" :loading="ui.okLoading"
        >确 认</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { required } from "@/utils/validator";
import { queryDepartment, queryDictionaryDetailByCode } from "@/utils/api";

const data_form = function() {
  return {
    id: null,
    superiorDepartmentId: 0,
    departmentName: "",
    departmentNumber: "",
    departmentType: {
      F_ItemDetailId: ''
    },
    contactName: "",
    contactPhone: "",
    departmentPhone: "",
    responsibilityRange: {
      F_ItemDetailId: ''
    },
    email: "",
    stablished: "",
    extensionNumber: "",
    departmentShortName: "",
    companyType: "",
    address: "",
    isSpecial: false,
    remark: "",
    sort: 0
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
      departmentName: {
        required
      }
    }
  },
  data() {
    return {
      form: data_form(),
      departmentList: [],
      ui: {
        okLoading: false
      },
      dictionaryData: {
        bmxz: [],
        zrfw: []
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
      return `${this.formType === "add" ? "新增" : "修改"}部门`;
    }
  },
  methods: {
    closeSelf() {
      this.isShow = false;
    },
    onClosed() {
      this.form = data_form();
      this.$v.$reset();
    },
    onOpen() {
      this.queryDepartment();
    },
    async onOk() {
      this.$v.form.$touch();
      if (this.$v.form.$error) return;

      this.ui.okLoading = true;

      try {
        await this.postForm();

        this.$emit("update");
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
        f_DepId: this.form.id,
        f_TopDepId: this.form.superiorDepartmentId || 0,
        f_DepCode: this.form.departmentNumber,
        f_DepName: this.form.departmentName,
        f_DepNatureId: this.form.departmentType.F_ItemDetailId || "",
        f_DepDuty: this.form.responsibilityRange.F_ItemDetailId || "",
        f_DepTel: this.form.departmentPhone,
        f_DepHeader: this.form.contactName,
        f_DepHeaderTel: this.form.contactPhone,
        f_FoundDate: this.form.stablished,
        f_DepMail: this.form.email,
        f_ExtNo: this.form.extensionNumber,
        f_Address: this.form.address,
        f_IsSpecial: this.form.isSpecial ? 1 : 0,
        f_Remark: this.form.remark,
        f_SortId: this.form.sort
      };

      await this.$_request({
        url: "/HR/Department/Change",
        method: "post",
        data
      });
    },
    async queryDepartment(keyword = "") {
      let resData = await queryDepartment({
        queryJson_S: JSON.stringify({
          query: keyword
        }),
        queryJson: "",
        orderJson: "",
        pageIndex: 1,
        pageSize: 50,
        isShow: 1
      });

      this.departmentList = resData.data;
    },
    async getDictionaryData() {
      let resList = await Promise.all([
        queryDictionaryDetailByCode("bmxz"),
        queryDictionaryDetailByCode("zrfw")
      ]);
      Object.assign(this.dictionaryData, {
        bmxz: resList[0].data,
        zrfw: resList[1].data
      });
    }
  },
  created() {
    this.getDictionaryData();
  },
};
</script>

<style lang="scss" module>
.form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 8px;
  .g1 {
    grid-column: 1 / -1;
  }
}
</style>
