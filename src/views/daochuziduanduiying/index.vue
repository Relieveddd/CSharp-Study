<template>
	<mm-atp palign="right">
		<template v-slot:action-left>
			<el-col :span="12">
				<el-radio-group v-model="radio" @change="radioChange">
				  <el-radio-button
				    v-for="(item, index) in radioList"
				    :key="index"
				    :label="item.value"
				    >{{ item.label }}</el-radio-button
				  >
				</el-radio-group>
			</el-col>
			<el-col :span="11">
				<el-input placeholder="请输入内容" v-model="keyword" class="input-with-select" @keyup.enter.native="search">
				    <el-button slot="append" icon="el-icon-search" @click="search(true)"></el-button>
				</el-input>
			</el-col>
		</template>
		<template v-slot:action-right>
			<el-button v-if="checkButton('add')" @click = "add">新增</el-button>
			<el-button v-if="checkButton('edit')" @click="edit">修改</el-button>
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
		<!-- <template v-slot:bottom>
			<g-bf :visible.sync="isShow" @close="onClose">
				<detail-table :isShow = "isShow" :orderId="orderId"></detail-table>
			</g-bf>
		</template> -->
		<template v-slot:other>
			<el-dialog
				:title=" changeType == 'add' ? '新增导入模板' : '修改导入模板' "
				:visible.sync="addShow">
				<el-form :model="form" label-width="80px" inline>
					<el-form-item label="功能模块">
						<el-cascader
							v-model="form.ModuleId"
							:options="moduleList"
							:props="{ checkStrictly: true, label:'ModuleName', value: 'Id', children: 'ChildList', emitPath: false }"
							clearable></el-cascader>
					</el-form-item>
					<el-form-item label="类型">
						<el-select v-model="form.ObjectType" @change="typeChange" disabled>
							<el-option v-for="item in objectTypeArr" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="名称">
						<el-select v-model="form.ObjectId" v-if="form.ObjectType == 1" filterable @change="gysChange">
							<el-option v-for="item in gysArr" :label="item.Name" :value="item.Id"></el-option>
						</el-select>
						<el-select v-model="form.ObjectId" v-if="form.ObjectType == 2" filterable @change="khChange">
							<el-option v-for="item in khArr" :label="item.Name" :value="item.Id"></el-option>
						</el-select>
						<el-select v-model="form.ObjectId" v-if="form.ObjectType == 3" filterable @change="depChange">
							<el-option v-for="item in depArr" :label="item.F_OrgName" :value="item.F_Fguid"></el-option>
						</el-select>
						<el-select v-model="form.ObjectId" v-if="form.ObjectType == 4" filterable @change="whChange">
							<el-option v-for="item in whArr" :label="item.F_Name" :value="item.F_FId"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="模板名称">
						<el-input v-model="form.TemplateName" style="width: 215px;"></el-input>
					</el-form-item>
				</el-form>
				<span slot="footer">
				  <el-button @click="closeSelf">取 消</el-button>
				  <el-button type="primary" @click="onOk" :loading="ui.okLoading"
				    >确 定</el-button
				  >
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
			"Id": "",
			"F_ComId": "",
			"ModuleId": "",
			"ObjectName": "",
			"ObjectId": "",
			"ObjectType": 1,
			"ServiceName": "",
			"TemplateName": "",
			"TemplateType": 1
		}
	}
	export default{
		name: "jiliangdanwei",
		mixins: [checkPermission],
		props:{
			templateType: {
				type: Number,
				default: 1
			}
		},
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
				orderJson: {},
				visibleRemove: false,
				radio: 1,
				radioList: [
					{
						label: "供应商",
						value: 1
					},
					{
						label: "客户",
						value: 2
					},
					{
						label: "部门",
						value: 3
					},
					{
						label: "仓库",
						value: "4"
					}
				],
				moduleList: [],
				objectTypeArr: [
					{
						label: '供应商',
						value: 1
					},
					{
						label: '客户',
						value: 2
					},
					{
						label: '部门',
						value: 3
					},
					{
						label: '仓库',
						value: 4
					},
				],
				gysArr: [],
				khArr: [],
				depArr: [],
				whArr: [],
				ui: {
					okLoading: false
				}
			}
		},
		methods:{
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
				this.changeType = 'add'
				this.form = form()
				this.form.ObjectType = parseInt(this.radio)
				this.addShow = true
			},
			handleClose() {
				this.addShow = false
			},
			async getList() {
				this.loading = true
				let res = await this.$_request({
					url: "/eximport/Template_ModuleDataField/List",
					method: "post",
					data: {
						pageIndex: this.pageIndex,
						pageSize: this.pageSize
						// objectType: this.radio,
						// templateType: this.templateType
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
					url: "/eximport/Template/Del",
					method: "post",
					data: [this.selectArr[0].Id]
				})
				this.getList()
				this.$message({
					type: "success",
					message: "操作成功"
				})
			},
			async edit() {
				if(this.selectArr.length != 1) {
					return this.$message({
						type: "warning",
						message: "请选择一条修改"
					})
				}
				this.form = this.selectArr[0]
				this.changeType = 'edit'
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
			//取消
			closeSelf() {
				this.form = form()
				this.addShow = false
			},
			radioChange(e) {
				this.pageIndex = 1
				this.getList()
			},
			//提交
			async onOk() {
				this.ui.okLoading = true
				this.form.templateType = this.templateType
				let res = await this.$_request({
					url: "/eximport/Template/Change",
					method: "post",
					data: this.form
				})
				this.ui.okLoading = false
				this.addShow = false
				this.$message({
					type: "success",
					message: "操作成功"
				})
				this.getList()
			},
			//取得模块列表
			async getModuleList() {
				let res = await this.$_request({
					url: "/eximport/Module/All",
					method: "post"
				})
				this.moduleList = res.data.data
			},
			typeChange(e) {
				this.form.ObjectId = ""
				this.form.ObjectName = ""
			},
			//修改选项
			gysChange(e) {
				let data = this.gysArr.find(x => {
					return x.Id == e
				})
				this.form.objectName = data.Name
			},
			depChange(e) {
				let data = this.depArr.find(x => {
					return x.F_Fguid == e
				})
				this.form.objectName = data.F_OrgName
			},
			khChange(e) {
				let data = this.khArr.find(x => {
					return x.Id == e
				})
				this.form.objectName = data.Name
			},
			whChange(e) {
				let data = this.whArr.find(x => {
					return x.F_FId == e
				})
				this.form.objectName = data.F_Name
			},
			//取得供应商
			async getGys() {
				let res = await this.$_request({
					url: "/sc/BaseInfo/ListNew",
					method: "post",
					data: {
						pageIndex: 1,
						pageSize: 999999,
						queryJson: JSON.stringify({})
					}
				})
				this.gysArr = res.data.data
			},
			//取得客户
			async getKh() {
				let res = await this.$_request({
					url: "/client/BaseInfo/List",
					method: "post",
					data: {
						pageIndex: 1,
						pageSize: 999999,
						queryJson: JSON.stringify({})
					}
				})
				this.khArr = res.data.data
			},
			//取得部门
			async getDepList() {
				let res = await this.$_request({
					url: "/Base/Org/GetOrgListAll",
					method: 'get',
					params: {
						orgType: 2,
						isTree: 0,
						isRole: 2
					}
				})
				this.depArr = res.data.data
			},
			//取得仓库
			async getWh() {
				let res = await this.$_request({
					url: "/Base/Org/GetOrgListAll",
					method: 'get',
					params: {
						orgType: 4,
						isTree: 1,
						isRole: 2
					}
				})
				this.whArr = res.data.data
			}
		},
		mounted() {
			this.getList()
			this.getModuleList()
			this.getGys()
			this.getKh()
			this.getDepList()
			this.getWh()
			this.$_request({
				url: "/eximport/ModuleDataField/List",
				method: "post",
				data: {
					moduleId: "1D144AA6-08C2-5A35-95E7-3BD28FBA6F0D",
					isGetChildModuleFields: true
				}
			})
			
		}
	}
</script>


<style>
	.el-dialog__title{color: #FF696B;}
</style>
