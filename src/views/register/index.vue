<!-- 注册 -->

<template>
  <div :class="$style['wrap']">
    <div :class="$style['container']">
      <div :class="$style['logo']">
        <img src="@/assets/logo.svg" alt="" />
      </div>
      <el-steps :active="step" align-center :class="$style['steps']">
        <el-step title="公司信息"></el-step>
        <el-step title="管理员信息"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <div :class="$style['step']">
        <el-form v-if="step === 0" size="medium">
          <el-form-item
            required
            :error="$v.form1.companyName.$error ? '必填' : ''"
          >
            <el-input
              v-model="form1.companyName"
              placeholder="公司完整名称"
            ></el-input>
          </el-form-item>
          <el-form-item
            required
            :error="$v.form1.identifier.$error ? '必填' : ''"
          >
            <el-input
              v-model="form1.identifier"
              placeholder="社会统一识别码"
            ></el-input>
          </el-form-item>
          <el-form-item required :error="$v.form1.address.$error ? '必填' : ''">
            <el-input v-model="form1.address" placeholder="地址"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="form2.remark" placeholder="简介"></el-input>
          </el-form-item>
          <el-form-item :error="$v.form1.license.$error ? '必填' : ''">
            <el-upload
              :class="$style['upload']"
              :show-file-list="false"
              :on-success="onSuccess"
              :on-error="onError"
              :before-upload="onBeforeUpload"
              :action="uploadAction"
              :headers="headers"
            >
              <div :class="$style['uploadContent']">
                <template v-if="ui.upload">
                  正在上传...
                </template>
                <template v-else-if="form1.license">
                  <img :class="$style['license']" :src="licenseSrc" alt="" />
                </template>
                <template v-else>
                  <i class="el-icon-upload" style="font-size:56px;"></i>
                  <div>点击上传营业执照</div>
                </template>
              </div>
            </el-upload>
          </el-form-item>
        </el-form>
        <el-form v-if="step === 1" size="medium">
          <el-form-item
            required
            :error="$v.form2.contactName.$error ? '必填' : ''"
          >
            <el-input
              v-model="form2.contactName"
              placeholder="管理员姓名"
            ></el-input>
          </el-form-item>
          <el-form-item
            required
            :error="$v.form2.contactPhone.$error ? '必填' : ''"
          >
            <el-input
              v-model="form2.contactPhone"
              placeholder="手机号"
            ></el-input>
          </el-form-item>
        </el-form>
        <div v-if="step === 2">
          <mm-icon icon="iconwancheng1" size="100px" color="#66b1ff"></mm-icon>
          <div style="text-align:center;margin:16px 0;">注册完成</div>
          <div style="text-align: center;"><span style="color: #409EFF;">账号：</span>{{form2.contactPhone}}</div>
          <div style="text-align: center;"><span style="color: #409EFF;">初始密码：</span>111111</div>
        </div>
      </div>
      <div :class="$style['bs']">
        <el-button v-if="step > 0 && step < 2" size="medium" @click="prev"
          >上一步</el-button
        >
        <el-button v-if="step < 1" size="medium" type="primary" @click="next"
          >下一步</el-button
        >
        <el-button
          v-if="step === 1"
          size="medium"
          type="primary"
          @click="onRegister"
          :loading="ui.loading"
          >注 册</el-button
        >
        <el-button
          v-if="step === 2"
          size="medium"
          type="primary"
          @click="goLogin"
          >去登陆</el-button
        >
      </div>
      <div :class="$style['bl']">
        <el-button type="text" @click="go({ name: 'login' })" size="medium"
          >&lt;返回登陆</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { required } from "@/utils/validator";

export default {
  name: "register",
  validations: {
    form1: {
      companyName: {
        required
      },
      identifier: {
        required
      },
      license: {
        required
      },
      address: {
        required
      }
    },
    form2: {
      contactPhone: {
        required
      },
      contactName: {
        required
      }
    }
  },
  data() {
    return {
      step: 0,
      form1: {
        companyName: "",
        identifier: "",
        license: "",
        address: ""
      },
      form2: {
        contactPhone: "",
        contactName: "",
        remark: ""
      },
      ui: {
        loading: false,
        upload: false
      },
      token:'',
      headers:{}
    };
  },
  computed: {
    uploadAction() {
      return `${process.env.VUE_APP_API_BASEURL || ""}/Base/File/UploadFile`;
    },
    licenseSrc() {
      return `${process.env.VUE_APP_API_BASEURL || ""}${this.form1.license}`;
    }
  },
  methods: {
    next() {
      this.$v.form1.$touch();
      if (this.$v.form1.$error) return;

      this.step++;
    },
    prev() {
      if (this.step > 0) {
        this.step--;
      }
    },
    goLogin() {
      this.$router.replace({
        name: "login"
      });
    },
    async onRegister() {
      this.$v.form2.$touch();
      if (this.$v.form2.$error) return;
      try {
        if(!this.checkPhone(this.form2.contactPhone)) {
          return this.$message({
            message: "手机号格式不正确",
            type: "warning"
          })
        }
        this.ui.loading = true;
        await this.postForm();

        this.step++;
      } catch (error) {
        this.ui.loading = false;
      }
    },
    async postForm() {
      let data = {
        f_Name: this.form1.companyName,
        f_ComCode: this.form1.identifier,
        f_License: this.form1.license,
        f_Address: this.form1.address,
        f_Tel: this.form2.contactPhone,
        f_Contact: this.form2.contactName,
        f_Remark: this.form2.remark
      };
      await this.$_request({
        url: "/Base/Company/Reg",
        method: "post",
        data: data
      });
    },
    onSuccess(response) {
      if (response.code === 200) {
        // this.form1.license = response.data.F_FileId;
        this.form1.license = response.data.F_FilePath;
        this.ui.upload = false;
      } else {
        this.onError();
      }
    },
    checkPhone(val){ 
        var phone = val;
        if(!(/^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/.test(phone))){
          return false; 
        } else{
          return true;
        }
    },
    onError() {
      this.form1.license = "";
      this.ui.upload = false;
      this.$message({
        message: "上传失败",
        type: "error"
      });
    },
    onBeforeUpload() {
      this.ui.upload = true;
    },
    go(route) {
      this.$router.replace(route);
    },
    async postLogin() {
      let data = {
        username: 18606581078,
        password: 4581078,
        // grant_type: "password",
        grant_type: "pwd.userauth",
        client_id: "client_pc",
        client_secret: "secret"
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
      this.token = (tokenType ? `${tokenType} ` : "") + tokenValue;
      this.headers = {Authorization: this.token}
    },
  },
  mounted() {
    this.postLogin()
  }
};
</script>

<style lang="scss" module>
.wrap {
  width: 100%;
  height: 100%;
  display: flex;
  background: #e9eef8;
  .container {
    background: #fff;
    margin: auto;
    .logo {
      text-align: center;
      margin-top: 24px;
      margin-bottom: 24px;
      img {
        height: 32px;
      }
    }
    .steps {
      width: 980px;
      margin-bottom: 24px;
    }
    .step {
      width: 400px;
      margin: auto;
      .upload {
        text-align: center;
        .uploadContent {
          width: 300px;
          height: 150px;
          border: 1px dashed #d9d9d9;
          border-radius: 6px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .license {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        }
      }
    }
    .bs {
      margin-top: 24px;
      text-align: center;
    }
    .bl {
      margin: 16px 32px;
    }
  }
}
</style>
