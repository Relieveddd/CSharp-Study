<template>
	<el-table
		ref="table"
		:data="list" 
		border 
		@select="selectData"
		@selection-change = "select" 
		row-key="Id"
		:tree-props="{children: 'ChildList'}">>
		<el-table-column type="selection"></el-table-column>
		<el-table-column type="index" label="序号"></el-table-column>
		<el-table-column prop="Name" label="类别名称" show-overflow-tooltip></el-table-column>
		<el-table-column prop="Code" label="类别代码" show-overflow-tooltip></el-table-column>
		<el-table-column prop="Sort" label="排序" show-overflow-tooltip></el-table-column>
		<el-table-column prop="State" label="状态" show-overflow-tooltip>
			<template slot-scope="scope">
				<span :style="'margin-right: 10px;'
				+(scope.row.State == 1 ? 'color: #00a0e9;' : 'color: #b7b7b7;')">
					{{scope.row.State == 1 ? '启用' : '禁用'}}
				</span>
			</template>
		</el-table-column>
	</el-table>
</template>

<script>
	const loopFind = function(idx, s, x, parentList, that) {
		if (parentList[idx]){
			let pid = parentList[idx]['pid']
			that.$refs.table.toggleRowSelection(parentList[idx]['content'], true)
			let json = JSON.parse(JSON.stringify(parentList[idx]['content']))
			if(!s) {
				s = json.childList
			}
			let a = json
			if(s == null) {
				a.childList = []
			}else{
				if(s.constructor === Array) {
					a.childList = [...s]
				}else{
					a.childList = [s]
				}
			}
			s = a
			return loopFind(pid, s, "", parentList, that)
		}else{
			return s
		}
	}
	
	export default{
		props:{
			list: {
				type: Array,
				default: []
			}
		},
		data() {
			return {
				parentList: {},
				selectPlatformArr: [],
				postTree: []
			}
		},
		methods:{
			select(e) {
				// this.$emit('selectData',e)
				this.importData = e
				this.selectPlatformArr = []
				let key = e.map(x => {
					return x.ParentId
				})
				e.map(x => {
					if(key.indexOf(x.Id) == -1) {
						this.selectPlatformArr.push(x)
					}
				})
				this.$emit('selectData',this.selectPlatformArr)
			},
			selectData(e, row) {
				//联动方法
				if(false) {
					let loop = (arr, blon) => {
						arr.ChildList.map(x => {
							this.$refs.table.toggleRowSelection(x, blon)
							if(x.ChildList) {
								this.$refs.table.toggleRowExpansion(x, true)
								loop(x, blon)
							}
						})
					}
					//判断当前项是选择还是未选中 
					if(e.indexOf(row) != -1) {
						//选中把子集全部选中
						if(row.ChildList) {
							this.$refs.table.toggleRowExpansion(row, true)
							loop(row, true)
						}
						//找到所有父集并选中
						this.postTree = []
						let that = this
						let s = loopFind(row.Id, "", row, this.parentList, this)
					}else{
						//取消把子集全部取消
						if(row.ChildList) {
							this.$refs.table.toggleRowExpansion(row, false)
							loop(row, false)
						}
					}
				}else{
					//非联动
					console.log(e,row)
				}
				
			}
		},
		mounted() {
			
		},
		watch:{
			list(val) {
				let parentList = {}
				let loopParent = function(arr) {
					arr.map(x => {
						// if(x.parentId != null) {
							let pid = x['ParentId']
							let id = x['Id']
							parentList[id] = {pid: pid, content: x}
						// }
						if(x.ChildList != null) {
							
							loopParent(x.ChildList)
						}
					})
				}
				loopParent(val)
				this.parentList = parentList
				// console.log(val)
				// console.log(parentList)
			}
		}
	}
</script>

<style>
</style>
