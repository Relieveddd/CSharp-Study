<template>
	<el-table :data="list" v-loading = "loading" border>
		<el-table-column type="index" label="序号"></el-table-column>
		<el-table-column label="产品代码" prop="ItemCode"></el-table-column>
		<el-table-column label="产品名称" prop="ItemName"></el-table-column>
		<el-table-column label="产品型号" prop="ItemModel"></el-table-column>
		<el-table-column label="计量单位" prop="Unit"></el-table-column>
		<el-table-column label="销售单价" prop="Price"></el-table-column>
		<el-table-column label="数量" prop="Num"></el-table-column>
		<el-table-column label="金额" prop="Amount"></el-table-column>
		<el-table-column label="产品NO" prop="ItemNo"></el-table-column>
		<el-table-column label="订购时间" prop="OrderDate"></el-table-column>
		<el-table-column label="备注" prop="Remark"></el-table-column>
	</el-table>
</template>
<script>
	export default{
		name: "detailTable",
		props: {
			orderId: {
				type: String,
				default: ""
			}
		},
		data() {
			return {
				pageSize: 99999,
				pageIndex: 1,
				list: [],
				loading: false
			}
		},
		watch:{
			orderId(id) {
				if(id) {
					this.getList()
				}
			}
		},
		methods:{
			async getList() {
				this.loading = true
				let res = await this.$_request({
					url: "/map/Order/DetailList",
					method: "post",
					data: {
						orderId: this.orderId,
						pageSize: this.pageSize,
						pageIndex: this.pageIndex
					}
				})
				this.list = res.data.data
				this.loading = false
			}
		},
		mounted() {
			this.getList()
		}
	}
</script>

<style>
</style>
