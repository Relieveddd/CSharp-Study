<template>
  <mm-atp>
    <template v-slot:action-left>
      <el-form :inline="true">
        <el-form-item>
          <el-date-picker
            v-model="query.yearMonth"
            type="month"
            placeholder="选择月份"
            value-format="yyyyMM"
            style="width:120px;"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-select v-model="query.type" placeholder="请选择" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="(item, index) in dictionaryData.rylb"
              :key="index"
              :label="item.F_ItemName"
              :value="item.F_ItemDetailId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            placeholder="关键词搜索"
            v-model="query.keyword"
            @keyup.enter.native.stop="getList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getList"
            ></el-button>
          </el-input>
        </el-form-item>
      </el-form>
    </template>
    <template v-slot:action-right>
      <el-button @click="onPrint('print')" v-if="checkButton('print')"
        >打印</el-button
      >
      <el-button
        @click="onPrint('printPreview')"
        v-if="checkButton('printPreview')"
        >打印预览</el-button
      >
    </template>
    <template v-slot:table>
      <el-table
        border
        height="100%"
        :data="tableData"
        v-loading="ui.loading"
        ref="table"
      >
        <el-table-column show-overflow-tooltip prop="depname" label="部门">
        </el-table-column>
        <el-table-column
          v-for="(item, index) in headerList"
          :key="index"
          :prop="`col_${index}`"
          :label="item.F_ItemName"
        >
        </el-table-column>
      </el-table>
    </template>
    <template v-slot:other>
      <object
        ref="report"
        type="application/x-grplugin6-report"
        width="0"
        height="0"
        style="display:block;"
      ></object>
    </template>
  </mm-atp>
</template>

<script>
import checkPermission from "@/utils/checkPermission";
import { queryDictionaryDetailByCode } from "@/utils/api";

export default {
  name: "report1",
  mixins: [checkPermission],
  data() {
    return {
      tableData: [],
      headerList: [],
      query: {
        keyword: "",
        type: "",
        yearMonth: ""
      },
      ui: {
        loading: false,
        printLoading: false
      },
      dictionaryData: {
        rylb: []
      }
    };
  },
  watch: {
    query: {
      handler() {
        this.getList();
      },
      deep: true
    }
  },
  methods: {
    async getList() {
      this.ui.loading = true;

      try {
        let res = await this.$_request({
          url: "/HR/Report/GetReport",
          method: "POST",
          data: {
            queryJson_S: JSON.stringify({
              query: this.query.keyword
            }),
            queryJson: JSON.stringify({
              f_ptype: this.query.type
            }),
            orderJson: "",
            pageIndex: 1,
            pageSize: 9999
          },
          params: {
            _reportType: 1,
            _yearMonth: this.query.yearMonth
          }
        });
        this.tableData = res.data.data;
      } finally {
        this.ui.loading = false;
      }
    },
    async getHeaderList() {
      let resData = await queryDictionaryDetailByCode("dj");

      this.headerList = resData.data;
    },
    async onPrint(type = "print") {
      let report = this.$refs.report;

      if (!report.LoadFromURL) {
        return this.$message({
          type: "error",
          dangerouslyUseHTMLString: true,
          message: `请使用360浏览器，并安装打印插件（<a href="http://www.rubylong.cn/download/gridreport6-release.zip" download>下载</a>）`
        });
      }

      let res = await this.$_request({
        url: "/HR/Report/Print",
        method: "post",
        data: {
          queryJson_S: JSON.stringify({
            query: this.query.keyword
          }),
          queryJson: JSON.stringify({
            f_ptype: this.query.type
          }),
          orderJson: "",
          pageIndex: 1,
          pageSize: 9999
        },
        params: {
          _reportType: 1
        }
      });

      report.LoadFromURL(
        `${
          process.env.VUE_APP_API_BASEURL
        }/upload/grf/jbsl.grf?t=${new Date().getTime()}`
      );
      report.LoadDataFromXML(res.data);

      if (type === "print") {
        report.Print(true);
      } else {
        report.PrintPreview(true);
      }
    },
    async getDictionaryData() {
      let resData = await queryDictionaryDetailByCode("rylb");

      this.dictionaryData.rylb = resData.data;
    }
  },
  async created() {
    this.ui.loading = true;
    await this.getDictionaryData();
    await this.getHeaderList();
    this.$refs.table.doLayout();
    this.ui.loading = false;
    await this.getList();
  }
};
</script>
