<!-- 数据字典 -->

<template>
  <div :class="$style['wrap']" v-loading="ui.loading">
    <div :class="$style['tree']">
      <div :class="$style['title']">字典分类</div>
      <el-tree :data="treeData" @node-click="onNodeClick">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span v-if="node.label">{{ node.label }}</span>
          <span v-else-if="data.code">{{
            dictionaryCodeHash[data.code]
              ? dictionaryCodeHash[data.code].F_ItemName
              : "(未找到)"
          }}</span>
        </span>
      </el-tree>
    </div>
    <mm-atp :class="$style['atp']">
      <template v-slot:action-left>
        当前字典：{{ currentDictionary && currentDictionary.F_ItemName }}
      </template>
      <template v-slot:action-right>
        <el-button type="primary" @click="onAdd" v-if="checkButton('add')"
          >新增</el-button
        >
        <el-button
          :disabled="disabledEdit"
          @click="onEdit"
          v-if="checkButton('edit')"
          >修改</el-button
        >
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
          <el-table-column
            show-overflow-tooltip
            type="selection"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            type="index"
            label="序号"
          ></el-table-column>
          <el-table-column show-overflow-tooltip prop="F_ItemName" label="名称">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="F_ItemValue"
            label="编号"
          >
          </el-table-column>
        </el-table>
      </template>
      <template v-slot:pagination> </template>
      <template v-slot:other>
        <c-add
          :visible.sync="ui.add"
          ref="form"
          :formType="formType"
          :currentDictionary="currentDictionary"
          @update="getList"
        ></c-add>
      </template>
    </mm-atp>
  </div>
</template>

<script>
import CAdd from "./components/add";
import checkPermission from "@/utils/checkPermission";
import { fromPairs as fromEntries } from "lodash";

export default {
  name: "dictionary",
  mixins: [checkPermission],
  components: {
    CAdd
  },
  data() {
    return {
      currentDictionary: null,
      treeData: [
        {
          label: "分组",
          children: [
            "whcd",
            "hklx",
            "hyzk",
            "zzmm",
            "jntc",
            "dj",
            "rylb",
            "rzdd",
            "xclx",
            "sblx",
            "jxlx",
            "twjr",
            "ffzq",
            "htlx",
            "khxm",
            "pd",
            "ry",
            "fylx",
            "zs",
            "lzyy",
            "xxms",
            "syx",
            "bmxz",
            "jndj",
            "zrfw",
            "fwhtqs"
          ].map(x => {
            return {
              code: x
            };
          })
        }
      ],
      formType: "add",
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
        loading: false
      },
      dictionaryCodeHash: null,
      abortController: null
    };
  },
  computed: {
    disabledEdit() {
      return this.tableSelectionData.length === 1 ? false : true;
    },
    disabledRemove() {
      return this.tableSelectionData.length > 0 ? false : true;
    }
  },
  methods: {
    onNodeClick(data) {
      if (data.code && this.dictionaryCodeHash[data.code]) {
        this.currentDictionary = this.dictionaryCodeHash[data.code];
        this.getList();
      }
    },
    onSelectionChange(val) {
      this.tableSelectionData = val;
    },
    onAdd() {
      this.formType = "add";
      this.ui.add = true;
    },
    onEdit() {
      let row = this.tableSelectionData[0];

      Object.assign(this.$refs.form.form, {
        id: row.F_ItemDetailId || "",
        rid: row.F_ItemId || "",
        pid: row.F_ParentId || "0",
        name: row.F_ItemName || "",
        number: row.F_ItemValue || "",
        sort: row.F_SortId || 0,
        isDefault: row.F_Default || 0,
        isEnable: row.F_Enable || 1,
        remark: row.F_ReMark || ""
      });

      this.formType = "edit";
      this.ui.add = true;
    },
    async onRemove() {
      let rowList = this.tableSelectionData.map(x => x.F_ItemDetailId).join();

      await this.$_request({
        url: "/HR/DataItemDetail/Del",
        method: "post",
        params: {
          ids: rowList
        }
      });

      this.ui.remove = false;
      this.getList();
      this.$message({
        message: "成功",
        type: "success"
      });
    },
    async getList() {
      if (!this.currentDictionary) return;

      this.ui.loading = true;

      try {
        let code = this.currentDictionary.F_ItemCode;

        let res = await this.$_request({
          url: "/HR/DataItem/GetBindDetail",
          method: "get",
          params: {
            code
          }
        });

        this.tableData = res.data.data;
      } finally {
        this.ui.loading = false;
      }
    },
    async getDictionaryCodeHash() {
      let res = await this.$_request({
        url: "HR/DataItem/List",
        method: "post",
        data: {
          pageIndex: 1,
          pageSize: 9999
        }
      });

      this.dictionaryCodeHash = fromEntries(
        res.data.data
          .filter(x => {
            return x.F_ItemCode && x.F_ItemId;
          })
          .map(x => {
            return [x.F_ItemCode, x];
          })
      );
    }
  },
  async created() {
    this.ui.loading = true;
    await Promise.all([this.getDictionaryCodeHash(), this.getList()]);
    this.ui.loading = false;
  }
};
</script>

<style lang="scss" module>
.wrap {
  display: flex;
  height: 100%;
  width: 100%;
  .tree {
    $color: #d9d9d9;
    flex: none;
    margin-right: 16px;
    width: 200px;
    border: solid 1px $color;
    .title {
      border-bottom: solid 1px $color;
      padding: 8px 12px;
      font-size: 12px;
    }
  }
  .atp {
    flex: 1;
    width: 100%;
  }
}
</style>
