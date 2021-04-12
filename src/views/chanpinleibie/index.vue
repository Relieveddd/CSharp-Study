<template>
	<div>
		<el-row type="flex" justify="space-between" style="margin-bottom: 10px;">
			<el-col :span="5">
				<!-- <el-input placeholder="请输入内容" v-model="value" class="input-with-select">
				    <el-select v-model="select" slot="prepend" placeholder="请选择">
				      <el-option label="餐厅名" value="1"></el-option>
				      <el-option label="订单号" value="2"></el-option>
				      <el-option label="用户电话" value="3"></el-option>
				    </el-select>
				    <el-button slot="append" icon="el-icon-search"></el-button>
				  </el-input> -->
			</el-col>
			<el-col :span="10">
				<div style="width: 100%;overflow: hidden;">
					<div style="float: right;">
						<el-button  @click = "add">新增</el-button>
						<el-button  @click="edit">修改</el-button>
						<!-- <el-button v-if="!checkButton('import')" @click="getPlatformList">导入</el-button> -->
						<el-popover
						  placement="top"
						  width="160"
						  v-model="visible">
						  <p>确定删除吗？</p>
						  <div style="text-align: right; margin: 0">
						    <el-button size="mini" type="text" @click="visible = false">取消</el-button>
						    <el-button type="primary" size="mini" @click="remove">确定</el-button>
						  </div>
						  <el-button style="margin-left: 10px;" slot="reference">删除</el-button>
						</el-popover>
					</div>
				</div>
			</el-col>
		</el-row>
		<div :style="{height: 'calc(100vh - '+tabHeight+'px)', overflow: 'auto'}">
			<tableList  :list = "tableList" v-loading="loading" @selectData = "selectData"></tableList>
		</div>
		<bottom :style="{height: 103 + bottomHeight + 'px'}" :record = "record" @pageIndexChange = "pageIndexChange"></bottom>
		<add :addShow="addShow" @updata="updata" :changeType="changeType" :info="info"></add>
		<el-dialog
			title="平台类别列表"
			fullscreen
			v-loading="platformLoading"
			:before-close="importListClose"
		  :visible.sync="importListShow">
			<el-table 
				ref="platform"
				:data="platform"
				row-key="id"
				@select="selectPlatformData"
				@selection-change="changePlatformData"
				border
				:tree-props="{children: 'childList'}">
				<el-table-column type="selection"></el-table-column>
				<el-table-column type="index" label="序号"></el-table-column>
				<el-table-column prop="name" label="类别名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="code" label="类别代码" show-overflow-tooltip></el-table-column>
				<el-table-column prop="sort" label="排序" show-overflow-tooltip></el-table-column>
				<el-table-column prop="state" label="状态" show-overflow-tooltip>
					<template slot-scope="scope">
						<span :style="'margin-right: 10px;'
						+(scope.row.state == 1 ? 'color: #00a0e9;' : 'color: #b7b7b7;')">
							{{scope.row.state == 1 ? '启用' : '禁用'}}
						</span>
					</template>
				</el-table-column>
			</el-table>
			<div slot="footer" class="dialog-footer">
				<el-button @click="importListShow = false">取 消</el-button>
				<el-button type="primary" @click="importShow">导 入</el-button>
			</div>
			<el-dialog
				append-to-body
				title="提示"
				:visible.sync="importDia"
				>
				<span>您计划导入的类别，存在未选择的上级或下级类别，请确认是否同时导入相应的层级关系？或仅导入本次选中的类别？或返回类别选择界面重选类别及导入层级关系？</span>
				<div slot="footer" class="dialog-footer">
					<el-button @click="importDia = false">我想重选</el-button>
					<el-button type="primary" @click="jb_importSure">仅导选中</el-button>
					<el-button type="danger" @click="importSure">同时导入上下级</el-button>
				</div>
			</el-dialog>
		</el-dialog>
	</div>
</template>

<script>
	import tableList from "./components/table"
	import bottom from "./components/bottom"
	import add from "./components/add.vue"
	import checkPermission from "@/utils/checkPermission";
	const loopFind = function(idx, s, x, parentList) {
		if (parentList[idx]){
			let pid = parentList[idx]['pid']
			let json = JSON.parse(JSON.stringify(parentList[idx]['content']))
			if(!s) {
				s = json.childList
			}
			let a = json
			if(s == null) {
				a.childList = []
			}else{
				if(s.constructor === Array) {
					a.childList = [...s]
				}else{
					a.childList = [s]
				}
			}
			s = a
			return loopFind(pid, s, "", parentList)
		}else{
			return s
		}
	}
	const form = () => {
		return {
			id: "",
			f_ComId: "",
			depid: "",
			parentId: "",
			code: "",
			name: "",
			sort: 0,
			state: 1
		}
	}
	export default{
		name: "jiliangdanwei",
		mixins: [checkPermission],
		components:{
			tableList,
			bottom,
			add
		},
		data() {
			return {
				value: "",
				select: "1",
				addShow: false,
				importListShow: false,
				platformLoading: false,
				form: form(),
				rules: {
				},
				tableList: [],
				pageIndex: 1,
				pageSize: 20,
				record: 0,
				loading: false,
				tabHeight:210,
				bottomHeight:-60,
				selectArr: [],
				changeType: "",
				F_ComId: '',
				visible: false,
				platform: [],
				selectPlatformArr: [],
				parentList: {},
				postTree: [],
				info: {},
				importDia: false,
				importData: []
			}
		},
		methods:{
			updata(e) {
				this.addShow = e
				this.getList()
			},
			add() {
				this.changeType = 'add'
				this.addShow = true
				// this.form = form()
				this.info = {}
			},
			handleClose() {
				this.addShow = false
			},
			async getList() {
				this.loading = true
				let res = await this.$_request({
					url: "/pr/ProductType/ListOfSys",
					method: "post",
					data: {
						pageIndex: this.pageIndex,
						pageSize: this.pageSize
					}
				})
				if(res.data.code === 200) {
					this.loading = false
					this.record = res.data.record
					this.tableList = res.data.data
				}
			},
			async remove() {
				this.visible = false
				if(this.selectArr.length !== 1) {
					this.$message({
						type:"warning",
						message: "请选择一条删除"
					})
				}else{
					this.loading = true
					let res = await	this.$_request({
							url: "/pr/ProductType/Del",
							method: "post",
							data:[this.selectArr[0].Id],
						})
					if(res.status === 200) {
						this.loading = false
						if(res.data) {
							this.$message({
								message: "删除成功",
								type: "success"
							})
						}
						this.getList()
					}
				}
			},
			async edit() {
				this.changeType = 'edit'
				if(this.selectArr.length !== 1) {
					this.$message({
						type:"warning",
						message: "请选择一条修改"
					})
				}else{
					let res = await this.$_request({
						url: "/pr/ProductTypeProperty/GetSingleTypeWithProperty",
						method: 'get',
						params: {id: this.selectArr[0].Id}
					})
					if(res.data.code == 200) {
						let data = res.data.data
						this.info = {
							code: data.Code,
							f_ComId: data.F_ComId,
							id: data.Id,
							name: data.Name,
							parentId: data.ParentId,
							sort: data.Sort,
							state: data.State,
							propertyList: data.PropertyList ? data.PropertyList.map(x => {
								return {
									id: x.Id,
									code: x.Code,
									name: x.Name,
									value: x.Value,
									isSpec: x.IsSpec,
									sort: x.Sort,
									state: x.State,
									isEnter: x.IsEnter
								}
							}): []
						}
					}
					this.addShow = true
				}		
			},
			pageIndexChange(e){
				this.pageIndex = e
				this.getList()
			},
			selectData(e) {
				this.selectArr = e
				// let key = e.map(x => {
				// 	return x.ParentId
				// })
				// let selectData = []
				// e.map(x => {
				// 	if(key.indexOf(x.Id) == -1) {
				// 		selectData.push(x)
				// 	}
				// })
				// let parentList = {}
				// let loopParent = function(arr) {
				// 	arr.map(x => {
				// 		if(x.ParentId != null) {
				// 			let pid = x['ParentId']
				// 			let id = x['Id']
				// 			parentList[id] = {pid: pid, content: x}
				// 		}
				// 		if(x.ChildList != null) {
				// 			loopParent(x.ChildList)
				// 		}
				// 	})
				// }
				// loopParent(this.tableList)
				// let loopFind = function(idx, s, x) {
				// 	if (parentList[idx]){
				// 		let pid = parentList[idx]['pid']
				// 		let json = JSON.parse(JSON.stringify(parentList[idx]['content']))
				// 		if(!s) {
				// 			s = json.ChildList
				// 		}
				// 		let a = json
				// 		a.ChildList = [s]
				// 		s = a
				// 		return loopFind(pid, s)
				// 	}else{
				// 		return s
				// 	}
				// }
				// selectData.map(x => {
				// 	let s = loopFind(x.Id, "", x)
				// })
			},
			importShow() {
				if(this.importData.length > 0) {
					this.importDia = true
				}else{
					this.$message({
						type: "warning",
						message: "请选择至少一条导入"
					})
				}
			},
			changePlatformData(e) {
				// console.log(e,123)
				this.importData = e
				this.selectPlatformArr = []
				let key = e.map(x => {
					return x.parentId
				})
				e.map(x => {
					if(key.indexOf(x.id) == -1) {
						this.selectPlatformArr.push(x)
					}
				})
			},
			selectPlatformData(e,row) {
				console.log(this.$refs.platform)
				console.log(e,row,123)
				console.log(e.indexOf(row))
				let loop = (arr, blon) => {
					arr.childList.map(x => {
						this.$refs.platform.toggleRowSelection(x, blon)
						if(x.childList) {
							loop(x, blon)
						}
					})
				}
				//判断当前项是选择还是未选中 
				if(e.indexOf(row) != -1) {
					//选中把子集全部选中
					if(row.childList) {
						this.$refs.platform.toggleRowExpansion(row, true)
						loop(row, true)
					}
					//找到所有父集并选中
					// let 
				}else{
					//取消把子集全部取消
					if(row.childList) {
						this.$refs.platform.toggleRowExpansion(row, false)
						loop(row, false)
					}
				}
				
				
				
				// loop(row)
			},
			importListClose() {
				this.importListShow = false
			},
			//仅导选中
			async jb_importSure() {
				let parentList = {}
				let loopParent = function(arr) {
					arr.map(x => {
						// if(x.parentId != null) {
							let pid = x['parentId']
							let id = x['id']
							parentList[id] = {pid: pid, content: x}
						// }
						if(x.childList != null) {
							loopParent(x.childList)
						}
					})
				}
				
				loopParent(this.importData)
				
				this.postTree = []
				this.selectPlatformArr.map(x => {
					let s = loopFind(x.id, "", x, parentList)
					this.postTree.push(s)
				})
				console.log(this.postTree)
			},
			//导入上下级
			async importSure() {
				let parentList = this.parentList
				this.postTree = []
				this.selectPlatformArr.map(x => {
					let s = loopFind(x.id, "", x, parentList)
					this.postTree.push(s)
				})
				console.log(this.postTree)
				return false
				
				
				if(this.postTree.length == 0) {
					return this.$message({
						type: "warning",
						message: "请选择至少一条导入"
					})
				}
				
				let res = await this.$_request({
					url: '/pr/ProductType/ImportFromSys',
					data: {
						productTypeList: this.postTree
					},
					method: 'post'
				})
				if(res.data.code == 200) {
					this.$message({
						type: "success",
						message: "导入成功"
					})
					this.getList()
					this.importListShow = false
				}
			}
		},
		mounted() {
			this.getList()
		}
	}
</script>

<style>
	.el-dialog__title{color: #FF696B;}
</style>
