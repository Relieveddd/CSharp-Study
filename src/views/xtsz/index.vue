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
			<el-button  @click = "add">新增</el-button>
			<el-button  @click="edit">修改</el-button>
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
			<tableList @orderBy = "orderBy"  :list = "tableList" v-loading="loading" @selectData = "selectData"></tableList>
		</template>
		<template v-slot:pagination >
		  <bottom ref="bottom"  :style="{height: 103 + bottomHeight + 'px'}" :record = "record" @pageIndexChange = "pageIndexChange"></bottom>
		</template>
		<template v-slot:other>
			<el-dialog
			:title="title"
			:visible.sync="addShow"
			width="1000px"
			@close="close"
			>
			  <el-form :model="form" inline label-width="100px">
					<el-form-item label="系统编号" >
					  <el-input v-model="form.F_ServiceCode"></el-input>
					</el-form-item>
					<el-form-item label="系统名称" >
						<el-input v-model="form.F_ServiceName"></el-input>
					</el-form-item>
					<el-form-item label="系统版本">
						<el-input v-model="form.F_ServiceVersion"></el-input>
					</el-form-item>
					<el-form-item label="系统类型" style="width: 100%;">
						<el-table :data="form.F_TypeList" border style="width: 815px;">
							<el-table-column label="平台类型">
								<template slot-scope="scope">
									<el-select v-model="scope.row.F_AppType">
										<el-option label="PC" :value="1"></el-option>
										<el-option label="微信小程序" :value="2"></el-option>
										<el-option label="钉钉" :value="3"></el-option>
									</el-select>
								</template>
							</el-table-column>
							<el-table-column label="平台appid">
								<template slot-scope="scope">
									<el-input v-model="scope.row.F_AppId"></el-input>
								</template>
							</el-table-column>
							<el-table-column label="平台scrent">
								<template slot-scope="scope">
									<el-input v-model="scope.row.F_Scrent"></el-input>
								</template>
							</el-table-column>
							<el-table-column label="关联公司">
								<template slot-scope = "scope">
									<el-select v-if="scope.row.F_AppType == 3" v-model="scope.row.F_ComId" filterable>
										<el-option v-for="item in comList" :label="item.F_Name" :value="item.F_ComId"></el-option>
									</el-select>
								</template>
							</el-table-column>
							<el-table-column align="center" width="150px">
								<template slot="header">
									<el-button @click="addKc" type="primary" icon="el-icon-plus">添加</el-button>
								</template>
								<template slot-scope="scope">
									<el-button @click="removeKc(scope.$index)" type="danger" icon="el-icon-delete-solid">移除</el-button>
								</template>
							</el-table-column>
						</el-table>
					</el-form-item>
			  </el-form>
				<span slot="footer">
					<el-button @click="addShow= false">取 消</el-button>
					<el-button type="primary" @click="submit">确 定</el-button>
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
			"F_ServiceId": "",
			"F_ServiceCode": "",
			"F_ServiceName": "",
			"F_ServiceVersion": "",
			"F_TypeList": [
				{
					"F_Id": "",
					"F_AppType": 0,
					"F_AppId": "",
					"F_Scrent": "",
					"F_ComId": ""
				}
			]
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
				orderJson: {},
				visibleRemove: false,
				title: "新增/修改微服务",
				comList: []
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
				// this.changeType = 'add'
				this.addShow = true
				
			},
			addKc() {
				this.form.F_TypeList.push({
					"F_Id": "",
					"F_AppType": "",
					"F_AppId": "",
					"F_Scrent": "",
					"F_ComId": ""
				})
			},
			removeKc(idx) {
				this.form.F_TypeList.splice(idx,1)
			},
			async submit() {
				let res = await this.$_request({
					url: "/service/Change",
					method: "post",
					data: this.form
				})
				this.addShow = false
				this.getList()
				this.$message({
					message: "操作成功",
					type: "success"
				})
			},
			handleClose() {
				this.addShow = false
			},
			async getList() {
				this.loading = true
				let res = await this.$_request({
					url: "/service/List",
					method: "post",
					data:{}
				})
				if(res.data.code === 200) {
					this.loading = false
					this.record = res.data.record
					this.tableList = res.data.data
				}
			},
			async remove() {
				this.visibleRemove = false
			},
			async edit() {
				this.form = JSON.parse(JSON.stringify(this.selectArr[0]))
				await this.getComList()
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
			close() {
				this.form = {}
			},
			//取得公司列表
			async getComList() {
				console.log(this.selectArr)
				let res = await this.$_request({
					url: "/Base/Company/List",
					method: "post",
					data: {
						pageIndex: 0,
						pageSize: 20,
						queryJson: JSON.stringify({f_ServiceId:this.selectArr[0].F_ServiceId}),
						queryJson_S: ""
					}
				})
				this.comList = res.data.data
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
