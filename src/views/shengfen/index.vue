<template>
	<mm-atp palign="right">
		<template v-slot:action-left>
			<el-col :span="18">
				<!-- <el-input placeholder="请输入内容" v-model="keyword" class="input-with-select" @keyup.enter.native="search">
				    <el-button slot="append" icon="el-icon-search" @click="search(true)"></el-button>
				</el-input> -->
			</el-col>
		</template>
		<template v-slot:action-right>
			<el-button  @click = "add">新增</el-button>
			<el-button  @click="edit">修改</el-button>
			<!-- <el-popover
			  placement="top"
			  width="160"
			  v-model="visibleRemove">
			  <p>确定删除吗？</p>
			  <div style="text-align: right; margin: 0">
			    <el-button size="mini" type="text" @click="visibleRemove = false">取消</el-button>
			    <el-button type="primary" size="mini" @click="remove">确定</el-button>
			  </div>
			  <el-button slot="reference">删除</el-button>
			</el-popover> -->
		</template>
		<template v-slot:table>
			<tableList @rowClick="rowClick" @orderBy = "orderBy"  :list = "tableList" v-loading="loading" @selectData = "selectData"></tableList>
		</template>
		<template v-slot:pagination >
		  <bottom ref="bottom"  :style="{height: 103 + bottomHeight + 'px'}" :pageIndex = "pageIndex" :record = "record" @pageIndexChange = "pageIndexChange"></bottom>
		</template>
		<template v-slot:bottom>
      <el-dialog
        :title="title"
        :visible.sync="addShow"
        v-loading="loading">
        <el-form :model="form" inline label-width="80px">
          <el-form-item label="省份代码">
            <el-input v-model="form.Code"></el-input>
          </el-form-item>
          <el-form-item label="省份名称">
            <el-input v-model="form.Name"></el-input>
          </el-form-item>
          <el-form-item label="所属国家">
            <el-select v-model="form.CountryId" filterable clearable>
              <el-option v-for="item in countryArr" :label="item.Name" :value="item.Id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button type="primary" @click="submit">确 定</el-button>
          <el-button @click="addShow=false">取 消</el-button>
        </span>
      </el-dialog>
			<!-- <g-bf :visible.sync="isShow" @close="onClose">
				<detail-table :isShow = "isShow" :orderId="orderId"></detail-table>
			</g-bf> -->
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
			"Code": "",
      "CountryId": "",
      "Name": "",
      "Name_EN": "",
      "Sort": 0
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
        title: "新增省份",
        countryArr: []
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
        this.form = form()
        this.title = "新增省份"
				this.changeType = 'add'
				this.addShow = true
			},
      async submit() {
        // this.form.F_ComId = 
        this.loading = true
        let res = await this.$_request({
          url: "/addr/Province/Change",
          method: "post",
          data: this.form
        })
        this.$message({
          type: "success",
          message: "操作成功"
        })
       this.addShow = false
       this.loading = false
       this.getList()
      },
			handleClose() {
				this.addShow = false
			},
			async getList() {
				this.loading = true
				let res = await this.$_request({
					url: "/addr/Province/List",
					method: "post",
					data: {
						pageIndex: this.pageIndex,
						pageSize: this.pageSize,
						
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
        if(this.selectArr.length!=1) {
          return this.$message({
            type: "warning",
            message: "请选择一条数据删除"
          })
        }
        let res = await this.$_request({
          url: "/vehicle/VehicleBrand/Del",
          method: "post",
          data: [this.selectArr[0].Id]
        })
        this.$message({
           type: "success",
           message: "操作成功"
         })
        this.getList()
			},
			async edit() {
				if(this.selectArr.length!=1) {
          return this.$message({
            type: "warning",
            message: "请选择一条数据修改"
          })
        }
        this.title = "修改省份"
        this.form = this.selectArr[0]
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
      // 取得国家列表
      async getCountry() {
        let res = await this.$_request({
          url: "/addr/Country/List",
          method: "post",
          data: {
            pageIndex: 1,
            pageSize: 999999
          }
        })
        this.countryArr = res.data.data
      }
		},
		mounted() {
			this.getList()
      this.getCountry()
		}
	}
</script>

<style>
	.el-dialog__title{color: #FF696B;}
</style>
