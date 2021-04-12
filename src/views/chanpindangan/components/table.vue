<template>
	<el-table :data="listNew" border @selection-change = "select">
		<el-table-column type="selection"></el-table-column>
		<el-table-column type="index" label="序号"></el-table-column>
		<el-table-column
		  prop="Img"
		  label="图片"
		  show-overflow-tooltip
			align="center"
		>
			<template slot-scope="scope">
				<el-tooltip placement="right" :disabled="!scope.row.Img" effect="light">
					<div style="position: relative;height: 50px;width: 100%;">
						<img style="height: 100%;width: auto;position: absolute;top: 50%;transform: translate(-50%,-50%);" :src="scope.row.Img" alt="">
					</div>
				  <div slot="content" >
						<!-- 132 -->
						<img style="height: 300px;width: auto;" :src="scope.row.Img" alt="">
					</div>
				</el-tooltip>
			</template>
		</el-table-column>
		<el-table-column prop="Code" label="产品编码" show-overflow-tooltip></el-table-column>
		<el-table-column prop="Name" label="名称" show-overflow-tooltip></el-table-column>
		<el-table-column prop="Spec" label="产品规格" show-overflow-tooltip></el-table-column>
		<el-table-column prop="gg" label="属性规格" show-overflow-tooltip></el-table-column>
		<el-table-column prop="sx" label="产品属性" show-overflow-tooltip></el-table-column>
		<el-table-column prop="ModelBrand" label="产品型号" show-overflow-tooltip></el-table-column>
		<el-table-column prop="PublishTime" label="上市时间" show-overflow-tooltip></el-table-column>
		<el-table-column prop="ProductType" label="产品类别" show-overflow-tooltip></el-table-column>
		<el-table-column prop="Enable" label="是否有效" show-overflow-tooltip>
			<template slot-scope="scope">
					{{scope.row.Enable == 1 ? '有效' : '无效'}}
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
		computed:{
			listNew() {
				let arr1 = this.list.map(x => {
					let arr = []
					let arr1 = []
					if(x.ProductInfoPropertyList) {
						x.ProductInfoPropertyList.map(y => {
							if(y.IsSpec) {
								arr1.push(y.ProductTypePropertyName + ':' + y.ProductTypePropertyValue)
							}else{
								arr.push(y.ProductTypePropertyName + ':' + y.ProductTypePropertyValue)
							}
						})
					}
					
					x.PublishTime = x.PublishTime ? x.PublishTime.substring(0, 10) : ""
					x.sx = arr.join('；')
					x.gg = arr1.join('；')
					return x
				})
				return arr1
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
