<template>
	<el-table :data="list" border @selection-change = "select" @row-click="rowClick" height="100%" @sort-change="sort">
		<el-table-column type="selection"></el-table-column>
		<el-table-column type="index" label="序号"></el-table-column>
		<el-table-column prop="ProductName"   label="产品名称" ></el-table-column>
		<el-table-column prop="NickName"    label="产品别称" ></el-table-column>
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
			}
		}
	}
</script>

<style>
</style>
