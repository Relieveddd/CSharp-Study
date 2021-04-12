<template>
  <el-dialog
    :title="title"
    :visible.sync="isShow"
    @closed="onClosed"
    @open="onOpen"
    :fullscreen="ui.fullscreen"
  >
    <el-form label-width="6em" v-if="!ui.fullscreen" v-loading="ui.loading">
      <el-form-item label="部门">
        <el-cascader
          style="width:100%"
          v-model="department"
          :options="departmentList"
          :props="{
            emitPath: false,
            multiple: true,
            checkStrictly: true,
            expandTrigger: 'hover'
          }"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="绩效成员">
        <el-radio-group v-model="type">
          <el-radio :label="1">全员</el-radio>
          <el-radio :label="2">部分</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="人员类别"
        required
        :error="$v.form.personnelTypeId.$error ? '必填' : ''"
      >
        <el-select
          v-model="form.personnelTypeId"
          placeholder="请输入关键词"
          value-key="F_ItemDetailId"
          style="width:100%"
        >
          <el-option
            v-for="(item, index) in dictionaryData.rylb"
            :key="index"
            :label="item.F_ItemName"
            :value="item.F_ItemDetailId"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <mm-atp v-else>
      <template v-slot:action-right>
        <el-row>
          <el-col style="margin-right: 10px;width: 90px;" v-if="hide">
              <el-upload
                multiple
                ref="upload"
                :action="uploadAction"
                :on-success="onUploadSuccess"
                :on-remove="onUploadRemove()"
                :headers="headers"
              >
                <el-button style="height: 32px;" size="mini">上传附件</el-button>
              </el-upload>   
          </el-col>
          <el-col style="width: 60px;margin-right: 10px;" v-if="false">
            <el-button @click="download">查看</el-button>
          </el-col>
          <el-col style="width: 90px;"  v-if="!isDisabled && formType === 'add'">
              <el-button
                @click="ui.sp = true"
                >导入员工</el-button>
          </el-col>
        </el-row>
      </template>
      <template v-slot:table>
        <el-table border :data="form.detailList">
          <el-table-column show-overflow-tooltip label="部门">
            <template v-slot="scope">
              <el-autocomplete
                v-model="scope.row.departmentName"
                :fetch-suggestions="queryDepartmentName"
                placeholder=""
                :disabled="true"
              ></el-autocomplete>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="姓名">
            <template v-slot="scope">
              <el-input
                v-model="scope.row.personalName"
                :disabled="true"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="职位">
            <template v-slot="scope">
              <el-input
                v-model="scope.row.jobName"
                placeholder=""
                :disabled="true"
              >
              </el-input>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="职务">
            <template v-slot="scope">
              <el-autocomplete
                v-model="scope.row.positionName"
                :fetch-suggestions="queryPositionName"
                placeholder=""
                :disabled="true"
              ></el-autocomplete>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="当前级别">
            <template v-slot="scope">
              <el-autocomplete
                v-model="scope.row.levelName"
                :fetch-suggestions="queryLevelName"
                placeholder=""
                :disabled="true"
              ></el-autocomplete>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="拟提级别">
            <template v-slot="scope">
              <el-select
                v-model="scope.row.betterLevel"
                placeholder=""
                value-key="F_ItemDetailId"
                :disabled="true"
              >
                <el-option
                  v-for="(item, index) in levelList"
                  :key="index"
                  :label="item.F_ItemName"
                  :value="item"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="核定级别">
            <template v-slot="scope">
              <el-select
                v-model="scope.row.newLevel"
                placeholder=""
                value-key="F_ItemDetailId"
              >
                <el-option
                  v-for="(item, index) in levelList"
                  :key="index"
                  :label="item.F_ItemName"
                  :value="item"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="评定说明">
            <template v-slot="scope">
              <el-input v-model="scope.row.remark"></el-input>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip align="right" width="80px">
            <template v-slot:default="scope">
              <el-button
                @click="onRemove(scope)"
                type="danger"
                icon="el-icon-delete"
                v-if="!isDisabled"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template v-slot:bottom>
        <el-alert title="" type="info" :closable="false" show-icon>
          当选择部门全员时，则自动带出人员，当选择部分人员时，则在此界面人工选择添加人
        </el-alert>
      </template>
    </mm-atp>
    <span slot="footer">
      <el-button @click="closeSelf">取 消</el-button>
      <el-button type="primary" @click="onOk" :loading="ui.okLoading"
        >确 认</el-button
      >
    </span>
    <c-sp
      :visible.sync="ui.sp"
      :preTable="form.detailList.map(x => x.personalId)"
      @ok="onPersonneSelect"
      append-to-body
    ></c-sp>
  </el-dialog>
</template>

<script>
import { required } from "@/utils/validator";
import {FileGetSingle} from "@/utils/api";
import { queryDictionaryDetailByCode, queryPosition } from "@/utils/api";
import CSp from "./sp";

const data_form = function() {
  return {
    id: "",
    personnelTypeId: "",
    detailList: []
  };
};

export default {
  components: {
    CSp
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    formType: {
      type: String,
      default: "add"
    },
    currentRow: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  validations: {
    form: {
      personnelTypeId: {
        required
      }
    },
    group: ["form"]
  },
  data() {
    return {
      department: [],
      type: 1,
      form: data_form(),
      ui: {
        fullscreen: false,
        tree: false,
        loading: false,
        okLoading: false,
        sp: false
      },
      departmentList: [],
      personalList: [],
      performanceTypeList: [],
      levelList: [],
      positionList: [],
      dictionaryData: {
        rylb: []
      },
      hide:false,
      f_Attach:''
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
      return `${this.formType === "add" ? "新增" : "修改"}条件`;
    },
    isDisabled() {
      if (this.type === 1 && this.department.length > 0) {
        return true;
      } else {
        return false;
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
    async onOpen() {
      this.ui.loading = true;
      if (this.currentRow && this.currentRow.F_Id) {
        this.ui.fullscreen = true;
        await this.getDetail();
      }

      await Promise.all([
        this.getDepartmentList(),
        this.getPerformanceType(),
        this.getLevel(),
        this.queryPosition(),
        this.getDictionaryData()
      ]);

      this.ui.loading = false;
    },
    async getDetail() {
      let res = await this.$_request({
        url: "/HR/LevAdjust/GetSingle",
        method: "get",
        params: {
          id: this.currentRow.F_Id
        }
      });
      if(this.formType === 'edit'){
        this.hide = true;
      }
      let resData = res.data.data;
      Object.assign(this.form, {
        id: resData.F_Id,
        personnelTypeId: resData.F_PType,
        detailList: resData.F_Detail.map(x => {
          return {
            personalId: x.F_EmpId,
            personalName: x.F_EmpName,
            departmentName: x.F_DepName,
            jobName: x.F_PostName,
            positionName: x.F_JobName,
            levelName: x.F_OldJobLev,
            betterLevel: {
              F_ItemName: x.F_ProJobLev,
              F_ItemDetailId: x.F_ProJobLevId
            },
            newLevel: {
              F_ItemDetailId: x.F_NewJobLevId,
              F_ItemName: x.F_NewJobLev
            },
            remark: x.F_ReMark
          };
        })
      });
    },
    closeSelf() {
      this.isShow = false;
    },
    onClosed() {
      this.form = data_form();
      this.department = [];
      this.ui.fullscreen = false;
      this.$v.$reset();
    },
    onAdd() {
      this.form.detailList.push({
        personalId: "",
        personalName: "",
        departmentName: "",
        positionName: "",
        levelName: "",
        result: "",
        bonus: "",
        overtimePay: "",
        deduction: "",
        remark: ""
      });
    },
    onRemove(scope) {
      this.form.detailList.splice(scope.$index, 1);
    },
    async onOk() {
      this.ui.okLoading = true;
      try {
        if(this.type === 2){
          this.hide=true
        }else{
          this.hide=false
        }
        if (this.ui.fullscreen === false) {
          this.$v.group.$touch();
          if (this.$v.group.$error) return;

          if (this.type === 1 && this.department.length > 0) {
            await this.getPersonal();
          }

          this.ui.fullscreen = true;
        } else {
          await this.postForm();

          this.closeSelf();
          this.$message({
            message: "成功",
            type: "success"
          });
          this.$emit("ok");
        }
      } finally {
        this.ui.okLoading = false;
      }
    },
    async postForm() {
      let data = {
        f_Id: this.form.id,
        f_PType: this.form.personnelTypeId,
        f_Attach: this.f_Attach,
        f_Detail: this.form.detailList.map(x => {
          return {
            f_EmpId: x.personalId,
            f_EmpName: x.personalName,
            f_DepName: x.departmentName,
            f_PostName: x.jobName,
            f_JobName: x.positionName,
            f_OldJobLev: x.levelName,
            f_ProJobLev: x.betterLevel.F_ItemName,
            f_ProJobLevId: x.betterLevel.F_ItemDetailId,
            f_NewJobLevId: x.newLevel.F_ItemDetailId,
            f_NewJobLev: x.newLevel.F_ItemName,
            f_ReMark: x.remark
          };
        })
      };
      if(!data.f_Attach) {
        this.$message({
          message: "请上传附件",
          type: "warn"
        });
      }

      await this.$_request({
        url: "/HR/LevAdjust/Change",
        method: "post",
        data
      });
    },
    async getDepartmentList() {
      let res = await this.$_request({
        url: "/HR/Department/GetTreeStructure",
        method: "get"
      });

      let loop = function(array = []) {
        return array.map(x => {
          let na = {
            label: x.F_DepName,
            value: x
          };

          if (x.Child) {
            na.children = loop(x.Child);
          }
          return na;
        });
      };

      this.departmentList = loop(res.data.data);
    },
    async getPerformanceType() {
      let resData = await queryDictionaryDetailByCode("jxlx");
      this.performanceTypeList = resData.data;
    },
    async getPersonal() {
      let resList = await Promise.all(
        this.department.map(x => {
          return this.$_request({
            url: "/HR/LevAdjust/GetEmpList",
            method: "post",
            data: {
              queryJson_S: "",
              queryJson: JSON.stringify({
                f_DepName: x.F_DepName
              }),
              orderJson: "",
              pageIndex: 1,
              pageSize: 9999
            }
          });
        })
      );

      let personalList = [];
      let detailList = [];

      resList.forEach(x => {
        personalList.push(...x.data.data);
        detailList.push(
          ...x.data.data.map(x => {
            return {
              personalId: x.F_EmpId,
              personalName: x.F_EmpName,
              departmentName: x.F_DepName,
              positionName: x.F_JobName,
              jobName: x.F_PostName,
              levelName: x.F_OldJobLev || "",
              remark: "",
              betterLevel: {
                F_ItemName: x.F_ProJobLev,
                F_ItemDetailId: x.F_ProJobLevId
              },
              newLevel: {
                F_ItemName: x.F_ProJobLev,
                F_ItemDetailId: x.F_ProJobLevId
              }
            };
          })
        );
      });

      this.personalList = personalList;
      this.form.detailList = detailList;
    },
    async getLevel() {
      let resData = await queryDictionaryDetailByCode("dj");
      this.levelList = resData.data;
    },
    async queryPosition() {
      let resData = await queryPosition({
        queryJson_S: "",
        queryJson: "",
        orderJson: "",
        pageIndex: 1,
        pageSize: 9999
      });

      this.positionList = resData.data;
    },
    queryLevelName(queryString, cb) {
      let list = this.levelList.map(x => {
        return x.F_ItemName;
      });

      cb(
        list
          .filter(x => {
            return x.includes(queryString);
          })
          .map(x => {
            return {
              value: x
            };
          })
      );
    },
    queryPositionName(queryString, cb) {
      let list = this.positionList.map(x => {
        return x.F_JobName;
      });

      cb(
        list
          .filter(x => {
            return x.includes(queryString);
          })
          .map(x => {
            return {
              value: x
            };
          })
      );
    },
    queryDepartmentName(queryString, cb) {
      let list = this.departmentList.map(x => {
        return x.F_DepNamex || x.label;
      });

      cb(
        list
          .filter(x => {
            return x.includes(queryString);
          })
          .map(x => {
            return {
              value: x
            };
          })
      );
    },
    onPersonneSelect(list) {
      this.form.detailList.push(
        ...list.map(x => {
          return {
            personalId: x.F_EmpId,
            personalName: x.F_EmpName,
            departmentName: x.F_DepName,
            jobName: x.F_PostName,
            positionName: x.F_JobName,
            levelName: x.F_OldJobLev,
            betterLevel: {
              F_ItemName: x.F_ProJobLev,
              F_ItemDetailId: x.F_ProJobLevId
            },
            newLevel: {
              F_ItemName: x.F_ProJobLev,
              F_ItemDetailId: x.F_ProJobLevId
            },
            remark: ""
          };
        })
      );
    },
    async getDictionaryData() {
      let resData = await queryDictionaryDetailByCode("rylb");

      this.dictionaryData.rylb = resData.data;
    },
    onUploadSuccess(response,file,fileList) {
        if(fileList.length>1){
          fileList.shift();
        }
        if(response.code==200){
          this.f_Attach = response.data.F_FileId;
        }
    },
    onUploadRemove() {
      return function(file, fileList) {
        
      };
    },
    download() {
      // if(this.form.leaveAuditAttach) {
        FileGetSingle(this.f_Attach).then(function(res){
           if(res.code==200){
             let url = `${process.env.VUE_APP_API_BASEURL || ""}`+res.data.F_FilePath;
             window.open(url);
           }
        });
      // }
    },
  }
};
</script>
