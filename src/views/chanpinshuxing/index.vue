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
		<tableList :style="{height: 'calc(100vh - '+tabHeight+'px)'}" :list = "tableList" v-loading="loading" @selectData = "selectData"></tableList>
		<bottom :style="{height: 103 + bottomHeight + 'px'}" :record = "record" @pageIndexChange = "pageIndexChange"></bottom>
		<el-dialog
		  title="新增产品属性"
		  :visible.sync="addShow"
		  width="640px"
		  :before-close="handleClose">
		  <div>
				<el-form :inline="true" label-width="85px"  ref="form" :rules="rules" :model="form">
					<el-form-item label="属性名称">
						<el-input v-model="form.name"></el-input>
					</el-form-item>
					<el-form-item label="属性代码">
						<el-input v-model="form.code"></el-input>
					</el-form-item>
					<el-form-item label="是否为规格">
						<div style="width: 200px;">
							<el-radio v-model="form.isSpec" :label="true">是</el-radio>
							<el-radio v-model="form.isSpec" :label="false">否</el-radio>
						</div>
					</el-form-item>
					<el-form-item label="是否可输入">
						<div style="width: 200px;">
							<el-radio v-model="form.isEnter" :label="1">是</el-radio>
							<el-radio v-model="form.isEnter" :label="0">否</el-radio>
						</div>
					</el-form-item>
					<el-form-item label="是否有效">
						<div style="width: 200px;">
							<el-radio v-model="form.state" :label="1">启用</el-radio>
							<el-radio v-model="form.state" :label="0">禁用</el-radio>
						</div>
					</el-form-item>
					<el-form-item label="排序">
						<div style="width: 200px;"><el-input-number v-model="form.sort" :min="0" :max="10000"></el-input-number></div>
					</el-form-item>
					<el-form-item >
						<el-table :data="form.value" border style="width: 600px;">
							<el-table-column label="序号" type="index">
							</el-table-column>
							<el-table-column label="属性值">
								<template slot-scope="scope">
									<el-input v-model="form.value[scope.$index]"></el-input>
								</template>
							</el-table-column>
							<el-table-column align="center" width="100">
								<template slot="header" slot-scope="scope">
									<el-button @click="addSxValue">添加值</el-button>
								</template>
								<template slot-scope="scope">
									<el-button @click="removeSxValue(scope.$index)">删除</el-button>
								</template>
							</el-table-column>
						</el-table>
						
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
			depid: "",
			code: "",
			name: "",
			isSpec: true,
			value: [],
			sort: 0,
			state: 1,
			isEnter: 0
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
				value: "",
				select: "1",
				addShow: false,
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
				typeArr: [],
				visible: false,
				platform: [],
				selectPlatformArr: [],
				parentList: {},
				postTree: []
			}
		},
		methods:{
			add() {
				this.changeType = 'add'
				this.addShow = true
				this.form = form()
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
				let formdate = JSON.parse(JSON.stringify(this.form))
				formdate.value = formdate.value.join(',')
				let res = await this.$_request({
					url: "/pr/Property/Change",
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
					url: "/pr/Property/List",
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
							url: "/pr/Property/Del",
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
						state: this.selectArr[0].State,
						isEnter: this.selectArr[0].IsEnter,
						name: this.selectArr[0].Name,
						sort: this.selectArr[0].Sort,
						isSpec: this.selectArr[0].IsSpec,
						value: this.selectArr[0].Value.split(',')
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
			},
			async getType() {
				let res = await this.$_request({
					url: '/pr/ProductType/List',
					method: 'post',
					data: {
						pageIndex: 1,
						pageSize: 999999
					}
				})
				this.typeArr = res.data.data
			},
			addSxValue() {
				this.form.value.push("")
			},
			removeSxValue(index) {
				console.log(index)
				console.log(this.form.value)
				this.form.value.splice(index,1)
			}
		},
		mounted() {
			this.getType()
			this.getList()
		}
	}
</script>

<style>
	.el-dialog__title{color: #FF696B;}
</style>
