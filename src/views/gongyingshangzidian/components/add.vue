<template>
  <el-dialog :title="title" :visible.sync="isShow" @closed="onClosed">
    <el-form label-width="6em">
      <el-form-item
        label="名称"
        required
        :error="$v.form.itemName.$error ? '必填' : ''"
      >
        <el-input v-model="form.itemName"></el-input>
      </el-form-item>
      <el-form-item label="编号">
        <el-input v-model="form.itemValue"></el-input>
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number
          v-model="form.sortId"
          :step="1"
          :min="0"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="是否可用">
        <el-radio-group v-model="form.enable">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
			<el-form-item label="备注">
			  <el-input v-model="form.remark"></el-input>
			</el-form-item>
      <!-- <el-form-item label="备注">
        <el-input v-model="form.remark"></el-input>
      </el-form-item> -->
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
		"id": "",
		"f_ComId": "",
		"itemId": "",
		"itemName": "",
		"itemValue": "",
		"sortId": 0,
		"enable": 1,
		remark: ""
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
    currentDictionary: {},
		details: {
			type: Array,
			default: []
		}
  },
  validations: {
    form: {
      itemName: {
        required
      },
      itemValue: {}
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
    },
		detailsCpu() {
			// console.log(this.details)
			// let arr = []
			// let loop = function(data) {
			// 	data.map(x => {
			// 		arr.push({value: x.F_ItemDetailId, label: x.F_ItemName})
			// 		if(x.Child) {
			// 			loop(x.Child)
			// 		}
			// 	})
			// }
			// loop(this.details)
			return this.details
		}
  },
  methods: {
		select(e) {
			// console.log(this.de)
		},
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
			// return false
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
			console.log(this.currentDictionary)
      let data = {
				Id: this.form.id,
        ItemId: this.currentDictionary.Id,
        ItemName: this.form.itemName,
        ItemValue: this.form.itemValue,
        sortId: this.form.sortId,
        Enable: this.form.enable,
				remark: this.form.remark
      };
      let res = await this.$_request({
        url: "/sc/DataItemDetail/Change",
        method: "post",
        data
      });
			console.log(res)
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
