<template>
	<el-table :data="list" border @selection-change = "select" @row-click="rowClick" height="100%" @sort-change="sort" :tree-props="{children: 'Child'}" row-key="Id">
		<el-table-column type="selection"></el-table-column>
		<el-table-column type="index" label="序号"></el-table-column>
		
		<el-table-column prop="CategoryName" label="分类名称"></el-table-column>
		<el-table-column prop="SortId" label="排序"></el-table-column>
		<el-table-column prop="Id" label="ID"></el-table-column>
		<el-table-column prop="IsDisabled" label="启用/禁用">
			<template slot-scope="scope">
				<el-switch
				  v-model="scope.row.IsDisabled"
				  active-color="#409eff"
				  inactive-color="#c4c4c4"
				  :active-value="false"
				  :inactive-value="true"
				  @click.stop.native
				  @change="onChange($event, scope.row)"
				>
				</el-switch>
			</template>
		</el-table-column>
	</el-table>
</template>

<script>
	export default{
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
			    url: "/Print/PrintModel/TypeChange",
			    method: "post",
			    data: b
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
