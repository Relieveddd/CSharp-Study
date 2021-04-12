<template>
  <div>
    <el-table border :data="form.contractList" style="width: 100%">
      <el-table-column show-overflow-tooltip label="签约部门">
        <template v-slot="scope">
          <el-cascader
            style="width:100%"
            v-model="scope.row.f_DepId"
            :options="departmentTree"
            :props="{
              emitPath: false,
              multiple: false,
              checkStrictly: true,
              value: 'F_DepId',
              label: 'F_DepName',
              children: 'Child',
              expandTrigger: 'hover'
            }"
          ></el-cascader>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="签约岗位">
        <template v-slot="scope">
          <el-select
            style="width:100%"
            v-model="scope.row.f_PostId"
            placeholder="请选择"
            value-key="F_PostId"
          >
            <el-option
              v-for="(item, index) in jobList"
              :key="index"
              :label="item.F_PostName"
              :value="item.F_PostId"
            >
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="签约职务">
        <template v-slot="scope">
          <el-select
            style="width:100%"
            v-model="scope.row.f_JobId"
            placeholder="请选择"
            value-key="F_JobId"
          >
            <el-option
              v-for="(item, index) in positionList"
              :key="index"
              :label="item.F_JobName"
              :value="item.F_JobId"
            >
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="合同类型">
        <template v-slot="scope">
          <el-select
            style="width:100%"
            v-model="scope.row.f_ConType"
            placeholder="请选择"
            value-key="F_ItemDetailId"
          >
            <el-option
              v-for="(item, index) in dictionaryData.htlx"
              :key="index"
              :label="item.F_ItemName"
              :value="item"
            >
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="签订日期">
        <template v-slot="scope">
          <el-date-picker
            v-model="scope.row.f_SigningDate"
            type="date"
            placeholder="选择日期"
            style="width:100%"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="有效期" min-width="150px">
        <template v-slot="scope">
          <el-date-picker
            v-model="scope.row.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width:100%"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="离职日期">
        <template v-slot="scope">
          <el-date-picker
            v-model="scope.row.f_LeaveDate"
            type="date"
            placeholder="选择日期"
            style="width:100%"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </template>
      </el-table-column>
      
      <el-table-column show-overflow-tooltip label="离职原因">
        <template v-slot="scope">
          <el-select
            style="width:100%"
            v-model="scope.row.f_LeaveReason"
            placeholder="请选择"
            value-key="F_ItemDetailId"
          >
            <el-option
              v-for="(item, index) in dictionaryData.lzyy"
              :key="index"
              :label="item.F_ItemName"
              :value="item"
            >
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      
      <el-table-column show-overflow-tooltip label="电子合同" width="180px">
        <template v-slot="scope">
          <el-col style="width: 60px;">
            <el-upload
              :action="uploadAction"
              multiple
              :on-success="onUploadSuccess(scope.row)"
              :on-remove="onUploadRemove(scope.row)"
              :file-list="scope.row.fileList"
              :show-file-list="true"
              :headers="headers"
            >
              <el-button size="mini">上传</el-button>
            </el-upload>
          </el-col>
          <el-col style="width: 20px;">
            <el-button style="height: 28px;padding: 7px 15px;" @click='download(scope.row)'>查看</el-button>
          </el-col>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="备注">
        <template v-slot="scope">
          <el-input v-model="scope.row.f_ReMark"></el-input>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="right" v-if="!preview">
        <template v-slot:header>
          <el-button @click="onAdd" size="mini" icon="el-icon-plus"></el-button>
        </template>
        <template v-slot:default="scope">
          <el-button
            @click="onRemove(scope)"
            type="danger"
            icon="el-icon-delete"
            size="mini"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="padding-top: 30px;">
        <el-col style="width: 100px;">
          <el-upload
            :action="uploadAction"
            multiple
            :file-list="fileListleave"
            :on-success="leave"
            :show-file-list="true"
            :headers="headers"
          >
            <el-button size="mini">离职审批单</el-button>
          </el-upload>
        </el-col>
        <el-col style="width: 20px;">
          <el-button style="height: 28px;padding: 7px 15px;" @click='downloadLeave()'>查看</el-button>
        </el-col>
    </el-row>
  </div>
</template>
            <!-- :file-list="fileListleave" -->
<script>
  import checkPermission from "@/utils/checkPermission";
    import {FileGetSingle} from "@/utils/api";
export default {
  mixins: [checkPermission],
  props: {
    pform: {},
    departmentList: {
      type: Array, 
      default() {
        return [];
      }
    },
    departmentTree: {
      type: Array,
      default() {
        return [];
      }
    },
    positionList: {
      type: Array,
      default() {
        return [];
      }
    },
    jobList: {
      type: Array,
      default() {
        return [];
      }
    },
    roleList: {
      type: Array,
      default() {
        return [];
      }
    },
    preview: {
      type: Boolean,
      default: false
    },
    dictionaryData: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data (){
    return {
      fileListleave:[]
    }
  },
  computed: {
    form: {
      get() {
        return this.pform;
      },
      set(n) {
        this.$emit("update:pform", n);
      }
    },
    uploadAction() {
      return `${process.env.VUE_APP_API_BASEURL || ""}/Base/File/UploadFile`;
    },
    headers() {
      return {Authorization: this.$store.state.user.token}
    }
  },
  methods: {
    onAdd() {
      this.form.contractList.push({
        f_DepId: "",
        f_JobId: "",
        f_PostId: "",
        f_ConType: {},
        f_SigningDate: "",
        f_resignation: "",
        dateRange: [],
        f_LeaveDate: "",
        f_LeaveReason: {},
        f_ReMark: "",
        fileList: [],
        f_Attach: ''
      });
    },
    download(row){
      FileGetSingle(row.F_Attach).then(function(res){
         if(res.code==200){
           let url = `${process.env.VUE_APP_API_BASEURL || ""}`+res.data.F_FilePath;
           window.open(url);
         }
      });
    },
    downloadLeave() {
      if(this.form.leaveAuditAttach) {
        FileGetSingle(this.form.leaveAuditAttach).then(function(res){
           if(res.code==200){
             let url = `${process.env.VUE_APP_API_BASEURL || ""}`+res.data.F_FilePath;
             window.open(url);
           }
        });
      }
    },
    onRemove(scope) {
      this.form.contractList.splice(scope.$index, 1);
    },
    onUploadSuccess(row) {
      return function(response, file, fileList) {
        row.f_Attach = response.data.F_FileId;
        if(fileList.length>1){
          fileList.shift();
        }
        row.fileList = fileList;
      };
    },
    onUploadRemove(row) {
      return function(file, fileList) {
        row.fileList = fileList;
      };
    },
    leave(response, file, fileList) {
      if(fileList.length>1){
        fileList.shift();
      }
      if(response.code===200){
        this.form.leaveAuditAttach =  response.data.F_FileId;
          // console.log(response);
        }
      // console.log(response,file,fileList);
      // fileListleave
    },
  }
};
</script>
