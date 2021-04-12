<!-- 数据字典 -->

<template>
  <div :class="$style['wrap']" v-loading="ui.loading">
    <div :class="$style['tree']">
      <div :class="$style['title']">字典分类</div>
      <el-tree :data="treeData" :props="{ label: 'ItemName' }" @node-click="onNodeClick">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span v-if="node.label">{{ node.label }}</span>
          <span v-else-if="data.code">{{
            dictionaryCodeHash[data.code]
              ? dictionaryCodeHash[data.code].ItemName
              : "(未找到)"
          }}</span>
        </span>
      </el-tree>
    </div>
    <mm-atp :class="$style['atp']">
      <template v-slot:action-left>
        当前字典：{{ currentDictionary && currentDictionary.ItemName}}
      </template>
      <template v-slot:action-right>
				<el-button type="primary" @click="onAddZd" v-if="checkButton('add')"
					>新增字典</el-button>
				<el-button type="primary" @click="onAddZd('edit')" v-if="checkButton('add')"
					>修改字典</el-button>
				<el-button type="primary" @click="onAdd" v-if="checkButton('add')"
					>新增字典明细</el-button>
        <el-button
          :disabled="disabledEdit"
          @click="onEdit"
          v-if="checkButton('edit')"
          >修改</el-button
        >
				<el-button @click="removeZd" v-if="checkButton('add')"
					>删除字典</el-button>
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
					row-key="F_ItemDetailId"
          @selection-change="onSelectionChange"
          v-loading="ui.tableLoading"
					:tree-props="{children: 'Child'}"
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
          <el-table-column show-overflow-tooltip prop="ItemName" label="名称">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ItemValue"
            label="编号"
          >
          </el-table-column>
					<el-table-column
					  show-overflow-tooltip
					  prop="Remark"
					  label="备注"
					>
					</el-table-column>
        </el-table>
      </template>
      <template v-slot:pagination>
				<bottom :style="{height: 103 + bottomHeight + 'px'}" :record = "record" @pageIndexChange = "pageIndexChange"></bottom>
			</template>
      <template v-slot:other>
        <c-add
          :visible.sync="ui.add"
          ref="form"
          :formType="formType"
					:details = "tableData"
          :currentDictionary="currentDictionary"
          @update="getList"
        ></c-add>
				<!-- //新增字典 -->
				<el-dialog :visible.sync="ui.dialog" @closed="onReset">
				  <el-form label-width="6em">
				    <!-- <el-form-item label="父集字典">
							<el-select
							  placeholder="请选择"
							  clearable
							  v-model="form.f_ParentId"
							  style="width:100%"
							>
							  <el-option label="无" value=""> </el-option>
							  <el-option
							    v-for="(item, index) in menuFlat"
							    :key="index"
							    :label="item.ItemName"
							    :value="item.Id"
							  >
							  </el-option>
							</el-select>
				    </el-form-item> -->
				    <el-form-item label="编号" required>
				      <el-input v-model="form.ItemCode"></el-input>
				    </el-form-item>
				    <el-form-item label="名称" required>
				      <el-input v-model="form.ItemName"></el-input>
				    </el-form-item>
						<el-form-item label="排序">
						  <el-input-number
						    v-model="form.SortId"
						    :step="1"
						    :min="0"
						  ></el-input-number>
						</el-form-item>
						<el-form-item label="是否可用">
						  <el-radio-group v-model="form.enabled">
						    <el-radio :label="1">是</el-radio>
						    <el-radio :label="0">否</el-radio>
						  </el-radio-group>
						</el-form-item>
				    <el-form-item>
				      <el-button @click="onOk">确认</el-button>
				    </el-form-item>
				  </el-form>
				</el-dialog>
      </template>
    </mm-atp>
  </div>
</template>

<script>
import CAdd from "./components/add";
import checkPermission from "@/utils/checkPermission";
import bottom from "./components/bottom.vue"
import { fromPairs as fromEntries } from "lodash";
const form = () => {
	return {
		"Id": "",
		"F_ComId": "",
		"ItemCode": "",
		"ItemName": "",
		"Enabled": 0,
		"SortId": 0
	}
}
export default {
  name: "dictionary",
  mixins: [checkPermission],
  components: {
    CAdd,
		bottom
  },
  data() {
    return {
      currentDictionary: null,
      treeData: [],
			record: 0,
			bottomHeight:-60,
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
        loading: false,
				dialog: false
      },
      dictionaryCodeHash: null,
      abortController: null,
			form: form(),
			menuTree: [],
    };
  },
  computed: {
    disabledEdit() {
      return this.tableSelectionData.length === 1 ? false : true;
    },
    disabledRemove() {
      return this.tableSelectionData.length > 0 ? false : true;
    },
		menuFlat() {
		  let result = [];
		
		  const treeflat = function(list) {
		    list.forEach(x => {
		      result.push(x);
		
		      if (x.Child && x.Child.length) {
		        treeflat(x.Child);
		      }
		    });
		  };
		
		  treeflat(this.menuTree);
		  return result;
		}
  },
  methods: {
		pageIndexChange(e){
			this.pageIndex = e
			this.getList()
		},
    onNodeClick(data) {
      if (data.ItemCode) {
				this.currentDictionary = data;
        this.getList();
      }
    },
    onSelectionChange(val) {
      this.tableSelectionData = val;
    },
		//新增字典
		onAddZd(e) {
			if(e == 'edit') {
				this.form = this.currentDictionary
			}
			
			this.ui.dialog = true
		},
		//删除字典
		async removeZd() {
			if (!this.currentDictionary){
				return this.$message({
					type: "warning",
					message: "请选择字典"
				})
			} 
			let res = await this.$_request({
				url: "/sc/DataItem/Del",
				method: "post",
				params: {
					ids: this.currentDictionary.Id
				}
			})
			this.$message({
			  message: "成功",
			  type: "success"
			});
			this.getDictionaryCodeHash();
		},
		onReset() {
			
		},
		async onOk() {
			await this.$_request({
			  url: "/sc/DataItem/Change",
			  method: "post",
			  data: this.form
			});
			
			this.getDictionaryCodeHash();
			this.$message({
			  message: "成功",
			  type: "success"
			});
			this.ui.dialog = false;
		},
    onAdd() {
			if (!this.currentDictionary){
				return this.$message({
					type: "warning",
					message: "请选择字典"
				})
			} 
      this.formType = "add";
      this.ui.add = true;
    },
    onEdit() {
      let row = this.tableSelectionData[0];
			console.log(row)
      Object.assign(this.$refs.form.form, {
        id: row.Id || "",
        itemId: row.ItemId || "",
        itemName: row.ItemName || "",
        itemValue: row.ItemValue || "",
        sortId: row.SortId || 0,
        enable: row.Enable || 1,
				remark: row.Remark
      });

      this.formType = "edit";
      this.ui.add = true;
    },
    async onRemove() {
      let rowList = this.tableSelectionData.map(x => x.Id);
      await this.$_request({
        url: "/sc/DataItemDetail/Del",
        method: "post",
        data: rowList
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
        let code = this.currentDictionary.Id;
				console.log(code)
				let res = await this.$_request({
				  url: "/sc/DataItemDetail/List",
				  method: "post",
				  data:{
						pageIndex: 1,
						pageSize: 20,
						queryJson: JSON.stringify({itemId: code}),
						queryJson_S: "",
						orderJson: ""
					}
				});
				if(res.data.code === 200) {
					this.loading = false
					this.record = res.data.record
					this.tableData = res.data.data
				}
				// this.tableData = res.data.data;
     //    let res = await this.$_request({
     //      url: "/WF/DataItemDetail/List",
     //      method: "POST",
     //      data:{
					// 	pageIndex: 1,
					// 	pageSize: 20,
					// 	queryJson: JSON.stringify({Id: code}),
					// 	queryJson_S: "",
					// 	orderJson: ""
					// }
     //    });

        this.tableData = res.data.data;
      } finally {
        this.ui.loading = false;
      }
    },
    async getDictionaryCodeHash() {
      let res = await this.$_request({
        url: "/sc/DataItem/List",
        method: "post",
        data: {
          pageIndex: 1,
          pageSize: 9999
        }
      });
			this.treeData = res.data.data
			this.menuTree = res.data.data;
      this.dictionaryCodeHash = fromEntries(
        res.data.data
          .filter(x => {
            return x.ItemCode && x.Id;
          })
          .map(x => {
            return [x.ItemCode, x];
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
