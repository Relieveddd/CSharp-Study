<template>
	<div style="height: 100%;">
		<el-container style="height: 100%;">
			<el-aside style="width: 200px;border: 1px solid #c5c5c5;overflow: auto;height: calc(100);">
				<div style="line-height: 31px;padding-left: 9px;border-bottom: 1px solid #c5c5c5;">类别列表</div>
				<el-tree :data="productTypeArr" :props="{children: 'ChildList',label: 'Name'}" @node-click="handleNodeClick"></el-tree>
			</el-aside>
			<el-main style="padding-top: 0;padding-bottom: 0px;">
				<el-row type="flex" justify="space-between" style="margin-bottom: 10px;">
					<el-col :span="5">
						<el-input style="width: 100%;" placeholder="请输入内容" v-model="keyword" class="input-with-select" @keyup.enter.native="search">
						    <el-button slot="append" icon="el-icon-search" @click="search(true)"></el-button>
						</el-input>
						
					</el-col>
					<el-col :span="4">
						<el-checkbox style="line-height: 32px;" @change="checkedChange" v-model="checked">查看无效</el-checkbox>
					</el-col>
					<el-col :span="13">
						<div style="width: 100%;overflow: hidden;">
							<div style="float: right;">
								<el-button  @click = "add">新增</el-button>
								<el-button  @click="edit">修改</el-button>
								<el-button v-if="checkButton('platFormImp')" @click="import_pt">平台导入</el-button>
								<!-- <el-button v-if="checkButton('remove')" @click="remove">删除</el-button> -->
								<el-popover
								  placement="top"
								  width="160"
								  v-model="visible">
								  <p>确定删除吗？</p>
								  <div style="text-align: right; margin: 0">
								    <el-button size="mini" type="text" @click="visible = false">取消</el-button>
								    <el-button type="primary" size="mini" @click="remove">确定</el-button>
								  </div>
								  <el-button style="margin-left: 10px;"  slot="reference">删除</el-button>
								</el-popover>
								<el-button  @click="download" style="margin-left: 10px;" v-if="productId == ''">导入模板</el-button>
								<importTable :importShow="importShow"  @updataList="updataList"></importTable>
								<g-exportG moduleId="1201af21-df3b-4844-ac1d-a3eb7b112ded" v-if="checkButton('export')"></g-exportG>
							</div>
						</div>
					</el-col>
				</el-row>
				<tableList :style="{height: 'calc(100vh - '+tabHeight+'px)', overflow: 'auto'}" :list = "tableList" v-loading="loading" @selectData = "selectData"></tableList>
				<bottom :style="{height: 103 + bottomHeight + 'px'}" :record = "record" @pageIndexChange = "pageIndexChange" :pageSize = "pageSize" :pageIndex="pageIndex"></bottom>
			</el-main>
		</el-container>
		
		
		<el-dialog
		  :title="title"
			fullscreen
			v-loading="addProLoading"
		  :visible.sync="addShow"
		  width="800px"
			@close="handleClose">
			<el-tabs v-model="tabName" @tab-click="tabClick" type="card">
				<el-tab-pane label="基础资料" name="first">
					<div>
						<el-form :inline="true" label-width="100px"  ref="form" :rules="rules" :model="form">
							<el-form-item label="款式编码" prop="styleId">
								<el-select style="width: 200px;" v-model="form.styleId" filterable>
									<el-option v-for="item in styleArr" :label="item.Name" :value="item.Id"></el-option>
								</el-select>
							</el-form-item>
							<!-- <el-form-item  label="款式编码" prop="styleCode">
								<el-input style="width: 200px;" v-model="form.styleCode"></el-input>
							</el-form-item> -->
							<el-form-item  label="69码" prop="code69">
								<el-input v-model="form.code69"></el-input>
							</el-form-item>
							<el-form-item label="产品类别" prop="productTypeId">
								<el-cascader
								  style="width: 200px;"
								  v-model="form.productTypeId"
									@change="selectProType"
								  :options="productTypeArr"
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
							<el-form-item  label="产品编码" prop="code">
								<el-input v-model="form.code"></el-input>
							</el-form-item>
							<el-form-item  label="产品名称" prop="name">
								<el-input v-model="form.name"></el-input>
							</el-form-item>
							<!-- <el-form-item  label="产品别称" prop="nickName">
								<el-input v-model="form.nickName"></el-input>
							</el-form-item> -->
							<el-form-item  label="产品型号" prop="modelBrand">
								<el-input v-model="form.modelBrand"></el-input>
							</el-form-item>
							<el-form-item  label="产品规格">
								<el-input v-model="form.spec"></el-input>
							</el-form-item>
							<el-form-item  label="品牌方">
								<el-select style="width: 200px;" v-model="form.manufactureIdList" filterable multiple>
									<el-option v-for="item in scsArr" :label="item.Name" :value="item.Id"></el-option>
								</el-select>
							</el-form-item>
							<!-- <el-form-item  label="供应商">
								<el-select style="width: 200px;" v-model="form.supplyIdList" filterable multiple>
									<el-option v-for="item in gysArr" :label="item.Name" :value="item.Id"></el-option>
								</el-select>
							</el-form-item> -->
							<el-form-item label="最小计量单位" >
								<el-select v-model="form.dataItemDetailId_MainUnit" style="width: 200px;">
									<el-option v-for="item in jldwArr" :label="item.ItemName" :value="item.Id"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item  label="保质期">
								<el-input v-model="form.expirationDate"></el-input>
							</el-form-item>
							<el-form-item  label="上市时间" prop="publishTime">
							 <el-date-picker
									style="width: 200px;"
									v-model="form.publishTime"
									value-format="yyyy-MM-dd"
									type="date"
									placeholder="选择日期">
								</el-date-picker>
							</el-form-item>
							<el-form-item label="重量" >
								<el-input v-model="form.weight"></el-input>
							</el-form-item>
							<el-form-item label="长宽高" >
								<el-input placeholder="长" style="width: 60px;" v-model="form.length"></el-input>
								<el-input placeholder="宽" style="width: 60px;margin-left: 10px;" v-model="form.width"></el-input>
								<el-input placeholder="高" style="width: 60px;margin-left: 10px;" v-model="form.height"></el-input>
							</el-form-item>
							<el-form-item label="执行标准" >
								<el-input v-model="form.standard"></el-input>
							</el-form-item>
							<!-- <el-form-item label="最低库存" >
								<el-input v-model="form.minimumInventory"></el-input>
							</el-form-item>
							<el-form-item label="最高库存" >
								<el-input v-model="form.maximumInventory"></el-input>
							</el-form-item> -->
							<el-form-item  label="是否可用" prop="enable">
								<el-radio-group v-model="form.enable">
								  <el-radio :label="1">是</el-radio>
								  <el-radio :label="0">否</el-radio>
								</el-radio-group>
							</el-form-item>
							
							<el-form-item style="width: 100%;text-align: center;" class="form_table" v-show="sxData.length>0">
								<el-table :data="sxData" border style="width: 100%;margin: 0 auto;">
									<el-table-column label="规格" align="center">
										<el-table-column label="规格名" align="center">
											<template slot-scope="scope" v-if="isSxSpec[scope.$index]">
												{{scope.$index < isSxSpec.length ? isSxSpec[scope.$index].propertyName : ""}}
											</template>
										</el-table-column>
										<el-table-column label="规格值" align="center">
											<template slot-scope="scope" v-if="isSxSpec[scope.$index]">
												<el-input v-if="isSxSpec[scope.$index].isEnter && isSxSpec[scope.$index].isEnter==1" v-model="isSxSpec[scope.$index].propertyValue"></el-input>
												<el-select v-else v-model="isSxSpec[scope.$index].propertyValue">
													<el-option
													v-for="item in isSxSpec[scope.$index].propertyValueArr"
													:label="item"
													:value="item">
													</el-option>
												</el-select>
											</template>
										</el-table-column>
									</el-table-column>
									<el-table-column label="属性" align="center">
										<el-table-column label="属性名" align="center">
											<template slot-scope="scope" v-if="noSxSpec[scope.$index]">
												{{scope.$index < noSxSpec.length ? noSxSpec[scope.$index].propertyName : ""}}
											</template>
										</el-table-column>
										<el-table-column label="属性值" align="center">
											<template slot-scope="scope" v-if="noSxSpec[scope.$index]">
												<el-input v-if="noSxSpec[scope.$index].isEnter && noSxSpec[scope.$index].isEnter==1" v-model="noSxSpec[scope.$index].propertyValue"></el-input>
												<el-select v-else v-model="noSxSpec[scope.$index].propertyValue">
													<el-option
													v-for="item in noSxSpec[scope.$index].propertyValueArr"
													:label="item"
													:value="item">
													</el-option>
												</el-select>
											</template>
										</el-table-column>
									</el-table-column>
								</el-table>
							</el-form-item>
							<el-form-item style="display: block;">
								<el-upload
									class="avatar-uploader"
								  multiple
								  ref="upload"
								  :action="uploadAction"
								  :on-success="onUploadSuccess"
								  :on-remove="onUploadRemove()"
								  :headers="headers">
									<img v-if="form.img" :src="form.img" class="avatar">
								  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
								</el-upload>
							</el-form-item>
						</el-form>
					</div>
				</el-tab-pane>
				<!-- //编码管理 -->
				<el-tab-pane label="合作伙伴" name="four">
					<div style="text-align: right;margin-bottom: 10px;">
						<el-button @click="addbmdz">新增</el-button>
						<!-- <el-button @click='removebmdz'>禁用</el-button> -->
					</div>
					<el-table :data="list_bmdz" border @select="selectBmdz">
						<el-table-column type="selection"></el-table-column>
						<el-table-column type="index" label="序号"></el-table-column>
						<el-table-column label="单位编码" prop="externalUnitCode"></el-table-column>
						<el-table-column label="单位名称" prop="externalUnitName"></el-table-column>
						<el-table-column label="产品编码" prop="code"></el-table-column>
						<el-table-column label="产品名称" prop="name"></el-table-column>
						<el-table-column label="产品型号" prop="model"></el-table-column>
						<el-table-column label="类型">
							<template slot-scope="scope">
								{{scope.row.externalUnitType == 1 ? '客户' : '供应商'}}
							</template>
						</el-table-column>
						<el-table-column label="是否启用" ref="isQy" :filters = "[{text: '启用', value: 1}, {text: '禁用', value: 0}]" :filter-method = "filterFun">
							<template slot-scope="scope">
								<el-switch
									@change="changeEnable($event, scope.row)"
								  v-model="scope.row.enable"
								  active-color="#13ce66"
								  inactive-color="#ccc"
									:active-value="1"
									:inactive-value="0">
								</el-switch>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
				<!-- //产品别称 -->
				<el-tab-pane label="产品别称" name="second">
					<el-table :data="form.nickName" border style="width: 740px;">
						<el-table-column type="index" label="序号"></el-table-column>
						<el-table-column label="别称" align="center">
							<template slot-scope = "scope">
								<el-input v-model="scope.row.value"></el-input>
							</template>
						</el-table-column>
						<el-table-column align="center" width="150px">
							<template slot="header">
								<el-button @click="addBc" type="primary" icon="el-icon-plus">添加</el-button>
							</template>
							<template slot-scope="scope">
								<el-button @click="removeBc(scope.$index)" type="danger" icon="el-icon-delete-solid">移除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
				<el-tab-pane label="换算关系" name="third">
					<div style="text-align: right;margin-bottom: 10px;">
						<el-button @click="addJldw">新增</el-button>
						<el-button @click='removeJldw'>取关</el-button>
					</div>
					<el-table :data="jldw_list" border @select="jldwSelect">
						<el-table-column type="selection"></el-table-column>
						<el-table-column type="index" label="序号"></el-table-column>
						<el-table-column prop="MainUnit" label="副计量单位" show-overflow-tooltip>
							<template slot-scope = "scope">
								{{jldwHash[scope.row.dataItemDetailId_MainUnit]}}
							</template>
						</el-table-column>
						<el-table-column prop="SubUnit" label="主计量单位" show-overflow-tooltip>
							<template slot-scope = "scope">
								{{jldwHash[scope.row.dataItemDetailId_SubUnit]}}
							</template>
						</el-table-column>
						<el-table-column prop="ConversionRelation" label="换算关系" show-overflow-tooltip>
							<template slot-scope="scope">
								{{'1'+jldwHash[scope.row.dataItemDetailId_MainUnit] + '=' + scope.row.conversionRelation + jldwHash[scope.row.dataItemDetailId_SubUnit]}}
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
				
				<!-- //库存管理 -->
				<el-tab-pane label="库存管理" name="five">
					<el-table :data="list_kc" border>
						<el-table-column label="仓库">
							<template slot-scope="scope">
								<el-select v-model="scope.row.warehouseId" filterable clearable>
									<el-option
										v-for="item in whList"
										:key="item.F_WId"
										:label="item.F_WHName"
										:value="item.F_WId"
									></el-option>
								</el-select>
							</template>
						</el-table-column>
						<el-table-column label="最高库存">
							<template slot-scope="scope">
								<el-input v-model="scope.row.maximumInventory"></el-input>
							</template>
						</el-table-column>
						<el-table-column label="最低库存">
							<template slot-scope="scope">
								<el-input v-model="scope.row.minimumInventory"></el-input>
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
				</el-tab-pane>
				<el-tab-pane label="铭牌" v-if="Mp">
					<el-table :data="list_mp" border>
						<el-table-column label="名牌类型">
							<template slot-scope="scope">
								<el-select v-model="scope.row.Id" @change="mpChange($event, scope.$index)" filterable clearable>
									<el-option
										v-for="item in mpList"
										:label="item.NamePlateTypeName"
										:value="item.Id"
									></el-option>
								</el-select>
							</template>
						</el-table-column>
						<el-table-column label="铭牌材质" prop="Material"></el-table-column>
						<el-table-column label="铭牌规格" prop="Spec"></el-table-column>
						<el-table-column label="铭牌数量" prop="Num"></el-table-column>
						<el-table-column align="center" width="150px">
							<template slot="header">
								<el-button @click="addMp" type="primary" icon="el-icon-plus">添加</el-button>
							</template>
							<template slot-scope="scope">
								<el-button @click="removeMp(scope.$index)" type="danger" icon="el-icon-delete-solid">移除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
			</el-tabs>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="addShow = false">取 消</el-button>
		    <el-button type="primary" @click="submitForm('form')">确 定</el-button>
		  </span>
			<!-- //计量单位 -->
			<el-dialog
			  title="新增换算关系"
				append-to-body
			  :visible.sync="jldwShow"
			  width="600px">
			  <div>
					<el-form :inline="true" label-width="80px"  ref="form_jldw"  :model="jldwForm">
						<el-form-item label="单位换算"  prop="dataItemDetailId_MainUnit">
							<span>1</span>
						  <el-select style="width: 100px;" v-model="jldwForm.dataItemDetailId_MainUnit" filterable placeholder="请选择">
						    <el-option
						      v-for="item in jldwArr"
						      :key="item.Id"
						      :label="item.ItemName"
						      :value="item.Id">
						    </el-option>
						  </el-select>
						</el-form-item>
						<el-form-item>
							<span>=</span>
						</el-form-item>
						<el-form-item prop="conversionRelation">
							<el-input-number v-model="jldwForm.conversionRelation"></el-input-number>
						</el-form-item>
						<el-form-item prop="dataItemDetailId_SubUnit">
							<el-select style="width: 100px;" v-model="form.dataItemDetailId_MainUnit" filterable placeholder="请选择" disabled>
							  <el-option
							    v-for="item in jldwArr"
							    :key="item.Id"
							    :label="item.ItemName"
							    :value="item.Id">
							  </el-option>
							</el-select>
						</el-form-item>
					</el-form>
				</div>
			  <span slot="footer" class="dialog-footer">
			    <el-button @click="jldwShow = false">取 消</el-button>
			    <el-button type="primary" @click="sureJldw">确 定</el-button>
			  </span>
			</el-dialog>
			<!-- //新增编码对照 -->
			<el-dialog
			  title="新增编码对照表"
			  :visible.sync="bmdzShow"
			  width="740px"
				append-to-body
			  >
			  <div>
					<el-form label-position="right" label-width="120px"  ref="bmdzForm"  :model="bmdzForm" inline>
						<el-form-item label="合作伙伴类型"  prop="externalUnitType" required :error="$v.bmdzForm.externalUnitType.$error ? '必填' : ''">
						  <el-select v-model="bmdzForm.externalUnitType" filterable placeholder="请选择" style="width: 200px;" @change="bmdzTypeChange">
						    <el-option label="客户" value="1"></el-option>
								<el-option label="供应商" value="2"></el-option>
						  </el-select>
						</el-form-item>
						<el-form-item  label="合作伙伴名称" required :error="$v.bmdzForm.supplyId.$error ? '必填' : ''">
							<el-select style="width: 200px;" @change="bmdzNameChange" v-model="bmdzForm.supplyId" filterable placeholder="请先选择合作伙伴类型">
								<el-option v-for="item in gysArr" :label="item.Name" :value="item.Id"></el-option>
							</el-select>
						</el-form-item>
						<!-- <el-form-item label="合作伙伴名称" prop="externalUnitName">
							<el-input v-model="bmdzForm.externalUnitName"></el-input>
						</el-form-item> -->
						<!-- <el-form-item label="外部单位编码" prop="externalUnitCode">
							<el-input v-model="bmdzForm.externalUnitCode"></el-input>
						</el-form-item> -->
						<el-form-item label="产品编码" prop="code">
							<el-input v-model="bmdzForm.code"></el-input>
						</el-form-item>
						<el-form-item label="产品名称" prop="name" >
							<el-input v-model="bmdzForm.name"></el-input>
						</el-form-item>
						<el-form-item label="产品型号" prop="model">
							<el-input v-model="bmdzForm.model"></el-input>
						</el-form-item>
					</el-form>
				</div>
			  <span slot="footer" class="dialog-footer">
			    <el-button @click="bmdzShow = false">取 消</el-button>
			    <el-button type="primary" @click="sureBmdz">确 定</el-button>
			  </span>
			</el-dialog>
		</el-dialog>
		<pt :ptShow="ptShow" @upPtShow="upPtShow"></pt>
	</div>
</template>

<script>
	import pt from "./components/pt.vue"
	import tableList from "./components/table"
	import bottom from "./components/bottom"
	import checkPermission from "@/utils/checkPermission";
	import importTable from "./components/importTable.vue"
	import { required, idcard } from "@/utils/validator";
	import IDValidator from "id-validator";
	let Validator = new IDValidator();
	const form = () => {
		return {
			id: "",
			code: "",
			name: "",
			modelBrand: "",
			f_ComId: "",
			publishTime: "",
			productTypeId: "",
			spec: "",
			enable: 1,
			productInfoPropertyList: [],
			img: "",
			styleCode: "",
			code69: "",
			styleId: "",
			nickName: [],
			weight: "",
			length: "",
			width: "",
			height: "",
			standard: "",
			expirationDate: "",
			minimumInventory: "",
			maximumInventory: "",
			supplyIdList: [],
			manufactureIdList: [],
			dataItemDetailId_MainUnit: "",
		}
	}
	const form_jldw = () => {
		return {
			id: "",
			f_ComId: "",
			dataItemDetailId_MainUnit: "",
			dataItemDetailId_SubUnit: "",
			conversionRelation: ""
		}
	}
	//编码对照
	const form_bmdz = () => {
		return {
			id: "",
			code: "",
			name: "",
			model: "",
			f_ComId: "",
			externalUnitCode: "",
			supplyId: "",
			externalUnitType: "",
			enable: 1
		}
	}
	//关联库存
	const form_kc = () => {
		return {
			"id": "",
			"f_ComId": "",
			"productId": "",
			"warehouseId": "",
			"minimumInventory": 0,
			"maximumInventory": 0
		}
	}
	//关联铭牌
	const form_mp = () => {
		return {
			"Id": "",
			"F_ComId": "",
			"Material": "",
			"NamePlateTypeId": "",
			"Num": 0,
			"Spec": ""
		}
	}
	export default{
		name: "chengfenqingdan",
		props:{
			productId: {
				type: String,
				default: ""
			}
		},
		mixins: [checkPermission],
		components:{
			tableList,
			bottom,
			importTable,
			pt
		},
		data() {
			return {
				value: "",
				select: "1",
				addShow: false,
				form: form(),
				jldwForm: form_jldw(),
				rules: {
					// code: [
					// 	{  trigger: 'blur', required: true, message: '产品编码不得为空' }
					// ],
					name: [
						{  trigger: 'blur', required: true, message: '产品名称不得为空' }
					],
					// modelBrand: [
					// 	{  trigger: 'blur', required: true, message: '产品型号不得为空' }
					// ],
					productTypeId: [
						{  trigger: 'change', required: true, message: '产品类别不得为空' }
					],
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
				importShow: false,
				productTypeArr: [],
				surfaceTreatArr: [],
				isSxSpec: [],
				noSxSpec: [],
				sxData: [],
				gysArr: [],
				scsArr: [],
				jldwArr: [],
				tabName: "first",
				jldw_list: [],
				jldwShow: false,
				jldwHash: {},
				jldwSelectArr: [],
				bmdzShow: false,
				bmdzForm: form_bmdz(),
				kcForm: form_kc(),
				mpForm: form_mp(),
				list_kc: [],
				list_mp: [],
				mpList: [],
				whList: [],
				styleArr: [],
				list_bmdz: [],
				bmdzSelectArr: [],
				addProLoading: false,
				visible: false,
				removeIds: [],
				// removeMpIds: [],
				title: '新增产品档案',
				keyword: '',
				ptShow: false,
				productTypeIdSel: "",
				checked: false,
				Mp: true, //隐藏铭牌
			}
		},
		validations: {
			jldwForm: {
				dataItemDetailId_MainUnit: {
					required
				},
				conversionRelation: {
					required
				}
			},
			bmdzForm: {
				code: {
				},
				name: {
				},
				externalUnitType: {
					required
				},
				supplyId: {
					required
				}
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
			upPtShow(e) {
				this.ptShow = e
				this.getList()
			},
			import_pt() {
				this.ptShow=true
			},
			async search(noSearch) {
				this.pageIndex = 1
				this.keyword = this.keyword.replace(/\s+/g,"");
				this.pageIndexChange()
			},
			async searchList() {
				this.loading = true
				let res = await this.$_request({
					url: '/pr/ProductInfo/ListSearch',
					method: 'post',
					data: {
						searchKey: this.keyword,
						pageSize: this.pageSize,
						pageIndex: this.pageIndex
					}
				})
				this.loading = false
				this.record = res.data.record
				this.tableList = res.data.data
			},
			async changeEnable(e, row) {
				this.addProLoading = true
				if(row.id && e == 0) {
					let res = await this.$_request({
						url: "/pr/CodeComparison/DisCodeComparison",
						method: 'post',
						data: {
							idList: [row.id]
						}
					})
				}
				if(row.id && e == 1) {
					let res = await this.$_request({
						url: "/pr/CodeComparison/EnableCodeComparison",
						method: 'post',
						data: {
							idList: [row.id]
						}
					})
				}
				this.addProLoading = false
			},
			filterFun(a, b, c) {
				return a == b.enable
			},
			tabClick() {
				
			},
			updataList() {
				this.getList()
			},
			async mainUnit() {
				//产品类别
				let res = await this.$_request({
					url: "/pr/ProductType/List",
					method: "post",
					data: {
						pageIndex: 1,
						pageSize: 99999,
						getMyAuthData: true
					}
				})
				if(this.productId) {
					res.data.data.map(x => {
						if(x.Code == this.productId) {
							x.ChildList.unshift({Id: x.Id,Name: "全部"})
							this.productTypeArr = x.ChildList
						}
					})
				}else{
					this.productTypeArr = res.data.data
				}
			},
			//选择产品类别
			handleNodeClick(e) {
				this.productTypeIdSel = e.Id
				this.pageIndex = 1
				this.getList()
			},
			//选择完产品类别请求属性
			async selectProType(e,arr) {
				//隐藏铭牌
				if(e == 'a84f2214-68e9-47dd-ade2-d7eefd4ed974' || e == '5079b091-5fc7-4f6e-8f9f-0e1818fdd8e0' || e == '1803367a-b01a-4a4d-8c83-c0a6fe6ded14') {
					this.Mp = false
				}else{
					this.Mp = true
				}
				let res = await this.$_request({
					url: "/pr/ProductTypeProperty/GetSingleTypeWithProperty",
					method: "get",
					params: {
						id: e
					}
				})
				this.isSxSpec = []
				this.noSxSpec = []
				if(res.data.data.PropertyList) {
					res.data.data.PropertyList.map(x => {
						let json = {
							productTypePropertyId: x.Id,
							propertyName: x.Name,
							isEnter: x.IsEnter,
							propertyValueArr: x.Value.split(','),
							propertyValue: "",
							productInfoId: ""
						}
						if(this.changeType == 'edit') {
							json.productInfoId = this.selectArr[0].Id
						}
						if(arr) {
							arr.map(y => {
								if(y.ProductTypePropertyId == x.Id) {
									
									json.propertyValue = y.ProductTypePropertyValue
								}
							})
						}
						if(x.State==1) {
							if(x.IsSpec) {
								this.isSxSpec.push(json)
							}else{
								this.noSxSpec.push(json)
							}
						}
						
					})
				}
				
				this.sxData = (this.isSxSpec.length >= this.noSxSpec.length ? this.isSxSpec : this.noSxSpec)
			},
			add() {
				this.changeType = 'add'
				this.removeIds = []
				this.addShow = true
				this.title = '新增产品档案'
				this.form = form()
				this.isSxSpec = []
				this.noSxSpec = []
				// console.log(this.isSxSpec,this.noSxSpec)
			},
			handleClose() {
				this.list_bmdz = []
				this.jldw_list = []
				this.list_kc = []
				this.list_mp = []
				this.tabName = "first"
				this.addShow = false
			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						//提交
						this.postForm()
					} else {
						return this.$message({
							type: "warning",
							message: "基础资料请填写完整"
						})
					}
				});
			},
			async postForm() {
				this.addProLoading = true
				let formdate = JSON.parse(JSON.stringify(this.form))
				formdate.productInfoPropertyList = this.isSxSpec.concat(this.noSxSpec).map(x => {
					if(x.isEnter == 1) {
						return{productTypePropertyId: x.productTypePropertyId, name: x.propertyName, propertyValue: x.propertyValue, productInfoId: x.productInfoId}
					}else{
						return{productTypePropertyId: x.productTypePropertyId, propertyValue: x.propertyValue, productInfoId: x.productInfoId}
					}
				})
				// formdate.f_ComId = this.$store.state.userinfo.F_ComId
				formdate.unitList = this.jldw_list.map(x => {
					return {
						dataItemDetailId_MainUnit: x.dataItemDetailId_MainUnit,
						dataItemDetailId_SubUnit: x.dataItemDetailId_SubUnit,
						conversionRelation: x.conversionRelation,
						isDefault: 0
					}
				})
				//将nikename数组转化为字符串
				formdate.nickName = formdate.nickName.map(x => {
					return x.value
				}).join(',')
				let res = await this.$_request({
					url: "/pr/ProductInfo/ChangeNew",
					data: formdate,
					method: "post"
				})
				// if(res.data.code === 200) {
					let id = res.data
					if(formdate.id) {
						id = formdate.id
					}
					
					
					await this.bmdzPost(id)
					// if(this.removeMpIds.length>0) {
					// 	await this.removeMpPost()
					// }
					if(this.Mp) {
						await this.mpPost()
					}
					if(this.removeIds.length>0) {
						await this.removeKcPost()
					}
					await this.kcPost(id)
					this.addProLoading = false
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
				// }else{
				// 	this.$message({
				// 		message: res.data.mes,
				// 		type: "success"
				// 	})
				// }
			},
			async bmdzPost(id) {
				let res = await Promise.all(this.list_bmdz.map(x => {
					if(!x.id && x.enable == 1) {
						return this.$_request({
							url: "/pr/CodeComparison/Change",
							method: 'post',
							data: {
								internalProductInfoId: id,
								code: x.code,
								name: x.name,
								model: x.model,
								supplyId: x.supplyId,
								externalUnitCode: x.externalUnitCode,
								externalUnitName: x.externalUnitName,
								externalUnitType: x.externalUnitType
							}
						})
					}
				}))
			},
			//库存关联请求
			async kcPost(id) {
				let inventoryList = this.list_kc.map(x => {
					return{
						id: x.id,
						productId: id,
						warehouseId: x.warehouseId,
						minimumInventory: x.minimumInventory,
						maximumInventory: x.maximumInventory
					}
				})
				if(inventoryList.length>0) {
					let res = await this.$_request({
						url: "/pr/ProductInfoInventoryWarehoue/ChangeBatch",
						method: 'post',
						data: {
							inventoryList: inventoryList
						}
					})
				}
				
			},
			//移除库存关联请求
			async removeKcPost() {
				let res = await this.$_request({
					url: "/pr/ProductInfoInventoryWarehoue/Del",
					method: "post",
					data: this.removeIds
				})
			},
			
			//铭牌关联请求
			async mpPost(id) {
				let namePlateIdList = this.list_mp.map(x => {
					return x.Id
				})
				if(namePlateIdList.length>0) {
					let res = await this.$_request({
						url: "/pr/NamePlate/ProductConnectionNamePlates",
						method: 'post',
						data: {
							productIdId: this.selectArr[0].Id,
							namePlateIdList: namePlateIdList
						}
					})
				}
			},
			
			//移除铭牌关联请求
			// async removeMpPost() {
			// 	let res = await this.$_request({
			// 		url: "/pr/NamePlate/ProductUnConnectionNamePlates",
			// 		method: "post",
			// 		data: {
			// 			productIdId: this.selectArr[0].Id,
			// 			namePlateIdList: this.removeMpIds
			// 		}
			// 	})
			// },
			
			async getList() {
				this.loading = true
				let res = await this.$_request({
					url: "/pr/ProductInfo/ListNew",
					method: "post",
					data: {
						pageIndex: this.pageIndex,
						pageSize: this.pageSize,
						enable: this.checked ? 0 : 1,
						productTypeId: this.productTypeIdSel,
						productTypeCode: this.productId ? this.productId : ""
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
							url: "/pr/ProductInfo/Del",
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
				this.removeIds = []
				this.title = '修改产品档案'
				if(this.selectArr.length !== 1) {
					this.$message({
						type:"warning",
						message: "请选择一条修改"
					})
				}else{
					this.form = {
						id:  this.selectArr[0].Id,
						code: this.selectArr[0].Code,
						name: this.selectArr[0].Name,
						modelBrand: this.selectArr[0].ModelBrand,
						f_ComId: this.selectArr[0].F_ComId,
						spec: this.selectArr[0].Spec,
						feature: this.selectArr[0].Feature,
						publishTime: this.selectArr[0].PublishTime,
						productTypeId: this.selectArr[0].ProductTypeId,
						enable:this.selectArr[0].Enable,
						code69: this.selectArr[0].Code69,
						styleId: this.selectArr[0].StyleId,
						nickName: this.selectArr[0].ProductInfoNickNameList ? this.selectArr[0].ProductInfoNickNameList.map(x => {
							return {value: x.NickName}
						}) : [],
						weight: this.selectArr[0].Weight,
						length: this.selectArr[0].Length,
						width: this.selectArr[0].Width,
						height: this.selectArr[0].Height,
						standard: this.selectArr[0].Standard,
						expirationDate: this.selectArr[0].ExpirationDate,
						minimumInventory: this.selectArr[0].MinimumInventory,
						maximumInventory: this.selectArr[0].MaximumInventory,
						img: this.selectArr[0].Img,
						dataItemDetailId_MainUnit: this.selectArr[0].DataItemDetailId_MainUnit,
						supplyIdList: this.selectArr[0].SupplyList ? this.selectArr[0].SupplyList.map(x => {
							return x.Id
						}) : [],
						manufactureIdList: this.selectArr[0].ManufactureList ? this.selectArr[0].ManufactureList.map(x => {
							return x.Id
						}) : []
					}
					this.jldw_list = this.selectArr[0].UnitList ? this.selectArr[0].UnitList.map(x => {
						return {
							dataItemDetailId_MainUnit: x.DataItemDetailId_MainUnit,
							dataItemDetailId_SubUnit: x.DataItemDetailId_SubUnit,
							conversionRelation: x.ConversionRelation,
							isDefault: 0
						}
					}) : [];
					this.selectProType(this.selectArr[0].ProductTypeId, this.selectArr[0].ProductInfoPropertyList)
					//取得产品对应的编码对照表
					let res = await this.$_request({
						url: "/pr/CodeComparison/List",
						method: 'post',
						data: {
							pageIndex: 1,
							pageSize: 99999,
							queryJson: JSON.stringify({internalProductInfoId: this.selectArr[0].Id})
						}
					})
					this.list_bmdz = res.data.data.map(x => {
						return {
							id: x.Id,
							internalProductInfoId: x.InternalProductInfoId,
							code: x.Code,
							name: x.Name,
							model: x.Model,
							supplyId: x.SupplyId,
							externalUnitCode: x.ExternalUnitCode,
							externalUnitName: x.ExternalUnitName,
							externalUnitType: x.ExternalUnitType,
							enable: x.Enable
						}
					})
					if(this.form.productTypeId == 'a84f2214-68e9-47dd-ade2-d7eefd4ed974' || this.form.productTypeId == '5079b091-5fc7-4f6e-8f9f-0e1818fdd8e0' || this.form.productTypeId == '1803367a-b01a-4a4d-8c83-c0a6fe6ded14') {
						this.Mp = false
					}else{
						this.Mp = true
					}
					this.getWithWh()
					this.getWithMp()
					this.addShow = true
				}		
			},
			checkedChange(val) {
				this.pageIndex = 1
			  this.getList();
			},
			pageIndexChange(e){
				this.pageIndex = e
				if(this.keyword ) {
					this.searchList()
				}else{
					this.getList()
				}
			},
			selectData(e) {
				this.selectArr = e
			},
			// 上传
			onUploadSuccess(response,file,fileList) {
			    if(fileList.length>1){
			      fileList.shift();
			    }
			    if(response.code==200){
			      this.form.img = process.env.VUE_APP_API_BASEURL+response.data.F_FilePath;
						this.dialogVisible = true;
			    }
			},
			onUploadRemove() {
			  return function(file, fileList) {
			    
			  };
			},
			bmdzTypeChange(e) {
				this.bmdzForm.supplyId = ""
				this.getGys(e)
			},
			bmdzNameChange(e) {
			},
			async getGys(e) {
				let type = ""
				if(e == 1) {
					type = 2
				}else{
					type = 1
				}
				let res = await this.$_request({
					url: "/sc/BaseInfo/List",
					method: "post",
					data: {
						queryJson: JSON.stringify({type: type}),
						pageSize: 999999,
						pageIndex: 1
					}
				})
				this.gysArr = res.data.data
			},
			async getScs() {
				let res = await this.$_request({
					url: "/sc/Manufacture/List",
					method: "post",
					data: {
						pageSize: 999999,
						pageIndex: 1
					}
				})
				this.scsArr = res.data.data
			},
			async getJldw() {
				let res = await this.$_request({
					url: "/pr/DataItemDetail/List",
					method: "post",
					data: {
						pageIndex: 1,
						pageSize: 999999,
						queryJson: JSON.stringify({"itemId":"1d2161d7-40e5-4671-ad3b-1284929af502"})
					}
				})
				this.jldwArr = res.data.data
				 res.data.data.map(x => {
					 this.jldwHash[x.Id] = x.ItemName
				 })
			},
			download() {
				window.open('http://wms.mingm.com.cn/产品档案导入模板.xlsx')
			},
			//新增计量单位
			addJldw() {
				if(!this.form.dataItemDetailId_MainUnit) {
					return this.$message({
						type: 'warning',
						message: "请在基础资料里选择最小计量单位"
					})
				}
				this.jldwForm = form_jldw()
				if(this.$refs.jldwForm) {
					this.$refs.jldwForm.resetFields()
				}
				this.jldwShow = true
			},
			//添加换算关系数据
			sureJldw() {
				if(!this.jldwForm.dataItemDetailId_MainUnit) {
					return this.$message({
						type: "warning",
						message: "请选择换算单位"
					})
				}
				if(this.jldwForm.conversionRelation == 0) {
					return this.$message({
						type: "warning",
						message: "请填写换算量"
					})
				}
				let data = JSON.parse(JSON.stringify(this.jldwForm))
				data.dataItemDetailId_SubUnit = this.form.dataItemDetailId_MainUnit
				//做唯一标识用于删除
				data.f_id = new Date().getTime()
				this.jldw_list.push(data)
				this.jldwShow = false
			},
			//选择换算关系
			jldwSelect(e,a,c) {
				this.jldwSelectArr = e
			},
			//移除换算关系
			removeJldw() {
				if(this.jldwSelectArr.length != 1) {
					return this.$message({
						type: "warning",
						message: "请选择一条换算关系"
					})
				}
				this.jldw_list.map((x, idx) => {
					if(x.f_id == this.jldwSelectArr[0].f_id) {
						this.jldw_list.splice(idx, 1)
					}
				})
			},
			//编码对照表
			addbmdz() {
				this.bmdzForm = form_bmdz()
				if(this.$refs.bmdzForm) {
					this.$refs.bmdzForm.resetFields()
				}
				this.bmdzShow = true
			},
			//
			sureBmdz() {
				this.$v.bmdzForm.$touch()
				if(this.$v.bmdzForm.$error) {
					return false
				}
				let info = this.gysArr.find(x => {
					return x.Id == this.bmdzForm.supplyId
				})
				this.bmdzForm.externalUnitName = info.Name
				this.bmdzForm.externalUnitCode = info.Code
				let data = JSON.parse(JSON.stringify(this.bmdzForm))
				data.f_id = new Date().getTime()
				this.list_bmdz.push(data)
				this.bmdzShow = false
			},
			selectBmdz(e) {
				this.bmdzSelectArr = e
			},
			removebmdz() {
				if(this.bmdzSelectArr.length != 1) {
					return this.$message({
						type: "warning",
						message: "请选择一条删除"
					})
				}
				this.list_bmdz.map((x, idx) => {
					if(x.f_id == this.bmdzSelectArr[0].f_id) {
						this.list_bmdz.splice(idx, 1)
					}
				})
			},
			//添加别称
			addBc() {
				this.form.nickName.push({value: ""})
			},
			//移除别称
			removeBc(idx) {
				this.form.nickName.splice(idx, 1)
			},
			//添加仓库库存
			addKc() {
				this.list_kc.push(form_kc())
			},
			//移除仓库库存
			removeKc(idx) {
				if(this.list_kc[idx].id) {
					this.removeIds.push(this.list_kc[idx].id)
				}
				this.list_kc.splice(idx, 1)
			},
			//添加铭牌
			addMp() {
				this.list_mp.push(form_mp())
			},
			//移除铭牌
			removeMp(idx) {
				// if(this.list_mp[idx].Id) {
				// 	this.removeMpIds.push(this.list_mp[idx].Id)
				// }
				this.list_mp.splice(idx, 1)
			},
			//取得仓库列表
			async getWhList() {
				let res = await this.$_request({
					url: "/WMS/Warehouse/List",
					method: "post",
					data: {
						pageIndex: 1,
						pageSize: 999999
					}
				})
				this.whList = res.data.data
			},
			//取得关联库存的列表
			async getWithWh() {
				let res = await this.$_request({
					url: "/pr/ProductInfoInventoryWarehoue/List",
					method: 'post',
					data: {
						productId: this.selectArr[0].Id,
						pageIndex: 1,
						pageSize: 99999
					}
				})
				this.list_kc = res.data.data.map(x => {
					return{
						id: x.Id,
						maximumInventory: x.MaximumInventory,
						minimumInventory: x.MinimumInventory,
						productId: x.ProductId,
						warehouseId: x.WarehouseId
					}
				})
			},
			
			//取得关联铭牌的列表
			async getWithMp() {
				let res = await this.$_request({
					url: "/pr/NamePlate/GetNamePlatesByProductId",
					method: "get",
					params: {
						productId: this.selectArr[0].Id
					}
				})
				this.list_mp = res.data.map(x => {
					return {
						Id: x.id,
						Material: x.material,
						NamePlateTypeId: x.namePlateTypeId,
						NamePlateTypeName: x.namePlateTypeName,
						Num: x.num,
						Spec: x.spec
					}
				})
				console.log(res)
			},
			
			//取得款式列表
			async getStyle() {
				let res = await this.$_request({
					url: "/pr/ProductStyle/List",
					method: "post",
					data: {
						pageIndex: 1,
						pageSize: 99999
					}
				})
				this.styleArr = res.data.data
			},
			//取得铭牌列表
			async getMp() {
				let res = await this.$_request({
					url: "/pr/NamePlate/List",
					method: "post",
					data: {
						pageIndex: 1,
						pageSize: 999999
					}
				})
				this.mpList = res.data.data
			},
			mpChange(e, idx) {
				console.log(e, idx)
				let data = this.mpList.find(x => {
					return x.Id == e
				})
				this.list_mp[idx] = Object.assign(this.list_mp[idx] ,data)
			}
		},
		mounted() {
			this.mainUnit()
			this.getStyle()
			// this.getList()
			// this.getGys()
			this.getScs()
			this.getJldw()
			this.getWhList()
			this.getMp()
			// this.$_request({
			// 	url: "/pr/ProductInfo/GetSingle",
			// 	method: "get",
			// 	params: {
			// 		id: "320e0b79-c84d-48e5-8584-812da4a25b52"
			// 	}
			// })
		},
		created() {
			// console.log(this.productId)
		}
	}
</script>

<style>
	.el-dialog__title{color: #FF696B;}
	.el-table::before{display: none;}
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
		.form_table>div{
			width: 100%;
		}
</style>
