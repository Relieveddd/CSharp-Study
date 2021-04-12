<template>
  <div>
    <el-table border :data="form.healthList" style="width: 100%">
      <el-table-column show-overflow-tooltip label="体检日期">
        <template v-slot="scope">
          <el-date-picker
            v-model="scope.row.f_TJDate"
            type="date"
            placeholder="选择日期"
            style="width:100%"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="医院">
        <template v-slot="scope">
          <el-input v-model="scope.row.f_Hospital"></el-input>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="体检项目">
        <template v-slot="scope">
          <el-input v-model="scope.row.f_TJProject"></el-input>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="结果">
        <template v-slot="scope">
          <el-input v-model="scope.row.f_Result"></el-input>
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
  methods: {
    onAdd() {
      this.form.healthList.push({
        f_TJDate: "",
        f_Hospital: "",
        f_TJProject: "",
        f_Result: ""
      });
    },
    onRemove(scope) {
      this.form.healthList.splice(scope.$index, 1);
    }
  }
};
</script>
