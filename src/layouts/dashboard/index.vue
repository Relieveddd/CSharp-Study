<template>
  <div :class="$style['wrap']" v-loading="ui.loading">
    <c-header @toggleSidebar="onToggleSidebar"></c-header>
    <div :class="$style['mainer']">
      <c-sidebar :tree="menuTree" :isShow.sync="ui.sidebar"></c-sidebar>
      <div :class="$style['content']">
        <c-tabbar @refresh="onRefresh"></c-tabbar>
        <div
          :class="[$style['container'], { [$style['padding']]: ui.padding }]"
        >
          <keep-alive :include="tabCacheList" :exclude="refreshTabName">
            <router-view v-if="ui.container"></router-view>
          </keep-alive>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CHeader from "./components/header";
import CTabbar from "./components/tabbar";
import CSidebar from "./components/sidebar";

export default {
  name: "layoutDashboard",
  components: {
    CHeader,
    CTabbar,
    CSidebar
  },
  data() {
    return {
      menuTree: [{
				F_Name: "人事薪酬管理平台",
				F_Icon: "",
				F_Url: "",
				Child: [{
					F_Name: "hr系统管理",
					F_Icon: "",
					F_Url: "hr",
				},{
					F_Name: "hr组织管理",
					F_Icon: "",
					F_Url: "hrOrganize",
				},{
					F_Name: "hr公司列表",
					F_Icon: "",
					F_Url: "companyList",
				}]
			},{
				F_Name: "AI会计管理平台",
				F_Icon: "",
				F_Url: "ai",
				Child: [{
					F_Name: "ai系统管理",
					F_Icon: "",
					F_Url: "ai",
				},{
					F_Name: "ai组织管理",
					F_Icon: "",
					F_Url: "aiOrganize",
				},{
					F_Name: "ai公司列表",
					F_Icon: "",
					F_Url: "companyListAI",
				}]
			},{
				F_Name: "专家预约坐诊管理平台",
				F_Icon: "",
				F_Url: "yl",
				Child: [{
					F_Name: "系统管理",
					F_Icon: "",
					F_Url: "yl",
				},{
					F_Name: "组织管理",
					F_Icon: "",
					F_Url: "ylOrganize",
				},{
					F_Name: "yl公司列表",
					F_Icon: "",
					F_Url: "companyListYL",
				}]
			},{
				F_Name: "智慧消防管理平台",
				F_Icon: "",
				F_Url: "",
				Child: [{
					F_Name: "系统管理",
					F_Icon: "",
					F_Url: "cc",
				},{
					F_Name: "组织管理",
					F_Icon: "",
					F_Url: "CcOrganize",
				},{
					F_Name: "智慧消防公司列表",
					F_Icon: "",
					F_Url: "companyListWMS",
				}]
			},{
				F_Name: "安安管理平台",
				F_Icon: "",
				F_Url: "",
				Child: [{
					F_Name: "系统管理",
					F_Icon: "",
					F_Url: "aa",
				},{
					F_Name: "组织管理",
					F_Icon: "",
					F_Url: "AaOrganize",
				},{
					F_Name: "Aa公司列表",
					F_Icon: "",
					F_Url: "companyListAA",
				}]
			},{
				F_Name: "商业智能平台",
				F_Icon: "",
				F_Url: "",
				Child: [{
					F_Name: "商业智能系统管理",
					F_Icon: "",
					F_Url: "syzn",
				},{
					F_Name: "组织管理",
					F_Icon: "",
					F_Url: "syznOrganize",
				},{
					F_Name: "商业智能公司列表",
					F_Icon: "",
					F_Url: "companyListSyzn",
				}]
			},{
				F_Name: "度见ERP",
				F_Icon: "",
				F_Url: "",
				Child: [{
					F_Name: "系统管理",
					F_Icon: "",
					F_Url: "cc_gys",
				},{
					F_Name: "组织管理",
					F_Icon: "",
					F_Url: "CcOrganize_gys",
				},{
					F_Name: "度见ERP公司列表",
					F_Icon: "",
					F_Url: "companyListWMS_gys",
				}]
			},{
				F_Name: "微服务管理",
				F_Icon: "",
				F_Url: "xtsz",
			},{
				F_Name: "产品管理",
				F_Icon: "",
				F_Url: "",
				Child: [{
					F_Name: "产品档案",
					F_Icon: "",
					F_Url: "chanpindangan",
				},{
					F_Name: "产品类别",
					F_Icon: "",
					F_Url: "chanpinleibie",
				},{
					F_Name: "产品属性",
					F_Icon: "",
					F_Url: "chanpinshuxing",
				},{
					F_Name: "产品字典",
					F_Icon: "",
					F_Url: "cpdaDictionary",
				},{
					F_Name: "品牌方",
					F_Icon: "",
					F_Url: "pinpaifang",
				},{
					F_Name: "产品别称",
					F_Icon: "",
					F_Url: "chanpinbiecheng",
				}]
			},{
				F_Name: "仓库管理",
				F_Icon: "",
				F_Url: "",
				Child: [{
					F_Name: "仓库字典",
					F_Icon: "",
					F_Url: "cangkuzidian",
				}]
			},{
				F_Name: "流程管理",
				F_Icon: "",
				F_Url: "",
				Child: [{
					F_Name: "流程字典",
					F_Icon: "",
					F_Url: "liuchengzidian",
				}]
			},{
				F_Name: "打印服务",
				F_Icon: "",
				F_Url: "",
				Child: [{
					F_Name: "打印模板",
					F_Icon: "",
					F_Url: "dayinmoban",
				},{
					F_Name: "模板类别",
					F_Icon: "",
					F_Url: "dayinmobanLeibie",
				}]
			},{
				F_Name: "安安字典",
				F_Icon: "",
				F_Url: "ananzidian"
			},
			{
				F_Name: "二维码管理",
				F_Icon: "",
				F_Url: "erweima"
			},
			{
				F_Name: "编码规则",
				F_Icon: "",
				F_Url: "bianmaguize"
			},
			{
				F_Name: "设备管理",
				F_Icon: "",
				F_Url: "shebeiguanli"
			},{
				F_Name: "供应商服务",
				F_Icon: "",
				F_Url: "",
				Child: [{
					F_Name: "供应商字典",
					F_Icon: "",
					F_Url: "gongyingshangzidian",
				}]
			},{
				F_Name: "导入导出模板",
				F_Icon: "",
				F_Url: "",
				Child: [{
					F_Name: "导入模板",
					F_Icon: "",
					F_Url: "daorudaochumoban",
				},
				{
					F_Name: "导出模板",
					F_Icon: "",
					F_Url: "daochumoban",
				}]
			}],
      ui: {
        sidebar: true,
        container: true,
        padding: true,
        loading: false
      },
      refreshTabName: ""
    };
  },
  computed: {
    tabCacheList() {
      let pinTabList = this.$store.state.tabView.pinTabList.map(x => x[0]);
      let tabList = this.$store.state.tabView.tabList.map(x => x[0]);

      return [...pinTabList, ...tabList];
    }
  },
  methods: {
    onToggleSidebar() {
      this.ui.sidebar = !this.ui.sidebar;
    },
    async onRefresh(payload) {
      this.refreshTabName = payload.tab[0];
      this.ui.container = false;

      await this.$nextTick();

      this.refreshTabName = "";
      this.ui.container = true;
    },
    async getMenu() {
      // let res = await this.$_request({
      //   url: "/Base/Module/GetRoleModuleList",
      //   method: "get"
      // });

      // this.menuTree = res.data.data;
    }
  },
  async created() {
    this.ui.loading = true;
    await this.getMenu();
    this.ui.loading = false;
  }
};
</script>

<style lang="scss" module>
.wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f2f2f2;
  .mainer {
    flex: 1;
    overflow: auto;
    display: flex;
    .content {
      flex: 1;
      margin: 8px;
      display: flex;
      flex-direction: column;
      overflow: auto;
      border-radius: 4px;
      .container {
        flex: 1;
        background: #fff;
        box-shadow: 0 1px 1px -1px rgba(0, 0, 0, 0.15);
        overflow: auto;
        &.padding {
          padding: 8px;
        }
        &::-webkit-scrollbar-track {
          background: #fff;
        }
      }
    }
  }
}
</style>
