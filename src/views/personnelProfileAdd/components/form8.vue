<!-- 训练档案 -->

<template>
  <div>
    <el-table border :data="form.trainingInfo" style="width: 100%">
      <el-table-column show-overflow-tooltip label="日期">
        <template v-slot="scope">
          <el-date-picker
            v-model="scope.row.f_Data"
            type="date"
            placeholder="选择日期"
            style="width:100%"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="考核项目">
        <template v-slot="scope">
          <el-select
            style="width:100%"
            v-model="scope.row.f_ExamineItem"
            placeholder="请选择"
            value-key="F_ItemDetailId"
          >
            <el-option
              v-for="(item, index) in dictionaryData.khxm"
              :key="index"
              :label="item.F_ItemName"
              :value="item"
            >
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="成绩">
        <template v-slot="scope">
          <el-input v-model="scope.row.f_Result"></el-input>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="评定">
        <template v-slot="scope">
          <el-select
            style="width:100%"
            v-model="scope.row.f_Rate"
            placeholder="请选择"
            value-key="F_ItemDetailId"
          >
            <el-option
              v-for="(item, index) in dictionaryData.pd"
              :key="index"
              :label="item.F_ItemName"
              :value="item"
            >
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="right" v-if="!preview">
        <template v-slot:header>
          <el-button @click="onAdd" size="mini" icon="el-icon-plus"></el-button>
        </template>
        <template v-slot:default="scope">
          <el-button
            @click="onRemove(scope)"
            type="danger"
            icon="el-icon-delete"
            size="mini"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    pform: {},
    preview: {
      type: Boolean,
      default: false
    },
    dictionaryData: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  computed: {
    form: {
      get() {
        return this.pform;
      },
      set(n) {
        this.$emit("update:pform", n);
      }
    }
  },
  data() {
    return {
      date: null
    };
  },
  methods: {
    onAdd() {
      this.form.trainingInfo.push({
        f_Data: "",
        f_ExamineItem: {},
        f_Result: "",
        f_Rate: {}
      });
    },
    onRemove(scope) {
      this.form.trainingInfo.splice(scope.$index, 1);
    }
  }
};
</script>
