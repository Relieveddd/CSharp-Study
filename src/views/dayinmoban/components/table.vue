<template>
	<el-table :data="list" border @selection-change = "select" @row-click="rowClick" height="100%" @sort-change="sort">
		<el-table-column type="selection"></el-table-column>
		<el-table-column type="index" label="序号"></el-table-column>
		
		<el-table-column prop="ModelNo" label="模板编号"></el-table-column>
		<el-table-column prop="PrintModelName" label="模板名称"></el-table-column>
		<el-table-column prop="CategoryName" label="模板类别"></el-table-column>
		<el-table-column prop="FileURL" label="模板文件地址"></el-table-column>
		<el-table-column prop="IsSystem" label="是否为系统模板">
			<template slot-scope="scope">
				{{scope.row.IsSystem ? '系统模板' : '非系统模板'}}
			</template>
		</el-table-column>
		<el-table-column prop="Remark"   label="模板备注" show-overflow-tooltip></el-table-column>
	</el-table>
</template>

<script>
	import checkPermission from "@/utils/checkPermission";
	export default{
		mixins: [checkPermission],
		props:{
			list: {
				type: Array,
				default: []
			}
		},
		data() {
			return {
				sortJson: {}
			}
		},
		methods:{
			select(e) {
				this.$emit('selectData',e)
			},
			rowClick(e) {
				this.$emit('rowClick', e)
			},
			//排序
			sort(e) {
				this.sortJson = {prop: e.prop,order: e.order}
				this.$emit('orderBy', {prop: e.prop,order: e.order})
				// this.getList()
			},
			async onChange(a, b) {
			  await this.$_request({
			    url: "/HR/BankCard/UpdateState",
			    method: "post",
			    params: {
			      ids: b.F_Id,
			      F_States: a
			    }
			  });
			
			  this.$message({
			    message: "状态修改成功",
			    type: "success"
			  });
			},
		}
	}
</script>

<style>
</style>
