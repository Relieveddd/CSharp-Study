<template>
	<mm-atp palign="right">
		<template v-slot:action-right>
			<el-button  @click = "add">新增</el-button>
			<el-button  @click="edit">修改</el-button>
		</template>
		<template v-slot:table>
			<tableList  :list = "tableList" v-loading="loading" @selectData = "selectData"></tableList>
		</template>
		<template v-slot:pagination >
		  <!-- <bottom ref="bottom"  :style="{height: 103 + bottomHeight + 'px'}" :pageIndex = "pageIndex" :record = "record" @pageIndexChange = "pageIndexChange"></bottom> -->
		</template>
		<template v-slot:other>
			<el-dialog
				:title="title"
				:visible.sync="addShow">
				<el-form label-width="80px" >
					<el-form-item label="父级">
						<el-cascader
							clearable
							v-model="form.ParentId"
							:options="tableList"
							:props="{ checkStrictly: true, label: 'CategoryName', value: 'Id',emitPath: false, children: 'Child' }"
							clearable>
						</el-cascader>
					</el-form-item>
					 
					<el-form-item label="分类名称">
						<el-input v-model="form.CategoryName"></el-input>
					</el-form-item>
					<el-form-item label="启用/禁用">
						<el-radio-group v-model="form.IsDisabled">
						  <el-radio :label="false">启用</el-radio>
						  <el-radio :label="true">禁用</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="排序">
						<el-input-number v-model="form.SortId" :min="0" :max="99999999" label="描述文字"></el-input-number>
					</el-form-item>
				</el-form>
				<span slot="footer">
				  <el-button @click="addShow = false">取 消</el-button>
				  <el-button type="primary" @click="onOk" :loading="ui.okLoading"
				    >确 定</el-button
				  >
				</span>
			</el-dialog>
		</template>
	</mm-atp>
</template>

<script>
	import detailTable from "./components/detailTable";
	import tableList from "./components/table"
	const form = () => {
		return {
			"Id": 0,
			"CategoryName": "",
			"IsDisabled": false,
			"SortId": 0,
			ParentId: 0
		}
	}
	export default{
		name: "jiliangdanwei",
		components:{
			tableList,
			detailTable
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
				loading: false,
				tabHeight:260,
				bottomHeight:-60,
				selectArr: [],
				changeType: "",
				F_ComId: '',
				proArr: [],
				orderJson: {},
				ui: {
				  okLoading: false
				},
				title: "",
				importShow: false
			}
		},
		methods:{
			updataList() {
				this.getList()
			},
			//排序
			orderBy(e) {
				this.orderJson = {orderby: e.prop, ordertype: e.order === 'ascending' ? 'asc' : 'desc'}

			},
			onClose(e) {
				this.tabHeight = 260
			},
			add() {
				this.title = "新增打印模板类别"
				this.changeType = 'add'
				this.form = form()
				this.addShow = true
			},
			handleClose() {
				this.addShow = false
			},
			async getList() {
				this.loading = true
				let res = await this.$_request({
					url: "/Print/PrintModel/GetTypeAll",
					method: "get",
				})
				if(res.data.code === 200) {
					this.loading = false
					this.tableList = res.data.data
				}
			},
			async edit() {
				if(this.selectArr.length !=1 ) {
					return this.$message({
						type: "warning",
						message: "请选择一条数据进行修改"
					})
				}
				this.form = this.selectArr[0]
				this.title = "修改打印模板类别"
				this.changeType = 'edit'
				this.addShow = true
			},
			selectData(e) {
				this.selectArr = e
			},
			async onOk() {
			  this.ui.okLoading = true;
				this.form.ParentId ? this.form.ParentId : this.form.ParentId=0
				let res = await this.$_request({
					url: "/Print/PrintModel/TypeChange",
					method: "post",
					data: this.form
				})
				this.ui.okLoading = false
				this.addShow = false
				this.getList()
				this.$message({
					type: "success",
					message: "添加成功"
				})
				
			},
		},
		mounted() {
			this.getList()
		}
	}
</script>

<style>
	.el-dialog__title{color: #FF696B;}
	 
	.systemUp .avatar-uploader .el-upload {
	    border: 1px dashed #d9d9d9;
	    border-radius: 6px;
	    cursor: pointer;
	    position: relative;
	    overflow: hidden;
	  }
	 .systemUp .avatar-uploader .el-upload:hover {
	    border-color: #409EFF;
	  }
	.systemUp  .avatar-uploader-icon {
	    font-size: 28px;
	    color: #8c939d;
	    width: 108px;
	    height: 108px;
	    line-height: 108px;
	    text-align: center;
	  }
	.systemUp  .avatar {
	    width: 108px;
	    height: 108px;
	    display: block;
	  }
</style>
