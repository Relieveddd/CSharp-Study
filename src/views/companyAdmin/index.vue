<template>
  <div style="padding-left: 30px;padding-top: 30px;" v-loading="ui.loading">
    <el-row class="row1" style="padding: 20px;">
      <el-col :span="4" style="line-height: 32px;text-align: right;">人事系统标题：</el-col>
      <el-col :span="8">
        <el-input v-model="SysConfig.f_HRSystemName"></el-input>
      </el-col>
    </el-row>
    <el-row style="padding: 20px;padding-top: 0px;line-height: 32px;">
      <el-col :span="4" style="text-align: right;">薪酬计算周期：</el-col>
      <el-col style="width: 215px;">
        <el-select @change="f_DayTypeChange" v-model="SysConfig.f_DayType" placeholder="请选择">
          <el-option
            v-for="item in dayType"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col v-show="showDay" style="width: 40px;margin: 0 10px;">上月</el-col>
      <el-col v-show="showDay" style="width: 215px;">
        <el-select v-model="SysConfig.f_SalaryStartDay" placeholder="请选择">
          <el-option
            v-for="item in day"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col v-show="showDay" style="width: 40px;margin: 0 10px;">本月</el-col>
      <el-col v-show="showDay" style="width: 215px;">
        <el-select v-model="SysConfig.f_SalaryEndDay" placeholder="请选择">
          <el-option
            v-for="item in day"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row style="padding: 20px;padding-top: 0px;">
      <el-col :span="4" style="text-align: right;line-height: 32px;">工资提醒日：</el-col>
      <el-col :span="8">
        <el-select v-model="SysConfig.f_SalaryCreateTip" placeholder="请选择">
          <el-option
            v-for="item in day"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row class="row3" style="line-height: 32px;">
      <el-col :span="4" style="text-align: right;">合同模板：</el-col>
      <el-col :span="6" style="margin-left: 10px;">
        <el-upload
          multiple
          ref="upload"
          :action="uploadAction"
          :on-success="onUploadSuccess"
          :headers="headers"
          :file-list="fileList2"
          list-type="picture"
        >
          <el-button size="mini">上传附件</el-button>
        </el-upload>
      </el-col>
    </el-row>
    <el-row>
      <el-col style="text-align: center;">
        <el-button @click="ok" type="primary">提交</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import checkPermission from "@/utils/checkPermission";
import { FileGetSingle } from "@/utils/api";
export default {
  name: "companyAdmin",
  mixins: [checkPermission],
  data() {
    return {
      month: 0,
      SysConfig: {
        f_HRSystemName: "",
        f_SalaryStartDay: "",
        f_SalaryEndDay: "",
        f_id: "",
        f_ContractTemplate: "",
        f_SalaryCreateTip: "",
        f_DayType: ""
      },
      dayType: [{value: 0,name: "请选择"}, {value: 1,name: "跨月"}, {value: 2,name: "自然月"}],
      showDay: false,
      day: [
        "请选择",
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        31
      ],
      fileList2: [],
      ui: {
        loading: false
      }
    };
  },
  computed: {
    uploadAction() {
      return `${process.env.VUE_APP_API_BASEURL || ""}/Base/File/UploadFile`;
    },
    headers() {
      return { Authorization: this.$store.state.user.token };
    }
  },
  methods: {
    getData() {
      this.SysConfig = this.$store.state.SysConfig;
      if(this.SysConfig.f_DayType === 1) {
        this.showDay = true
      }
      if (this.SysConfig.f_ContractTemplate) {
        FileGetSingle(this.SysConfig.f_ContractTemplate).then(res => {
          if(res.code === 200) {
            this.fileList2 = [
              { name: res.data.F_FileName, url: res.data.F_FilePath }
            ];
          }
        });
      }
    },
    getSys() {
      
    },
    onUploadSuccess(response, file, fileList) {
      if (fileList.length > 1) {
        fileList.shift();
      }
      if (response.code == 200) {
        this.SysConfig.f_ContractTemplate = response.data.F_FileId;
      }
    },
    ok() {
      let params = this.SysConfig;
      for(let key in params) {
        if(params[key] === '请选择') {
          params[key] = ''
        }       
      }
      if(params.f_DayType === 1 && (!params.f_SalaryEndDay || !params.f_SalaryStartDay)) {
        return this.$message({
          message: "请选择薪酬计算日期",
          type: 'warning'
        })
      }
      let that = this;
      this.ui.loading = true;
      this.$_request({
        url: "/HR/SysConfig/Change",
        method: "post",
        data: params
      }).then(res => {
        if (res.data.code == 200) {
          if (that.SysConfig.f_HRSystemName) {
            document.title = that.SysConfig.f_HRSystemName;
          }
          this.$message({
            message: "提交成功",
            type: "success"
          })
        }
        this.ui.loading = false;
      });
    },
    f_DayTypeChange(val) {
      if (val === 1) {
        this.showDay = true
      }else{
        this.showDay = false;
        this.SysConfig.f_SalaryStartDay = "";
        this.SysConfig.f_SalaryEndDay = "";
      }
    }
  },
  watch: {
    "SysConfig.f_DayType"(val) {
      if (val === 1) {
        this.showDay = true
      }else{
        this.showDay = false;
      }
    }
  },
  mounted() {
    this.getData();
  }
};
</script>
<style></style>
