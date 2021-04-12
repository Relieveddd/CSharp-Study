import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import user from "./user";
import tabView from "./tabView";
import dictionary from "./dictionary";
import request from "@/utils/request";
import login from "./login.js"

Vue.use(Vuex);

const initState = function() {
  return {
    permissionStatus: false,
    menuPermission: [],
    buttonPermission: {},
    SysConfig:{
      SysConfigStatus: false,
    }
  };
};

export default new Vuex.Store({
  state: initState(),
  mutations: {
    set(state, payload) {
      Object.assign(state, payload);
    },
    reset(state) {
      Object.assign(state, initState());
    }
  },
  actions: {
    async getPermission(context) {
      await request({
        url:'/HR/Emp/RefreshCache',
        method:'post'
      })
      let res = await request({
        url: "/Base/Module/GetRoleModuleList",
        method: "get"
      });
      let buttonHash = {};
      let menuList = [];
      let loop = function(list) {
        list.forEach(x => {
          if (x.F_Url) {
            menuList.push(x.F_Url);
            buttonHash[x.F_Url] = (x.F_Opers || []).map(x => x.F_OperCode);
          }
          if (x.Child) {
            loop(x.Child);
          }
        });
      };
      loop(res.data.data || []);
			if(menuList.includes('admin')) {
				menuList = menuList.concat([
					'hr', 
					'ai', 
					'hrOrganize', 
					'aiOrganize', 
					'cc', 
					'CcOrganize',
					'cc_gys',
					'CcOrganize_gys',
					'aa', 
					'AaOrganize', 
					'companyList',
					'companyListAA',
					'companyListWMS',
					'companyListWMS_gys',
					'companyListAI',
					'companyListYL',
					'syzn',
					'syznOrganize',
					'companyListSyzn',
					'xtsz',
					'chanpinleibie',
					'chanpindangan',
					'chanpinshuxing',
					'cpdaDictionary',
					'pinpaifang',
					'chanpinbiecheng',
					'cangkuzidian',
					'liuchengzidian',
					'dayinmoban',
					'dayinmobanLeibie',
					'ananzidian',
					'erweima',
					'shebeiguanli',
					'gongyingshangzidian',
					'daorudaochumoban',
					'daochumoban',
					'bianmaguize'
				])
			}
      context.commit("set", {
        menuPermission: menuList,
        buttonPermission: buttonHash,
        permissionStatus: true
      });
    },
    reset({ commit }) {
      commit("reset");
    },
    async getSysConfig(context) {
      let res = await request({
        url:'/HR/SysConfig/GetSingle',
        method:'get'
      })
      let data = res.data.data;
      console.log(data)
      if(!data){
        data={};
      }
      if(data.F_HRSystemName){
        document.title = data.F_HRSystemName;
      }
      let SysConfig={
        f_id: data.F_Id,
        f_ContractTemplate: data.F_ContractTemplate,
        f_SalaryStartDay: data.F_SalaryStartDay,
        f_SalaryEndDay: data.F_SalaryEndDay,
        f_HRSystemName: data.F_HRSystemName,
        f_DayType: data.F_DayType,
        f_SalaryCreateTip: data.F_SalaryCreateTip,
        SysConfigStatus: true
      }
      context.commit("set", {SysConfig:SysConfig})
      // if(){
      //   
      // }
    }
  },
  modules: {
    user,
    tabView,
    dictionary,
    login
  },
  plugins: [createPersistedState({ paths: ["user"] })]
});
