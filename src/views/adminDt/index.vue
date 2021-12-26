<template>
  <mm-atp>
    <template v-slot:action-left>
      <el-radio-group v-model="component">
        <el-radio-button
          v-for="(item, index) in componentList"
          :key="index"
          :label="item.value"
          >{{ item.label }}</el-radio-button
        >
      </el-radio-group>
    </template>
    <template v-slot:table>
      <component :is="component" :type="component"></component>
    </template>
  </mm-atp>
</template>

<script>
import module from "./components/module";
import xcx_module from "./components/module";
import dd_module from "./components/module";
import operate from "./components/operate";
import dictionary from "./components/dictionary";
import dictionaryDetail from "./components/dictionaryDetail";

export default {
  components: {
    module,
    operate,
    dictionary,
    dictionaryDetail,
		xcx_module,
		dd_module
  },
  data() {
    return {
      component: "module",
      componentList: [
        {
          label: "PC模块",
          value: "module"
        },
				{
				  label: "小程序模块",
				  value: "xcx_module",
					
				},
				{
				  label: "钉钉小程序模块",
				  value: "dd_module",
					
				},
        {
          label: "权限",
          value: "operate"
        },
        {
          label: "字典",
          value: "dictionary"
        },
        {
          label: "字典详情",
          value: "dictionaryDetail"
        }
      ],
      t: {
        id: "1",
        name: "t"
      }
    };
  },
  methods: {
    async addModule() {
      let data = {
        f_ModuleId: "",
        f_TopId: "",
        f_Code: "",
        f_Name: "",
        f_Url: "",
        f_Icon: "",
        f_Operates: "",
        f_Sortid: 0,
        f_IsModule: true,
        f_IsExpand: true
      };
      await this.$_request({
        url: "/Base/Module/Change",
        method: "post",
        data
      });
    }
  }
};
</script>

<style lang="scss" module>
.header {
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.08);
  padding: 8px 0;
  text-align: center;
}
.content {
  padding: 16px;
  flex: 1;
}
</style>
