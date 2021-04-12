<template>
  <el-dialog title="修改密码" :visible.sync="isShow" @closed="onClosed">
    <el-form>
      <!-- <el-form-item label="旧密码">
        <el-input type="password" v-model="form.oldPassword"></el-input>
      </el-form-item> -->
      <el-form-item
        label="新密码"
        :error="$v.form.newPassword.$error ? '至少6个字符' : ''"
      >
        <el-input
          type="password"
          v-model="form.newPassword"
          placeholder="至少6个字符"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="确认新密码"
        :error="$v.form.confirmPassword.$error ? '请输入相同的密码' : ''"
      >
        <el-input type="password" v-model="form.confirmPassword"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="closeSelf">取 消</el-button>
      <el-button type="primary" @click="onOk" :loading="ui.okLoading"
        >确认</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { required, sameAs, minLength } from "@/utils/validator";

const data_form = function() {
  return {
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  };
};

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
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
  validations: {
    form: {
      newPassword: {
        required,
        minLength: minLength(6)
      },
      confirmPassword: {
        sameAsPassword: sameAs("newPassword")
      }
    }
  },
  computed: {
    isShow: {
      get() {
        return this.visible;
      },
      set(n) {
        this.$emit("update:visible", n);
      }
    }
  },
  methods: {
    onClosed() {
      this.form = data_form();
      this.$v.$reset();
      this.ui.okLoading = false;
    },
    closeSelf() {
      this.isShow = false;
    },
    async onOk() {
      this.$v.form.$touch();
      if (this.$v.form.$error) return;

      this.ui.okLoading = true;

      await this.$_request({
        url: "/HR/Emp/UpdateEmpInfo",
        method: "post",
        params: {
          F_Pwd: this.form.newPassword
        }
      });

      this.$message({
        message: "成功",
        type: "success"
      });
      this.closeSelf();
    }
  }
};
</script>
