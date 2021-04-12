<template>
  <el-dialog
    title="提示"
    :visible.sync="warn"
    width="30%"
    :before-close="handleClose">
    <span>请到 薪酬管理>薪酬项目 下添加出警费</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="warn = false">暂不添加</el-button>
      <el-button type="primary" @click="sure">前去添加</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default{
    props:{
      warn: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        warn1: ''
      }
    },
    methods:{
      //////////////////提示信息////////////
      alert (){
        this.warn = true;
      },
      handleClose(done) {
          this.warn = false
      },
      sure() {
        this.warn = false
      }
    }
  }
</script>

<style>
</style>
