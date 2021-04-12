<template>
	<el-dialog
		title="平台类别列表"
		fullscreen
		v-loading="platformLoading"
		@open="open"
	  :visible.sync="isShow">
		<el-container style="height: 100%;">
			<el-aside style="width: 200px;border: 1px solid #c5c5c5;overflow: auto;height: calc(100);">
				<div style="line-height: 31px;padding-left: 9px;border-bottom: 1px solid #c5c5c5;">类别列表</div>
				<el-tree :data="productTypeArr" :props="{children: 'ChildList',label: 'Name'}" @node-click="handleNodeClick"></el-tree>
			</el-aside>
			<el-main style="padding-top: 0;padding-bottom: 0px;">
				<el-row type="flex" justify="space-between" style="margin-bottom: 10px;">
					<el-col :span="5">
						<el-input style="width: 100%;" placeholder="请输入内容" v-model="keyword" class="input-with-select" @keyup.enter.native="search">
						    <el-button slot="append" icon="el-icon-search" @click="search(true)"></el-button>
						</el-input>
						
					</el-col>
				</el-row>
				<el-table
					ref="platform"
					:data="platform"
					row-key="Id"
					:style="{height: 'calc(100vh - 200px)', overflow: 'auto'}"
					@select="selectPlatformData"
					@selection-change="changePlatformData"
					border>
					<el-table-column type="selection"></el-table-column>
					<el-table-column type="index" label="序号"></el-table-column>
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
				<div style="float: right;">
					<el-pagination
					@current-change="changePage"
						:page-size="20"
						:current-page.sync="pageIndex"
					  background
					  layout="prev, pager, next"
					  :total="total">
					</el-pagination>
				</div>
			</el-main>
		</el-container>
		
		<div slot="footer" class="dialog-footer">
			<el-button @click="isShow = false">取 消</el-button>
			<el-button type="primary" @click="importSure">导 入</el-button>
		</div>
	</el-dialog>
</template>

<script>
	export default{
		props:{
			ptShow:{
				type: Boolean,
				default: false
			}
		},
		data(){
			return{
				platform: [],
				platformLoading: false,
				importDia: false,
				selectData: [],
				total: 0,
				pageIndex: 1,
				productTypeArr: [],
				productTypeIdSel: "",
				keyword: ""
			}
		},
		computed:{
			isShow:{
				get() {
					return this.ptShow
				},
				set(e) {
					this.$emit('upPtShow',e)
				}
			}
		},
		methods:{
			search() {
				this.pageIndex = 1
				this.getList()
			},
			handleNodeClick(e) {
				this.productTypeIdSel = e.Id
				this.pageIndex = 1
				this.getList()
			},
			open() {
				this.pageIndex = 1
				this.getList()
			},
			changePage() {
				this.getList()
			},
			async getList() {
				this.platformLoading = true
				let res = await this.$_request({
					url: "/pr/ProductInfo/ListOfSys",
					method: "post",
					data: {
						isShowAdded: false,
						pageSize: 20,
						pageIndex: this.pageIndex,
						productTypeId: this.productTypeIdSel,
						keyword: this.keyword
					}
				})
				this.total = res.data.record
				this.platform = res.data.data.map(x => {
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
				this.platformLoading = false
			},
			importListClose() {
				
			},
			selectPlatformData() {
				
			},
			changePlatformData(e) {
				this.selectData = e
			},
			async importSure() {
				this.platformLoading =true
				let res = await this.$_request({
					url: "/pr/ProductInfo/ImportFromSys",
					method: 'post',
					data: {
						productInfoList: this.selectData
					}
				})
				this.platformLoading = false
				this.isShow = false
				this.$message({
					type: 'success',
					message: '导入成功'
				})
			},
			jb_importSure() {
				
			},
			async mainUnit() {
				//产品类别
				let res = await this.$_request({
					url: "/pr/ProductType/ListOfSys",
					method: "post",
					data: {
						pageIndex: 1,
						pageSize: 99999,
						getMyAuthData: true
					}
				})
				this.productTypeArr = res.data.data
			}
		},
		mounted() {
			this.mainUnit()
		}
	}
</script>

<style>
</style>
