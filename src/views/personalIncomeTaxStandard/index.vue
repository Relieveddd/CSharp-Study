<!-- 个税缴纳标准 -->

<template>
  <mm-atp palign="right">
    <template v-slot:action-left v-if="false">
      <el-date-picker
        v-model="query.year"
        value-format="yyyy"
        type="year"
        placeholder="选择年"
        :clearable="false"
        :class="$style['date']"
      >
      </el-date-picker>
      <el-select
        v-model="query.month"
        placeholder="选择月"
        :clearable="true"
        :class="$style['date']"
      >
        <template v-slot:prefix>
          <span class="el-input__prefix"
            ><i class="el-input__icon el-icon-date"></i
          ></span>
        </template>
        <el-option
          v-for="(item, index) in monthList"
          :key="index"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </template>
    <template v-slot:action-right>
      <el-button @click="onAdd" type="primary" v-if="checkButton('add')"
        >新增</el-button
      >
      <el-button @click="onEdit" v-if="checkButton('edit')">修改</el-button>
      <el-popover placement="bottom" v-model="ui.remove">
        <el-button
          slot="reference"
          :disabled="disabledRemove"
          v-if="checkButton('remove')"
          >删除</el-button
        >
        <p>确定要删除吗？</p>
        <div style="text-align: right;">
          <el-button
            size="mini"
            type="danger"
            :disabled="disabledRemove"
            @click="onRemove"
            :loading="ui.removeLoading"
            >确定</el-button
          >
        </div>
      </el-popover>
    </template>
    <template v-slot:table>
      <el-table
        border
        height="100%"
        :data="tableData"
        @selection-change="onSelectionChange"
        v-loading="ui.tableLoading"
      >
        <el-table-column show-overflow-tooltip type="selection">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          type="index"
          label="序号"
        ></el-table-column>
        <el-table-column show-overflow-tooltip prop="F_Operation" label="条件">
          <template slot-scope="scope">
            {{ scope.row.F_Operation === 0 ? "不超过" : "超过" }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="F_MinValue" label="金额">
          <template slot-scope="scope">
            {{
              scope.row.F_MaxValue
                ? `${scope.row.F_MinValue}至${scope.row.F_MaxValue}`
                : `${scope.row.F_MinValue}`
            }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="F_Tax" label="税率%">
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="F_Fast" label="速算扣除数">
        </el-table-column>
      </el-table>
    </template>
    <template v-slot:pagination>
      <el-pagination
        background
        layout="prev, pager, next,jumper"
        :page-size.sync="pagination.size"
        :current-page.sync="pagination.current"
        :total.sync="pagination.total"
        @current-change="getList"
      ></el-pagination>
    </template>
    <template v-slot:other>
      <c-add
        :visible.sync="ui.add"
        ref="form"
        :formType="formType"
        @update="getList"
      ></c-add>
    </template>
  </mm-atp>
</template>

<script>
import checkPermission from "@/utils/checkPermission";
import CAdd from "./components/add";

export default {
  name: "personalIncomeTaxStandard",
  components: {
    CAdd
  },
  mixins: [checkPermission],
  data() {
    return {
      form: {},
      formType: "add",
      query: {
        year: "",
        month: ""
      },
      tableData: [],
      tableSelectionData: [],
      pagination: {
        current: 1,
        total: 1,
        size: 20
      },
      ui: {
        add: false,
        remove: false,
        tableLoading: false,
        removeLoading: false
      }
    };
  },
  computed: {
    monthList() {
      let array = [];

      for (let index = 1; index <= 12; index++) {
        array.push({
          label: `${index}月`,
          value: `${index}`.padStart(2, 0)
        });
      }

      return array;
    },
    disabledEdit() {
      return this.tableSelectionData.length === 1 ? false : true;
    },
    disabledRemove() {
      return this.tableSelectionData.length > 0 ? false : true;
    }
  },
  watch: {
    query() {
      this.getList();
    }
  },
  methods: {
    async getList() {
      this.ui.tableLoading = true;

      try {
        let res = await this.$_request({
          url: "/HR/PersTax/List",
          method: "post",
          data: {
            queryJson_S: "",
            queryJson: "",
            orderJson: "",
            pageIndex: this.pagination.current,
            pageSize: this.pagination.size
          }
        });

        this.tableData = res.data.data;
      } finally {
        this.ui.tableLoading = false;
      }
    },
    onAdd() {
      this.formType = "add";
      this.ui.add = true;
    },
    onEdit() {
      this.$refs.form.tableData = this.tableData.map(x => {
        return {
          id: x.F_Id,
          operator1: x.F_Operation,
          value1: x.F_MinValue,
          value2: x.F_MaxValue,
          tariff: x.F_Tax,
          deduction: x.F_Fast
        };
      });

      this.formType = "edit";
      this.ui.add = true;
    },
    async onRemove() {
      this.ui.removeLoading = true;

      try {
        await this.$_request({
          url: "/HR/PersTax/Del",
          method: "post",
          params: {
            ids: this.tableSelectionData.map(x => x.F_Id).join()
          }
        });

        this.ui.remove = false;
        this.getList();
      } finally {
        this.ui.removeLoading = false;
      }
    },
    onSelectionChange(val) {
      this.tableSelectionData = val;
    }
  },
  created() {
    this.getList();
  }
};
</script>

<style lang="scss" module>
.label {
  font-weight: bold;
  font-size: 14px;
}
.date {
  width: 150px !important;
}
</style>
