<template>
	<mm-atp palign="right" v-loading="ui.loading">
	  <template v-slot:action-left>
	    <el-input
	      placeholder="关键词搜索"
	      v-model="keyword"
	      @keyup.enter.native="tableFilter"
	    >
	      <el-button
	        slot="append"
	        icon="el-icon-search"
	        @click="tableFilter"
	      ></el-button>
	    </el-input>
	  </template>
	  <template v-slot:action-right>
	    <el-button
	      :disabled="disabledEdit"
	      @click="onPermission(1)"
	      >PC授权</el-button
	    >
	    <el-button
	      :disabled="disabledEdit"
	      @click="onPermission(3)"
	      >小程序授权</el-button
	    >
	  </template>
	  <template v-slot:table>
	    <el-table
	      border
	      height="100%"
	      :data="companyList"
	      ref="table"
	      size="small"
				@selection-change="onSelectionChange"
	    >
				<el-table-column type="selection"></el-table-column>
	      <el-table-column
	        show-overflow-tooltip
	        type="index"
	        label="序号"
	      ></el-table-column>
				<el-table-column
				  show-overflow-tooltip
				  prop="F_ComNo"
				  label="公司编号"
				></el-table-column>
	      <el-table-column
	        show-overflow-tooltip
	        prop="F_Name"
	        label="名称"
	      ></el-table-column>
	      <el-table-column show-overflow-tooltip prop="F_Address" label="地址">
	      </el-table-column>
	      <el-table-column show-overflow-tooltip prop="F_Contact" label="联系人">
	      </el-table-column>
	      <el-table-column
	        show-overflow-tooltip
	        prop="F_Tel"
	        label="联系电话"
	      >
	      </el-table-column>
				<el-table-column show-overflow-tooltip prop="F_CreateDate" label="创建日期"></el-table-column>
				<el-table-column show-overflow-tooltip prop="F_CompanyCode" label="公司码"></el-table-column>
				<el-table-column show-overflow-tooltip prop="F_Remark" label="备注"></el-table-column>
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
		  <c-permission
		    :visible.sync="ui.permission"
		    :id="(currentRow && currentRow.F_OrgGuid) || ''"
				:serviceId="(currentRow && currentRow.F_ServiceId) || ''"
		    :type="4"
		    :moduleType="type"
		  ></c-permission>
		</template>
	</mm-atp>
</template>

<script>
	import CPermission from "./components/permission";
	import checkPermission from "@/utils/checkPermission";
	import requestService from "@/utils/serviceCfg"
	export default{
		name: "companyList",
		mixins: [checkPermission],
		components:{
			CPermission
		},
		props:{
			f_ServiceId: {
				type: String,
				default: requestService.dt
			}
		},
		data() {
			return {
				keyword: "",
				tableSelectionData: [],
				currentRow: null,
				companyList: [],
				pagination: {
					current: 1,
					total: 1,
					size: 20,
				},
				ui: {
				  add: false,
					loading: false,
				  remove: false,
				  removeLoading: false,
				  permission: false,
				  tableLoading: false
				},
				type: 1
			}
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
			tableFilter() {
				this.getList()
			},
			async getList() {
				if(this.keyword) {
					this.pagination.current = 1
				}
				let res = await this.$_request({
					url: "/Base/Company/List",
					method: "post",
					data: {
						pageIndex: this.pagination.current,
						pageSize: this.pagination.size,
						queryJson: JSON.stringify({f_ServiceId: this.f_ServiceId}),
						queryJson_S: this.keyword ? JSON.stringify({query: this.keyword}) : ""
					}
				})
				
				this.pagination.total = res.data.record
				this.companyList = res.data.data
			},
			onPermission(type) {
			  this.currentRow = this.tableSelectionData[0];
			  this.type = type;
			  this.ui.permission = true;
			},
			onSelectionChange(val) {
				console.log(val)
			  this.tableSelectionData = val;
			},
		},
		mounted() {
			this.getList()
		}
	}
</script>

<style>
</style>
