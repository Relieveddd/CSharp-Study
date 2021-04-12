import serviceId from "@/utils/serviceCfg.js"
let routes = [
  {
    path: "/dashboard",
    component: () => import("@/layouts/dashboard"),
		name: serviceId.cc,
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
			  path: "jiuyuanjingli",
			  name: "jiuyuanjingli",
			  meta: {
			    title: "救援经历"
			  }
			},
			{
			  path: "gerenrongyu",
			  name: "gerenrongyu",
			  meta: {
			    title: "个人荣誉"
			  }
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
			  path: "weizhifuwu",
			  name: "weizhifuwu",
			  meta: {
			    title: "位置服务"
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
			  path: "chanpinbiecheng",
			  name: "chanpinbiecheng",
			  meta: {
			    title: '产品别称'
			  }
			},
			{
			  path: "danjufuwu",
			  name: "danjufuwu",
			  meta: {
			    title: '单据服务'
			  }
			},
			{
			  path: "kuanshi",
			  name: "kuanshi",
			  meta: {
			    title: '款式'
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
			  path: "cangkudangan",
			  name: "cangkudangan",
			  meta: {
			    title: '仓库档案'
			  }
			},
			{
			  path: "huoweidangan",
			  name: "huoweidangan",
			  meta: {
			    title: '货位档案'
			  }
			},
			{
			  path: "cangkuzidian",
			  name: "cangkuzidian",
			  meta: {
			    title: '仓库字典'
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
			  path: "liuchengrenwuyiban",
			  name: "liuchengrenwuyiban",
			  meta: {
			    title: '流程任务-已办'
			  }
			},
			{
			  path: "rukudan",
			  name: "rukudan",
			  meta: {
			    title: '入库单'
			  }
			},
			{
			  path: "tuihuodan",
			  name: "tuihuodan",
			  meta: {
			    title: '退货单'
			  }
			},
			{
			  path: "tuihuodan",
			  name: "tuihuodan",
			  meta: {
			    title: '退货单'
			  }
			},
			{
			  path: "chukudan",
			  name: "chukudan",
			  meta: {
			    title: '出库单'
			  }
			},
			{
			  path: "tuikudan",
			  name: "tuikudan",
			  meta: {
			    title: '退库单'
			  }
			},
			{
			  path: "yiweidan",
			  name: "yiweidan",
			  meta: {
			    title: '移位单'
			  }
			},
			{
			  path: "yikudan",
			  name: "yikudan",
			  meta: {
			    title: '移库单'
			  }
			},
			{
			  path: "pandiandan",
			  name: "pandiandan",
			  meta: {
			    title: '盘点单'
			  }
			},
			{
			  path: "kucunchaxun",
			  name: "kucunchaxun",
			  meta: {
			    title: '库存查询'
			  }
			},
			{
			  path: "yingkuitiaozheng",
			  name: "yingkuitiaozheng",
			  meta: {
			    title: '盈亏调整'
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
			  path: "yongcanrenshu",
			  name: "yongcanrenshu",
			  meta: {
			    title: '用餐人数'
			  }
			},
			{
			  path: "yuanshidingdan",
			  name: "yuanshidingdan",
			  meta: {
			    title: '原始订单'
			  }
			},
			{
			  path: "xiaoshoudingdan",
			  name: "xiaoshoudingdan",
			  meta: {
			    title: '销售订单'
			  }
			},
			{
			  path: "fahuotongzhi",
			  name: "fahuotongzhi",
			  meta: {
			    title: '发货通知'
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
			  path: "chanpinshuxing",
			  name: "chanpinshuxing",
			  meta: {
			    title: '产品属性'
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
			  path: "yizhoushipu",
			  name: "yizhoushipu",
			  meta: {
			    title: '一周食谱'
			  }
			},
			{
			  path: "shipuguize",
			  name: "shipuguize",
			  meta: {
			    title: '食谱规则'
			  }
			},
			{
			  path: "shipudangan",
			  name: "shipudangan",
			  meta: {
			    title: '食谱档案'
			  }
			},
			{
			  path: "shicaidangan",
			  name: "shicaidangan",
			  meta: {
			    title: '食材档案'
			  }
			},
			{
			  path: "liangyoufushi",
			  name: "liangyoufushi",
			  meta: {
			    title: '粮油副食'
			  }
			},
			{
			  path: "hs_caigouxuqiu",
			  name: "hs_caigouxuqiu",
			  meta: {
			    title: '伙食-采购需求'
			  }
			},
			{
			  path: "hs_caigoudan",
			  name: "hs_caigoudan",
			  meta: {
			    title: '伙食-采购单'
			  }
			},
			{
			  path: "hs_rukudan",
			  name: "hs_rukudan",
			  meta: {
			    title: '伙食-入库单'
			  }
			},
			{
			  path: "hs_chukudan",
			  name: "hs_chukudan",
			  meta: {
			    title: '伙食-出库单'
			  }
			},
			{
			  path: "hs_tuihuodan",
			  name: "hs_tuihuodan",
			  meta: {
			    title: '伙食-退货单'
			  }
			},
			{
			  path: "hs_tuikudan",
			  name: "hs_tuikudan",
			  meta: {
			    title: '伙食-退库单'
			  }
			},
			{
			  path: "lyfs_caigouxuqiu",
			  name: "lyfs_caigouxuqiu",
			  meta: {
			    title: '粮油副食-采购需求'
			  }
			},
			{
			  path: "lyfs_caigoudan",
			  name: "lyfs_caigoudan",
			  meta: {
			    title: '粮油副食-采购单'
			  }
			},
			{
			  path: "lyfs_rukudan",
			  name: "lyfs_rukudan",
			  meta: {
			    title: '粮油副食-采购入库单'
			  }
			},
			{
			  path: "lyfs_chukudan",
			  name: "lyfs_chukudan",
			  meta: {
			    title: '粮油副食-领用出库单'
			  }
			},
			{
			  path: "lyfs_tuihuodan",
			  name: "lyfs_tuihuodan",
			  meta: {
			    title: '粮油副食-采购退货单'
			  }
			},
			{
			  path: "lyfs_tuikudan",
			  name: "lyfs_tuikudan",
			  meta: {
			    title: '粮油副食-领用退库单'
			  }
			},
			{
			  path: "qc_diaobochukudan",
			  name: "qc_diaobochukudan",
			  meta: {
			    title: '器材-调拨出库单'
			  }
			},
			{
			  path: "qc_diaoborukudan",
			  name: "qc_diaoborukudan",
			  meta: {
			    title: '器材-调拨入库单'
			  }
			},
			{
			  path: "qc_xiafachukudan",
			  name: "qc_xiafachukudan",
			  meta: {
			    title: '器材-下发出库单'
			  }
			},
			{
			  path: "qc_xiafarukudan",
			  name: "qc_xiafarukudan",
			  meta: {
			    title: '器材-下发入库单'
			  }
			},
			{
			  path: "qc_juanzengchukudan",
			  name: "qc_juanzengchukudan",
			  meta: {
			    title: '器材-捐赠出库单'
			  }
			},
			{
			  path: "qc_juanzengrukudan",
			  name: "qc_juanzengrukudan",
			  meta: {
			    title: '器材-捐赠入库单'
			  }
			},
			{
			  path: "qc_gerenzhuangbeilingyong",
			  name: "qc_gerenzhuangbeilingyong",
			  meta: {
			    title: '器材-个人装备领用'
			  }
			},
			{
			  path: "qc_cheliangqicailingyong",
			  name: "qc_cheliangqicailingyong",
			  meta: {
			    title: '器材-车辆器材领用'
			  }
			},
			{
			  path: "qc_wgcigoudan",
			  name: "qc_wgcigoudan",
			  meta: {
			    title: '器材-外购-采购单'
			  }
			},
			{
			  path: "qc_wgcigourukudan",
			  name: "qc_wgcigourukudan",
			  meta: {
			    title: '器材-外购-采购入库'
			  }
			},
			{
			  path: "qc_tuikudandan",
			  name: "qc_tuikudandan",
			  meta: {
			    title: '器材-退库单'
			  }
			},
			{
			  path: "qc_wgcigoutuihuodan",
			  name: "qc_wgcigoutuihuodan",
			  meta: {
			    title: '器材-外购-采购退货'
			  }
			},
			{
			  path: "shipucanshu",
			  name: "shipucanshu",
			  meta: {
			    title: '食谱参数'
			  }
			},
			{
			  path: "gy_caigouxuqiu",
			  name: "gy_caigouxuqiu",
			  meta: {
			    title: '公用-采购需求'
			  }
			},
			{
			  path: "gy_caigoudan",
			  name: "gy_caigoudan",
			  meta: {
			    title: '公用-采购单'
			  }
			},
			{
			  path: "gy_rukudan",
			  name: "gy_rukudan",
			  meta: {
			    title: '公用-入库单'
			  }
			},
			{
			  path: "gy_chukudan",
			  name: "gy_chukudan",
			  meta: {
			    title: '公用-出库单'
			  }
			},
			{
			  path: "gy_tuihuodan",
			  name: "gy_tuihuodan",
			  meta: {
			    title: '公用-退货单'
			  }
			},
			{
			  path: "gy_tuikudan",
			  name: "gy_tuikudan",
			  meta: {
			    title: '公用-退库单'
			  }
			},
			{
			  path: "chanpinbom",
			  name: "chanpinbom",
			  meta: {
			    title: '产品BOM'
			  }
			},
			{
			  path: "caigouxuqiu",
			  name: "caigouxuqiu",
			  meta: {
			    title: '采购需求'
			  }
			},
			{
			  path: "caigoudan",
			  name: "caigoudan",
			  meta: {
			    title: '采购单'
			  }
			},
			{
			  path: "jiesuandan",
			  name: "jiesuandan",
			  meta: {
			    title: '采购结算单'
			  }
			},
			{
			  path: "yewuleixing",
			  name: "yewuleixing",
			  meta: {
			    title: '业务类型'
			  }
			},
			{
			  path: "zhishiguanli",
			  name: "zhishiguanli",
			  meta: {
			    title: '知识管理'
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
			  path: "gongfangguanli",
			  name: "gongfangguanli",
			  meta: {
			    title: '供方管理'
			  }
			},
			{
			  path: "pinpaifang",
			  name: "pinpaifang",
			  meta: {
			    title: '品牌方'
			  }
			},
			{
			  path: "baoyangdan",
			  name: "baoyangdan",
			  meta: {
			    title: '保养单'
			  }
			},
			{
			  path: "zichanqingdan",
			  name: "zichanqingdan",
			  meta: {
			    title: '资产清单'
			  }
			},
			{
			  path: "gerentaizhang",
			  name: "gerentaizhang",
			  meta: {
			    title: '个人台账'
			  }
			},
			{
			  path: "chimaduizhao",
			  name: "chimaduizhao",
			  meta: {
			    title: '尺码对照'
			  }
			},
			{
			  path: "chimabiaozhun",
			  name: "chimabiaozhun",
			  meta: {
			    title: '尺码标准'
			  }
			},
			{
			  path: "beizhuangchima",
			  name: "beizhuangchima",
			  meta: {
			    title: '被装尺码'
			  }
			},
			{
			  path: "beizhuangqingdan",
			  name: "beizhuangqingdan",
			  meta: {
			    title: '被装清单'
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
			{
			  path: "nongfuchanpincaigoubaobiao",
			  name: "nongfuchanpincaigoubaobiao",
			  meta: {
			    title: '农副产品采购报表'
			  }
			},
			{
			  path: "zurixiaohaobaobiao",
			  name: "zurixiaohaobaobiao",
			  meta: {
			    title: '逐日消耗报表'
			  }
			},
			{
			  path: "yizhoucaigouhuizongbiao",
			  name: "yizhoucaigouhuizongbiao",
			  meta: {
			    title: '一周采购汇总表'
			  }
			},
			{
			  path: "shoufacunhuizongbaobiao",
			  name: "shoufacunhuizongbaobiao",
			  meta: {
			    title: '收发存汇总报表'
			  }
			},
			{
			  path: "rukuhuizongbaobiao",
			  name: "rukuhuizongbaobiao",
			  meta: {
			    title: '入库汇总报表'
			  }
			},
			{
			  path: "chukuhuizongbaobiao",
			  name: "chukuhuizongbaobiao",
			  meta: {
			    title: '出库汇总报表'
			  }
			},
			{
			  path: "churukumingxibaobiao",
			  name: "churukumingxibaobiao",
			  meta: {
			    title: '出入库明细报表'
			  }
			},
			{
			  path: "lingyongdanweichukuhuizongbiao",
			  name: "lingyongdanweichukuhuizongbiao",
			  meta: {
			    title: '领用单位出库汇总表'
			  }
			},
			{
			  path: "leibiehuizongbaobiao",
			  name: "leibiehuizongbaobiao",
			  meta: {
			    title: '类别汇总报表'
			  }
			},
			{
				path: "yizhouhuoshihuizong",
				name: "yizhouhuoshihuizong",
				meta: {
				  title: "一周伙食汇总"
				}
			},
			{
				path: "pandianhuizongbaobiao",
				name: "pandianhuizongbaobiao",
				meta: {
				  title: "盘点汇总报表"
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
			  path: "daochuziduanduiying",
			  name: "daochuziduanduiying",
			  meta: {
			    title: '导出字段对应'
			  }
			},
			{
			  path: "daoruziduanduiying",
			  name: "daoruziduanduiying",
			  meta: {
			    title: '导入字段对应'
			  }
			},
			{
			  path: "zhanghaoguanli",
			  name: "zhanghaoguanli",
			  meta: {
			    title: '账号管理'
			  }
			},
			{
			  path: "dayinmoban",
			  name: "dayinmoban",
			  meta: {
			    title: '打印模板'
			  }
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
			  path: "yongchedan",
			  name: "yongchedan",
			  meta: {
			    title: "用车单"
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
			  path: "mingpailiebiao",
			  name: "mingpailiebiao",
			  meta: {
			    title: "铭牌列表"
			  }
			},
			{
			  path: "mingpaileixing",
			  name: "mingpaileixing",
			  meta: {
			    title: "铭牌类型"
			  }
			},
			{
			  path: "mingpaizhizuoqingdan",
			  name: "mingpaizhizuoqingdan",
			  meta: {
			    title: "铭牌制作清单"
			  }
			},
			{
				path: "zhanghuxinxi",
				name: "zhanghuxinxi",
				meta: {
				  title: "账户信息"
				}
			},
			{
				path: "caigouduizhangdan",
				name: "caigouduizhangdan",
				meta: {
				  title: "采购对账单"
				}
			},
			{
				path: "xiaoshouduizhangdan",
				name: "xiaoshouduizhangdan",
				meta: {
				  title: "销售对账单"
				}
			},
			{
				path: "diaoboshenqingdan",
				name: "diaoboshenqingdan",
				meta: {
				  title: "调拨申请单"
				}
			},
			{
				path: "suicheruku",
				name: "suicheruku",
				meta: {
				  title: "随车入库"
				}
			},
			{
				path: "xiaoshoujiesuandam",
				name: "xiaoshoujiesuandam",
				meta: {
				  title: "销售结算单"
				}
			},
			{
				path: "huoweihuaban",
				name: "huoweihuaban",
				meta: {
				  title: "货位画板"
				}
			}
    ]
  }
];

export default routes;
