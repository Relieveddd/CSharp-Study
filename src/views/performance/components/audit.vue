<template>
  <el-dialog
    :visible.sync="isShow"
    title="审核"
    @closed="onClosed"
    @open="onOpen"
  >
    <el-form label-width="6em" v-loading="ui.loading">
      <el-form-item
        label="绩效类型"
        required
        :error="$v.form.typeId.$error ? '必填' : ''"
      >
        <el-select
          v-model="form.typeId"
          style="width:100%;"
          value-key="F_ItemDetailId"
        >
          <el-option
            v-for="(item, index) in performanceTypeList"
            :key="index"
            :label="item.F_ItemName"
            :value="item.F_ItemDetailId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="日期"
        required
        :error="$v.form.yearMonth.$error ? '必填' : ''"
      >
        <el-date-picker
          v-model="form.yearMonth"
          type="month"
          placeholder="选择日期"
          value-format="yyyy-MM"
          style="width:100%;"
        >
        </el-date-picker>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="closeSelf">取 消</el-button>
      <el-button type="primary" @click="onOk" :loading="ui.okLoading"
        >确 认</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { required } from "@/utils/validator";
import { queryDictionaryDetailByCode } from "@/utils/api";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  validations: {
    form: {
      typeId: {
        required
      },
      yearMonth: {
        required
      }
    }
  },
  computed: {
    isShow: {
      get() {
        return this.visible;
      },
      set(n) {
        this.$emit("update:visible", n);
      }
    }
  },
  data() {
    return {
      form: {
        typeId: "",
        yearMonth: ""
      },
      performanceTypeList: [],
      ui: {
        okLoading: false,
        loading: false
      }
    };
  },
  methods: {
    closeSelf() {
      this.isShow = false;
    },
    onClosed() {},
    async onOpen() {
      this.ui.loading = true;
      this.getPerformanceType();
      this.ui.loading = false;
    },
    async onOk() {
      this.$v.form.$touch();
      if (this.$v.form.$error) return;

      this.ui.okLoading = true;

      try {
        await this.$_request({
          url: "/HR/SalaryProperty/Audit",
          method: "post",
          params: {
            F_ProType: this.form.typeId,
            F_Year: (this.form.yearMonth || "").split("-")[0],
            F_Month: (this.form.yearMonth || "").split("-")[1]
          }
        });

        this.closeSelf();
        this.$emit("ok");
      } finally {
        this.ui.okLoading = false;
      }
    },
    async getPerformanceType() {
      let resData = await queryDictionaryDetailByCode("jxlx");
      this.performanceTypeList = resData.data;
    }
  },
  created() {}
};
</script>
