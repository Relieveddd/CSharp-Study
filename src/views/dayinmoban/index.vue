<template>
	<mm-atp palign="right">
		<template v-slot:top>
			<alert v-if="!ts"></alert>
		</template>
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
			  <el-button slot="reference">删除</el-button>
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
				:visible.sync="addShow">
				<el-form label-width="130px" >
					<el-form-item label="模板名称">
						<el-input v-model="form.PrintModelName"></el-input>
					</el-form-item>
					<el-form-item label="模板编号">
						<el-input v-model="form.ModelNo"></el-input>
					</el-form-item>
					<el-form-item label="模板分类">
						<el-cascader
								v-model="form.CategoryId"
						    :options="mbTypeArr"
						    :props="{ checkStrictly: true, label: 'CategoryName', value: 'Id',emitPath: false,children: 'Child' }"
						    clearable>
						</el-cascader>
						<!-- <el-select v-model="form.CategoryId" style="width: 200px;" filterable clearable>
							<el-option v-for="item in mbTypeArr" :label="item.CategoryName" :value="item.Id"></el-option>
						</el-select> -->
					</el-form-item>
					<el-form-item label="备注">
						<el-input v-model="form.Remark"></el-input>
					</el-form-item>
					<el-form-item label="模板类型">
						<el-radio-group v-model="form.IsSystem">
						  <el-radio :label="true">系统模板</el-radio>
						  <el-radio :label="false">非系统模板</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="纸张类型">
						<el-radio-group v-model="form.PaperType" @change="getHtml()">
						  <el-radio :label="1">A4</el-radio>
						  <el-radio :label="2">A5</el-radio>
							<el-radio :label="3">自定义大小</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item v-if="form.PaperType == 3" label="纸张大小">
						长(mm)<el-input @change="getHtml()" v-model="form.PaperHeight" style="width: 100px;"></el-input> 宽(mm)<el-input @change="getHtml()" v-model="form.PaperWidth" style="width: 100px;"></el-input>
					</el-form-item>
					<el-form-item label="打印方向" @change="getHtml()">
						<el-radio-group v-model="form.Orient">
						  <el-radio :label="1">纵向</el-radio>
						  <el-radio :label="2">横向</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="表头只在首页显示">
						<el-radio-group v-model="form.IsHeaderOnlyInFirstPage">
						  <el-radio :label="1">是</el-radio>
						  <el-radio :label="0">否</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="表尾只在末页显示">
						<el-radio-group v-model="form.IsFootOnlyInLastPage">
						  <el-radio :label="1">是</el-radio>
						  <el-radio :label="0">否</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="显示页码">
						<el-radio-group v-model="form.IsShowPageNumber">
						  <el-radio :label="1">是</el-radio>
						  <el-radio :label="0">否</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="模板文件" class="systemUp">
						<el-upload
						  ref="upload"
						  :action="uploadAction"
						  :on-success="onUploadSuccess"
						  :on-remove="onUploadRemove()"
							:file-list="fileList"
						  :headers="headers">
							<el-button size="small" type="primary">点击上传</el-button>
						</el-upload>
					</el-form-item>
					<el-form-item label="模板设计">
						<el-button type="primary" @click="dy">点击设计</el-button>
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
	//打印全局函数//
	var LODOP; //声明为全局变量
	
	//检验是否安装插件
	function CheckIsInstall() {
		try{
		  var LODOP=getLodop(); 
			if (LODOP.VERSION) {
				 // if (LODOP.CVERSION)
				 // alert("当前有WEB打印服务C-Lodop可用!\n C-Lodop版本:"+LODOP.CVERSION+"(内含Lodop"+LODOP.VERSION+")"); 
				 // else
				 // alert("本机已成功安装了Lodop控件！\n 版本号:"+LODOP.VERSION); 
		
			};
			return true
		 }catch(err){
			 // window.open('http://ipms.mingm.com.cn/CLodop_Setup_for_Win32NT.exe')
			 return false
		 } 
	}
	
	function install(data) {	 
		try{ 
			var LODOP=getLodop();
			if (LODOP.VERSION) {
				CreateFullBill(data);
				//		LODOP.SET_SHOW_MODE("HIDE_ITEM_LIST",true);//设置对象列表默认处于关闭状态
				//		LODOP.SET_SHOW_MODE("TEXT_SHOW_BORDER",1); //设置字符编辑框默认为single	
				LODOP.PRINT_DESIGN();	
				 if (LODOP.CVERSION){
					 // alert("当前有WEB打印服务C-Lodop可用!\n C-Lodop版本:"+LODOP.CVERSION+"(内含Lodop"+LODOP.VERSION+")"); 
				 }
				 
				 else{
					 //未安装打印插件
					 // alert("本机已成功安装了Lodop控件！\n 版本号:"+LODOP.VERSION); 
				 }
				 // alert("本机已成功安装了Lodop控件！\n 版本号:"+LODOP.VERSION); 

			};
			
		 }catch(err){
			
		 } 
	};
		
	function CreateFullBill(data) {
		LODOP=getLodop();
		// if(data) {
			eval(data); 
		// }
		
		// LODOP.PRINT_INIT("打印控件功能演示_Lodop功能_获得程序代码");
	};	
	
	
	
	import alert from "./components/alert.vue"
	import detailTable from "./components/detailTable";
	import tableList from "./components/table"
	import bottom from "./components/bottom"
	import checkPermission from "@/utils/checkPermission";
	const form = () => {
		return {
			"Id": 0,
			"F_ComId": "",
			"CategoryId": "",
			"ModelNo": "",
			"IsSystem": true,
			"PaperType": "",
			"PaperWidth": "",
			"PaperHeight": "",
			"Orient": "",
			"PrintModelContent": "",
			"Remark": "",
			"FileURL": "",
			IsHeaderOnlyInFirstPage: "",
			IsFootOnlyInLastPage: "",
			IsShowPageNumber: "",
			"PrintModelName": "",
			"Modelfileds": [],
			"ModelTypes": [] //平台不需要关联类型
		}
	}
	export default{
		name: "jiliangdanwei",
		mixins: [checkPermission],
		components:{
			tableList,
			bottom,
			detailTable,
			alert
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
				mbTypeArr: [],
				ui: {
				  okLoading: false
				},
				title: "",
				importShow: false,
				fileList: [],
				ts: true
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
			// 上传
			onUploadSuccess(response,file,fileList) {
			    if(fileList.length>1){
			      fileList.shift();
			    }
			    if(response.code==200){
			      this.form.FileURL = process.env.VUE_APP_API_BASEURL + response.data.F_FilePath;
						this.dialogVisible = true;
						this.getHtml()
			    }
			},
			onUploadRemove() {
			  return function(file, fileList) {
			    
			  };
			},
			updataList() {
				this.getList()
			},
			//取得excle转html的数据
			 async getHtml() {
				 if(this.form.PaperType == 3) {
					if(!(this.form.PaperHeight > 0 && this.form.PaperWidth >0)) {
						return
					}
				 }
				let res = await this.$_request({
					url: "/Print/PrintModel/ExcelToHtmlPreview",
					method: "post",
					data: {
						fileURL: this.form.FileURL,
						paperType: this.form.PaperType,
						orient: this.form.Orient,
						paperHeight: this.form.PaperType == 3 ? this.form.PaperHeight : 0,
						paperWidth: this.form.PaperType == 3 ? this.form.PaperWidth : 0
					}
				})
				this.form.PrintModelContent = res.data
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
				this.pageIndex = 1;
				this.getList()
				
			},
			add() {
				this.form = form()
				this.fileList = []
				if(CheckIsInstall()) {
					this.title = "新增打印模板"
					this.changeType = 'add'
					this.addShow = true
				}else{
					this.$message({
						type: "warning",
						message: "需要下载插件才可使用此功能"
					})
				}
			},
			handleClose() {
				this.addShow = false
			},
			async getList() {
				this.loading = true
				let res = await this.$_request({
					url: "/Print/PrintModel/List",
					method: "post",
					data: {
						pageIndex: this.pageIndex,
						pageSize: this.pageSize,
						queryJson: JSON.stringify({}),
						orderBy: this.orderJson.orderby,
						queryJson_S: JSON.stringify({query: this.keyword}),
						orderAscDesc: this.orderJson.ordertype,
						isShow: 1
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
				if(this.selectArr.length !=1 ) {
					return this.$message({
						type: "warning",
						message: "请选择一条数据进行删除"
					})
				}
				let res = await this.$_request({
					url: "/Print/PrintModel/Delete",
					method: "post",
					params: {
						ids: this.selectArr[0].Id
					}
				})
				this.$message({
					type: "success",
					message: "删除成功"
				})
				this.getList()
			},
			async edit() {
				if(!CheckIsInstall()) {
					this.$message({
						type: "warning",
						message: "需要下载插件才可使用此功能"
					})
					return false
				}
				if(this.selectArr.length !=1 ) {
					return this.$message({
						type: "warning",
						message: "请选择一条数据进行修改"
					})
				}
				let res = await this.$_request({
					url: "/Print/PrintModel/GetSingle",
					method: "get",
					params: {
						id: this.selectArr[0].Id
					}
				})
				this.form = res.data.data
				this.fileList = [{
					name: this.form.FileURL,
					url: this.form.FileURL
				}]
				this.title = "修改打印模板"
				this.changeType = 'edit'
				this.addShow = true
			},
			pageIndexChange(e){
				this.pageIndex = e
				this.getList()
			},
			selectData(e) {
				this.selectArr = e
			},
			rowClick(e) {
				this.tabHeight = 600
				this.isShow = true
				this.orderId = e.Id
			},
			
			//取得模板分类
			async typeList() {
				let res = await this.$_request({
					url: "/Print/PrintModel/GetTypeAll",
					method: "get",
				})
				this.mbTypeArr = res.data.data
			},
			async onOk() {
			  this.ui.okLoading = true;
				if(this.form.PaperType != 3) {
					this.form.PaperWidth = 0
					this.form.PaperHeight = 0
				}
				let res = await this.$_request({
					url: "/Print/PrintModel/Change",
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
			dy() {
				if(this.form.PaperType == 3 && (this.form.PaperWidth<=0 || this.form.PaperHeight<=0)) {
					return this.$message({
						message: "请输入纸张尺寸",
						type: "warning"
					})
				}
				let data = this.form.PrintModelContent
				install(data)
				//关闭输出函数
				let that = this
				if (LODOP.CVERSION) CLODOP.On_Return = function(TaskID,Value){ that.form.PrintModelContent = Value };
				//关闭输出函数
			}
		},
		mounted() {
			// this.getList()
			// this.getPerson()
			this.typeList()
			this.ts = CheckIsInstall()
		}
	}
</script>

<style>
	.el-dialog__title{color: #FF696B;}
</style>
