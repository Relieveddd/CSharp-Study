<!-- 登录 -->

<template>
  <div :class="$style['wrap']">
    <div :class="$style['mainer']">
      <div :class="$style['container']">
        <div :class="$style['ad']">
          <img src="@/assets/undraw_dashboard_nklg.svg" alt="" />
        </div>
        <div :class="$style['content']">
          <div :class="$style['logo']">
            <img src="@/assets/logo.svg" alt="" />
          </div>
          <el-form size="medium" v-if="loginType === 'username'">
            <el-form-item>
              <el-input
                v-model="form.phoneNumber"
                placeholder="手机号"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-input
                type="password"
                v-model="form.password"
                placeholder="密码"
                @keyup.enter.native="onLogin"
              ></el-input>
            </el-form-item>
            <!-- <el-form-item>
            <el-input v-model="form.code" placeholder="验证码">
              <template v-slot:append>
                <img
                  :class="$style['codeImg']"
                  src="http://temp.im/40x20"
                  alt
                />
              </template>
            </el-input>
          </el-form-item> -->
            <el-form-item>
              <el-button
                @click="onLogin"
                :loading="ui.loading"
                style="width:100%;"
                type="primary"
                >登录</el-button
              >
            </el-form-item>
          </el-form>
          <div
            v-else-if="loginType === 'qr'"
            id="qr"
            :class="$style['qr']"
          ></div>
          <div :class="$style['bottom']">
            <el-button type="text" @click="go({ name: 'register' })"
              >没有单位？去注册</el-button
            >
            <!-- <el-button type="text">忘记密码？</el-button> -->
          </div>
        </div>
        <!-- <div :class="$style['loginType']" @click="changeLoginType">
        <mm-icon icon="iconmenu"></mm-icon>
      </div> -->
      </div>
    </div>
    <div :class="$style['footer']">
      <div>
        <span>电话：0574-55688191</span>
        <span>邮箱：sales@mingm.com.cn</span>
      </div>
      <div>
        <span>Copyright 宁波明明网络科技有限公司 All Rights Reserved</span>
        <span></span>
        <a href="http://beian.miit.gov.cn" target="_blank"
          >浙ICP备16026770号-10</a
        >
      </div>
    </div>
  </div>
</template>

<script>
import { Message } from "element-ui";
export default {
  name: "login",
  data() {
    return {
      form: {
        phoneNumber: "",
        password: "",
        code: "",
        nonce: ""
      },
      loginType: "username",
      ui: {
        loading: false
      }
    };
  },
  methods: {
    async onLogin() {
      this.ui.loading = true;

      try {
        await this.postLogin();

        this.$router.replace({
          name: "dashboard"
        });
      } finally {
        this.ui.loading = false;
      }
    },
    async postLogin() {
      let data = {
        username: this.form.phoneNumber,
        password: this.form.password,
        // grant_type: "password",
        grant_type: "pwd.userauth",
        client_id: "owerpwd.client",
        client_secret: "secret",
        service_code: "hr.service"
      };
      let formData = new FormData();
      for (const key of Object.keys(data)) {
        formData.set(key, data[key]);
      }
      let res = await this.$_request({
        url: "/connect/token",
        method: "post",
        data: formData
      });

      let tokenValue = res.data.access_token;
      let tokenType = res.data.token_type;

      this.$store.commit("user/set", {
        token: (tokenType ? `${tokenType} ` : "") + tokenValue,
        phone: this.form.phoneNumber
      });
    },
    async changeLoginType() {
      if (this.loginType === "username") {
        this.loginType = "qr";
        await this.$nextTick();
        this.getQr();
      } else {
        this.loginType = "username";
      }
    },
    go(route) {
      this.$router.replace(route);
    },
    getQr() {
      new window.WxLogin({
        self_redirect: false,
        id: "qr",
        appid: "wxbdc5610cc59c1631",
        scope: "snsapi_login",
        redirect_uri: "https%3A%2F%2Fpassport.yhd.com%2Fwechat%2Fcallback.do"
      });
    }
  },
  mounted() {
    //////////////////授权登录过期的状态////////////////
    let logonInvalidation = this.$store.state.login.logonInvalidation;
    if(logonInvalidation){
      this.$store.commit('login/set', {logonInvalidation:false})
      Message({
        showClose: true,
        dangerouslyUseHTMLString: false,
        message: "授权过期，请重新登录",
        type: "error"
      });
    }
  }
};
</script>

<style lang="scss" module>
@import "@/style/var.scss";

.wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #e9eef8;
  .mainer {
    flex: 1;
    display: flex;
    .container {
      position: relative;
      display: flex;
      margin: auto;
      background: #fff;
      width: 980px;
      min-height: 520px;
      justify-content: space-between;
      .ad {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 300px;
          height: 400px;
          object-fit: contain;
          object-position: center;
        }
      }
      .content {
        margin-top: 100px;
        padding: 0 56px;
        width: 300px;
        box-sizing: content-box;
        .logo {
          text-align: center;
          margin-bottom: 32px;
          img {
            height: 32px;
          }
        }
        .qr {
          text-align: center;
        }
        .bottom {
          display: flex;
          justify-content: space-between;
          margin-bottom: 32px;
        }
        .codeImg {
          cursor: pointer;
          height: 34px;
          float: left;
        }
      }
      .loginType {
        cursor: pointer;
        position: absolute;
        right: 0;
        top: 0;
        $w: 72px;
        font-size: $w;
        color: $color1;
        &::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: $w 0 0 $w;
          border-color: transparent transparent transparent #fff;
        }
      }
    }
  }
  .footer {
    line-height: 1;
    flex: none;
    font-size: 12px;
    text-align: center;
    margin: 4px 0;
    span,
    a {
      display: inline-block;
      margin: 4px 2px;
      padding: 0 2px;
    }
    a {
      all: unset;
      cursor: pointer;
    }
  }
}
</style>
