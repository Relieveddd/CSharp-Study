<template>
  <el-dialog :title="title" :visible.sync="isShow" @closed="onClosed">
    <el-form label-width="6em">
      <el-form-item label="字典">
        <el-input
          v-if="currentDictionary && currentDictionary.F_ItemName"
          v-model="currentDictionary.F_ItemName"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item
        label="名称"
        required
        :error="$v.form.name.$error ? '必填' : ''"
      >
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="编号">
        <el-input v-model="form.number"></el-input>
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number
          v-model="form.sort"
          :step="1"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="默认值">
        <el-radio-group v-model="form.isDefault">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否可用">
        <el-radio-group v-model="form.isEnable">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
			<el-form-item label="是否锁定">
			  <el-radio-group v-model="form.isLock">
			    <el-radio :label="'1'">是</el-radio>
			    <el-radio :label="'0'">否</el-radio>
			  </el-radio-group>
			</el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remark"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="closeSelf">取 消</el-button>
      <el-button type="primary" @click="onOk" :loading="ui.okLoading"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { required } from "@/utils/validator";

const data_form = function() {
  return {
    id: "",
    rid: "",
    pid: "0",
    name: "",
    number: "",
    sort: 0,
    isDefault: 0,
    isEnable: 1,
    remark: "",
		isLock: ""
  };
};

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    formType: {
      type: String,
      default: "add"
    },
    currentDictionary: {}
  },
  validations: {
    form: {
      name: {
        required
      },
      number: {}
    }
  },
  data() {
    return {
      form: data_form(),
      operatorList: {
        1: "小于",
        2: "小于等于",
        3: "等于",
        4: "大于等于",
        5: "大于"
      },
      ui: {
        okLoading: false
      }
    };
  },
  computed: {
    isShow: {
      get() {
        return this.visible;
      },
      set(n) {
        this.$emit("update:visible", n);
      }
    },
    title() {
      return `${this.formType === "add" ? "新增" : "修改"}明细`;
    }
  },
  methods: {
    closeSelf() {
      this.isShow = false;
    },
    onClosed() {
      this.form = data_form();
      this.ui.okLoading = false;
      this.$v.$reset();
    },
    async onOk() {
      this.$v.form.$touch();
      if (this.$v.form.$error) return;

      if (!this.currentDictionary || !this.currentDictionary.F_ItemId) return;

      this.ui.okLoading = true;

      try {
        await this.postForm();

        this.closeSelf();
        this.$message({
          message: "成功",
          type: "success"
        });
        this.$emit("update");
      } catch (error) {
        this.ui.okLoading = false;
      }
    },
    async postForm() {
      let data = {
        f_ItemDetailId: this.form.id,
        f_ItemId: this.currentDictionary.F_ItemId,
        f_ParentId: this.form.pid,
        f_ItemName: this.form.name,
        f_ItemValue: this.form.number,
        f_SortId: this.form.sort,
        f_Default: this.form.isDefault,
        f_Enable: this.form.isEnable,
        f_ReMark: this.form.remark,
				f_IsLock: this.form.isLock
      };
      await this.$_request({
        url: "/WMS/DataItemDetail/Change",
        method: "post",
        data
      });
    }
  }
};
</script>

<style lang="scss" module>
.condition {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 16px;
}
.other {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 16px;
}
</style>
