<template>
  <div class="onlineFinancialListNormalDetail">
    <p>当前订单状态： <span v-if='tableData[0] && tableData[0].roof_status == 0'>未结算</span><span v-else-if='tableData[0] && tableData[0].roof_status == 1'>结算成功</span><span v-else-if='tableData[0] && tableData[0].roof_status == -1'>结算失败</span></p>
    <h5>订单信息</h5>
    <el-table
      :data="tableData" border
      style="width: 100%">
      <el-table-column label='订单编号' prop='order_id' min-width="120" align='center'></el-table-column>
      <el-table-column label='订单状态' prop='pay_status' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span v-for='item in ginfo_deliver_statusArr' v-if='item.value == scope.row.deliver_status'>{{item.label}}</span>
        </template>
      </el-table-column>
      <el-table-column label='商家名称' prop='business_name' min-width="120" align='center'></el-table-column>
      <el-table-column label='商品名称' prop='g_name' min-width="120" align='center'></el-table-column>
      <el-table-column label='商品进价' prop='g_income' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span>{{scope.row.g_income / 100}}</span>
        </template>
      </el-table-column>
      <el-table-column label='商品售价' prop='g_price' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span>{{scope.row.g_price / 100}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-table
      :data="tableData" border
      style="width: 100%">
      <el-table-column label='商品SKU' prop='g_format' min-width="120" align='center'></el-table-column>
      <el-table-column label='商品件数' prop='g_num' min-width="120" align='center'></el-table-column>
      <el-table-column label='用户ID' prop='nickname' min-width="120" align='center'></el-table-column>
      <el-table-column label='支付方式' prop='pay_way' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span>现金支付：{{scope.row.cash / 100}},余额支付：{{scope.row.balance / 100}},银贝支付：{{scope.row.silver}},金贝支付：{{scope.row.gold}},铜贝支付：{{scope.row.copper}}</span>
        </template>
      </el-table-column>
      <el-table-column label='订单完成时间' prop='take_at' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span>{{$formatTime(scope.row.take_at)}}</span>
        </template>
      </el-table-column>
      <el-table-column label='' prop='' min-width="120" align='center'></el-table-column>
    </el-table>
    <h5>结算信息</h5>
    <el-table
      :data="tableData" border
      style="width: 100%">
      <el-table-column label='结算单号' prop='prorate_num' min-width="120" align='center'></el-table-column>
      <el-table-column label='结算渠道' prop='channel' min-width="120" align='center'></el-table-column>
      <el-table-column label='结算金额' prop='amount' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span>{{scope.row.amount / 100}}</span>
        </template>
      </el-table-column>
      <el-table-column label='结算状态' prop='roof_status' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span v-if='scope.row.roof_status == 0'>失败</span>
          <span v-else>成功</span>
        </template>
      </el-table-column>
      <el-table-column label='结算完成时间' prop='pay_at' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span>{{$formatTime(scope.row.pay_at)}}</span>
        </template>
      </el-table-column>
    </el-table>
    <h5>商家信息</h5>
    <el-table
      :data="tableData" border
      style="width: 100%">
      <el-table-column label='支付宝账号' prop='ali_account' min-width="120" align='center'></el-table-column>
      <el-table-column label='微信账号' prop='wx_account' min-width="120" align='center'></el-table-column>
      <el-table-column label='对公银行账号' prop='bank_account' min-width="120" align='center'></el-table-column>
    </el-table>
    <el-button v-if='status !== 1' type='primary' style='margin: 20px;' @click='changeStatusBefore(1)'>更改为已分账</el-button>
    <el-button v-if='status == 0' type='primary' style='margin: 20px;' @click='changeStatusBefore(2)'>立即分账</el-button>
    <el-dialog
      title="实际分账金额"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="结算价">
          <el-input v-model="form.transfer_amount"></el-input>
        </el-form-item>
        <el-form-item label="结算邮费">
          <el-input v-model="form.freight"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeStatus">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        form: {
          transfer_amount: '',
          freight: ''
        },
        type: '',
        dialogVisible: false,
        tableData: [],
        status: '',
        ginfo_deliver_statusArr: [
          {value: 1, label: '等待出库'},
          {value: 2, label: '配送中'},
          {value: 3, label: '已签收'}
        ],
        order_type: [
          {value: 1, label: '金贝支付'},
          {value: 2, label: '银贝支付'},
          {value: 3, label: '现金支付'},
          {value: 4, label: '现金+金贝支付'},
          {value: 5, label: '金贝+铜贝支付'},
          {value: 6, label: '银贝+铜贝支付'},
          {value: 7, label: '现金+铜贝支付'},
          {value: 8, label: '金贝+余额'},
          {value: 9, label: '金贝+余额+现金'},
          {value: 10, label: '余额+现金'}
        ]
      }
    },
    created () {
      this.$axios({
        type: 'post',
        url: '/Financial/getfinancialdetial',
        data: {info_id: this.$route.query.id},
        fuc: (res) => {
        this.tableData = [res.data]
      this.status = res.data.roof_status
    }
    })
    },
    methods: {
      changeStatusBefore (num) {
        this.form.transfer_amount = this.tableData[0].amount / 100
        this.form.freight = this.tableData[0].freight / 100
        this.type = num
        this.dialogVisible = true
      },
      changeStatus () {
        if (this.type == 2) {
          this.assignMoney()
          return
        }
        this.$axios({
          type: 'post',
          url: '/Financial/updateorderstatus',
          data: {
            id: this.tableData[0].id,
            info_id: this.tableData[0].info_id,
            ...this.form
      },
        fuc: (res) => {
          if (res.code == 200) {
            this.$message.success('操作成功')
            this.$deleteOneTag('/financial/onlineFinancialListNormal')
          }
        }
      })
      },
      assignMoney () {
        this.$axios({
          type: 'post',
          url: '/queue/manualTransfer',
          data: {type: 'online', transfer_id: this.tableData[0].id, ...this.form},
          fuc: (res) => {
            if (res.code == 200) {
              this.$message.success('操作成功')
              this.$deleteOneTag('/financial/onlineFinancialListNormal')
            }
          }
        })
      }
    }
  }
</script>
<style scoped="true">
  .onlineFinancialListNormalDetail{
    margin: 10px 20px 20px;
    overflow: hidden;
  }

</style>
<style>
  .onlineFinancialListNormalDetail .el-table th {
    background: #f5f7fa;
  }
</style>
