<template>
  <div>
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
            ref="handleDepart"
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
          label="绩效类型"
          required
          :error="$v.form.type.$error ? '必填' : ''"
        >
          <el-select
            v-model="form.type"
            value-key="F_ItemDetailId"
            style="width:100%"
          >
            <el-option
              v-for="(item, index) in performanceTypeList"
              :key="index"
              :label="item.F_ItemName"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="评定年月"
          required
          :error="$v.form.yearMonth.$error ? '必填' : ''"
        >
          <el-date-picker
            v-model="form.yearMonth"
            type="month"
            placeholder="选择日期"
            value-format="yyyy,MM"
            style="width:100%"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="薪酬"
          required
          :error="$v.salaryTableHeaderList.$error ? '必填' : ''"
          v-show="false"
        >
          <el-select
            v-model="salaryTableHeaderList"
            value-key="F_ItemId"
            style="width:100%"
            multiple
          >
            <el-option
              v-for="(item, index) in salaryProjectList"
              :key="index"
              :label="item.F_ItemName"
              :value="item"
            >
            </el-option>
          </el-select>
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
      <mm-atp v-else v-loading="ui.loading">
        <!-- <template v-slot:action-right>
          <g-thai @ok="onThaiOk" :headerList="thaiHeaderList"></g-thai>
          <el-button @click="ui.sp = true" v-if="!isAddPersonnel"
            >导入员工</el-button>
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
        </template> -->
       <template v-slot:action-right>
          <el-row>
            <el-col style="width: 90px;">
              <g-thai @ok="onThaiOk" :headerList="thaiHeaderList"></g-thai>
            </el-col>
            <el-col style="width: 90px;" v-if="!isAddPersonnel"> 
              <el-button @click="ui.sp = true" 
                >导入员工</el-button>
            </el-col>
            <el-col style="margin-left: 10px;width: 90px;">
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
          </el-row>
        </template>
        <template v-slot:table>
          <el-table border :data="form.detailList" max-height="600" fit >
            <el-table-column show-overflow-tooltip label="部门" min-width="100" align="center">
              <template v-slot="scope">
                <el-autocomplete
                  v-model="scope.row.departmentName"
                  :fetch-suggestions="queryDepartmentName"
                  placeholder=""
                  :disabled="true"
                  size="mini"
                ></el-autocomplete>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="姓名" min-width="90" align="center">
              <template v-slot="scope">
                <el-input
                  v-model="scope.row.personalName"
                  :disabled="true"
                  size="mini"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="级别" min-width="100" align="center">
              <template v-slot="scope">
                <el-autocomplete
                  v-model="scope.row.levelName"
                  :fetch-suggestions="queryLevelName"
                  placeholder=""
                  :disabled="true"
                  size="mini"
                ></el-autocomplete>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="职务" min-width="100" align="center">
              <template v-slot="scope">
                <el-autocomplete
                  v-model="scope.row.positionName"
                  :fetch-suggestions="queryPositionName"
                  placeholder=""
                  :disabled="true"
                  size="mini"
                ></el-autocomplete>
              </template>
            </el-table-column>
            <el-table-column 
              min-width="140"
              align="center"
              v-for="(item, index) in salaryTableHeaderList"
              :key="index"
              :label="item.F_ItemName || item.F_SalaryItemName || ''"
            >
              <template v-slot="scope">
                <el-input-number
                  v-model="
                    scope.row.salaryProjectList[
                      item.F_ItemId || item.F_SalaryItem
                    ]
                  "
                  controls-position="right"
                  size="mini"
                  style="width:100%"
                ></el-input-number>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="评定说明">
              <template v-slot="scope">
                <el-input v-model="scope.row.remark" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip align="right" width="80px">
              <template v-slot:default="scope">
                <el-button
                  @click="onRemove(scope)"
                  type="danger"
                  icon="el-icon-delete"
                  v-if="!isAddPersonnel"
                  size="mini"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </mm-atp>
      <span slot="footer">
        <el-alert
          v-if="ui.fullscreen && !haveFormDetailList"
          title="请选择人员"
          type="warning"
          :closable="false"
          show-icon
          style="margin-bottom:16px;text-align:start;"
        >
        </el-alert>
        <el-button @click="closeSelf">取 消</el-button>
        <el-button
          type="primary"
          @click="onOk"
          :loading="ui.okLoading"
          :disabled="ui.fullscreen && !haveFormDetailList"
          >确 认</el-button
        >
      </span>
      <g-sp
        ref="child"
        :visible.sync="ui.sp"
        :preTable="form.detailList.map(x => x.personalId)"
        @ok="onPersonneSelect"
        append-to-body
      ></g-sp>
    </el-dialog>
    <el-dialog
      class="xz"
      title="提示"
      :visible.sync="warn"
      width="50%"
      :before-close="handleClose">
      <span>您尚未添加此薪酬项目，无法新增。
  请到“薪酬管理>薪酬项目”下新增“出警费”薪酬项。</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="warn = false">暂不添加</el-button>
        <el-button type="primary" @click="sure">前去添加</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fromPairs as fromEntries } from "lodash";
import { required } from "@/utils/validator";
import { queryDictionaryDetailByCode, queryPosition, FileGetSingle} from "@/utils/api";
import { set } from "lodash";


const data_form = function() {
  return {
    id: "",
    type: null,
    yearMonth: "",
    personnelTypeId: "",
    detailList: []
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
      type: {
        required
      },
      yearMonth: {
        required
      },
      personnelTypeId: {
        required
      }
    },
    salaryTableHeaderList: {
      required
    },
    group: ["form", "salaryTableHeaderList"]
  },
  data() {
    return {
      warn: false,
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
      salaryProjectList: [],
      salaryTableHeaderList: [],
      dictionaryData: {
        rylb: []
      },
      f_Attach:''
    };
  },
  computed: {
    salaryTableHeaderHash() {
      return fromEntries(
        this.salaryTableHeaderList.map(x => [x.F_ItemId || x.F_SalaryItem, x])
      );
    },
    isShow: {
      get() {
        return this.visible;
      },
      set(n) {
        this.$emit("update:visible", n);
      }
    },
    title() {
      return `${this.formType === "add" ? "新增" : "修改"}`;
    },
    isAddPersonnel() {
      if (this.type === 1 && this.department.length > 0) {
        return true;
      } else {
        return false;
      }
    },
    haveFormDetailList() {
      return this.form.detailList.length ? true : false;
    },
    thaiHeaderList() {
      return [
        ...this.salaryTableHeaderList.map(x => {
          return {
            label: x.F_ItemName,
            prop: `salaryProjectList.${x.F_ItemId}`
          };
        }),
        {
          label: "评定说明",
          prop: "remark"
        }
      ];
    },
    uploadAction() {
      return `${process.env.VUE_APP_API_BASEURL || ""}/Base/File/UploadFile`;
    },
    headers() {
      return {Authorization: this.$store.state.user.token}
    }
  },
  methods: {
    onThaiOk(data) {
      let { prop, content } = data;

      this.form.detailList.forEach(element => {
        set(element, prop, content);
      });
    },
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
        this.getSalaryProjectList(),
        this.getDictionaryData()
      ]);

      this.ui.loading = false;
    },
    closeSelf() {
      this.isShow = false;
    },
    onClosed() {
      this.form = data_form();
      this.department = [];
      this.salaryProjectList = [];
      this.salaryTableHeaderList = [];
      this.ui.fullscreen = false;
      this.$v.$reset();
    },
    onRemove(scope) {
      this.form.detailList.splice(scope.$index, 1);
    },
    async onOk() {
      this.ui.okLoading = true;

      try {
        if (this.ui.fullscreen === false) {
          this.$v.group.$touch();
          if (this.$v.group.$error) return;

          if (this.type === 1 && this.department.length > 0) {
            await this.getPersonal();
          }
          if(this.type === 2 && this.department.length > 0) {
            let depart = {};
            this.$refs.handleDepart.getCheckedNodes().map(x => {
              
              if(x.parent) {
                if(!depart[x.parent.label]){
                  x.parent.value.Child = [];
                  depart[x.parent.label] = x.parent.value;
                }
                depart[x.parent.label].Child.push(x.value);
              }else{
                if(!depart[x.label]){
                  x.value.Child = [];
                  depart[x.label] = x.value;
                }
              }
            }) 
            let departArr = [];
            for(let key in depart) {
              departArr.push(depart[key])
            }
            this.$refs.child.showDepartment(departArr);
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
        // f_ProType: this.form.type.F_ItemDetailId,
        f_ProType: "996",
        f_SType: 996,
        f_Year: Number((this.form.yearMonth || "").split(",")[0]),
        f_Month: Number((this.form.yearMonth || "").split(",")[1]),
        f_Attach: this.f_Attach,
        f_PType: this.form.personnelTypeId,
        f_DepIds: this.department.map(x => {
          return x.F_DepId
        }).join(','),
        f_Detail: this.form.detailList.map(x => {
          return {
            f_EmpId: x.personalId,
            f_DepName: x.departmentName,
            f_Job: x.positionName,
            f_Lev: x.levelName,
            f_Result: x.result,
            f_Bonus: x.bonus,
            f_ReMark: x.remark,
            f_BFKFInfo: Object.entries(x.salaryProjectList).map(x => {
              let [id, value] = x;

              return {
                f_SalaryItem: id,
                f_SalaryItemName:
                  this.salaryTableHeaderHash[id].F_ItemName ||
                  this.salaryTableHeaderHash[id].F_SalaryItemName,
                f_SalaryValue: value || 0
              };
            })
          };
        })
      };
      await this.$_request({
        url: "/HR/SalaryPropertyPatch/Change",
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
            url: "/HR/Emp/EmpList",
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
              personalId: x.F_EmpID,
              personalName: x.F_EmpName,
              departmentName: x.F_DepName,
              positionName: x.F_JobName,
              levelName: x.F_JobLevelZName || "",
              result: "",
              bonus: "",
              overtimePay: "",
              deduction: "",
              remark: "",
              salaryProjectList: fromEntries(
                this.salaryTableHeaderList.map(x => [x.F_ItemId, 0])
              )
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
          return Object.assign({
            personalId: x.F_EmpID,
            personalName: x.F_EmpName,
            departmentName: x.F_DepName,
            positionName: x.F_JobName,
            levelName: x.F_JobLevelZName,
            result: "",
            bonus: "",
            overtimePay: "",
            deduction: "",
            remark: "",
            salaryProjectList: fromEntries(
              this.salaryTableHeaderList.map(x => [x.F_ItemId, 0])
            )
          });
        })
      );
    },
    async getSalaryProjectList() {
      let res = await this.$_request({
        url: "/HR/SalaryItems/List",
        method: "post",
        data: {
          queryJson_S: "",
          queryJson: JSON.stringify({
            f_ItemType: 1
          }),
          orderJson: "",
          pageIndex: 1,
          pageSize: 9999
        }
      });
      let msg = true;
      this.salaryProjectList = res.data.data.map(x => {
        if(x.F_Name === '加班费'){
          this.salaryTableHeaderList = [{F_ItemId:x.F_Id,F_ItemName: x.F_Name,F_ItemType: x.F_ItemType}];
          msg = false;
        }
        return {
          F_ItemId: x.F_Id,
          F_ItemName: x.F_Name,
          F_ItemType: x.F_ItemType
        };
      });
      if(msg){
        this.isShow = false;
        this.warn = true;
        return false
      }else{
        this.isShow = true;
      }
      
    },
    addSalaryProject(list) {
      list.push({
        salaryProjectId: "",
        value: 0
      });
    },
    removeSalaryProject(scope, list) {
      list.splice(scope.$index, 1);
    },
    async getDetail() {
      let res = await this.$_request({
        url: "/HR/SalaryPropertyPatch/GetSingle",
        method: "get",
        params: {
          id: this.currentRow.F_Id,
          pageIndex: 1,
          pageSize: 9999
        }
      });

      let resData = res.data.data;

      Object.assign(this.form, {
        id: resData.F_Id,
        type: {
          F_ItemDetailId: resData.F_ProType
        },
        yearMonth: `${resData.F_Year},${resData.F_Month}`,
        personnelTypeId: resData.F_PType,
        detailList: resData.F_Detail.map(x => {
          return {
            personalId: x.F_EmpId,
            personalName: x.F_EmpName,
            departmentName: x.F_DepName,
            positionName: x.F_Job,
            levelName: x.F_Lev,
            result: x.F_Result,
            bonus: x.F_Bonus,
            overtimePay: "",
            deduction: "",
            remark: x.F_ReMark,
            salaryProjectList: fromEntries(
              x.F_BFKFInfo.map(x => [x.F_SalaryItem, x.F_SalaryValue])
            )
          };
        })
      });

      if (resData.F_Detail && resData.F_Detail.length) {
        this.salaryTableHeaderList = resData.F_Detail[0].F_BFKFInfo || [];
      }
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
      if(this.f_Attach) {
        FileGetSingle(this.f_Attach).then(function(res){
           if(res.code==200){
             let url = `${process.env.VUE_APP_API_BASEURL || ""}`+res.data.F_FilePath;
             window.open(url);
           }
        });
      }
    },
    handleClose(done) {
        this.warn = false
    },
    sure() {
      this.warn = false
      this.$router.replace({
        name: "salaryProject"
      });
    }
  }
};
</script>
