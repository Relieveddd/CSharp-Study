<template>
  <el-dialog :title="title" :visible.sync="isShow" @closed="onClosed">
    <el-form label-width="6em" ref="form">
      <el-form-item
        label="编号"
      >
        <el-input v-model="form.no" placeholder="人工录入"></el-input>
      </el-form-item>
      <el-form-item
        label="名称"
        required
        :error="$v.form.name.$error ? '必填' : ''"
      >
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <el-radio-group v-model="form.type">
          <el-radio :label="1">普通薪酬项</el-radio>
          <el-radio :label="2">社保项</el-radio>
          <el-radio :label="3">公积金</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="小数点格式">
        <el-input
          v-model="form.format"
          placeholder="0.00,0.000,0.00000"
        ></el-input>
      </el-form-item>
      <el-form-item label="计薪类型">
        <el-radio-group v-model="form.countType">
          <el-radio :label="0">增加项</el-radio>
          <el-radio :label="1">扣除项</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="计税类型">
        <el-radio-group v-model="form.taxType">
          <el-radio :label="0">计税</el-radio>
          <el-radio :label="1">不计税</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="规则类型">
        <el-radio-group v-model="form.ruleType">
          <el-radio :label="2">薪酬标准</el-radio>
          <el-radio :label="1">人工录入</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="规则值">
        <el-input v-model="form.ruleValue"></el-input>
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number v-model="form.sort" :min="0"></el-input-number>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="closeSelf">取 消</el-button>
      <el-button type="primary" @click="onOk">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { required } from "@/utils/validator";

const data_form = function() {
  return {
    id: "",
    name: "",
    no: "",
    countType: 0,
    type: 1,
    // 固定
    format: "0.00",
    ruleType: 2,
    ruleValue: "",
    taxType: 0,
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
      name: {
        required
      }
    }
  },
  data() {
    return {
      form: data_form()
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
      return `${this.formType === "add" ? "新增" : "修改"}薪酬项目`;
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
    async onOk() {
      this.$v.form.$touch();
      if (this.$v.form.$error) return;

      await this.postForm();

      this.$emit("update");
      this.closeSelf();
      this.$message({
        message: "成功",
        type: "success"
      });
    },
    async postForm() {
      let data = {
        f_Id: this.form.id,
        f_Name: this.form.name,
        f_No: this.form.no,
        f_CalculationType: this.form.countType,
        f_ItemType: this.form.type,
        f_DecFormat: this.form.format,
        f_RuleType: this.form.ruleType,
        f_RuleValue: this.form.ruleValue,
        f_TaxModel: this.form.taxType,
        f_SortId: this.form.sort
      };

      await this.$_request({
        url: "/HR/SalaryItems/Change",
        method: "post",
        data
      });
    }
  }
};
</script>
