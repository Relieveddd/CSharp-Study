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
			isShow: {
				type: Boolean,
				default: false
			},
			pageIndex: {
				type: Number,
				default: 1
			}
		},
		data() {
			return {
				pageSize: 20
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
				this.$emit('pageIndexChange',e)
			},
			resetIndex(e) {
				this.pageIndex = 1
			}
		},
		mounted() {
		}
	}
</script>

<style>
</style>
