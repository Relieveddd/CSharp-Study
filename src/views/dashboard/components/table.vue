<template>
  <div>
    <el-table :data="list" border @selection-change="select" highlight-current-row @row-click="getProId">
      <!-- <el-table-column type="selection"></el-table-column> -->
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="PlanDate" label="日期" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ProCode" label="产品编号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ProName" label="产品名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ProModel" label="型号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Num" label="计划生产数量" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Num_Real" label="实际完工数量" show-overflow-tooltip></el-table-column>
      <el-table-column prop="TimeRang" label="计划时间段" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Status" label="状态" show-overflow-tooltip>
        <template slot-scope="scope">
          <span :style="'margin-right: 10px;' ">
            {{
            scope.row.Status == 1 ? '计划中' : scope.row.Status == 2 ? '生产中' : scope.row.Status == 3 ? '停线中' : scope.row.Status == 4 ? '进度异常' : scope.row.Status == 5 ? '换线中' : scope.row.Status == 6 ? '已完工' : ''
          }}
            <el-button type="primary" v-if="scope.row.Status != 6" @click="dialogVisible1 = true">变更</el-button>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="Sort" label="备注" show-overflow-tooltip></el-table-column>
      <el-table-column prop="IsSpec" label="异常" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.IsSpec ? '是' : "否" }}
        </template>
      </el-table-column>

    </el-table>
    <el-dialog :visible.sync="dialogVisible1" width="30%">
      <span>是否变更？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">再想想</el-button>
        <el-button type="primary" @click="getstart">确认开始</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible2" fullscreen @click.stop>
      <div style="display: flex;justify-content: space-between">
        <el-table :data="list1" border @selection-change="select" height="600" style="width:80%;flex: unset">
          <!--          <el-table-column type="selection"></el-table-column>-->
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="code" label="配件编号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="name" label="配件名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="model" label="配件型号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="supplyName" label="供应商" show-overflow-tooltip></el-table-column>
          <el-table-column prop="dosage" label="BOM量" show-overflow-tooltip></el-table-column>
          <el-table-column prop="packedNum" label="已包装量" show-overflow-tooltip></el-table-column>
          <el-table-column prop="ExceptionNum" label="异常" show-overflow-tooltip></el-table-column>
        </el-table>
        <div style="width: 18%;display: flex;flex-wrap: wrap;align-content: center;justify-content: center">
          <div style="width: 80%">
            <p v-html="'产品编号:'+ProCode"></p>
            <p v-html="'产品名称:'+ProName"></p>
            <p v-html="'产品型号:'+ProModel"></p>
            <p v-html="'计划说明:'"></p>
            <p v-html="'计划产量:'+Num"></p>
            <p v-html="'已完工量:'+Num_Real"></p>
          </div>
          <div
            style="width: 100%;height:30%;border:1px solid #000;display: flex;align-items: center;justify-content: center;margin-bottom: 30px">
            <p> {{
                Status == 1 ? '计划中' : Status == 2 ? '生产中' : Status == 3 ? '停线中' : Status == 4 ? '进度异常' : Status == 5 ? '换线中' : Status == 6 ? '已完工' : ''
              }}</p>
          </div>
          <el-button type="primary" @click="dialogVisible3 = true">{{
                Status == 1 ? '开始生产':Status == 3 ? '继续生产' :'停线'
            }}</el-button>
          <el-button type="primary" @click="dialogVisible4 = true">换线</el-button>
        </div>
        <el-dialog title="提示" :visible.sync="dialogVisible3" width="30%" append-to-body @click.stop>
          <span>是否{{
              Status == 1 ? '开始生产':Status == 3 ? '继续生产' :'停线'
            }}</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible3 = false">取 消</el-button>
            <el-button type="primary" @click="changeStatus" :loading="false">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="dialogVisible4" width="30%" append-to-body>
          <span>是否换线</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible4 = false">取 消</el-button>
            <el-button type="primary" @click="changeStatus1">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    props: {
      list: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        dialogVisible1: false,
        dialogVisible2: false,
        dialogVisible3: false,
        dialogVisible4: false,
        ProId: null,
        ProName: null,
        Num: null,
        Num_Real: null,
        ProModel: null,
        ProCode: null,
        Status: null,
        ProOrderId: null,
        list1: []
      }
    },
    methods: {
      select(e) {
        this.$emit('selectData', e)
      },

      getProId(row) {
        this.ProId = row.ProId
        this.ProName = row.ProName
        this.Num = row.Num
        this.Num_Real = row.Num_Real
        this.ProModel = row.ProModel
        this.ProCode = row.ProCode
        this.Status = row.Status
        this.ProOrderId = row.ProOrderId
      },
      getstart() {
        this.dialogVisible1 = false
        this.dialogVisible2 = true
        this.getProIdInfo()
      },
      async getProIdInfo() {
        this.loading = true
        let res = await this.$_request({
          url: "/pr/ProOrder/ProPackInfo",
          method: "post",
          data: {
            proId: this.ProId
          }
        })
        this.list1 = res.data
      },
      async changeStatus() {
        this.loading = true
        let newStatus = this.Status == 1 ? '2' : this.Status == 3 ? '2' : '3'
        let res = await this.$_request({
          url: "/pr/ProOrder/ProOrderStatus",
          method: "post",
          data: {
            idList: [{
              ProOrderId: this.ProOrderId,
              proId: this.ProId
            }],
            status: newStatus
          }
        }).catch(() => {});
        location.reload()
      },
      async changeStatus1() {
        this.loading = true
        let res = await this.$_request({
          url: "/pr/ProOrder/ProOrderStatus",
          method: "post",
          data: {
            idList: [{
              ProOrderId: this.ProOrderId,
              proId: this.ProId
            }],
            status: 5
          }
        }).catch(() => {});
        location.reload()
      },
    }
  }
</script>

<style>
</style>
