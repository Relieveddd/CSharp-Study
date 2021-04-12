<template>
  <g-bf :visible.sync="isShow" @close="onClose">
    <component :is="'personnelProfileAdd'" :id="id" preview></component>
  </g-bf>
</template>

<script>
import personnelProfileAdd from "../../personnelProfileAdd";

export default {
  components: {
    personnelProfileAdd
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ""
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
  data() {
    return {
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
        }
      ],
      form: {
        id: "",
        number: "",
        name: "",
        sexType: "",
        birthplaceType: [],
        nationalityType: "",
        educationType: {},
        idcard: "",
        phoneNumber: "",
        address: "",
        residenceAddress: "",
        birthday: "",
        accountType: {},
        marriageType: {},
        boyNumber: "",
        girlNumber: "",
        politicalType: {},
        skillList: {},
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
        job: {},
        position: {},
        level: {},
        type: {},
        workAddress: "",
        role: {},
        veteran: {},
        email: "",
        beforeAge: "",
        bank: "",
        bankCardId: "",
        socialSecurity: {},
        socialSecurityCardId: "",
        //
        familyList: [],
        healthList: [],
        contractList: [],
        resumeList: [],
        jobList: [],
        educationList: []
      },
      ui: {
        loading: false
      }
    };
  },
  watch: {
    id(n) {
      if (n) {
        this.getForm(n);
      }
    }
  },
  methods: {
    async getForm(id = "") {
      if (!id) return;

      this.ui.loading = true;

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
        marriageType: {
          F_ItemDetailId: data.F_Marital
        },
        boyNumber: data.F_Son,
        girlNumber: data.F_Girl,
        politicalType: {
          F_ItemDetailId: data.F_Political
        },
        skillList: {
          F_ItemDetailId: data.F_Skill
        },
        high: data.F_Hight,
        weight: data.F_Weight,
        headLength: data.F_HeadLen,
        legLength: data.F_FootLen,
        // 三围
        bust: (data.F_ThreeCircle || "").split(",")[0],
        waist: (data.F_ThreeCircle || "").split(",")[1],
        hip: (data.F_ThreeCircle || "").split(",")[2],
        //
        department: {
          F_DepId: data.F_DepID
        },
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
        workAddress: data.F_WorkAddress,
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
        socialSecurity: {
          F_ItemDetailId: data.F_InsuranceType
        },
        socialSecurityCardId: data.F_InsuranceCardId,
        //
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
            dateRange: [x.F_StartDate, x.F_EndDate]
          });
        }),
        resumeList: (data.F_JobRecordInfo || []).map(x => {
          return Object.assign({}, x, {
            dateRange: [x.F_StartDate, x.F_EndDate]
          });
        }),
        jobList: (data.F_CareerInfo || []).map(x => {
          return Object.assign({}, x, {
            dateRange: [x.F_StartDate, x.F_EndDate]
          });
        }),
        educationList: (data.F_EduInfo || []).map(x => {
          return Object.assign({}, x, {
            dateRange: [x.F_StartDate, x.F_EndDate]
          });
        })
      });

      this.ui.loading = false;
    },
    onClose() {
      this.ui.loading = false;
      this.$emit("close");
    }
  }
};
</script>
