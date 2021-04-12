<!-- 首页 -->

<template>
  <div :class="$style['wrap']" v-loading="ui.loading">
    <c-list :class="$style['c3']" :data="todoList" title="待处理"></c-list>
    <c-list
      :class="$style['c3']"
      :data="contracttipList"
      title="合同到期提醒"
    ></c-list>
    <c-list
      :class="$style['c3']"
      :data="personnelList"
      title="新员工入职提醒"
    ></c-list>
    <c-list
      :class="$style['c3']"
      :data="birthdayList"
      title="员工生日提醒"
    ></c-list>
    <c-chart1
      title="人员类型"
      :data="personnelcategoryList"
      :class="$style['c2']"
    ></c-chart1>
    <c-chart2
      type="2"
      :rylbList="dictionaryData.rylb"
      chartType="theta"
      :class="$style['c2']"
    ></c-chart2>
    <c-chart2
      type="1"
      :rylbList="dictionaryData.rylb"
      chartType="theta"
      :class="$style['c2']"
    ></c-chart2>
    <c-chart1
      title="持证分析"
      :data="certificateList"
      :class="$style['c2']"
    ></c-chart1>
    <c-chart1
      title="退伍军人"
      :data="veteranList"
      :class="$style['c2']"
    ></c-chart1>
    <c-chart2
      type="6"
      :rylbList="dictionaryData.rylb"
      chartType="theta"
      :class="$style['c2']"
    ></c-chart2>
    <c-chart2
      type="4"
      :rylbList="dictionaryData.rylb"
      :class="$style['c4']"
    ></c-chart2>
    <c-chart2
      type="3"
      :rylbList="dictionaryData.rylb"
      :class="$style['c2']"
    ></c-chart2>
    <c-chart2
      type="5"
      :rylbList="dictionaryData.rylb"
      :class="$style['c6']"
    ></c-chart2>
  </div>
</template>

<script>
import { queryDictionaryDetailByCode } from "@/utils/api";
import CList from "./components/list";
import CChart1 from "./components/chart1";
import CChart2 from "./components/chart2";

export default {
  name: "dashboard",
  components: {
    CList,
    CChart1,
    CChart2
  },
  data() {
    return {
      todoList: [],
      contracttipList: [],
      personnelList: [],
      birthdayList: [],
      personnelcategoryList: [],
      certificateList: [],
      veteranList: [],
      ui: {
        loading: false
      },
      dictionaryData: {
        rylb: []
      }
    };
  },
  methods: {
    async get() {
      this.ui.loading = true;

      try {
        let res = await this.$_request({
          url: "/HR/Tip/GetIndexTip",
          method: "get"
        });

        let resData = res.data.data;

        this.todoList = resData.to_do;
        this.contracttipList = resData.con_tip;
        this.personnelList = resData.new_emp;
        this.birthdayList = resData.emp_birth;
        this.personnelcategoryList = resData.ptype_ratio;
        this.certificateList = resData.empir_ratio;
        this.veteranList = resData.twjr_ratio;
      } finally {
        this.ui.loading = false;
      }
    },
    async getDictionaryData() {
      let resData = await queryDictionaryDetailByCode("rylb");

      this.dictionaryData.rylb = resData.data;
    }
  },
  created() {
    this.getDictionaryData();
  },
  mounted() {
    this.get();
  }
};
</script>

<style lang="scss" module>
.wrap {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 24px;
  margin: 12px;
}
.c3 {
  grid-column-start: span 3;
}
.c4 {
  grid-column-start: span 4;
}
.c2 {
  grid-column-start: span 2;
}
.c6 {
  grid-column-start: span 6;
}
</style>
