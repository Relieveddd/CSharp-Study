<template>
  <el-dialog
    :title="title"
    :visible.sync="isShow"
    @closed="onClosed"
    @open="onOpen"
  >
    <el-form label-width="6em">
      <el-form-item
        label="职务名称"
        required
        :error="$v.form.name.$error ? '必填' : ''"
      >
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item
        label="职务编号"
        required
        :error="$v.form.number.$error ? '必填' : ''"
      >
        <el-input v-model="form.number"></el-input>
      </el-form-item>
      <el-form-item label="所在部门">
        <el-select
          v-model="form.department"
          placeholder="请输入关键词"
          value-key="F_DepId"
          style="width:100%;"
        >
          <el-option
            v-for="(item, index) in departmentList"
            :key="index"
            :label="item.F_DepName"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
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
import { queryDepartment } from "@/utils/api";

const data_form = function() {
  return {
    id: null,
    name: null,
    number: null,
    status: null,
    remark: null,
    department: {},
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
      },
      number: {
        required
      },
      department: {}
    }
  },
  data() {
    return {
      form: data_form(),
      departmentList: [],
      ui: {
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
      return `${this.formType === "add" ? "新增" : "修改"}职务`;
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
        f_JobId: this.form.id,
        f_DepId: this.form.department.F_DepId || "",
        f_JobCode: this.form.number,
        f_JobName: this.form.name,
        f_ReMark: this.form.remark,
        f_SortId: this.form.sort
      };

      await this.$_request({
        url: "/HR/Job/Change",
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
        pageSize: 50
      });

      this.departmentList = resData.data;
    }
  }
};
</script>
