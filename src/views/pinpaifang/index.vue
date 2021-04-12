<template>
	<mm-atp palign="right">
		<template v-slot:action-left>
			<el-col :span="18">
				<el-input placeholder="请输入内容" v-model="keyword" class="input-with-select" @keyup.enter.native="search">
				    <el-button slot="append" icon="el-icon-search" @click="search(true)"></el-button>
				</el-input>
			</el-col>
		</template>
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
			  <el-button slot="reference">删除</el-button>
			</el-popover>
		</template>
		<template v-slot:table>
			<tableList @rowClick="rowClick" @orderBy = "orderBy"  :list = "tableList" v-loading="loading" @selectData = "selectData"></tableList>
		</template>
		<template v-slot:pagination >
		  <bottom ref="bottom"  :style="{height: 103 + bottomHeight + 'px'}" :record = "record" @pageIndexChange = "pageIndexChange"></bottom>
		</template>
		<!-- <template v-slot:bottom>
			<g-bf :visible.sync="isShow" @close="onClose">
				<detail-table :isShow = "isShow" :orderId="orderId"></detail-table>
			</g-bf>
		</template> -->
		<template v-slot:other>
			<el-dialog
			:title="title"
			:visible.sync="showAdd"
			width="640px"
			>
			  <el-form :model="form" inline label-width="85px">
					<el-form-item label="名称" >
					  <el-input v-model="form.Name"></el-input>
					</el-form-item>
					<el-form-item label="联系人">
						<el-input v-model="form.ContactPerson" style="width: 200px;"></el-input>
					</el-form-item>
					<el-form-item label="联系电话">
						<el-input v-model="form.Tel" style="width: 200px;"></el-input>
					</el-form-item>
					<el-form-item label="所在地">
						<el-input v-model="form.Addr" style="width: 200px;"></el-input>
					</el-form-item>
					<el-form-item label="关联供应商">
						<el-select v-model="form.SupplyId" filterable style="width: 200px;">
							<el-option v-for="item in gysArr" :value="item.Id" :label="item.Name"></el-option>
						</el-select>
					</el-form-item>
					
					
			  </el-form>
				<span slot="footer">
					<el-button @click="showAdd = false">取 消</el-button>
					<el-button type="primary" @click="submit">确 定</el-button>
				</span>
			</el-dialog>
		</template>
	</mm-atp>
</template>

<script>
	import detailTable from "./components/detailTable";
	import tableList from "./components/table"
	import bottom from "./components/bottom"
	import checkPermission from "@/utils/checkPermission";
	const form = () => {
		return {
			"Id": "",
			"F_ComId": "",
			SupplyId: "",
			"Name": "",
			Addr: "",
			ContactPerson: "",
			Tel: ""
		}
	}
	export default{
		name: "jiliangdanwei",
		mixins: [checkPermission],
		components:{
			tableList,
			bottom,
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
				showAdd: false,
				title: "新增品牌方",
				gysArr: []
			}
		},
		computed:{
			uploadAction() {
			  return `${process.env.VUE_APP_API_BASEURL || ""}/Base/File/UploadFile`;
			},
			headers() {
			  return {Authorization: this.$store.state.user.token}
			}
		},
		methods:{
			orderBy(e) {
				this.orderJson = {orderby: e.prop, ordertype: e.order === 'ascending' ? 'asc' : 'desc'}
				if(this.keyword ) {
					this.search()
				}else{
					this.getList()
				}
			},
			onClose(e) {
				this.tabHeight = 260
			},
			async search(noSearch) {
				this.keyword = this.keyword.replace(/\s+/g,"");
				
			},
			onUploadSuccess(response,file,fileList) {
			    if(fileList.length>1){
			      fileList.shift();
			    }
			    if(response.code==200){
			      this.form.BusinessLicenceSrc = process.env.VUE_APP_API_BASEURL+response.data.F_FilePath;
			    }
			},
			onUploadRemove() {
			  return function(file, fileList) {
			    
			  };
			},
			async submit() {
				let res = await this.$_request({
					url: "/sc/Manufacture/Change",
					method: "post",
					data: this.form
				})
				this.showAdd = false
				this.getList()
				this.$message({
					message: "操作成功",
					type: "success"
				})
			},
			add() {
				// this.changeType = 'add'
				this.title = "新增品牌方"
				this.form = form()
				this.showAdd = true
			},
			handleClose() {
				this.addShow = false
			},
			async getList() {
				this.loading = true
				let res = await this.$_request({
					url: "/sc/Manufacture/List",
					method: "post",
					data: {
						pageIndex: this.pageIndex,
						pageSize: this.pageSize,
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
				if(this.selectArr.length !== 1) {
					this.$message({
						type:"warning",
						message: "请选择一条删除"
					})
				}else{
					this.loading = true
					let res = await	this.$_request({
							url: "/sc/Manufacture/Del",
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
					this.isShow = false
				}
			},
			async edit() {
				this.title = "修改品牌方"
				console.log(this.selectArr[0])
				this.form = this.selectArr[0]
				console.log(this.form)
				this.showAdd = true
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
				return false
				this.tabHeight = 600
				this.isShow = true
				this.orderId = e.Id
			},
			async getGys() {
				let res = await this.$_request({
					url: "/sc/BaseInfo/List",
					method: "post",
					data: {
						queryJson: JSON.stringify({type: 1}),
						pageSize: 999999,
						pageIndex: 1
					}
				})
				console.log(res)
				this.gysArr = res.data.data
			}
		},
		mounted() {
			this.getGys()
			this.getList()
		}
	}
</script>

<style>
	.el-dialog__title{color: #FF696B;}
	.avatar-uploader .el-upload {
	    border: 1px dashed #d9d9d9;
	    border-radius: 6px;
	    cursor: pointer;
	    position: relative;
	    overflow: hidden;
	  }
	  .avatar-uploader .el-upload:hover {
	    border-color: #409EFF;
	  }
	  .avatar-uploader-icon {
	    font-size: 28px;
	    color: #8c939d;
	    width: 108px;
	    height: 108px;
	    line-height: 108px;
	    text-align: center;
	  }
	  .avatar {
	    width: 108px;
	    height: 108px;
	    display: block;
	  }
</style>
