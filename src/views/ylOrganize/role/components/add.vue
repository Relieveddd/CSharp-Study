<template>
  <el-dialog :title="title" :visible.sync="isShow" @closed="onClosed">
    <el-form label-width="6em">
      <el-form-item
        label="名称"
        required
        :error="$v.form.name.$error ? '必填' : ''"
      >
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item
        label="编号"
        required
        :error="$v.form.number.$error ? '必填' : ''"
      >
        <el-input v-model="form.number"></el-input>
      </el-form-item>
      <el-form-item label="所在部门">
        <el-select
          v-model="form.departmentId"
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="queryDepartment"
        >
          <el-option
            v-for="(item, index) in departmentList"
            :key="index"
            :label="item.F_DepName"
            :value="item.F_DepId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remark"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="closeSelf">取 消</el-button>
      <el-button type="primary" @click="onOk" :loading="ui.loading"
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
    id: "",
    name: "",
    number: "",
    departmentId: "",
    remark: ""
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
      }
    }
  },
  data() {
    return {
      form: data_form(),
      departmentList: [],
      ui: {
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
      return `${this.formType === "add" ? "新增" : "修改"}角色`;
    }
  },
  methods: {
    closeSelf() {
      this.isShow = false;
    },
    onClosed() {
      this.form = data_form();
      this.ui.loading = false;
      this.$v.$reset();
    },
    async onOk() {
      this.$v.form.$touch();
      if (this.$v.form.$error) return;

      this.ui.loading = true;

      try {
        await this.postForm();
        this.closeSelf();
        this.$message({
          message: "成功",
          type: "success"
        });
      } finally {
        this.ui.loading = false;
      }
    },
    async postForm() {
      let data = {
        f_RoleId: this.form.id,
        f_RoleCode: this.form.number,
        f_RoleName: this.form.name,
        f_ReMark: this.form.remark
        // f_SortId: 0
      };

      if (this.form.id) {
        // data.f_RoleId = this.form.id;
      }

      await this.$_request({
        url: "/Base/Role/Change",
        method: "post",
        data
      });

      this.$emit("update");
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
