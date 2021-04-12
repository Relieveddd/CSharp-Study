<!-- 社保标准 -->

<template>
  <mm-atp palign="right" v-loading="ui.loading">
    <template v-slot:action-left>
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
      <el-button
        @click="onEdit"
        :disabled="disabledEdit"
        v-if="checkButton('edit')"
        >修改</el-button
      >
      <el-popover
        placement="bottom"
        trigger="click"
        title="确定删除？"
        v-model="ui.remove"
      >
        <el-button
          slot="reference"
          :disabled="disabledRemove"
          v-if="checkButton('remove')"
          >删除</el-button
        >
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
        ref="table"
        :data="tableData"
        highlight-current-row
        @current-change="onTableCurrentChange"
        @selection-change="onSelectionChange"
      >
        <el-table-column show-overflow-tooltip type="selection">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          type="index"
          label="序号"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="F_Name"
          label="标准名称"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="F_Describe"
          label="备注"
        ></el-table-column>
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
    <template v-slot:bottom>
      <c-bf
        :visible.sync="ui.bf"
        @close="onClose"
        :currentRow="currentRow"
      ></c-bf>
    </template>
  </mm-atp>
</template>

<script>
import dayjs from "dayjs";
import checkPermission from "@/utils/checkPermission";
import CBf from "./components/bf";

export default {
  name: "societyInsuranceStandard",
  mixins: [checkPermission],
  components: {
    CBf
  },
  data() {
    return {
      form: {},
      formType: "add",
      query: {
        year: "",
        month: ""
      },
      tableHeaderList: [
        {
          label: "标准名称",
          prop: "f_Name"
        },
        {
          label: "日期",
          prop: ""
        },
        {
          label: "标准状态",
          prop: ""
        },
        {
          label: "日期",
          prop: ""
        }
      ],
      tableData: [],
      tableSelectionData: [],
      currentRow: null,
      pagination: {
        current: 1,
        total: 1,
        size: 20
      },
      ui: {
        add: false,
        remove: false,
        bottom: false,
        bf: false,
        loading: false,
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
    query: {
      handler: function() {
        this.getList();
      },
      deep: true
    }
  },
  methods: {
    async getList() {
      this.ui.loading = true;

      try {
        let res = await this.$_request({
          url: "/HR/InsurancePlan/List",
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
        this.ui.loading = false;
      }
    },
    onBottomClose() {
      this.$refs.table.setCurrentRow([]);
      this.ui.bottom = false;
    },
    onTableCurrentChange(currentRow) {
      if (currentRow) {
        this.currentRow = currentRow;
        this.ui.bf = true;
      }
    },
    async onAdd() {
      this.closeAddTab();
      await this.$nextTick();

      this.$router.replace({
        name: "societyInsuranceStandardAdd"
      });
    },
    async onEdit() {
      this.closeAddTab();
      await this.$nextTick();

      this.$router.replace({
        name: "societyInsuranceStandardEdit",
        query: {
          id: this.tableSelectionData[0].F_Id
        }
      });
    },
    onClose() {
      this.$refs.table.setCurrentRow([]);
    },
    closeAddTab() {
      this.$store.commit("tabView/removeTab", {
        tab: {
          name: "societyInsuranceStandardAdd"
        }
      });

      this.$store.commit("tabView/removeTab", {
        tab: {
          name: "societyInsuranceStandardEdit"
        }
      });
    },
    async onRemove() {
      this.ui.removeLoading = true;

      try {
        await this.$_request({
          url: "/HR/InsurancePlan/Del",
          method: "post",
          params: {
            ids: this.tableSelectionData.map(x => x.F_Id).join(",")
          }
        });

        this.getList();
        this.ui.remove = false;
        this.$message({
          message: "成功",
          type: "success"
        });
      } finally {
        this.ui.removeLoading = false;
      }
    },
    onSelectionChange(val) {
      this.tableSelectionData = val;
    }
  },
  created() {
    let nowDate = dayjs();

    Object.assign(this.query, {
      year: `${nowDate.year()}`,
      month: `${nowDate.month() + 1}`.padStart(2, 0)
    });

    this.$_eventBus.$on("societyInsuranceStandardAdd", this.getList);
  },
  beforeDestroy() {
    this.$_eventBus.$off("societyInsuranceStandardAdd", this.getList);
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
