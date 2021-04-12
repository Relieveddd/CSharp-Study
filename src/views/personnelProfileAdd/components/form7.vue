<template>
  <div>
    <el-table border :data="form.educationList" style="width: 100%">
      <el-table-column show-overflow-tooltip label="起止日期" min-width="150px">
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
      <el-table-column show-overflow-tooltip label="学校">
        <template v-slot="scope">
          <el-input v-model="scope.row.f_School"></el-input>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="学历">
        <template v-slot="scope">
          <el-select
            style="width:100%"
            v-model="scope.row.f_Education"
            placeholder="请选择"
            value-key="F_ItemDetailId"
          >
            <el-option
              v-for="(item, index) in dictionaryData.whcd"
              :key="index"
              :label="item.F_ItemName"
              :value="item"
            >
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="专业">
        <template v-slot="scope">
          <el-input v-model="scope.row.f_Major"></el-input>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="证明人">
        <template v-slot="scope">
          <el-input v-model="scope.row.f_Witness"></el-input>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="荣誉成就">
        <template v-slot="scope">
          <el-input v-model="scope.row.f_Achievement"></el-input>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="证书">
        <template v-slot="scope">
          <el-select
            style="width:100%"
            v-model="scope.row.f_Certificate"
            placeholder="请选择"
            value-key="F_ItemDetailId"
          >
            <el-option
              v-for="(item, index) in dictionaryData.zs"
              :key="index"
              :label="item.F_ItemName"
              :value="item"
            >
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="附件" width="180px">
        <template v-slot="scope">
          <el-upload
            :action="uploadAction"
            multiple
            :on-success="onUploadSuccess(scope.row)"
            :on-remove="onUploadRemove(scope.row)"
            :file-list="scope.row.fileList"
            :show-file-list="true"
          >
            <el-button size="mini">上传附件</el-button>
          </el-upload>
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
    },
    uploadAction() {
      return `${process.env.VUE_APP_API_BASEURL || ""}/Base/Base/UploadFile`;
    }
  },
  methods: {
    onAdd() {
      this.form.educationList.push({
        dateRange: [],
        f_School: "",
        f_Education: {
          F_ItemDetailId: ""
        },
        f_Major: "",
        f_Witness: "",
        f_Achievement: "",
        f_Certificate: {
          F_ItemDetailId: ""
        },
        fileList: []
      });
    },
    onRemove(scope) {
      this.form.educationList.splice(scope.$index, 1);
    },
    onUploadSuccess(row) {
      return function(response, file, fileList) {
        row.fileList = fileList;
      };
    },
    onUploadRemove(row) {
      return function(file, fileList) {
        row.fileList = fileList;
      };
    }
  }
};
</script>
