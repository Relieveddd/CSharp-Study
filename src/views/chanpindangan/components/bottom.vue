<template>
	<div style="overflow: hidden;">
		<div style="float: right;">
			<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page.sync="_pageIndex"
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
			},
			pageSize: {
				type: Number
			},
			pageIndex: {
				type: Number
			}
		},
		data() {
			return {

			}
		},
		computed:{
			_pageIndex: {
				get() {
					return this.pageIndex
				},
				set(e) {
					this.$emit('pageIndexChange',e)
				}
			}
		},
		methods:{
			handleSizeChange(e) {

			},
			handleCurrentChange(e){
				// this.$emit('pageIndexChange',e)
			}
		},
		mounted() {
			console.log(this.record)
		}
	}
</script>

<style>
</style>
