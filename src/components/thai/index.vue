<template>
  <el-popover
    placement="bottom"
    trigger="click"
    v-model="isShow"
    @after-leave="onLeave"
  >
    <el-form>
      <el-form-item label="项目名">
        <el-select v-model="prop" placeholder="请选择">
          <el-option
            v-for="(item, index) in headerList"
            :key="index"
            :label="item.label"
            :value="item.prop"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="项目值">
        <el-input v-model="content"></el-input>
      </el-form-item>
      <el-form-item size="mini">
        <div style="text-align:center;">
          <el-button @click="onOk" type="primary">确定</el-button>
          <el-button @click="hide">关闭</el-button>
        </div>
      </el-form-item>
    </el-form>
    <el-button slot="reference">批量录入</el-button>
  </el-popover>
</template>

<script>
export default {
  name: "thai",
  props: {
    headerList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      content: "",
      prop: "",
      isShow: false
    };
  },
  methods: {
    onOk() {
      let data = {
        prop: this.prop,
        content: this.content
      };

      this.$emit("ok", data);
      this.hide();
    },
    hide() {
      this.isShow = false;
    },
    onLeave() {
      this.content = "";
      this.prop = "";
    }
  }
};
</script>
