<template>
	<div style="float: right;margin-left: 10px;">
		<div style="position: relative;width: 105px; cursor: pointer;height: 32px;overflow: hidden;">
			<el-button
				@click="importAlert"
				style="z-index: 10;"
				>产品档案导入</el-button
			>
			<!-- <input style="z-index: 20;opacity: 0; position: absolute;top: -24px;left: 0;width: 100%;height:55px;cursor: pointer;" ref="clearFile" type="file" d="file_input" @change="importf(this)" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" /> -->
		</div>
		<el-dialog 
		fullscreen
		@close="reset"
		:visible.sync="show"
		title="导入预览">
			<el-table :data="tableArr" border>
				<el-table-column type="index" label="序号" width="60"></el-table-column>
				<el-table-column v-for="item in bt" :prop="item.prop" :label="item.label"></el-table-column>
			</el-table>
			<span slot="footer">
			  <el-button @click="closeSelf">取 消</el-button>
			  <el-button type="primary" @click="sureImport" :loading="okLoading"
			    >确 认</el-button
			  >
			</span>
		</el-dialog>
		<el-dialog
			width="500px"
			:visible.sync="optionShow"
			title="导入"
			>
			<div class="imp_title">选择excle文件</div>
			<div class="box">
				<div class="fileName">{{presentation}}</div>
				<div style="position: relative;width: 72px; cursor: pointer;height: 32px;overflow: hidden;">
					<el-button
						@click="importAlert"
						style="z-index: 10;width: 70px;"
						type="primary"
						icon="el-icon-document"
						></el-button
					>
					<input style="z-index: 20;opacity: 0; position: absolute;top: -24px;left: 0;width: 100%;height:55px;cursor: pointer;" ref="clearFile" type="file" d="file_input" @change="importf(this)" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
				</div>
			</div>
			<div>
				<el-select v-model="sheetName" class="sheetName" v-show="file" placeholder="请选择sheet">
					<el-option v-for="item in sheetArr" :label="item" :value="item"></el-option>
				</el-select>
				<el-cascader
					filterable
					placeholder="功能模块"
					v-show="file"
					@change="changeMk"
					class="sheetName"
					v-model="moduleId"
					:options="moduleList"
					:props="{ checkStrictly: true, label:'ModuleName', value: 'Id', children: 'ChildList', emitPath: false }"
					clearable></el-cascader>
					<!-- //选择模板 -->
					<el-select v-show="moduleId" v-model="templateId" class="sheetName" clearable filterable placeholder="请选择模板">
						<el-option v-for="item in mbArr" :label="item.TemplateName" :value="item.Id"></el-option>
					</el-select>
			</div>
			<span slot="footer">
			  <el-button @click="closeSelf">取 消</el-button>
			  <el-button type="primary" @click="fileBtn" :loading="okLoading"
			    >确 认</el-button
			  >
			</span>
		</el-dialog>
	</div>
	
</template>

<script>
	import XLSX from "xlsx";
	export default{
		data() {
			return{
				tableArr: [{
					产品类别: 123
				}],
				show: false,
				file: "",
				okLoading: false,
				optionShow: false,
				presentation: "请选择文件",
				sheetName: "",
				sheetArr: [],
				bt: [],
				moduleList: [],
				moduleId: "",
				templateId: "",
				mbArr: []
			}
		},
		methods:{
			//导入选项
			async importAlert() {
				this.optionShow = true
				this.getModuleList()
				// let res = await 
			},
			//导入产品档案
			importf(obj) {
					let that= this;
					let inputDOM = this.$refs.inputer; // 通过DOM取文件数据
					this.file = event.currentTarget.files[0];
					let formData = new FormData();
					this.presentation = this.file.name
					formData.append('file',this.file,this.file.name)
					this.$refs.clearFile.value = null;
					var rABS = false; //是否将文件读取为二进制字符串
					var f = this.file;
					var reader = new FileReader();
					//if (!FileReader.prototype.readAsBinaryString) {
					FileReader.prototype.readAsBinaryString = function(f) {
					 var binary = "";
					 var rABS = false; //是否将文件读取为二进制字符串
					 var pt = this;
					 var wb; //读取完成的数据
					 var outdata;
					 var reader = new FileReader();
					 reader.onload = function(e) {
						var bytes = new Uint8Array(reader.result);
						var length = bytes.byteLength;
						for (var i = 0; i < length; i++) {
						 binary += String.fromCharCode(bytes[i]);
						}
						var XLSX = require("xlsx");
						if (rABS) {
						 wb = XLSX.read(btoa(fixdata(binary)), {
							//手动转化
							type: "base64"
						 });
						} else {
						 wb = XLSX.read(binary, {
							type: "binary"
						 });
						}
						that.sheetArr = wb.SheetNames
						// outdata就是你想要的东西 excel导入的数据
						
						// outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
						// excel 数据再处理
						// that.tableArr = outdata
						// 这里需要注意名字一定要和excel的内容的文字对上
						// 放入到element的table中显示出来
					 };
					 reader.readAsArrayBuffer(f);
					};
					if (rABS) {
					 reader.readAsArrayBuffer(f);
					} else {
					 reader.readAsBinaryString(f);
					}
					// 这里补个时间问题，excel的时间格式是序列号，如果用的上需要转化
					// 需要在这个位置加上调用方法
				 //  outdata.map(v => {
				 //   let obj = {};
				 //   obj.f_BirthDay= ExcelDateToJSDate(v.出生日期);
						 // obj.f_BusInsuranceExpire= ExcelDateToJSDate(v.商业险到期日期);
				 //   arr.push(obj);
				 //  });
					// 这个方法暂时是目前找的比较好，日期不是很精确，精确不到秒（暂未查出小时和分钟出问题），excel日期序列号装换成时间格式，
					function ExcelDateToJSDate(serial) {
					 let utc_days = Math.floor(serial - 25569);
					 let utc_value = utc_days * 86400;
					 let date_info = new Date(utc_value * 1000);
					 let fractional_day = serial - Math.floor(serial) + 0.0000001;
					 let total_seconds = Math.floor(86400 * fractional_day);
					 let seconds = total_seconds % 60;
					 total_seconds -= seconds;
					 let hours = Math.floor(total_seconds / (60 * 60));
					 let minutes = Math.floor(total_seconds / 60) % 60;
					 let ctime=new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
					// 这是时间拼接，需要什么格式可以自行拼接
					 return (ctime.getFullYear()+'-'+(ctime.getMonth()+1)+'-'+ctime.getDate());
					}
						// this.show = true
			},
			// 导入产品档案
			// 上传按钮
			async fileBtn() {
				if(!this.templateId) {
					return this.$message({
						type: "warning",
						message: "请选择导入模板"
					})
				}
				this.okLoading = true
				let formData = new FormData();
				formData.append('file',this.file,this.file.name)
				
				let res = await this.$_request({
					url: "/Base/File/UploadFile",
					method: "post",
					data: formData
				})
				let res1 = await this.$_request({
					url: "/eximport/Template/GetTemplateAndExcelHeadersWithData",
					method: 'post',
					data: {
						excelPath: res.data.data.F_FilePath,//文件路径
						templateId: this.templateId,//模板id
						templateType: 1,//1导入 2导出
						dataType: 1,// 1一对一 2一对多
						masterSheetName: this.sheetName,//sheet名称
						detailSheetName: "", //当数据类型为一对多时明细所对应的sheet名称(为空 则默认取第2个sheet)一对一时可忽略此字段
						masterEntityFieldDesc: "" //一对多时明细对应的主表系统字段(例如订单与订单明细 一对多类型导入时 明细sheet中和主sheet中都有表头'订单编号')若为空 则默认取明细中与主sheet相同的表头字段一对一导入时忽略此字段
					}
				})
				//取得表头
				if(res1.data.data.FieldList) {
					this.bt = res1.data.data.FieldList[0].Field.map(x => {
						return {
							label: x.CustomeFieldName,
							prop: x.EntityFieldName
						}
					})
					//取得数据
					this.tableArr = res1.data.data.FieldList.map(x => {
						let json = {}
						x.Field.map(d => {
							json[d.EntityFieldName] = d.ExcelValue
						})
						return json
					})
				}
				this.okLoading = false
				this.show = true
			},
			async sureImport() {
				this.okLoading = true
				let res = await this.$_request({
					url: "/pr/ProductInfo/ChangeBatchNew",
					method: "post",
					data: {
						productInfoList: this.tableArr
					}
				})
				this.$message({
					type: "success",
					message: "操作成功"
				})
				this.okLoading = false
				this.optionShow = false
				this.show = false
			},
			closeSelf() {
				this.file =null
				this.templateId = ""
				this.moduleId = ""
				this.sheetName = ""
				this.optionShow = false
				this.show = false
			},
			reset() {
				this.file =null
				this.tableArr = []
				this.okLoading = false
			},
			//选择模块事件
			changeMk() {
				this.templateId = ""
				this.getMbList()
			},
			//取得模块列表
			async getModuleList() {
				let res = await this.$_request({
					url: "/eximport/Module/All",
					method: "post"
				})
				this.moduleList = res.data.data
			},
			//取得模板列表
			async getMbList() {
				let res = await this.$_request({
					url: "/eximport/Template/List",
					method: "post",
					data: {
						pageIndex: 1,
						pageSize: 99999,
						templateType: 1,
						moduleId: this.moduleId
					}
				})
				this.mbArr = res.data.data
			}
		}
	}
</script>

<style lang="scss" scoped>
	.imp_title{
		font-size: 12px;
		color: #333;
		margin-bottom: 5px;
	}
	.sheetName{
		width: 100%;
		::v-deep input{
			border: none;
			border-bottom: 1px solid #dcdfe6;
			border-radius: 0;
			border-color: #dcdfe6;
		}
	}
	.box{
		display: flex;
		justify-content: center;
		// align-items: center;
		.fileName{
			color: #CCCCCC;
			line-height: 32px;
			box-sizing: border-box;
			flex: 1;
			border-bottom: 1px solid #dcdfe6;
		}
	}
</style>
