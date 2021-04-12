<template>
  <div>
    <el-table border :data="form.resumeList" style="width: 100%">
      <el-table-column show-overflow-tooltip label="部门">
        <template v-slot="scope">
          <el-cascader
            style="width:100%"
            v-model="scope.row.f_DepId"
            :options="departmentTree"
            :props="{
              emitPath: false,
              multiple: false,
              checkStrictly: true,
              value: 'F_DepId',
              label: 'F_DepName',
              children: 'Child',
              expandTrigger: 'hover'
            }"
          ></el-cascader>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="岗位">
        <template v-slot="scope">
          <el-select
            style="width:100%"
            v-model="scope.row.f_PostId"
            placeholder="请选择"
            value-key="F_PostId"
          >
            <el-option
              v-for="(item, index) in jobList"
              :key="index"
              :label="item.F_PostName"
              :value="item.F_PostId"
            >
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="职务">
        <template v-slot="scope">
          <el-select
            style="width:100%"
            v-model="scope.row.f_JobId"
            placeholder="请选择"
            value-key="F_JobId"
          >
            <el-option
              v-for="(item, index) in positionList"
              :key="index"
              :label="item.F_JobName"
              :value="item.F_JobId"
            >
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="日期" min-width="150px">
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
      <el-table-column show-overflow-tooltip label="备注">
        <template v-slot="scope">
          <el-input v-model="scope.row.f_ReMark"></el-input>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="级别">
        <template v-slot="scope">
          <el-select
            style="width:100%"
            v-model="scope.row.f_JobLevelId"
            placeholder="请选择"
            value-key="F_ItemDetailId"
          >
            <el-option
              v-for="(item, index) in dictionaryData.dj"
              :key="index"
              :label="item.F_ItemName"
              :value="item"
            >
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="荣誉">
        <template v-slot="scope">
          <el-select
            style="width:100%"
            v-model="scope.row.f_HonorId"
            placeholder="请选择"
            value-key="F_ItemDetailId"
          >
            <el-option
              v-for="(item, index) in dictionaryData.ry"
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
      <el-table-column
        show-overflow-tooltip
        align="right"
        v-if="!preview"
        width="60px"
      >
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
    departmentList: {
      type: Array,
      default() {
        return [];
      }
    },
    departmentTree: {
      type: Array,
      default() {
        return [];
      }
    },
    positionList: {
      type: Array,
      default() {
        return [];
      }
    },
    jobList: {
      type: Array,
      default() {
        return [];
      }
    },
    roleList: {
      type: Array,
      default() {
        return [];
      }
    },
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
  data() {
    return {};
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
      this.form.resumeList.push({
        f_DepId: "",
        f_JobId: "",
        f_PostId: "",
        f_RecordDate: "",
        f_RecordType: "",
        f_ReMark: "",
        dateRange: [],
        f_JobLevelId: {},
        f_HonorId: {},
        fileList: []
      });
    },
    onRemove(scope) {
      this.form.resumeList.splice(scope.$index, 1);
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
