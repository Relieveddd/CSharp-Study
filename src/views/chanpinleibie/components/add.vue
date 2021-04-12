<template>
	<el-dialog
	  :title="changeType == 'add' ? '新增产品类别' : '修改产品类别'"
	  :visible.sync="isShow"
		fullscreen
	  width="1000px"
		@close="onClose"
		@open="open"
	  :before-close="handleClose">
	  <div>
			<el-form :inline="true" label-width="80px"  ref="form"  :model="form">
				<el-form-item label="父级"  prop="parentId">
					<el-cascader
						clearable
					  style="width: 200px;"
					  v-model="form.parentId"
					  :options="typeArr"
					  :props="{
					    emitPath: false,
					    multiple: false,
					    checkStrictly: true,
					    value: 'Id',
					    label: 'Name',
					    children: 'ChildList',
					    expandTrigger: 'hover'
					  }"
					></el-cascader>
				</el-form-item>
				<el-form-item label="类别名称">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="类别代码">
					<el-input v-model="form.code"></el-input>
				</el-form-item>
				<el-form-item label="排序">
					<div style="width: 200px;"><el-input-number v-model="form.sort" :min="0" :max="10000"></el-input-number></div>
				</el-form-item>
				<el-form-item label="是否有效">
					<el-radio v-model="form.state" :label="1">启用</el-radio>
					<el-radio v-model="form.state" :label="0">禁用</el-radio>
				</el-form-item>
			</el-form>
			<div style="margin-bottom: 10px;">
				<el-button @click="addNewSx">添加新属性</el-button>
			</div>
			<el-table :data="form.propertyList" border >
				<el-table-column type="selection"></el-table-column>
				<el-table-column type="index" label="序号"></el-table-column>
				<el-table-column label="编号" prop="code"></el-table-column>
				<el-table-column label="名称"  width="150">
					<template slot-scope="scope">
						<el-cascader
							:ref="'sx_'+scope.$index"
						  v-model="scope.row.name"
							@change="sxSelect($event,scope.$index)"
							clearable
						  :options="sxList"
						  :props="{
						    emitPath: false,
						    multiple: false,
						    checkStrictly: true,
						    value: 'Name',
						    label: 'Name',
						    children: 'ChildList',
						    expandTrigger: 'hover'
						  }"
						></el-cascader>
					</template>
				</el-table-column>
				<el-table-column label="排序" prop="sort">
					<template slot-scope="scope">
						<el-input v-model="scope.row.sort"></el-input>
					</template>
				</el-table-column>
				<el-table-column label="是否启用" ref="isQy" :filters = "[{text: '启用', value: 1}, {text: '禁用', value: 0}]" :filter-method = "filterFun">
					<template slot-scope="scope">
						<el-switch
						  v-model="scope.row.state"
							@change="change($event, scope.$index)"
						  active-color="#13ce66"
						  inactive-color="#ccc"
							:active-value="1"
							:inactive-value="0">
						</el-switch>
					</template>
				</el-table-column>
				<el-table-column label="可输入">
					<template slot-scope="scope">
						<el-select v-model="scope.row.isEnter">
							<el-option :value="1" label="是"></el-option>
							<el-option :value="0" label="否"></el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column label="规格" prop="isSpec">
					<template slot-scope="scope">
						<el-select v-model="scope.row.isSpec">
							<el-option :value="true" label="是"></el-option>
							<el-option :value="false" label="否"></el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column label="属性值" prop="value"></el-table-column>
				<el-table-column >
					<template slot="header" slot-scope="scope">
						<el-button @click="addSx">添加行</el-button>
					</template>
					<template slot-scope="scope">
						<el-button
							size="mini"
							@click="remove(scope.$index, scope.row)">移除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
	  <span slot="footer" class="dialog-footer">
	    <el-button @click="isShow = false">取 消</el-button>
	    <el-button type="primary" @click="submitForm('form')">确 定</el-button>
	  </span>
		<el-dialog
		  title="新增产品属性"
		  :visible.sync="innerAddShow"
		  width="640px"
			append-to-body
		  :before-close="handleClose">
		  <div>
				<el-form :inline="true" label-width="85px"  ref="formSx" :model="formSx">
					<el-form-item label="属性名称">
						<el-input v-model="formSx.name"></el-input>
					</el-form-item>
					<el-form-item label="属性代码">
						<el-input v-model="formSx.code"></el-input>
					</el-form-item>
					<el-form-item label="是否为规格">
						<div style="width: 200px;">
							<el-radio v-model="formSx.isSpec" :label="true">是</el-radio>
							<el-radio v-model="formSx.isSpec" :label="false">否</el-radio>
						</div>
					</el-form-item>
					<el-form-item label="是否可输入">
						<div style="width: 200px;">
							<el-radio v-model="formSx.isEnter" :label="1">是</el-radio>
							<el-radio v-model="formSx.isEnter" :label="0">否</el-radio>
						</div>
					</el-form-item>
					<el-form-item label="是否有效">
						<div style="width: 200px;">
							<el-radio v-model="formSx.state" :label="1">启用</el-radio>
							<el-radio v-model="formSx.state" :label="0">禁用</el-radio>
						</div>
					</el-form-item>
					<el-form-item label="排序">
						<div style="width: 200px;"><el-input-number v-model="formSx.sort" :min="0" :max="10000"></el-input-number></div>
					</el-form-item>
					<el-form-item >
						<el-table :data="formSx.value" border style="width: 600px;">
							<el-table-column label="序号" type="index">
							</el-table-column>
							<el-table-column label="属性值">
								<template slot-scope="scope">
									<el-input v-model="formSx.value[scope.$index]"></el-input>
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
		    <el-button @click="innerAddShow = false">取 消</el-button>
		    <el-button type="primary" @click="submitFormSx('formSx')">确 定</el-button>
		  </span>
		</el-dialog>
	</el-dialog>
</template>

<script>
	const form = () => {
		return {
			id: "",
			f_ComId: "",
			depid: "",
			parentId: "",
			code: "",
			name: "",
			sort: 0,
			state: 1,
			propertyList: []
		}
	}
	const form_s = () => {
		return {
			id: "",
			code: "",
			name: "",
			value: "",
			isSpec: true,
			sort: 0,
			state: 1,
			isEnter: 0
		}
	}
	const formSx = () => {
		return {
			id: "",
			f_ComId: "",
			depid: "",
			parentId: "",
			code: "",
			name: "",
			isSpec: true,
			value: [],
			sort: 0,
			state: 1,
			isEnter: 0,
		}
	}
	export default{
		props:{
			addShow: {
				type: Boolean,
				default: false
			},
			changeType: {
				type: String,
				default: 'add'
			},
			info: {
				type: Object,
				default: {}
			}
		},
		data() {
			return {
				form: form(),
				typeArr: [],
				sxList: [],
				innerAddShow: false,
				formSx: formSx(),
				changeSxType: 'add'
			}
		},
		watch:{
			info: {
				handler(val, old) {
					if(val.propertyList) {
						this.form = val
					}
				},
				deep: true
			}
		},
		computed:{
			isShow: {
				get() {
					return this.addShow
				},
				set(e) {
					this.$emit('updata',e)
				}
			}
		},
		methods:{
			onClose() {
				this.form = form()
				this.formSx = formSx()
			},
			handleClose() {
				this.isShow = false
			},
			async getTypeList() {
				let res = await this.$_request({
					url: "/pr/ProductType/ListOfSys",
					method: "post",
					data: {
						pageIndex: 1,
						pageSize: 99999
					}
				})
				this.typeArr = res.data.data
			},
			addSx() {
				this.form.propertyList.push(form_s())
			},
			remove(index) {
				this.form.propertyList.splice(index, 1)
			},
			//取得树形列表
			async getSxList() {
				let res = await this.$_request({
					url: "/pr/Property/List",
					method: 'post',
					data: {
						pageIndex: 1,
						pageSize: 99999
					}
				})
				this.sxList = res.data.data
				res.data.data.map(x => {
					if(x.Name === this.formSx.name) {
						this.form.propertyList.push({
							id: x.Id,
							code: x.Code,
							name: x.Name,
							value: x.Value,
							isSpec: x.IsSpec,
							sort: x.Sort,
							state: x.State,
							isEnter: x.IsEnter
						})
					}
				})
			},
			sxSelect(e,index) {
				let data = JSON.parse(JSON.stringify(this.$refs['sx_'+index].getCheckedNodes()[0].data))
					this.form.propertyList[index].id = data.Id
					this.form.propertyList[index].code = data.Code
					this.form.propertyList[index].name = data.Name
					this.form.propertyList[index].value = data.Value
					this.form.propertyList[index].isSpec = data.IsSpec
					this.form.propertyList[index].sort = data.Sort
					this.form.propertyList[index].state = data.State
					this.form.propertyList[index].isEnter = data.IsEnter
			},
			change(e, index) {
				console.log(e, index)
				console.log(this.form.propertyList[index].state)
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
				let formdate = this.form
				// return false
				let res = await this.$_request({
					url: "/pr/ProductTypeProperty/ChangeBatch",
					data: formdate,
					method: "post"
				})
				if(res.data.code === 200) {
					this.isShow = false
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
				}else{
					this.$message({
						message: res.data.mes,
						type: "success"
					})
				}
			},
			//添加新属性
			addNewSx() {
				this.innerAddShow = true
				this.formSx = formSx()
			},
			isQy(e) {
				console.log(e)
				// this.$refs.isQy.filterMethod()
				// console.log(this.$refs.isQy)
			},
			async submitFormSx() {
				let formdate = JSON.parse(JSON.stringify(this.formSx))
				formdate.value = formdate.value.join(',')
				let res = await this.$_request({
					url: "/pr/Property/Change",
					data: formdate,
					method: "post"
				})
				if(res.data.code === 200) {
					this.innerAddShow = false
					if(this.changeSxType === 'edit') {
						this.$message({
							message: "修改成功",
							type: "success"
						})
					}
					if(this.changeSxType === 'add') {
						this.$message({
							message: "添加成功",
							type: "success"
						})
					}
					this.getSxList()
				}else{
					this.$message({
						message: res.data.mes,
						type: "success"
					})
				}
			},
			filterFun(a, b, c) {
				return a == b.state
			},
			addSxValue() {
				this.formSx.value.push("")
			},
			removeSxValue(index) {
				console.log(index)
				console.log(this.form.value)
				this.formSx.value.splice(index,1)
			},
			open() {
				this.getTypeList()
				this.getSxList()
			}
		},
		mounted() {
			console.log(this.form)
			
			
			
		}
	}
</script>

<style>
</style>
