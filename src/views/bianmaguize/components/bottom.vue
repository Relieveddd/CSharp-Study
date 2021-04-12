<template>
	<div style="overflow: hidden;">
		<div style="float: right;">
			<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page.sync="pageIndex"
				:page-size="pageSize"
				background
				layout="prev, pager, next, jumper"
				:total="record">
			</el-pagination>
		</div>
		
	</div>
</template>

<script>
	export default{
		props:{
			record: {
				type: Number
			}
		},
		data() {
			return {
				pageSize: 20,
				pageIndex: 1
			}
		},
		methods:{
			handleSizeChange(e) {

			},
			handleCurrentChange(e){
				this.$emit('pageIndexChange',e)
			}
		},
		mounted() {
			console.log(this.record)
		}
	}
</script>

<style>
</style>
