<template>
  <div class="unlineFinancialrDetail">
    <p>当前订单状态： <span v-if='tableData[0] && tableData[0].transfer_status == 0'>待转账</span><span v-else-if='tableData[0] && tableData[0].transfer_status == 1'>结算成功</span><span v-else-if='tableData[0] && tableData[0].transfer_status == -1'>结算失败</span></p>
    <h5>订单信息</h5>
    <el-table
    :data="tableData" border
    style="width: 100%">
      <el-table-column label='订单编号' prop='package_order_no' min-width="120" align='center'></el-table-column>
      <el-table-column label='订单状态' prop='astatus' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span v-if='scope.row.order_status == 0'>待支付</span>
          <span v-else-if='scope.row.order_status == 1'>已支付</span>
          <span v-else-if='scope.row.order_status == -1'>取消订单</span>
          <span v-else-if='scope.row.order_status == 2'>已完成</span>
          <span v-else-if='scope.row.order_status == 3'>退款中</span>
          <span v-else-if='scope.row.order_status == 3'>已退款</span>
        </template>
      </el-table-column>
      <el-table-column label='商家名称' prop='business_name' min-width="120" align='center'></el-table-column>
      <el-table-column label='服务名称' prop='package_name' min-width="120" align='center'></el-table-column>
      <el-table-column label='进价' prop='cost_price' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span>{{scope.row.cost_price / 100}}</span>
        </template>
      </el-table-column>
      <el-table-column label='售价' prop='total_cost' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span>{{scope.row.total_cost / 100}}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-table
    :data="tableData" border style="width: 100%">

      <el-table-column label='用户ID' prop='user_id' min-width="120" align='center'></el-table-column>
      <el-table-column label='支付方式' prop='g_income' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span>现金支付：{{scope.row.cash / 100}},余额支付：{{scope.row.balance / 100}},银贝支付：{{scope.row.silver}},金贝支付：{{scope.row.gold}}</span>
        </template>
      </el-table-column>
      <el-table-column label='订单完成时间' prop='finish_at' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span v-if='scope.row.finish_at'>{{$formatTime(scope.row.finish_at)}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
    </el-table>
    <h5>结算信息</h5>
    <el-table
    :data="tableData" border
    style="width: 100%">
      <el-table-column label='结算单号' prop='transfer_no' min-width="120" align='center'></el-table-column>
      <el-table-column label='结算渠道' prop='g_num' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span v-if='scope.row.transfer_type == 1'>微信</span>
          <span v-else-if='scope.row.transfer_type == 2'>支付宝</span>
          <span v-else-if='scope.row.transfer_type == 3'>人工</span>
        </template>
      </el-table-column>
      <el-table-column label='结算金额' prop='transfer_amount' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span>{{scope.row.transfer_amount / 100}}</span>
        </template>
      </el-table-column>
      <el-table-column label='结算状态' prop='transfer_status' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span v-if='scope.row.transfer_status == 0'>待转账</span>
          <span v-else-if='scope.row.transfer_status == 1'>成功</span>
          <span v-else-if='scope.row.transfer_status == -1'>失败</span>
        </template>
      </el-table-column>
      <el-table-column label='结算完成时间' prop='deal_time' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span v-if='scope.row.transfer_at'>{{$formatTime(scope.row.transfer_at)}}</span>
          <span v-else>-</span>
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
    <h5>更改订单状态</h5>
    <span>订单状态： </span>
    <el-select v-model="status" placeholder="请选择">
      <el-option
        label="结算成功"
        value="1">
      </el-option>
      <el-option
        label="结算失败"
        value="0">
      </el-option>
    </el-select>
    <br/>
    <el-button type='success' style='margin: 10px auto;display: block;' @click='changeStatus'>保存</el-button>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        tableData: [],
        status: ''
      }
    },
    created () {
      this.$axios({
        type: 'post',
        url: '/Financial/packagedetail',
        data: {transfer_id: this.$route.query.union_business_transfer_id, type: 1},
        fuc: (res) => {
          this.tableData = [res.data]
        }
      })
    },
    methods: {

      changeStatus () {
        this.$axios({
          type: 'post',
          url: '/Financial/changestatus',
          data: {
            package_order_id: this.tableData[0].package_order_id,
            change_type: 'normal',
            change_status: this.status
          },
          fuc: (res) => {
            if (res.code == 200) {
              this.$message.success('操作成功')
              this.$deleteOneTag('/financial/financialVouchersNormalList')
            }
          }
        })
      }
    }
  }
</script>
<style scoped="true">
  .unlineFinancialrDetail{
    margin: 10px 20px 20px;
    overflow: hidden;
  }

</style>
<style>
  .unlineFinancialrDetail .el-table th {
    background: #f5f7fa;
  }
</style>
