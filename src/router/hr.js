import serviceId from "@/utils/serviceCfg.js"
let routes = [
  {
    path: "/dashboard",
    component: () => import("@/layouts/dashboard"),
		name: serviceId.hr,
    children: [
      {
        path: "",
        name: "dashboard",
        meta: {
          title: "首页",
          isPin: true,
          requirePermissionCheck: false
        },
        component: () => import("@/views/dashboard/")
      },
      {
        path: "societyInsuranceStandard",
        name: "societyInsuranceStandard",
        meta: {
          title: "社保标准"
        },
        component: () => import("@/views/societyInsuranceStandard")
      },
      {
        path: "societyInsuranceStandardAdd",
        name: "societyInsuranceStandardAdd",
        meta: {
          title: "新增社保标准",
          requirePermissionCheck: false
        },
        component: () => import("@/views/societyInsuranceStandardAdd")
      },
      {
        path: "societyInsuranceStandardEdit",
        name: "societyInsuranceStandardEdit",
        meta: {
          title: "修改社保标准",
          requirePermissionCheck: false
        },
        component: () => import("@/views/societyInsuranceStandardEdit")
      },
      {
        path: "personalIncomeTaxStandard",
        name: "personalIncomeTaxStandard",
        meta: {
          title: "个税缴纳标准"
        },
        component: () => import("@/views/personalIncomeTaxStandard")
      },
      {
        path: "personnelProfile",
        name: "personnelProfile",
        meta: {
          title: "人事档案"
        },
        component: () => import("@/views/personnelProfile")
      },
      {
        path: "personnelProfileAdd",
        name: "personnelProfileAdd",
        meta: {
          title: "新增人事档案",
          requirePermissionCheck: false
        },
        component: () => import("@/views/personnelProfileAdd")
      },
      {
        path: "personnelProfileEdit",
        name: "personnelProfileEdit",
        meta: {
          title: "修改人事档案",
          requirePermissionCheck: false
        },
        component: () => import("@/views/personnelProfileEdit")
      },
			{
			  path: "zhanghaoguanli",
			  name: "zhanghaoguanli",
			  meta: {
			    title: "账号管理"
			  }
			},
			{
			  path: "personnelProfileAdd_delete",
			  name: "personnelProfileAdd_delete",
			  meta: {
			    title: "新增账号"
			  }
			},
			{
			  path: "personnelProfileEdit_delete",
			  name: "personnelProfileEdit_delete",
			  meta: {
			    title: "修改账号"
			  },
			},
			{
			  path: "yhkGl",
			  name: "yhkGl",
			  meta: {
			    title: "银行卡管理"
			  }
			},
      {
        path: "wage",
        name: "wage",
        meta: {
          title: "工资表"
        },
        component: () => import("@/views/wage")
      },
			{
			  path: "laowufei",
			  name: "laowufei",
			  meta: {
			    title: "劳务费"
			  }
			},
      {
        path: "salaryProject",
        name: "salaryProject",
        meta: {
          title: "薪酬项目"
        },
        component: () => import("@/views/salaryProject")
      },
      {
        path: "companyStructure",
        name: "companyStructure",
        meta: {
          title: "组织结构"
        },
        component: () => import("@/views/companyStructure")
      },
      {
        path: "performance",
        name: "performance",
        meta: {
          title: "绩效评定"
        },
        component: () => import("@/views/performance")
      },
			{
			  path: "performanceShenHe",
			  name: "performanceShenHe",
			  meta: {
			    title: "绩效评定审核"
			  }
			},
      {
        path: "adjustment",
        name: "adjustment",
        meta: {
          title: "补发&扣发"
        },
        component: () => import("@/views/adjustment")
      },
			{
			  path: "adjustmentShenHe",
			  name: "adjustmentShenHe",
			  meta: {
			    title: "补发&扣发审核"
			  }
			},
      {
        path: "overtimePay",
        name: "overtimePay",
        meta: {
          title: "新增加班费"
        },
        component: () => import("@/views/overtimePay")
      },
			{
			  path: "overtimePayShenHe",
			  name: "overtimePayShenHe",
			  meta: {
			    title: "加班费审核"
			  }
			},
      {
        path: "policePay",
        name: "policePay",
        meta: {
          title: "出警费"
        },
        component: () => import("@/views/policePay")
      },
			{
			  path: "policePayShenHe",
			  name: "policePayShenHe",
			  meta: {
			    title: "出警费审核"
			  }
			},
      {
        path: "adjustmentLevel",
        name: "adjustmentLevel",
        meta: {
          title: "级别调整"
        },
        component: () => import("@/views/adjustmentLevel")
      },
      {
        path: "salaryStandard",
        name: "salaryStandard",
        meta: {
          title: "薪酬标准"
        },
        component: () => import("@/views/salaryStandard")
      },
      {
        path: "salaryStandardAdd",
        name: "salaryStandardAdd",
        meta: {
          title: "新增薪酬标准",
          requirePermissionCheck: false
        },
        component: () => import("@/views/salaryStandardAdd")
      },
      {
        path: "salaryStandardEdit",
        name: "salaryStandardEdit",
        meta: {
          title: "修改薪酬标准",
          requirePermissionCheck: false
        },
        component: () => import("@/views/salaryStandardEdit")
      },
      {
        path: "salaryPlan",
        name: "salaryPlan",
        meta: {
          title: "薪酬方案"
        },
        component: () => import("@/views/salaryPlan")
      },
      {
        path: "dictionary",
        name: "dictionary",
        meta: {
          title: "数据字典"
        },
        component: () => import("@/views/dictionary")
      },
      {
        path: "admin",
        name: "admin",
        meta: {
          title: "系统管理"
        },
        component: () => import("@/views/admin")
      },
      {
        path: "report1",
        name: "report1",
        meta: {
          title: "级别实力统计表"
        },
        component: () => import("@/views/report1")
      },
      {
        path: "report2",
        name: "report2",
        meta: {
          title: "各大队财务结算表(按人员类别)"
        },
        component: () => import("@/views/report2")
      },
      {
        path: "report3",
        name: "report3",
        meta: {
          title: "各大队财务结算表(按单位)"
        },
        component: () => import("@/views/report3")
      },
      {
        path: "report4",
        name: "report4",
        meta: {
          title: "人员类别实力统计统计表"
        },
        component: () => import("@/views/report4")
      },
      {
        path: "serviceFee",
        name: "serviceFee",
        meta: {
          title: "服务费用"
        },
        component: () => import("@/views/serviceFee")
      },
			{
			  path: "zhizhengguanli",
			  name: "zhizhengguanli",
			  meta: {
			    title: "制证管理"
			  }
			},
			{
			  path: "xftuichuzheng",
			  name: "xftuichuzheng",
			  meta: {
			    title: "消防退出证"
			  }
			},
      {
        path: "companyAdmin",
        name: "companyAdmin",
        meta: {
          title: '系统设置'
        },
        component: () => import("@/views/companyAdmin")
      },
      {
        path: "generateWage",
        name: "generateWage",
        meta: {
          title: '工资表生成'
        },
        component: () => import("@/views/generateWage")
      },
      {
        path: "reviewedWage",
        name: "reviewedWage",
        meta: {
          title: '工资表审核'
        },
        component: () => import("@/views/reviewedWage")
      },
      {
        path: "extendWage",
        name: "extendWage",
        meta: {
          title: '工资表发放'
        },
        component: () => import("@/views/extendWage")
      },
      {
        path: "attence",
        name: "attence",
        meta: {
          title: '考勤管理'
        },
        component: () => import("@/views/attence")
      },
			{
				path: "batchRegular",
				name: "batchRegular",
				meta: {
				  title: '批量转正'
				}
			},
			{
				path: "batchContract",
				name: "batchContract",
				meta: {
				  title: '批量续签'
				},
			},
			{
				path: "xinchoufafangfangan",
				name: "xinchoufafangfangan",
				meta: {
				  title: '薪酬发放方案'
				},
			},
			{
				path: "geshuikouchu",
				name: "geshuikouchu",
				meta: {
				  title: '个税扣除'
				},
			},
			{
			  path: "ceshi",
			  name: "ceshi",
			  meta: {
			    title: '测试'
			  },
			  component: () => import("@/views/attence")
			},
    ]
  }
];

export default routes;
