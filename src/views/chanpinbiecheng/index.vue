<template>
	<mm-atp palign="right">
		<!-- <template v-slot:action-left>
			<el-col :span="18">
				<el-input placeholder="请输入内容" v-model="keyword" class="input-with-select" @keyup.enter.native="search">
				    <el-button slot="append" icon="el-icon-search" @click="search(true)"></el-button>
				</el-input>
			</el-col>
		</template> -->
		<template v-slot:action-right>
			<el-button @click = "add">新增</el-button>
			<el-button @click="edit">修改</el-button>
			<el-popover
			  placement="top"
			  width="160"
			  v-model="visibleRemove">
			  <p>确定删除吗？</p>
			  <div style="text-align: right; margin: 0">
			    <el-button size="mini" type="text" @click="visibleRemove = false">取消</el-button>
			    <el-button type="primary" size="mini" @click="remove">确定</el-button>
			  </div>
			  <el-button v-if="checkButton('remove')" slot="reference">删除</el-button>
			</el-popover>
		</template>
		<template v-slot:table>
			<tableList @rowClick="rowClick" @orderBy = "orderBy"  :list = "tableList" v-loading="loading" @selectData = "selectData"></tableList>
		</template>
		<template v-slot:pagination >
		  <bottom ref="bottom"  :style="{height: 103 + bottomHeight + 'px'}" :pageIndex = "pageIndex" :record = "record" @pageIndexChange = "pageIndexChange"></bottom>
		</template>
		<template v-slot:other>
			<el-dialog
			:title="title"
			:visible.sync="addShow"
			>
				<el-form label-width="80px">
					<el-form-item label="产品名称">
						<el-select v-model="form.productId" filterable :filter-method="proFilter" style="width: 230px;">
							<el-option
								v-for="item in filterProArr"
								:value="item.Id"
								:key="item.Id"
								:label="item.Name"
								>
								<span>{{item.Code+'-'+item.Name+'-'+item.ModelBrand}}</span>
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="产品别称">
						<el-input style="width: 230px;" v-model="form.nickName"></el-input>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="addShow = false">取 消</el-button>
					<el-button type="primary" @click="sub">确 定</el-button>
				</span>
			</el-dialog>
		</template>
	</mm-atp>
</template>

<script>
	import tableList from "./components/table"
	import bottom from "./components/bottom"
	import checkPermission from "@/utils/checkPermission";
	const form = () => {
		return {
			id: "",
			f_ComId: "",
			productId: "",
			nickName: ""
		}
	}
	export default{
		name: "jiliangdanwei",
		mixins: [checkPermission],
		components:{
			tableList,
			bottom
		},
		data() {
			return {
				orderId: "",
				isShow: false,
				keyword: "",
				select: "1",
				addShow: false,
				form: form(),
				tableList: [],
				pageIndex: 1,
				pageSize: 20,
				record: 0,
				loading: false,
				tabHeight:260,
				bottomHeight:-60,
				selectArr: [],
				changeType: "",
				F_ComId: '',
				proArr: [],
				filterProArr: [],
				orderJson: {},
				visibleRemove: false,
				title: "新增产品别称"
			}
		},
		methods:{
			//关键字搜索
			proFilter(e) {
				this.filterProArr = this.proArr.filter(x => {
					let str = x.Code+x.Name+x.ModelBrand
					if(e) {
						if(str.indexOf(e) != -1) {
							return true
						}else{
							return false
						}
					}else{
						this.filterProArr = this.proArr
					}
					
				})
			},
			//排序
			orderBy(e) {
				this.orderJson = {orderby: e.prop, ordertype: e.order === 'ascending' ? 'asc' : 'desc'}

			},
			onClose(e) {
				this.tabHeight = 260
			},
			async search(noSearch) {
				this.keyword = this.keyword.replace(/\s+/g,"");
				if(this.keyword) {
					this.loading = true
					let res = await this.$_request({
						url: "/map/Order/ListSearch",
						method: 'post',
						data: {
							pageIndex: noSearch ? 1 : this.pageIndex,
							pageSize: this.pageSize,
							key: this.keyword
						}
					})
					if(res.data.code === 200) {
						this.loading = false
						this.record = res.data.record
						this.tableList = res.data.data
						if(noSearch) {
							this.$refs.bottom.resetIndex()
						}
					}
				}else{
					this.pageIndex = 1;
					this.getList()
				}
			},
			add() {
				this.title = "新增产品别称"
				this.changeType = 'add'
				this.form = form()
				this.addShow = true
			},
			async sub() {
				if(!this.form.productId) {
					return this.$message({
						type: "warning",
						message: "请选择产品"
					})
				}
				if(!this.form.nickName) {
					return this.$message({
						type: "warning",
						message: "请填写别称"
					})
				}
				let res = await this.$_request({
					url: "/pr/ProductInfoNickName/Change",
					method: "post",
					data: this.form
				})
				this.$message({
					type: "success",
					message: "操作成功"
				})
				this.getList()
				this.addShow = false
			},
			handleClose() {
				this.addShow = false
			},
			async getList() {
				this.loading = true
				let res = await this.$_request({
					url: "/pr/ProductInfoNickName/List",
					method: "post",
					data: {
						pageIndex: this.pageIndex,
						pageSize: this.pageSize,
						queryJson: JSON.stringify({}),
						orderBy: this.orderJson.orderby,
						orderAscDesc: this.orderJson.ordertype
					}
				})
				if(res.data.code === 200) {
					this.loading = false
					this.record = res.data.record
					this.tableList = res.data.data
				}
			},
			async remove() {
				this.visibleRemove = false
				if(this.selectArr.length != 1) {
					return this.$message({
						type: "warning",
						message: "请选择一条删除"
					})
				}
				let res = await this.$_request({
					url: "/pr/ProductInfoNickName/Del",
					method: "post",
					data: [this.selectArr[0].Id]
				})
				this.$message({
					type: "success",
					message: "删除成功"
				})
				this.getList()
			},
			async edit() {
				this.title = "修改产品别称"
				if(this.selectArr.length != 1) {
					return this.$message({
						type: "warning",
						message: "请选择一条修改"
					})
				}
				this.form = {
					f_ComId: this.selectArr[0].F_ComId,
					id: this.selectArr[0].Id,
					nickName:	this.selectArr[0].NickName,
					productId:	this.selectArr[0].ProductId
				}
				this.addShow = true
			},
			pageIndexChange(e){
				this.pageIndex = e
				if(this.keyword ) {
					this.search()
				}else{
					this.getList()
				}
			},
			selectData(e) {
				this.selectArr = e
			},
			rowClick(e) {
				this.tabHeight = 600
				this.isShow = true
				this.orderId = e.Id
			},
			async getProList() {
				let res = await this.$_request({
					url: "/pr/ProductInfo/ListNew",
					method: "post",
					data: {
						pageIndex: 1,
						pageSize: 999999
					}
				})
				this.proArr = res.data.data
				this.filterProArr = res.data.data
			}
		},
		mounted() {
			this.getList()
			this.getProList()
		}
	}
</script>

<style>
	.el-dialog__title{color: #FF696B;}
</style>
