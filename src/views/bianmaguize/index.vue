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
						<el-button  @click="remove">删除</el-button>
					</div>
				</div>
			</el-col>
		</el-row>
		<tableList :style="{height: 'calc(100vh - '+tabHeight+'px)'}" :list = "tableList" v-loading="loading" @selectData = "selectData"></tableList>
		<bottom :style="{height: 103 + bottomHeight + 'px'}" :record = "record" @pageIndexChange = "pageIndexChange"></bottom>
		<el-dialog
		  title="新增编码规则"
		  :visible.sync="addShow"
		  width="1100px"
		  :before-close="handleClose">
		  <div>
				<el-form :inline="true" label-width="100px"  ref="form" :rules="rules" :model="form">
					<el-form-item   label="名称">
					  <el-input v-model="form.fullName"></el-input>
					</el-form-item>
					<el-form-item   label="编号">
					  <el-input v-model="form.code"></el-input>
					</el-form-item>
					<el-form-item label="功能模块">
						<el-select v-model="form.moduleId" filterable>
							<el-option 
								v-for="item in moduleList"
								:label="item.moduleName"
								:value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="产品类别"  v-show="form.moduleId == '1D144AA6-08C2-5A35-95E7-3BD28FBA6F0D'">
						<el-cascader
							ref="proType"
							v-model="form.productTypeId"
							@change="proTypeChange"
							style="width: 200px;"
							:options="proTypeArr"
							:props="{children: 'Child', label: 'F_Name', value: 'F_FId', multiple: false, checkStrictly: true, expandTrigger: 'hover', emitPath: false}"
						>
							
						</el-cascader>
					</el-form-item>
					<!-- <el-form-item   label="系统功能">
						  <el-cascader
									style="width: 200px;"
						      :options="mainUnitArr"
									v-model="form.dataItemDetailId_Sys"
									
						      :props="{ checkStrictly: true,children: 'ChildList', value: 'Id', label: 'ItemName' }"
						      clearable>
							</el-cascader>
					</el-form-item> -->
					<el-form-item   label="当前流水号"  prop="currentNumber">
					  <el-input v-model="form.currentNumber"></el-input>
					</el-form-item>
					
					<el-form-item  label="排序码" prop="contents">
					  <el-input  type="text" v-model="form.sortCode" placeholder="请输入"></el-input>
					</el-form-item>
					<!-- <el-form-item style="width: 425px;" label="编码方式" prop="mode">
						<el-radio-group style="width: 320px;" v-model="form.mode">
						  <el-radio style="margin-right: 7px;" :label="1">人工+自动</el-radio>
						  <el-radio style="margin-right: 7px;" :label="2">人工</el-radio>
							<el-radio :label="3">自动</el-radio>
						</el-radio-group>
					</el-form-item> -->
					<el-form-item style="width: 425px;" label="是否可用" prop="enabledMark">
						<el-radio-group v-model="form.enabledMark">
						  <el-radio :label="1">是</el-radio>
						  <el-radio :label="0">否</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item  label="编码规则" style="width: 100%;">
						<el-table :data="form.ruleFormatJson" border>
							<el-table-column width="140px" label="前缀" prop="ItemTypeName">
								<template slot-scope="scope">
									<el-select v-model="scope.row.ItemType" @change="changeQz($event,scope.$index)" placeholder="请选择">
										<el-option
											v-for="item in qianzhui"
											:key="item.value"
											:label="item.name"
											:value="item.value">
										</el-option>
									</el-select>
								</template>
							</el-table-column>
							<el-table-column width="140px" label="格式" prop="FormatStr">
								<template slot-scope="scope">
									<el-select v-if="geshi[scope.row.ItemType]" v-model="scope.row.FormatStr" placeholder="请选择">
									    <el-option
									      v-for="item in geshi[scope.row.ItemType]"
									      :key="Math.random()*100"
									      :label="item"
									      :value="item">
									    </el-option>
									  </el-select>
										<el-input v-else v-model="scope.row.FormatStr"></el-input>
								</template>
							</el-table-column>
							<el-table-column width="120px" label="步长" prop="StepValue">
								<template slot-scope="scope">
									<el-input  v-model="scope.row.StepValue"></el-input>
								</template>
							</el-table-column>
							<el-table-column width="120px" label="初始值" prop="InitValue">
								<template slot-scope="scope">
									<el-input v-model="scope.row.InitValue"></el-input>
								</template>
							</el-table-column>
							<el-table-column width="120px" label="排序码" prop="SortCode">
								<template slot-scope="scope">
									<el-input v-model="scope.row.SortCode"></el-input>
								</template>
							</el-table-column>
							<el-table-column width="120px" label="是否启用" ref="isQy" :filters = "[{text: '启用', value: 1}, {text: '禁用', value: 0}]" :filter-method = "filterFun">
								<template slot-scope="scope">
									<el-switch
										@change="changeEnable($event, scope.$index)"
									  v-model="scope.row.EnabledMark"
									  active-color="#13ce66"
									  inactive-color="#ccc"
										:active-value="1"
										:inactive-value="0">
									</el-switch>
								</template>
							</el-table-column>
							<el-table-column width="200px" label="说明" prop="Description">
								<template slot-scope="scope">
									<el-input v-model="scope.row.Description"></el-input>
								</template>
							</el-table-column>
							<el-table-column width="100px" show-overflow-tooltip align="right">
							  <template v-slot:header>
							    <el-button @click="onAdd" size="mini" icon="el-icon-plus"></el-button>
							  </template>
							  <template v-slot:default="scope">
							    <el-button
							      @click="onRemove(scope)"
							      type="danger"
							      icon="el-icon-delete"
							      size="mini"
							    ></el-button>
							  </template>
							</el-table-column>
						</el-table>
					</el-form-item>
					<el-form-item label="备注"  prop="description">
					  <el-input style="width: 525px;" v-model="form.description"></el-input>
					</el-form-item>
				</el-form>
			</div>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="addShow = false">取 消</el-button>
		    <el-button type="primary" @click="submitForm('form')">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	import tableList from "./components/table"
	import bottom from "./components/bottom"
	import checkPermission from "@/utils/checkPermission";
	const form = () => {
		return {
			id: "",
			f_ComId: "",
			code: "",
			fullName: "",
			moduleId: "",
			currentNumber: "",
			ruleFormatJson: [],
			sortCode: "",
			enabledMark: "",
			description: "",
			productTypeId: ""
		}
	}
	const ruleFormatJson = () => {
		return {
			"ItemType":0,
			"ItemTypeName":"自定义",
			"FormatStr":"",
			"StepValue":"",
			"InitValue":"",
			SortCode: "",
			EnabledMark: 0,
			"Description":"",
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
			let validateCode = (rule, value, callback) => {
				if(!value) {
					return callback(new Error('主计量单位不能为空'));
				}
				callback()
			}
			let validateName = (rule, value, callback) => {
				if(!value) {
					return callback(new Error('副计量单位不能为空'));
				}
				callback()
			}
			let conversionRelation = (rule, value, callback) => {
				if(!value) {
					return callback(new Error('换算量不能为空'));
				}
				callback()
			}
			return {
				value: "",
				select: "1",
				addShow: false,
				form: form(),
				rules: {
					dataItemDetailId_MainUnit: [
						{ validator: validateCode, trigger: 'change', required: true }
					],
					dataItemDetailId_SubUnit: [
						{ validator: validateName, trigger: 'change', required: true }
					],
					conversionRelation: [
						{ validator: conversionRelation, trigger: 'blur', required: true }
					]
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
				qianzhui: [
					{
						name: "自定义",
						value: 0
					},
					{
						name: "日期",
						value: 2
					},
					{
						name: "流水号",
						value: 4
					},
					{
						name: "部门编号",
						value: 5
					},
					{
						name: "公司编号",
						value: 7
					},
					{
						name: "用户标识",
						value: 9
					},
				],
				geshi: [
					'',
					['mmdd','ddmm','mmyy','yymm','yyyymm','yymmdd','yyyymmdd'],
					['000','0000','00000','000000'],
					"",
					"",
					"",
					"",
					"",
					"",
					""
				],
				proTypeArr: [],
				proTypeFilter: [],
				moduleList: []
			}
		},
		methods:{
			changeEnable(e, index) {
				// if(e == 1) {
				// 	this.form.ruleFormatJson.map((x, idx) => {
				// 		if(idx != index) {
				// 			x.EnabledMark = 0
				// 		}
				// 	})
				// }
			},
			filterFun(a, b, c) {
				return a == b.EnabledMark
			},
			// async mainUnit() {
			// 	let F_ComId = ''
			// 	if(this.$store.state.userinfo.F_ComId) {
			// 		F_ComId = this.$store.state.userinfo.F_ComId
			// 	}else{
			// 		F_ComId = JSON.parse(sessionStorage.getItem('userinfo')).F_ComId
			// 	}
			// 	let res = await this.$_request({
			// 		url: "/pr/DataItem/List",
			// 		data: {
			// 			pageIndex: 1,
			// 			pageSize: 9999
			// 		},
			// 		method: "post"
			// 	}) 
			// 	this.mainUnitArr = res.data.data
			// },
			//取得功能模块
			async getModuleList() {
				let res = await this.$_request({
					url: "/corl/Module/All",
					method: "post"
				})
				this.moduleList = res.data
			},
			changeQz(val,idx) {
				this.form.ruleFormatJson[idx].ItemTypeName = this.qianzhui[val].name
				this.form.ruleFormatJson[idx].FormatStr = ''
			},
			onRemove(scope) {
			  this.form.ruleFormatJson.splice(scope.$index, 1);
			},
			onAdd() {
				this.form.ruleFormatJson.push(ruleFormatJson());
			},
			add() {
				this.changeType = 'add'
				this.addShow = true
				this.form = form()
				// let proTypeFilter = JSON.parse(JSON.stringify(this.proTypeArr))
				// let loop = function(arr,productTypeId) {
				// 	arr.map(x => {
				// 		if(x.IsConnectCodeRule == 1 && productTypeId.indexOf(x.Id) == -1) {
				// 			x.disabled = true
				// 		}else{
				// 			x.disabled = false
				// 		}
				// 		if(x.ChildList) {
				// 			loop(x.ChildList, productTypeId)
				// 		}
				// 	})
				// }
				// loop(proTypeFilter, [])
				// this.proTypeFilter = proTypeFilter
			},
			handleClose() {
				this.addShow = false
			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						//提交
						this.postForm()
					} else {
						return false;
					}
				});
			},
			async postForm() {
				let formdate = {}
				let ruleFormatJson = JSON.stringify(this.form.ruleFormatJson) 
				Object.assign(formdate, this.form,{ruleFormatJson: ruleFormatJson})
				if(this.form.moduleId != '1D144AA6-08C2-5A35-95E7-3BD28FBA6F0D') {
					formdate.productTypeId = ""
				}
				// formdate.dataItemDetailId_Sys = formdate.dataItemDetailId_Sys[formdate.dataItemDetailId_Sys.length-1]
				// formdate.f_ComId = this.$store.state.userinfo.F_ComId
				// let res = {}
				let res = await this.$_request({
					url: "/corl/CodeRule/Change",
					data: formdate,
					method: "post"
				})
				if(res.data.code === 200) {
					this.addShow = false
					if(this.changeType === 'edit') {
						this.$message({
							message: "修改成功",
							type: "success"
						})
					}
					if(this.changeType === 'add') {
						this.$message({
							message: "添加成功",
							type: "success"
						})
					}
					this.getList()
				}else{
					this.$message({
						message: res.data.mes,
						type: "success"
					})
				}
			},
			async getList() {
				this.loading = true
				let res = await this.$_request({
					url: "/corl/CodeRule/List",
					method: "post",
					data: {
						pageIndex: this.pageIndex,
						pageSize: this.pageSize,
						queryJson: JSON.stringify({})
					}
				})
				if(res.data.code === 200) {
					this.loading = false
					this.record = res.data.record
					this.tableList = res.data.data
				}
			},
			async remove() {
				if(this.selectArr.length !== 1) {
					this.$message({
						type:"warning",
						message: "请选择一条删除"
					})
				}else{
					this.loading = true
					let res = await	this.$_request({
							url: "/pr/CodeRule/Del",
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
					this.form = {
						id: this.selectArr[0].Id,
						f_ComId: this.selectArr[0].F_ComId,
						code: this.selectArr[0].Code,
						fullName: this.selectArr[0].FullName,
						moduleId: this.selectArr[0].ModuleId,
						currentNumber: this.selectArr[0].CurrentNumber,
						ruleFormatJson: this.selectArr[0].RuleFormatJson ? JSON.parse(this.selectArr[0].RuleFormatJson) : '',
						sortCode: this.selectArr[0].SortCode,
						enabledMark: this.selectArr[0].EnabledMark,
						productTypeId: this.selectArr[0].ProductTypeId,
						description: this.selectArr[0].Description,
					}
					// let proTypeFilter = JSON.parse(JSON.stringify(this.proTypeArr))
					// let loop = function(arr,productTypeId) {
					// 	arr.map(x => {
					// 		if(x.IsConnectCodeRule == 1 && productTypeId.indexOf(x.Id) == -1) {
					// 			x.disabled = true
					// 		}else{
					// 			x.disabled = false
					// 		}
					// 		if(x.ChildList) {
					// 			loop(x.ChildList, productTypeId)
					// 		}
					// 	})
					// }
					// loop(proTypeFilter, this.form.productTypeId)
					// this.proTypeFilter = proTypeFilter
					this.addShow = true
				}		
			},
			getIdss(node, Id, path){
			    if (!path) { path = [] }
			    if (node.Id === Id) { return path }
			    path.push(node);
			    if (node.ChildList.some(child => this.getIdss(child, Id, path))) {
			        return path
			    }
			    path.pop();
			    return false
			},
			pageIndexChange(e){
				this.pageIndex = e
				this.getList()
			},
			selectData(e) {
				this.selectArr = e
			},
			proTypeChange(e) {
				
			},
			//取得产品类别
			async getProType() {
				let res = await this.$_request({
					url: "/Base/Org/GetOrgListAll",
					method: "GET",
					params: {
						isRole: 1,
						isTree: 1,
						orgType: 5
					}
				})
				this.proTypeArr = res.data.data
				console.log(res,777)
			}
		},
		mounted() {
			this.getModuleList()
			this.getList()
			this.getProType()
		}
	}
</script>

<style>
	.el-dialog__title{color: #FF696B;}
</style>
