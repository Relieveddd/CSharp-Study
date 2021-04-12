<template>
  <div>
    <el-table border :data="form.familyList" style="width: 100%">
      <el-table-column show-overflow-tooltip label="家庭关系">
        <template v-slot="scope">
          <el-input v-model="scope.row.f_Relation"></el-input>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="姓名">
        <template v-slot="scope">
          <el-input v-model="scope.row.f_Name"></el-input>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="手机号">
        <template v-slot="scope">
          <el-input v-model="scope.row.f_Tel"></el-input>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="工作单位">
        <template v-slot="scope">
          <el-input v-model="scope.row.f_WorkCompany"></el-input>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="right" v-if="!preview">
        <template v-slot:header>
          <el-button @click="onAdd" icon="el-icon-plus" size="mini"></el-button>
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
      this.form.familyList.push({
        f_Relation: "",
        f_Name: "",
        f_Tel: "",
        f_WorkCompany: ""
      });
    },
    onRemove(scope) {
      this.form.familyList.splice(scope.$index, 1);
    }
  }
};
</script>
