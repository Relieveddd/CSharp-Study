<template>
  <el-dialog :title="title" :visible.sync="isShow" @closed="onClosed">
    <el-form label-width="6em">
      <el-form-item
        label="岗位名称"
        required
        :error="$v.form.name.$error ? '必填' : ''"
      >
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item
        label="岗位编号"
        required
        :error="$v.form.number.$error ? '必填' : ''"
      >
        <el-input v-model="form.number"></el-input>
      </el-form-item>
      <el-form-item label="是否有效">
        <el-radio-group v-model="form.status">
          <el-radio :label="true">有效</el-radio>
          <el-radio :label="false">无效</el-radio>
        </el-radio-group>
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

const data_form = function() {
  return {
    id: null,
    name: "",
    number: "",
    status: true,
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
      return `${this.formType === "add" ? "新增" : "修改"}岗位`;
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
        f_PostId: this.form.id,
        f_PostCode: this.form.number,
        f_PostName: this.form.name,
        f_ReMark: this.form.remark,
        f_SortId: this.form.sort
      };

      await this.$_request({
        url: "/HR/Post/Change",
        method: "post",
        data
      });
    }
  }
};
</script>
