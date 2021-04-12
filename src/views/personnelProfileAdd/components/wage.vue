<!-- 薪酬记录 -->

<template>
  <mm-atp palign="right">
    <template v-slot:table>
      <el-table border :data="tableData">
        <el-table-column
          show-overflow-tooltip
          type="index"
          label="序号"
        ></el-table-column>
        <el-table-column show-overflow-tooltip label="时间">
          <template v-slot="scope">
            {{ scope.row.F_Year }} - {{ scope.row.F_Month }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="F_YFGZ" label="应发工资">
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="F_GJJ" label="公积金">
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="F_GS" label="个税">
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="F_SF" label="实发工资">
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
      <el-dialog
        title="明细"
        :visible.sync="ui.detail"
        @closed="onClosed"
        @open="onOpen"
        :fullscreen="true"
      >
        <el-table
          border
          height="100%"
          :data="detailTableData"
          size="mini"
          v-loading="ui.detailLoading"
        >
          <template v-for="(v, k) in detailTableHeaderTree">
            <el-table-column
              :key="k"
              v-if="v.list.length"
              :label="v.title"
              align="center"
            >
              <el-table-column
                v-for="(item, index) in v.list"
                :key="index"
                :label="item.f_title"
                align="center"
              >
                <template v-slot="scope">
                  <template>
                    {{ scope.row[item.f_columnId] }}
                  </template>
                </template>
              </el-table-column>
            </el-table-column>
          </template>
        </el-table>
        <span slot="footer">
          <el-button @click="ui.detail = false" :disabled="false" type="primary"
            >关闭
          </el-button>
        </span>
      </el-dialog>
    </template>
  </mm-atp>
</template>

<script>
let data_tableHeaderTree = function() {
  return {
    1: {
      title: "个人信息",
      list: []
    },
    2: {
      title: "应发",
      list: []
    },
    3: {
      title: "扣发",
      list: []
    },
    4: {
      title: "社保",
      list: []
    },
    5: {
      title: "个税",
      list: []
    },
    6: {
      title: "实发",
      list: []
    },
    other: {
      title: "其他",
      list: []
    }
  };
};

export default {
  props: {
    id: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      tableData: [],
      pagination: {
        current: 1,
        total: 1,
        size: 20
      },
      detailTableHeaderTree: data_tableHeaderTree(),
      detailTableData: [],
      ui: {
        detail: false,
        detailLoading: false
      }
    };
  },
  watch: {
    id(n) {
      if (n) {
        this.getList();
      }
    }
  },
  methods: {
    async getList() {
      let res = await this.$_request({
        url: "/HR/SalarySlip/EmpSalaryList",
        method: "post",
        data: {
          queryJson_S: "",
          queryJson: JSON.stringify({
            f_EmpId: this.id
          }),
          orderJson: "",
          pageIndex: this.pagination.current,
          pageSize: this.pagination.size
        }
      });

      this.tableData = res.data.data;
      this.pagination.total = res.data.record || 1;
    },
    async onDetail(row) {
      this.ui.detailLoading = true;

      let res = await this.$_request({
        url: "/HR/SalarySlip/EmpReport",
        method: "get",
        params: {
          id: row.F_Id
        }
      });

      let resData = res.data.data;

      resData.F_GridHead.forEach(x => {
        this.detailTableHeaderTree[x.f_coltype || "other"].list.push(x);
      });

      this.detailTableData = resData.F_RowsData
        ? resData.F_RowsData.map(x => {
            return JSON.parse(x.F_SalaryJson);
          })
        : [];

      this.ui.detailLoading = false;
    },
    onClosed() {},
    onOpen() {}
  },
  created() {
    this.getList();
  }
};
</script>
