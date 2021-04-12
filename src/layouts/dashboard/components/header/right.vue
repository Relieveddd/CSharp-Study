<template>
  <div :class="$style['wrap']">
    <el-dropdown trigger="click">
      <div :class="$style['avatar-wrap']">
        <img src="@/assets/avatar.svg" alt="" :class="$style['avatar']" />
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="ui.password = true"
          >修改密码</el-dropdown-item
        >
        <el-dropdown-item v-if='F_RoleType === "2" ? true : false' @click.native="ui.transfer = true"
          >转移管理员</el-dropdown-item
        >
        <el-dropdown-item @click.native="onLogout">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <c-password :visible.sync="ui.password"></c-password>
    <c-transfer :visible.sync="ui.transfer"></c-transfer>
  </div>
</template>

<script>
import CPassword from "./password";
import CTransfer from "@/views/personnelProfile/components/transfer";

export default {
  components: {
    CPassword,
    CTransfer
  },
  data() {
    return {
      ui: {
        password: false,
        transfer: false
      },
      F_RoleType:3
    };
  },
  methods: {
    onLogout() {
      this.$store.dispatch("user/reset");
      this.$store.dispatch("tabView/reset");
      this.$store.dispatch("reset");
      this.$router.replace({
        name: "login"
      });
    },
    async get() {
      let res = await this.$_request({
        url: "/connect/userinfo",
        method: "post"
      });
     this.F_RoleType=res.data.F_RoleType
    }
  },
  async mounted(){
    this.get();
  }
};
</script>

<style lang="scss" module>
.wrap {
  margin-right: 8px;
  display: flex;
  align-items: center;
  .avatar-wrap {
    font-size: 0;
    .avatar {
      border-radius: 50%;
      $w: 32px;
      width: $w;
      height: $w;
      background: #e1e1e1;
      outline: none;
      cursor: pointer;
    }
  }
}
</style>
