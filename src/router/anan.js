import serviceId from "@/utils/serviceCfg.js"
let routes = [
  {
    path: "/dashboard",
    component: () => import("@/layouts/dashboard"),
		name: serviceId.aa,
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
        path: "shebeiguanli",
        name: "shebeiguanli",
        meta: {
          title: "设备管理"
        }
      },
			{
			  path: "shebeiweizhi",
			  name: "shebeiweizhi",
			  meta: {
			    title: "设备位置"
			  }
			},
			{
			  path: "yongcanliebiao",
			  name: "yongcanliebiao",
			  meta: {
			    title: "用餐列表"
			  }
			},
			{
			  path: "yongcanjilu",
			  name: "yongcanjilu",
			  meta: {
			    title: "用餐记录"
			  }
			},
			{
			  path: "yongcantongji",
			  name: "yongcantongji",
			  meta: {
			    title: "用餐统计"
			  }
			},
			{
			  path: "chuqintongji",
			  name: "chuqintongji",
			  meta: {
			    title: "出勤统计"
			  }
			},
			{
			  path: "daduichuqintongji",
			  name: "daduichuqintongji",
			  meta: {
			    title: "大队出勤统计"
			  }
			},
			{
			  path: "chuqinfenxi",
			  name: "chuqinfenxi",
			  meta: {
			    title: "出勤分析"
			  }
			},
      {
        path: "heibaimingdan",
        name: "heibaimingdan",
        meta: {
          title: "黑白名单"
        }
      },
			{
			  path: "wurengangting",
			  name: "wurengangting",
			  meta: {
			    title: "无人岗亭"
			  }
			},
			{
			  path: "yaoqingliebiao",
			  name: "yaoqingliebiao",
			  meta: {
			    title: "邀请列表"
			  }
			},
			{
			  path: "tanqinliebiao",
			  name: "tanqinliebiao",
			  meta: {
			    title: "探亲单"
			  }
			},
			{
			  path: "daorudaochumoban",
			  name: "daorudaochumoban",
			  meta: {
			    title: '导入模板'
			  }
			},
			{
			  path: "daochumoban",
			  name: "daochumoban",
			  meta: {
			    title: '导出模板'
			  }
			},
			{
			  path: "waichuqingjialiebiao",
			  name: "waichuqingjialiebiao",
			  meta: {
			    title: "外出请假"
			  }
			},
			{
			  path: "yuyueliebiao",
			  name: "yuyueliebiao",
			  meta: {
			    title: "预约"
			  }
			},
			{
			  path: "baifangjilu",
			  name: "baifangjilu",
			  meta: {
			    title: "拜访记录"
			  }
			},
			{
			  path: "kaoqinjilu",
			  name: "kaoqinjilu",
			  meta: {
			    title: "考勤记录"
			  }
			},
			{
			  path: "tanqinjilu",
			  name: "tanqinjilu",
			  meta: {
			    title: "探亲记录"
			  }
			},
			{
			  path: "qingjiajilu",
			  name: "qingjiajilu",
			  meta: {
			    title: "请假记录"
			  }
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
			  path: "AAdictionary",
			  name: "AAdictionary",
			  meta: {
			    title: "安安字典"
			  }
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
			  path: "zhanghaoguanli",
			  name: "zhanghaoguanli",
			  meta: {
			    title: '账号管理'
			  }
			},
			{
			  path: "chepailiebiao",
			  name: "chepailiebiao",
			  meta: {
			    title: '车牌列表'
			  }
			},
			{
			  path: "chepaijilu",
			  name: "chepaijilu",
			  meta: {
			    title: '车牌记录'
			  }
			},
			{
			  path: "cheweihuaban",
			  name: "cheweihuaban",
			  meta: {
			    title: '车位画板'
			  }
			},
			{
			  path: "shipinliu",
			  name: "shipinliu",
			  meta: {
			    title: '视频流'
			  }
			},
			{
			  path: "tongxingjilu",
			  name: "tongxingjilu",
			  meta: {
			    title: '通行记录'
			  }
			},
			{
			  path: "kehuguanli",
			  name: "kehuguanli",
			  meta: {
			    title: "客户管理"
			  }
			},
			{
			  path: "gongfangguanli",
			  name: "gongfangguanli",
			  meta: {
			    title: "供方管理"
			  }
			},
			{
			  path: "qitadanwei",
			  name: "qitadanwei",
			  meta: {
			    title: '其他单位'
			  }
			},
			{
			  path: "yongchedan",
			  name: "yongchedan",
			  meta: {
			    title: "用车单"
			  }
			},
			{
			  path: "paichedan",
			  name: "paichedan",
			  meta: {
			    title: "派车单"
			  }
			},
			{
			  path: "yongcheguihuandan",
			  name: "yongcheguihuandan",
			  meta: {
			    title: "归还单"
			  }
			},
			{
			  path: "paibanjihua",
			  name: "paibanjihua",
			  meta: {
			    title: "排班计划"
			  }
			},
			{
			  path: "cheliangpinpai",
			  name: "cheliangpinpai",
			  meta: {
			    title: "车辆品牌"
			  }
			},
			{
			  path: "cheliangguiji",
			  name: "cheliangguiji",
			  meta: {
			    title: "车辆轨迹"
			  }
			},
			{
			  path: "cheliangxinxi",
			  name: "cheliangxinxi",
			  meta: {
			    title: "车辆信息"
			  }
			},
			{
			  path: "yongcheshiyou",
			  name: "yongcheshiyou",
			  meta: {
			    title: "用车事由"
			  }
			},
			{
			  path: "guojiaxinxi",
			  name: "guojiaxinxi",
			  meta: {
			    title: "国家信息"
			  }
			},
			{
			  path: "shengfen",
			  name: "shengfen",
			  meta: {
			    title: "省份"
			  }
			},
			{
			  path: "dijishi",
			  name: "dijishi",
			  meta: {
			    title: "地级市"
			  }
			},
			{
			  path: "quxian",
			  name: "quxian",
			  meta: {
			    title: "区县"
			  }
			},
			{
			  path: "zhenjiedao",
			  name: "zhenjiedao",
			  meta: {
			    title: "镇街道"
			  }
			},
			{
			  path: "dizhixinxi",
			  name: "dizhixinxi",
			  meta: {
			    title: "地址信息"
			  }
			},
			{
			  path: "dizhileixing",
			  name: "dizhileixing",
			  meta: {
			    title: "地址类型"
			  }
			},
			{
			  path: "dizhileixingshuxing",
			  name: "dizhileixingshuxing",
			  meta: {
			    title: "地址类型-属性"
			  }
			},
			{
			  path: "gongzuoliucheng",
			  name: "gongzuoliucheng",
			  meta: {
			    title: '工作流程'
			  }
			},
			{
			  path: "liuchengsheji",
			  name: "liuchengsheji",
			  meta: {
			    title: '流程设计'
			  }
			},
			{
			  path: "liuchengweituo",
			  name: "liuchengweituo",
			  meta: {
			    title: '流程委托'
			  }
			},
			{
			  path: "liuchengrenwu",
			  name: "liuchengrenwu",
			  meta: {
			    title: '流程任务'
			  }
			},
			{
			  path: "liuchengrenwudaiban",
			  name: "liuchengrenwudaiban",
			  meta: {
			    title: '流程任务-待办'
			  }
			},
			{
			  path: "gongzuoliuzidianMx",
			  name: "gongzuoliuzidianMx",
			  meta: {
			    title: '工作流程字典明细'
			  }
			},
			{
			  path: "liuchengrenwuyiban",
			  name: "liuchengrenwuyiban",
			  meta: {
			    title: '流程任务-已办'
			  }
			},
			{
			  path: "chanpindangan",
			  name: "chanpindangan",
			  meta: {
			    title: '产品档案'
			  }
			},
			{
			  path: "chanpinleibie",
			  name: "chanpinleibie",
			  meta: {
			    title: '产品类别'
			  }
			},
			{
			  path: "dituweilan",
			  name: "dituweilan",
			  meta: {
			    title: '地图围栏'
			  }
			},
			{
			  path: "cheweidangan",
			  name: "cheweidangan",
			  meta: {
			    title: '车位档案'
			  }
			},
			{
			  path: "tingchejifeifangan",
			  name: "tingchejifeifangan",
			  meta: {
			    title: '停车计费方案'
			  }
			},
			{
			  path: "jinchujifeijilubiao",
			  name: "jinchujifeijilubiao",
			  meta: {
			    title: '进出计费记录表'
			  }
			},
			{
			  path: "tingcheMFSCMXB",
			  name: "tingcheMFSCMXB",
			  meta: {
			    title: '停车免费时长明细表'
			  }
			},
			{
			  path: "tingchedikouquan",
			  name: "tingchedikouquan",
			  meta: {
			    title: '停车抵扣券'
			  }
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
