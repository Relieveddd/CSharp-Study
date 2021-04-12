<template>
	<el-table :data="list" border @selection-change = "select">
		<el-table-column type="selection"></el-table-column>
		<el-table-column type="index" label="序号"></el-table-column>
		<el-table-column prop="Name" label="属性名称" show-overflow-tooltip></el-table-column>
		<el-table-column prop="Code" label="属性代码" show-overflow-tooltip></el-table-column>
		<el-table-column prop="Value" label="属性值" show-overflow-tooltip></el-table-column>
		<el-table-column prop="IsSpec" label="是否为规格" show-overflow-tooltip>
			<template slot-scope="scope">
				{{scope.row.IsSpec ? '是' : "否"}}
			</template>
		</el-table-column>
		<el-table-column prop="Sort" label="排序" show-overflow-tooltip></el-table-column>
		<el-table-column prop="State" label="状态" show-overflow-tooltip>
			<template slot-scope="scope">
				<span :style="'margin-right: 10px;'
				+(scope.row.State == 1 ? 'color: #00a0e9;' : 'color: #b7b7b7;')">
					{{scope.row.State == 1 ? '启用' : '禁用'}}
				</span>
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
				
			}
		},
		methods:{
			select(e) {
				this.$emit('selectData',e)
			}
		}
	}
</script>

<style>
</style>
