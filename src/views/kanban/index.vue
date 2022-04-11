<template>
  <div>
    <tableList :style="{height: 'calc(100vh - '+tabHeight+'px)'}" :list="tableList" v-loading="loading" @selectData="selectData"></tableList>
    <bottom :style="{height: 103 + bottomHeight + 'px'}" :record="record" @pageIndexChange="pageIndexChange"></bottom>
  </div>
</template>

<script>
import tableList from "./components/table"
import bottom from "./components/bottom"
import checkPermission from "@/utils/checkPermission";

const form = () => {
  return {
    id: "",
    f_ComId: "",
    depid: "",
    code: "",
    name: "",
    isSpec: true,
    value: [],
    sort: 0,
    state: 1,
    isEnter: 0
  }
}
export default {
  name: "jiliangdanwei",
  mixins: [checkPermission],
  components: {
    tableList,
    bottom
  },
  data() {
    return {
      value: "",
      select: "1",
      addShow: false,
      form: form(),
      rules: {},
      tableList: [],
      pageIndex: 1,
      pageSize: 20,
      record: 0,
      loading: false,
      tabHeight: 210,
      bottomHeight: -60,
      selectArr: [],
      changeType: "",
      F_ComId: '',
      typeArr: [],
      visible: false,
      platform: [],
      selectPlatformArr: [],
      parentList: {},
      postTree: []
    }
  },
  methods: {
    add() {
      this.changeType = 'add'
      this.addShow = true
      this.form = form()
    },
    handleClose() {
      this.addShow = false
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //提交
          this.postForm()
        } else {
          return false;
        }
      });
    },
    async getList() {
      this.loading = true
      let res = await this.$_request({
        url: "/pr/ProOrder/KanBan",
        method: "post",
        data: {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          f_comid: "377954c8-9907-4ee5-b290-6623e9438e7b",
        }
      })
      if (res.data.code === 200) {
        // console.log(res);
        this.loading = false
        this.record = res.data.record
        this.tableList = res.data.data
      }
    },

    pageIndexChange(e) {
      this.pageIndex = e
      this.getList()
    },
    selectData(e) {
      this.selectArr = e
    },
    async getType() {
      let res = await this.$_request({
        url: '/pr/ProOrder/KanBan',
        method: 'post',
        data: {
          pageIndex: 1,
          pageSize: 999999
        }
      })
      this.typeArr = res.data.data
    },


  },
  mounted() {
    this.getType()
    this.getList()
  }
}
</script>

<style>
.el-dialog__title {
  color: #FF696B;
}
</style>
