<template>
  <el-dialog :title="title" :visible.sync="isShow" @closed="onClosed">
    <el-form label-width="6em">
      <el-form-item label="上级字典">
        <el-input
          v-if="currentDictionary && currentDictionary.F_ItemName"
          v-model="currentDictionary.F_ItemName"
          disabled
        ></el-input>
      </el-form-item>
			<el-form-item label="上级明细">
				<el-cascader
				    v-model="form.parentId"
						:props='{
							emitPath: false,
							checkStrictly: true,
							label: "F_ItemName",
							value: "F_ItemDetailId",
							children: "Child"
						}'
				    :options="detailsCpu"
				    @change="select"></el-cascader>
				<!-- <el-select v-model="form.parentId" filterable placeholder="请选择" @change="select">
					<el-option
						v-for="item in detailsCpu"
						:key="item.value"
						:label="item.label"
						:value="item.value">
					</el-option>
				</el-select> -->
			</el-form-item>
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
      <el-form-item label="默认值">
        <el-radio-group v-model="form.default">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否可用">
        <el-radio-group v-model="form.enabled">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
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
    id: "",
		default: 0,
		itemId: "",//字典id
    parentId: "",
    itemName: "",
    itemValue: "",
    sortId: 0,
    enabled: 1
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
			console.log(1)
      if (this.$v.form.$error) return;
			console.log(2)
			console.log(this.form)
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
      let data = {
				f_ItemDetailId: this.form.id,
        f_ItemId: this.currentDictionary.F_ItemId,
				f_ParentId: this.form.parentId ? this.form.parentId : 0,
        f_ItemName: this.form.itemName,
        f_ItemValue: this.form.itemValue,
        f_SortId: this.form.sortId,
        f_Enable: this.form.enabled,
				f_Default: this.form.default
      };
      let res = await this.$_request({
        url: "/WF/DataItemDetail/Change",
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
