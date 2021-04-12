<!-- 新增人事档案 -->

<template>
  <mm-atp palign="right" v-loading="ui.loading">
    <template v-slot:top>
      <el-tabs v-model="tab">
        <el-tab-pane
          v-for="(item, index) in tabList"
          :key="index"
          :label="item.title"
          :name="item.component"
        ></el-tab-pane>
        <el-tab-pane v-if="preview" label="薪酬记录" name="wage"></el-tab-pane>
      </el-tabs>
    </template>
    <template v-slot:table>
      <component
        v-show="tab === 'form1'"
        ref="form1"
        :is="'form1'"
        :pform.sync="form"
        :departmentList="departmentList"
        :departmentTree="departmentTree"
        :positionList="positionList"
        :jobList="jobList"
        :roleList="roleList"
        :dictionaryData="dictionaryData"
        :preview="preview"
        :socialSecurityTypeList="socialSecurityTypeList"
        :formType="formType"
      ></component>
      <keep-alive>
        <component
          v-if="tab !== 'form1' && tab !== 'wage'"
          :is="formComponent"
          :pform.sync="form"
          :departmentList="departmentList"
          :departmentTree="departmentTree"
          :positionList="positionList"
          :jobList="jobList"
          :roleList="roleList"
          :dictionaryData="dictionaryData"
          :preview="preview"
          :socialSecurityTypeList="socialSecurityTypeList"
        ></component>
      </keep-alive>
      <component v-if="tab === 'wage'" :is="'wage'" :id="id"> </component>
    </template>
    <template v-slot:pagination v-if="!preview">
      <el-button type="primary" @click="onOk" :loading="ui.okLoading"
        >确认</el-button
      >
    </template>
  </mm-atp>
</template>

<script>
import {
  queryDepartment,
  queryPosition,
  queryJob,
  queryRole,
  queryDictionaryDetailByCode
} from "@/utils/api";
import form1 from "./components/form1";
import form2 from "./components/form2";
import form3 from "./components/form3";
import form4 from "./components/form4";
import form5 from "./components/form5";
import form6 from "./components/form6";
import form7 from "./components/form7";
import form8 from "./components/form8";
import wage from "./components/wage";
import CPermission from "@/views/companyStructure/role/components/permission";
const data_form = function() {
  return {
    id: "",
    number: "",
    name: "",
    sexType: "",
    isSlip: "",
    salarySlipTip: "",
    birthplaceType: [],
    nationalityType: "",
    educationType: {},
    idcard: "",
    phoneNumber: "",
    address: "",
    residenceAddress: "",
    birthday: "",
    busInsuranceExpire: "",
    accountType: {},
    restModel: {},
    busInsurance: "",
    marriageType: {},
    boyNumber: "",
    girlNumber: "",
    politicalType: {},
    skillList: [],
    high: "",
    weight: "",
    headLength: "",
    legLength: "",
    // 三围
    bust: "",
    waist: "",
    hip: "",
    //
    department: {},
    departmentId: "",
    job: {},
    position: {},
    level: {},
    type: {},
    workAddress: {},
    role: {},
    veteran: {},
    email: "",
    beforeAge: "",
    bank: "",
    bankCardId: "",
    skillLev: "",
    socialSecurity: {},
    socialSecurityCardId: "",
    //
    familyList: [],
    healthList: [],
    contractList: [],
    resumeList: [],
    jobList: [],
    educationList: [],
    trainingInfo: [],
    leaveAuditAttach: ''
  };
};

export default {
  name: "personnelProfileAdd",
  components: {
    form1,
    form2,
    form3,
    form4,
    form5,
    form6,
    form7,
    form8,
    wage,
    CPermission
  },
  provide() {
    let disabled = this.preview;
    return {
      elForm: {
        disabled
      }
    };
  },
  props: {
    id: {
      type: String,
      default: ""
    },
    preview: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: data_form(),
      tab: "form1",
      tabList: [
        {
          title: "基础信息",
          component: "form1"
        },
        {
          title: "家庭关系",
          component: "form2"
        },
        {
          title: "健康档案",
          component: "form3"
        },
        {
          title: "合同管理",
          component: "form4"
        },
        {
          title: "履历管理",
          component: "form5"
        },
        {
          title: "工作经历",
          component: "form6"
        },
        {
          title: "教育经历",
          component: "form7"
        },
        {
          title: "训练档案",
          component: "form8"
        }
      ],
      departmentList: [],
      departmentTree: [],
      positionList: [],
      jobList: [],
      roleList: [],
      dictionaryData: {
        whcd: [],
        hklx: [],
        hyzk: [],
        zzmm: [],
        jntc: [],
        rylb: [],
        rzdd: [],
        twjr: [],
        sblx: [],
        dj: [],
        htlx: [],
        khxm: [],
        pd: [],
        ry: [],
        zs: [],
        xxms: [],
        syx: [],
        lzyy: [],
        jndj: []
      },
      socialSecurityTypeList: [],
      ui: {
        loading: false,
        okLoading: false
      },
      formType: "add"
    };
  },
  computed: {
    formComponent() {
      return this.tab;
    }
  },
  methods: {
    async onOk() {
      this.$refs.form1.readBirthday(this.form.idcard);
      this.$refs.form1.$v.form.$touch();
      if (this.$refs.form1.$v.form.$error) {
        return this.$message({
          message: "请填写完整",
          type: "warning"
        });
      }
      if(this.$refs.form1.busInsuranceExpire_b === 0) {
        this.form.busInsuranceExpire = ''
      }
      if(this.form.salarySlipTip) {
        this.form.salarySlipTip = 1
      }else{
        this.form.salarySlipTip = 0
      }
      this.ui.okLoading = true;

      try {
        await this.postForm();

        this.$_eventBus.$emit("personnelProfileAdd");
        this.$message({
          message: "成功",
          type: "success"
        });

        if (this.formType === "add") {
          this.$refs.form1.$v.$reset();
          this.form = data_form();
        } else {
          this.$store.commit("tabView/removeTab", {
            tab: {
              name: "personnelProfileEdit"
            }
          });

          let tabSize = this.$store.state.tabView.tabList.length;

          if (tabSize >= 1) {
            let lastTab = this.$store.state.tabView.tabList[tabSize - 1];

            this.$router.replace({
              name: lastTab[0]
            });
          } else {
            let firstPinTab = this.$store.state.tabView.pinTabList[0];

            this.$router.replace({
              name: firstPinTab[0]
            });
          }
        }
      } finally {
        this.ui.okLoading = false;
      }
    },
    async postForm() {
      let data = {
        f_EmpID: this.form.id,
        f_EmpCode: this.form.number,
        f_EmpName: this.form.name,
        f_Tel: this.form.phoneNumber,
        f_DepID: this.form.departmentId,
        f_JobId: this.form.position.F_JobId,
        f_PostId: this.form.job.F_PostId,
        f_RoleId: this.form.role.F_RoleId,
        f_RoleName: this.form.role.F_RoleName,
        f_JobLevel: this.form.level.F_ItemDetailId || "",
        f_PType: this.form.type.F_ItemDetailId || "",
        f_Sex: this.form.sexType,
        f_IsSlip:this.form.isSlip,
        f_SalarySlipTip:this.form.salarySlipTip,
        f_Birthplace: this.form.birthplaceType.join(",") || "",
        f_Nation: this.form.nationalityType || "",
        f_Education: this.form.educationType.F_ItemDetailId || "",
        f_IdCard: this.form.idcard,
        f_BirthDay: this.form.birthday,
        f_Weight: this.form.weight,
        f_Hight: this.form.high,
        f_HeadLen: this.form.headLength,
        f_FootLen: this.form.legLength,
        f_ThreeCircle: `${this.form.bust},${this.form.waist},${this.form.hip}`,
        f_Marital: this.form.marriageType.F_ItemDetailId || "",
        f_Son: this.form.boyNumber,
        f_Girl: this.form.girlNumber,
        f_Skill: this.form.skillList.map(x => x.F_ItemDetailId || "").join(","),
        f_WorkAddress: this.form.workAddress.F_ItemDetailId || "",
        f_Veteran: this.form.veteran.F_ItemDetailId || "",
        f_Political: this.form.politicalType.F_ItemDetailId || "",
        f_Email: this.form.email,
        f_BeforeAge: this.form.beforeAge,
        f_Bank: this.form.bank || "",
        f_BankCardId: this.form.bankCardId,
        f_SkillLev: this.form.skillLev,
        f_InsuranceType: this.form.socialSecurity.F_ItemId || "",
        f_InsuranceCardId: this.form.socialSecurityCardId,
        f_Address: this.form.address,
        f_AccountType: this.form.accountType.F_ItemDetailId || "",
        f_Residence: this.form.residenceAddress,
        f_RestModel: this.form.restModel.F_ItemDetailId || "",
        f_BusInsurance: this.form.busInsurance,
        f_BusInsuranceExpire: this.form.busInsuranceExpire,
        f_LeaveAuditAttach:this.form.leaveAuditAttach || "",
        f_FamilyInfo: this.form.familyList.map(x => {
          return x;
        }),
        f_HealthInfo: this.form.healthList.map(x => {
          return x;
        }),
        f_ContractInfo: this.form.contractList.map(x => {
          return Object.assign({}, x, {
            f_StartDate: x.dateRange[0],
            f_EndDate: x.dateRange[1],
            f_ConType: x.f_ConType.F_ItemDetailId || "",
            f_LeaveReason: x.f_LeaveReason.F_ItemDetailId || ""
          });
        }),
        f_JobRecordInfo: this.form.resumeList.map(x => {
          return Object.assign({}, x, {
            f_JobLevelId: x.f_JobLevelId.F_ItemDetailId,
            f_HonorId: x.f_HonorId.F_ItemDetailId,
            f_StartRecordDate: x.dateRange[0],
            f_EndRecordDate: x.dateRange[1],
            f_Annex: (x.fileList || []).map(x => x.response.file).join(",")
          });
        }),
        f_CareerInfo: this.form.jobList.map(x => {
          return Object.assign({}, x, {
            f_StartDate: x.dateRange[0],
            f_EndDate: x.dateRange[1]
          });
        }),
        f_EduInfo: this.form.educationList.map(x => {
          return Object.assign({}, x, {
            f_StartDate: x.dateRange[0],
            f_EndDate: x.dateRange[1],
            f_Education: x.f_Education.F_ItemDetailId || "",
            f_Annex: (x.fileList || []).map(x => x.response.file).join(","),
            f_Certificate: x.f_Certificate.F_ItemDetailId || ""
          });
        }),
        f_Status: 1,
        f_TrainingInfo: this.form.trainingInfo.map(x => {
          return {
            f_Data: x.f_Data,
            f_ExamineItem: x.f_ExamineItem.F_ItemDetailId || "",
            f_Result: x.f_Result,
            f_Rate: x.f_Rate.F_ItemDetailId || ""
          };
        })
      };
      await this.$_request({
        url: "/HR/Emp/Change",
        method: "post",
        data
      });
    },
    async queryData() {
      let params = {
        queryJson_S: "",
        queryJson: "",
        orderJson: "",
        pageIndex: 1,
        pageSize: 999
      };

      await Promise.all([
        queryDepartment(params).then(resData => {
          this.departmentList = resData.data;
        }),
        queryPosition(params).then(resData => {
          this.positionList = resData.data;
        }),
        queryJob(params).then(resData => {
          this.jobList = resData.data;
        }),
        queryRole(params).then(resData => {
          this.roleList = resData.data;
        })
      ]);
    },
    async getDictionary() {
      let keys = Object.keys(this.dictionaryData);
      let pl = [];

      for (const key of keys) {
        pl.push(
          queryDictionaryDetailByCode(key).then(resData => {
            this.dictionaryData[key] = resData.data;
          })
        );
      }
      await Promise.all(pl);
    },
    async getSocialSecurityTypeList() {
      let res = await this.$_request({
        url: "/HR/InsurancePlan/GetBindList",
        method: "get"
      });

      this.socialSecurityTypeList = res.data.data;
    },
    async getForm(id = "") {
      if (!id) return;

      let res = await this.$_request({
        url: "/HR/Emp/GetSingle",
        method: "get",
        params: {
          F_EmpId: id
        }
      });

      let data = res.data.data;
      Object.assign(this.form, {
        id: data.F_EmpID,
        number: data.F_EmpCode,
        name: data.F_EmpName,
        sexType: data.F_Sex,
        birthplaceType: (data.F_Birthplace || "").split(","),
        nationalityType: data.F_Nation,
        educationType: {
          F_ItemDetailId: data.F_Education
        },
        idcard: data.F_IdCard,
        phoneNumber: data.F_Tel,
        address: data.F_Address,
        residenceAddress: data.F_Residence,
        birthday: data.F_BirthDay,
        accountType: {
          F_ItemDetailId: data.F_AccountType
        },
        restModel: {
          F_ItemDetailId: data.F_RestModel
        },
        busInsurance: data.F_BusInsurance,
        busInsuranceExpire: data.F_BusInsuranceExpire,
        marriageType: {
          F_ItemDetailId: data.F_Marital
        },
        isSlip: data.F_IsSlip ? "1" : "0",
        salarySlipTip: data.F_SalarySlipTip ? true : false,
        boyNumber: data.F_Son,
        girlNumber: data.F_Girl,
        leaveAuditAttach:data.F_LeaveAuditAttach,
        politicalType: {
          F_ItemDetailId: data.F_Political
        },
        skillList: data.F_Skill
          ? (data.F_Skill || "").split(",").map(x => {
              return {
                F_ItemDetailId: x
              };
            })
          : [],
        high: data.F_Hight,
        weight: data.F_Weight,
        headLength: data.F_HeadLen,
        legLength: data.F_FootLen,
        // 三围
        bust: (data.F_ThreeCircle || "").split(",")[0],
        waist: (data.F_ThreeCircle || "").split(",")[1],
        hip: (data.F_ThreeCircle || "").split(",")[2],
        department: {
          F_DepId: data.F_DepID
        },
        departmentId: data.F_DepID || "",
        job: {
          F_PostId: data.F_PostId
        },
        position: {
          F_JobId: data.F_JobId
        },
        level: {
          F_ItemDetailId: data.F_JobLevel
        },
        type: {
          F_ItemDetailId: data.F_PType
        },
        workAddress: {
          F_ItemDetailId: data.F_WorkAddress
        },
        role: {
          F_RoleId: data.F_RoleId
        },
        veteran: {
          F_ItemDetailId: data.F_Veteran
        },
        email: data.F_Email,
        beforeAge: data.F_BeforeAge,
        bank: data.F_Bank,
        bankCardId: data.F_BankCardId,
        skillLev: data.F_SkillLev,
        socialSecurity: {
          F_ItemId: data.F_InsuranceType
        },
        socialSecurityCardId: data.F_InsuranceCardId,
        familyList: (data.F_FamilyInfo || []).map(x => {
          return {
            f_Name: x.F_Name,
            f_Relation: x.F_Relation,
            f_Tel: x.F_Tel,
            f_WorkCompany: x.F_WorkCompany
          };
        }),
        healthList: (data.F_HealthInfo || []).map(x => {
          return {
            f_Hospital: x.F_Hospital,
            f_Result: x.F_Result,
            f_TJDate: x.F_TJDate,
            f_TJProject: x.F_TJProject
          };
        }),
        contractList: (data.F_ContractInfo || []).map(x => {
          return Object.assign({}, x, {
            f_DepId: x.F_DepId,
            f_PostId: x.F_PostId,
            f_JobId: x.F_JobId,
            dateRange: [x.F_StartDate, x.F_EndDate],
            f_ConType: {
              F_ItemDetailId: x.F_ConType
            },
            f_LeaveReason: {
              F_ItemDetailId: x.F_LeaveReason
            },
            f_SigningDate: x.F_SigningDate,
            f_ReMark: x.F_ReMark
          });
        }),
        resumeList: (data.F_JobRecordInfo || []).map(x => {
          return Object.assign({}, x, {
            f_DepId: x.F_DepId,
            f_PostId: x.F_PostId,
            f_JobId: x.F_JobId,
            f_ReMark: x.F_ReMark,
            dateRange: [x.F_StartRecordDate || "", x.F_EndRecordDate || ""],
            f_JobLevelId: {
              F_ItemDetailId: x.F_JobLevelId
            },
            f_HonorId: {
              F_ItemDetailId: x.F_HonorId
            },
            fileList: (x.F_Annex || "").split(",").map(x => {
              return {
                name: x,
                response: {
                  file: x
                }
              };
            })
          });
        }),
        jobList: (data.F_CareerInfo || []).map(x => {
          return Object.assign({}, x, {
            dateRange: [x.F_StartDate, x.F_EndDate],
            f_Company: x.F_Company,
            f_JobName: x.F_JobName,
            f_Achievement: x.F_Achievement
          });
        }),
        educationList: (data.F_EduInfo || []).map(x => {
          return Object.assign({}, x, {
            dateRange: [x.F_StartDate || "", x.F_EndDate || ""],
            f_School: x.F_School,
            f_Education: {
              F_ItemDetailId: x.F_Education
            },
            f_Major: x.F_Major,
            f_Witness: x.F_Witness,
            f_Achievement: x.F_Achievement,
            f_Certificate: {
              F_ItemDetailId: x.F_Certificate
            },
            fileList: (x.F_Annex || "").split(",").map(x => {
              return {
                name: x,
                response: {
                  file: x
                }
              };
            })
          });
        }),
        trainingInfo: (data.F_TrainingInfo || []).map(x => {
          return {
            f_Data: x.F_Data,
            f_ExamineItem: {
              F_ItemDetailId: x.F_ExamineItem || ""
            },
            f_Result: x.F_Result,
            f_Rate: {
              F_ItemDetailId: x.F_Rate || ""
            }
          };
        })
      });
    },
    async getDepartmentTree() {
      let res = await this.$_request({
        url: "/HR/Department/GetTreeStructure",
        method: "get"
      });

      this.departmentTree = res.data.data;
    }
  },
  watch: {
    async id(n) {
      if (n) {
        this.ui.loading = true;

        await this.getForm(n);

        this.ui.loading = false;
      }
    }
  },
  async created() {
    this.ui.loading = true;

    try {
      if (this.$route.query.id || this.id) {
        this.formType = "edit";
        await this.getForm(this.$route.query.id || this.id);
      }

      await Promise.all([
        this.queryData(),
        this.getDictionary(),
        this.getSocialSecurityTypeList(),
        this.getDepartmentTree()
      ])
    } finally {
      this.ui.loading = false;
    }
  }
};
</script>
