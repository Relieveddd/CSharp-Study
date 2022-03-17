let routes = [
  {
    path: "/",
    name: "home",
    meta: {
      requireAuthorization: false
    },
    redirect: {
      name: "dashboard"
    }
  },
  {
    path: "/login",
    name: "login",
    meta: {
      title: "登录",
      requireAuthorization: false
    },
    component: () => import("@/views/login")
  },
  {
    path: "/register",
    name: "register",
    meta: {
      title: "注册",
      requireAuthorization: false
    },
    component: () => import("@/views/register")
  },
  {
    path: "/dashboard",
    component: () => import("@/layouts/dashboard"),
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
        path: "wage",
        name: "wage",
        meta: {
          title: "工资表"
        },
        component: () => import("@/views/wage")
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
			  path: "companyList",
			  name: "companyList",
			  meta: {
			    title: "hr公司列表"
			  },
			  component: () => import("@/views/companyList")
			},
			{
			  path: "companyList_dt",
			  name: "companyList_dt",
			  meta: {
			    title: "dt公司列表"
			  },
			  component: () => import("@/views/companyList_dt")
			},
			{
			  path: "companyListAA",
			  name: "companyListAA",
			  meta: {
			    title: "AA公司列表"
			  },
			  component: () => import("@/views/companyListAA")
			},
			{
			  path: "companyListAI",
			  name: "companyListAI",
			  meta: {
			    title: "AI公司列表"
			  },
			  component: () => import("@/views/companyListAI")
			},
			{
			  path: "companyListWMS",
			  name: "companyListWMS",
			  meta: {
			    title: "智能消防公司列表"
			  },
			  component: () => import("@/views/companyListWMS")
			},
			{
			  path: "companyListWMS_gys",
			  name: "companyListWMS_gys",
			  meta: {
			    title: "度见ERP公司列表"
			  },
			  component: () => import("@/views/companyListWMS_gys")
			},
			{
			  path: "companyListYL",
			  name: "companyListYL",
			  meta: {
			    title: "YL公司列表"
			  },
			  component: () => import("@/views/companyListYL")
			},
			{
			  path: "companyListSyzn",
			  name: "companyListSyzn",
			  meta: {
			    title: "Syzn公司列表"
			  },
			  component: () => import("@/views/companyListSyzn")
			},
			{
			  path: "duijiepingtai",
			  name: "duijiepingtai",
			  meta: {
			    title: "对接平台"
			  },
			  component: () => import("@/views/duijiepingtai")
			},
			{
			  path: "xtsz",
			  name: "xtsz",
			  meta: {
			    title: "微服务"
			  },
			  component: () => import("@/views/xtsz")
			},
			{
			  path: "chanpinleibie",
			  name: "chanpinleibie",
			  meta: {
			    title: "产品类别"
			  },
			  component: () => import("@/views/chanpinleibie")
			},
			{
			  path: "chanpinshuxing",
			  name: "chanpinshuxing",
			  meta: {
			    title: "产品属性"
			  },
			  component: () => import("@/views/chanpinshuxing")
			},
			{
			  path: "chanpindangan",
			  name: "chanpindangan",
			  meta: {
			    title: "产品档案"
			  },
			  component: () => import("@/views/chanpindangan")
			},
			{
			  path: "cpdaDictionary",
			  name: "cpdaDictionary",
			  meta: {
			    title: "产品字典"
			  },
			  component: () => import("@/views/cpdaDictionary")
			},
			{
			  path: "cangkuzidian",
			  name: "cangkuzidian",
			  meta: {
			    title: "仓库字典"
			  },
			  component: () => import("@/views/cangkuzidian")
			},
			{
			  path: "liuchengzidian",
			  name: "liuchengzidian",
			  meta: {
			    title: '工作流程字典'
			  },
				 component: () => import("@/views/liuchengzidian")
			},
			{
			  path: "pinpaifang",
			  name: "pinpaifang",
			  meta: {
			    title: "品牌方"
			  },
			  component: () => import("@/views/pinpaifang")
			},
			{
			  path: "chanpinbiecheng",
			  name: "chanpinbiecheng",
			  meta: {
			    title: "产品别称"
			  },
			  component: () => import("@/views/chanpinbiecheng")
			},
			{
			  path: "hrOrganize",
			  name: "hrOrganize",
			  meta: {
			    title: "hr组织结构"
			  },
			  component: () => import("@/views/hrOrganize")
			},
			{
			  path: "dtOrganize",
			  name: "dtOrganize",
			  meta: {
			    title: "hr组织结构"
			  },
			  component: () => import("@/views/dtOrganize")
			},
			{
			  path: "aiOrganize",
			  name: "aiOrganize",
			  meta: {
			    title: "ai组织结构"
			  },
			  component: () => import("@/views/aiOrganize")
			},
			{
			  path: "CcOrganize",
			  name: "CcOrganize",
			  meta: {
			    title: "智能消防组织结构"
			  },
			  component: () => import("@/views/CcOrganize")
			},
			{
			  path: "CcOrganize_gys",
			  name: "CcOrganize_gys",
			  meta: {
			    title: "度见ERP组织结构"
			  },
			  component: () => import("@/views/CcOrganize_gys")
			},
			{
			  path: "AaOrganize",
			  name: "AaOrganize",
			  meta: {
			    title: "安安组织结构"
			  },
			  component: () => import("@/views/AaOrganize")
			},
			{
			  path: "ylOrganize",
			  name: "ylOrganize",
			  meta: {
			    title: "yl组织结构"
			  },
			  component: () => import("@/views/ylOrganize")
			},
      {
        path: "hr",
        name: "hr",
        meta: {
          title: "hr系统管理"
        },
        component: () => import("@/views/adminHr")
      },
			{
			  path: "dt",
			  name: "dt",
			  meta: {
			    title: "dt系统管理"
			  },
			  component: () => import("@/views/adminDt")
			},
			{
			  path: "ai",
			  name: "ai",
			  meta: {
			    title: "ai系统管理"
			  },
			  component: () => import("@/views/adminAi")
			},
			{
			  path: "cc",
			  name: "cc",
			  meta: {
			    title: "智能消防系统管理"
			  },
			  component: () => import("@/views/adminCC")
			},
			{
			  path: "cc_gys",
			  name: "cc_gys",
			  meta: {
			    title: "度见ERP系统管理"
			  },
			  component: () => import("@/views/adminCC_gys")
			},
			{
			  path: "aa",
			  name: "aa",
			  meta: {
			    title: "安安系统管理"
			  },
			  component: () => import("@/views/adminAA")
			},
			{
			  path: "syzn",
			  name: "syzn",
			  meta: {
			    title: "商业智能系统管理"
			  },
			  component: () => import("@/views/adminSyzn")
			},
			{
			  path: "syznOrganize",
			  name: "syznOrganize",
			  meta: {
			    title: "商业智能组织结构"
			  },
			  component: () => import("@/views/syznOrganize")
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
			  path: "dayinmoban",
			  name: "dayinmoban",
			  meta: {
			    title: '打印模板'
			  },
			  component: () => import("@/views/dayinmoban")
			},
			{
			  path: "dayinmobanLeibie",
			  name: "dayinmobanLeibie",
			  meta: {
			    title: '模板类别'
			  },
			  component: () => import("@/views/dayinmobanLeibie")
			},
			{
			  path: "ananzidian",
			  name: "ananzidian",
			  meta: {
			    title: '安安字典'
			  },
			  component: () => import("@/views/ananzidian")
			},
			{
			  path: "gongyingshangzidian",
			  name: "gongyingshangzidian",
			  meta: {
			    title: '供应商字典'
			  },
			  component: () => import("@/views/gongyingshangzidian")
			},
			{
			  path: "erweima",
			  name: "erweima",
			  meta: {
			    title: '二维码管理'
			  },
			  component: () => import("@/views/erweima")
			},
			{
			  path: "shebeiguanli",
			  name: "shebeiguanli",
			  meta: {
			    title: '设备管理'
			  },
			  component: () => import("@/views/shebeiguanli")
			},
			{
			  path: "daorudaochumoban",
			  name: "daorudaochumoban",
			  meta: {
			    title: '导入模板'
			  },
			  component: () => import("@/views/daorudaochumoban")
			},
			{
			  path: "daochumoban",
			  name: "daochumoban",
			  meta: {
			    title: '导出模板'
			  },
			  component: () => import("@/views/daochumoban")
			},
			{
			  path: "bianmaguize",
			  name: "bianmaguize",
			  meta: {
			    title: '编码规则'
			  },
			  component: () => import("@/views/bianmaguize")
			},
			{
			  path: "shengfen",
			  name: "shengfen",
			  meta: {
			    title: "省份"
			  },
			  component: () => import("@/views/shengfen")
			},
			{
			  path: "dijishi",
			  name: "dijishi",
			  meta: {
			    title: "地级市"
			  },
			  component: () => import("@/views/dijishi")
			},
			{
			  path: "quxian",
			  name: "quxian",
			  meta: {
			    title: "区县"
			  },
			  component: () => import("@/views/quxian")
			},
			{
			  path: "zhenjiedao",
			  name: "zhenjiedao",
			  meta: {
			    title: "镇街道"
			  },
			  component: () => import("@/views/zhenjiedao")
			},
      {
        path: "kanban",
        name: "kanban",
        meta: {
          title: "看板"
        },
        component: () => import("@/views/kanban")
      }
    ]
  },
  {
    path: "/404",
    name: "404",
    meta: {
      title: "未找到",
      requireAuthorization: false
    },
    component: () => import("@/views/error/404")
  },
  {
    path: "*",
    meta: {
      requireAuthorization: false
    },
    redirect: {
      name: "404"
    }
  }
];

export default routes;
