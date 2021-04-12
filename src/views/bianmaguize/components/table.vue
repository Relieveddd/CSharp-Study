<template>
	<el-table :data="list" border @selection-change = "select">
		<el-table-column type="selection"></el-table-column>
		<el-table-column type="index" label="序号"></el-table-column>
		<el-table-column prop="FullName" label="名称" show-overflow-tooltip></el-table-column>
		<el-table-column prop="Code" label="代码" show-overflow-tooltip></el-table-column>
		<el-table-column prop="ModuleName" label="系统功能" show-overflow-tooltip></el-table-column>
		<el-table-column prop="ProductTypeName" label="产品类别" show-overflow-tooltip></el-table-column>
		<!-- <el-table-column prop="Mode" label="方式" show-overflow-tooltip>
			<template slot-scope="scope">
				{{scope.row.Mode == 1 ? '人工+自动' : ''}}
				{{scope.row.Mode == 2 ? '人工' : ''}}
				{{scope.row.Mode == 3 ? '自动' : ''}}
			</template>
		</el-table-column> -->
		<el-table-column width="800" prop="SortCode" label="规则格式" show-overflow-tooltip>
			<template slot-scope="scope">
				<el-table border :data="JSON.parse(scope.row.RuleFormatJson)">
					<el-table-column width="120" prop="ItemTypeName" label="前缀"></el-table-column>
					<el-table-column prop="FormatStr" label="格式"></el-table-column>
					<el-table-column label="步长" prop="StepValue"></el-table-column>
					<el-table-column label="初始值" prop="InitValue"></el-table-column>
					<el-table-column label="说明" prop="Description"></el-table-column>
				</el-table>
			</template>
		</el-table-column>
		<el-table-column prop="CurrentNumber" label="当前流水号" show-overflow-tooltip></el-table-column>
		<el-table-column prop="SortCode" label="排序值" show-overflow-tooltip></el-table-column>
		<el-table-column prop="Enable" label="启用/禁用" show-overflow-tooltip>
			<template slot-scope="scope">
				<el-switch
				  v-model="scope.row.EnabledMark"
					@change="changeState($event, scope.row)"
				  active-color="#13ce66"
				  inactive-color="#b7b7b7"
					:active-value="1"
					:inactive-value="0">
				</el-switch>
				<span :style="'margin-right: 10px;'
				+(scope.row.EnabledMark == 1 ? 'color: #00a0e9;' : 'color: #b7b7b7;')">
					<!-- {{scope.row.EnabledMark == 1 ? '启用' : '禁用'}} -->
				</span>
			</template>
		</el-table-column>
<!-- 		<el-table-column prop="enabledMark" label="是否有效" show-overflow-tooltip>
			<template slot-scope="scope">
					{{scope.row.EnabledMark == 1 ? '有效' : '无效'}}
				</template>
		</el-table-column> -->
		<el-table-column prop="Description" label="备注" show-overflow-tooltip></el-table-column>
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
			},
			async changeState(e,row) {
				console.log(e,11)
				if(e == 1) {
					//启用
					let res = await this.$_request({
						url: '/corl/CodeRule/Enable',
						method: 'post',
						data: [row.Id]
					})
				}else{
					let res = await this.$_request({
						url: '/corl/CodeRule/Disable',
						method: 'post',
						data: [row.Id]
					})
				}
				
				this.$message({
					type: 'success',
					message: '操作成功'
				})
			}
		}
	}
</script>

<style>
</style>
