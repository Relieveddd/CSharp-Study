import serviceId from "@/utils/serviceCfg.js"
let routes = [
  {
    path: "/dashboard",
    component: () => import("@/layouts/dashboard"),
		name: serviceId.syzn,
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
			  path: "",
			  name: "jichuziliao",
			  meta: {
			    title: '基础资料'
			  }
			},
			{
			  path: "chanpinfuwu",
			  name: "chanpinfuwu",
			  meta: {
			    title: '产品服务'
			  }
			},
			{
			  path: "youshangguanli",
			  name: "youshangguanli",
			  meta: {
			    title: '友商管理'
			  }
			},
			{
			  path: "youshangbumen",
			  name: "youshangbumen",
			  meta: {
			    title: '友商部门'
			  }
			},
			{
			  path: "youshanggongsi",
			  name: "youshanggongsi",
			  meta: {
			    title: '友商公司'
			  }
			},
			{
			  path: "youshangmendian",
			  name: "youshangmendian",
			  meta: {
			    title: '友商门店'
			  }
			},
			{
			  path: "kehusqfg",
			  name: "kehusqfg",
			  meta: {
			    title: '客户社区复购'
			  }
			},
			{
			  path: "yejifenxi",
			  name: "yejifenxi",
			  meta: {
			    title: '销售业绩分析'
			  }
			},
			{
			  path: "fengongsimendian",
			  name: "fengongsimendian",
			  meta: {
			    title: '分公司门店'
			  }
			},
			{
			  path: "xingzhengqu",
			  name: "xingzhengqu",
			  meta: {
			    title: '行政区'
			  }
			},
			{
			  path: "zerenzhuti",
			  name: "zerenzhuti",
			  meta: {
			    title: '责任主体'
			  }
			},
			{
			  path: "chanpinfenxi",
			  name: "chanpinfenxi",
			  meta: {
			    title: '产品'
			  }
			},
			{
			  path: "xiaoshoumendian",
			  name: "xiaoshoumendian",
			  meta: {
			    title: '销售门店'
			  }
			},
			{
			  path: "chanpinzuhe",
			  name: "chanpinzuhe",
			  meta: {
			    title: '产品组合'
			  }
			},
			{
			  path: "biaozhunjiage",
			  name: "biaozhunjiage",
			  meta: {
			    title: '标准价格'
			  }
			},
			{
			  path: "kemuduizhaobiao",
			  name: "kemuduizhaobiao",
			  meta: {
			    title: '科目对照表'
			  }
			},
			{
			  path: "kehuguanli",
			  name: "kehuguanli",
			  meta: {
			    title: '客户管理'
			  }
			},
			{
			  path: "shequguanli",
			  name: "shequguanli",
			  meta: {
			    title: '社区管理'
			  }
			},
			{
			  path: "xiaoquguanli",
			  name: "xiaoquguanli",
			  meta: {
			    title: '小区管理'
			  }
			},
			{
			  path: "dingdanguanli",
			  name: "dingdanguanli",
			  meta: {
			    title: '订单管理'
			  }
			},
			{
			  path: "mubiaoguanli",
			  name: "mubiaoguanli",
			  meta: {
			    title: '目标管理'
			  }
			},
			{
			  path: "huodongguanli",
			  name: "huodongguanli",
			  meta: {
			    title: '活动管理'
			  }
			},
			{
			  path: "huodongshenhe",
			  name: "huodongshenhe",
			  meta: {
			    title: '活动审核'
			  }
			},
			{
			  path: "baoxiaoluru",
			  name: "baoxiaoluru",
			  meta: {
			    title: '报销录入'
			  }
			},
			{
			  path: "baoxiaoshenpi",
			  name: "baoxiaoshenpi",
			  meta: {
			    title: '报销审批'
			  }
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
			  path: "companyStructure",
			  name: "companyStructure",
			  meta: {
			    title: "组织结构"
			  },
			  component: () => import("@/views/companyStructure")
			},
			{
			  path: "rsdaDictionary",
			  name: "rsdaDictionary",
			  meta: {
			    title: "人事档案数据字典"
			  }
			},
			{
			  path: "rsdaDictionaryDetail",
			  name: "rsdaDictionaryDetail",
			  meta: {
			    title: "人事档案数据字典明细"
			  }
			},
			{
			  path: "cpdaDictionary",
			  name: "cpdaDictionary",
			  meta: {
			    title: "产品档案数据字典"
			  }
			},
			{
			  path: "cpdaDictionaryDetail",
			  name: "cpdaDictionaryDetail",
			  meta: {
			    title: "产品档案数据字典明细"
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
			  path: "bianmaduizhaobiao",
			  name: "bianmaduizhaobiao",
			  meta: {
			    title: '编码对照表'
			  }
			},
			{
			  path: "bianmaguize",
			  name: "bianmaguize",
			  meta: {
			    title: '编码规则'
			  }
			},
			{
			  path: "jiliangdanwei",
			  name: "jiliangdanwei",
			  meta: {
			    title: '计量单位'
			  }
			},
			{
			  path: "chengfenqingdan",
			  name: "chengfenqingdan",
			  meta: {
			    title: '成分清单'
			  }
			},
    ]
  }
];

export default routes;
