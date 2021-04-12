<template>
  <el-dialog title="转移管理员" :visible.sync="isShow" @closed="onClosed">
    <el-form v-if="step === 0">
      <el-form-item label="当前账户手机号" required>
        <el-input v-model="nowPhone" disabled></el-input>
      </el-form-item>
      <el-form-item
        label="手机验证码"
        required
        :error="$v.nowPhoneCode.$error ? '必填' : ''"
      >
        <el-input v-model="nowPhoneCode">
          <g-buttontimer
            slot="append"
            @click="onSend1"
            label="获取验证码"
          ></g-buttontimer>
        </el-input>
      </el-form-item>
    </el-form>
    <el-form v-if="step === 1">
      <el-form-item
        label="交接人手机号"
        required
        :error="$v.newPhone.$error ? '请输入正确手机号' : ''"
      >
        <el-input v-model="newPhone" @blur="$v.newPhone.$touch()"></el-input>
      </el-form-item>
      <el-form-item
        label="手机验证码"
        required
        :error="$v.newPhoneCode.$error ? '必填' : ''"
      >
        <el-input v-model="newPhoneCode">
          <g-buttontimer
            slot="append"
            @click="onSend2"
            label="获取验证码"
          ></g-buttontimer>
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="closeSelf">取 消</el-button>
      <el-button v-if="step === 0" @click="onNext">下一步</el-button>
      <el-button
        v-if="step === 1"
        type="primary"
        @click="onOk"
        :loading="ui.okLoading"
        >确认</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { required } from "@/utils/validator";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      nowPhoneCode: "",
      newPhone: "",
      newPhoneCode: "",
      ui: {
        okLoading: false
      },
      step: 0
    };
  },
  validations: {
    nowPhoneCode: {
      required
    },
    newPhone: {
      required
    },
    newPhoneCode: {
      required
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
    },
    nowPhone() {
      return this.$store.state.user.phone;
    }
  },
  methods: {
    onClosed() {
      this.$v.$reset();
      this.nowPhoneCode = "";
      this.newPhone = "";
      this.newPhoneCode = "";
    },
    closeSelf() {
      this.isShow = false;
    },
    async onOk() {
      this.$v.$touch();
      if (this.$v.$error) return;

      this.ui.okLoading = true;

      try {
        await this.verifyCode(this.newPhone, this.newPhoneCode);

        await this.$_request({
          url: "/HR/Emp/UpdateRole",
          method: "post",
          params: {
            F_Tel: this.newPhone
          }
        });

        this.closeSelf();
      } finally {
        this.ui.okLoading = false;
      }
    },
    async onSend1() {
      this.sendCode(this.nowPhone);
    },
    async onSend2() {
      this.$v.newPhone.$touch();
      if (this.$v.newPhone.$error) return;

      this.sendCode(this.newPhone);
    },
    async onNext() {
      this.$v.nowPhoneCode.$touch();
      if (this.$v.nowPhoneCode.$error) return;

      await this.verifyCode(this.nowPhone, this.nowPhoneCode);
      this.step = 1;
    },
    async sendCode(phone = "") {
      if (phone) {
        await this.$_request({
          url: "/Base/Base/SendMsg",
          method: "get",
          params: {
            tel: phone
          }
        });

        this.$message({
          message: "短信发送成功",
          type: "success"
        });
      }
    },
    async verifyCode(phone = "", code = "") {
      let res = await this.$_request({
        url: "/Base/Base/ValidateMsg",
        method: "get",
        params: {
          tel: phone,
          msgcode: code
        }
      });

      if (res.data.code !== 200) {
        return Promise.reject("asdasd");
      }
    }
  }
};
</script>

<style lang="scss" module>
.wrap {
  display: flex;
  max-height: 50vh;
  .left {
    overflow: auto;
    flex: none;
    margin-right: 16px;
    padding-right: 16px;
    border-right: solid 1px #dcdfe6;
    width: 150px;
  }
  .right {
    overflow: auto;
    flex: 1;
  }
}
</style>
