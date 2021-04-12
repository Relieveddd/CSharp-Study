import serviceId from "@/utils/serviceCfg.js"
let routes = [
  {
    path: "/dashboard",
    component: () => import("@/layouts/dashboard"),
		name: serviceId.ai,
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
			  path: "yongtuminglu",
			  name: "yongtuminglu",
			  meta: {
			    title: '用途名录'
			  }
			},
			{
			  path: "feiyongminglu",
			  name: "feiyongminglu",
			  meta: {
			    title: '费用名录'
			  }
			},
			{
			  path: "kemuminglu",
			  name: "kemuminglu",
			  meta: {
			    title: '科目名录'
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
			  path: "dictionary",
			  name: "dictionary",
			  meta: {
			    title: "数据字典"
			  },
			  component: () => import("@/views/dictionary")
			},
			{
			  path: "xiaoshou",
			  name: "xiaoshou",
			  meta: {
			    title: '销售'
			  }
			},
			{
			  path: "caigou",
			  name: "caigou",
			  meta: {
			    title: '采购'
			  }
			},
    ]
  }
];

export default routes;
