<template>
  <mm-atp palign="right">
    <template v-slot:action-left>
      <el-col :span="18">
        <el-input
          placeholder="请输入内容"
          v-model="keyword"
          class="input-with-select"
          @keyup.enter.native="search"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="search(true)"
          ></el-button>
        </el-input>
      </el-col>
    </template>
    <template v-slot:action-right> </template>
    <template v-slot:table>
      <tableList
        @rowClick="rowClick"
        @orderBy="orderBy"
        :list="tableList"
        v-loading="loading"
        @selectData="selectData"
      ></tableList>
    </template>
    <template v-slot:pagination>
      <bottom
        ref="bottom"
        :style="{ height: 103 + bottomHeight + 'px' }"
        :pageIndex="pageIndex"
        :record="record"
        @pageIndexChange="pageIndexChange"
      ></bottom>
    </template>
    <template v-slot:other> </template>
  </mm-atp>
</template>

<script>
import tableList from "./components/table";
import bottom from "./components/bottom";
import checkPermission from "@/utils/checkPermission";
const form = () => {
  return {
    id: "",
    f_ComId: "",
    productId: "",
    nickName: ""
  };
};
export default {
  name: "jiliangdanwei",
  mixins: [checkPermission],
  components: {
    tableList,
    bottom
  },
  data() {
    return {
      orderId: "",
      isShow: false,
      keyword: "",
      select: "1",
      addShow: false,
      form: form(),
      tableList: [],
      pageIndex: 1,
      pageSize: 20,
      record: 0,
      loading: false,
      tabHeight: 260,
      bottomHeight: -60,
      selectArr: [],
      changeType: "",
      F_ComId: "",
      proArr: [],
      filterProArr: [],
      orderJson: {},
      visibleRemove: false,
      title: "新增产品别称"
    };
  },
  methods: {
    //排序
    orderBy(e) {
      this.orderJson = {
        orderby: e.prop,
        ordertype: e.order === "ascending" ? "asc" : "desc"
      };
    },
    onClose(e) {
      this.tabHeight = 260;
    },
    async search(noSearch) {
      this.keyword = this.keyword.replace(/\s+/g, "");
      this.pageIndex = 1;
      this.getList();
    },
    handleClose() {
      this.addShow = false;
    },
    async getList() {
      this.loading = true;
      let res = await this.$_request({
        url: "/HR/PlatInfo/List",
        method: "post",
        data: {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          queryJson_S: JSON.stringify({ query: this.keyword }),
          orderBy: this.orderJson.orderby,
          orderAscDesc: this.orderJson.ordertype
        }
      });
      this.loading = false;
      this.record = res.data.recordcount;
      this.tableList = res.data.data;
    },
    async remove() {
      this.visibleRemove = false;
      if (this.selectArr.length != 1) {
        return this.$message({
          type: "warning",
          message: "请选择一条删除"
        });
      }
      let res = await this.$_request({
        url: "http://apiv2.duxian366.com/pr/ProductInfoNickName/Del",
        method: "post",
        data: [this.selectArr[0].Id]
      });
      this.$message({
        type: "success",
        message: "删除成功"
      });
      this.getList();
    },
    async edit() {
      this.title = "修改产品别称";
      if (this.selectArr.length != 1) {
        return this.$message({
          type: "warning",
          message: "请选择一条修改"
        });
      }
      this.form = {
        f_ComId: this.selectArr[0].F_ComId,
        id: this.selectArr[0].Id,
        nickName: this.selectArr[0].NickName,
        productId: this.selectArr[0].ProductId
      };
      this.addShow = true;
    },
    pageIndexChange(e) {
      this.pageIndex = e;
      if (this.keyword) {
        this.search();
      } else {
        this.getList();
      }
    },
    selectData(e) {
      this.selectArr = e;
    },
    rowClick(e) {
      this.tabHeight = 600;
      this.isShow = true;
      this.orderId = e.Id;
    }
  },
  mounted() {}
};
</script>

<style>
.el-dialog__title {
  color: #ff696b;
}
</style>
