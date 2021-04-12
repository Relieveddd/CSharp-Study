<template>
  <div>
    <el-table border :data="form.jobList" style="width: 100%">
      <el-table-column show-overflow-tooltip label="起止日期">
        <template v-slot="scope">
          <el-date-picker
            v-model="scope.row.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width:100%"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="单位名称">
        <template v-slot="scope">
          <el-input v-model="scope.row.f_Company"></el-input>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="职务">
        <template v-slot="scope">
          <el-input v-model="scope.row.f_JobName"></el-input>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="绩效成就">
        <template v-slot="scope">
          <el-input v-model="scope.row.f_Achievement"></el-input>
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
      this.form.jobList.push({
        dateRange: [],
        f_Company: "",
        f_JobName: "",
        f_Achievement: ""
      });
    },
    onRemove(scope) {
      this.form.jobList.splice(scope.$index, 1);
    }
  }
};
</script>
