<template>
  <div class="unlineOrderDetail">
    <p v-if='tableData[0]'>当前订单状态：
      <span v-if='tableData[0].status == -1'>取消订单</span>
      <span v-if='tableData[0].status == 0'>待支付</span>
      <span v-if='tableData[0].status == 1'>已支付</span>
      <span v-if='tableData[0].status == 2'>已完成</span>
      <span v-if='tableData[0].status == 4'>已退款</span>
      <span v-if='tableData[0].status == 3'>退款中</span>
    </p>
    <h5>基本信息</h5>
    <el-table
    :data="tableData" border
    style="width: 100%">
      <el-table-column label='订单编号' prop='package_order_no' min-width="120" align='center'></el-table-column>
      <el-table-column label='订单付款时间' prop='pay_at' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span v-if='scope.row.pay_at'>{{$formatTime(scope.row.pay_at)}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if='tableData[0] && (tableData[0].status == 3 || tableData[0].status == 4)' label='申请退款时间' prop='apply_refund_at' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span v-if='scope.row.apply_refund_at'>{{$formatTime(scope.row.apply_refund_at)}}</span>
        </template>
      </el-table-column>
      <el-table-column label='订单时间' prop='create_at' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span v-if='scope.row.create_at'>{{$formatTime(scope.row.create_at)}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if='tableData[0] && (tableData[0].status == 3 || tableData[0].status == 4)' label='退款原因' prop='refund_reason' min-width="120" align='center'></el-table-column>
      <el-table-column label='购买人名称' prop='user_name' min-width="120" align='center'></el-table-column>
      <el-table-column label='购买人id' prop='user_id' min-width="120" align='center'></el-table-column>
      <el-table-column label='商家名称' prop='business_name' min-width="120" align='center'>
      </el-table-column>
    </el-table>
    <h5>服务信息</h5>
    <el-table
    :data="tableData" border
    style="width: 100%">
      <el-table-column label='服务名称' prop='package_name' min-width="120" align='center'></el-table-column>
      <el-table-column label='售价' prop='price' min-width="120" align='center'></el-table-column>
      <el-table-column label='结算价' prop='cost_price' min-width="120" align='center'></el-table-column>
      <el-table-column label='支付方式' prop='' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span>现金支付：{{scope.row.cash}},余额支付：{{scope.row.balance}},银贝支付：{{scope.row.silver}},金贝支付：{{scope.row.gold}}</span>
        </template>
      </el-table-column>
      <el-table-column label='流水编号' prop='serialnumber' min-width="120" align='center'></el-table-column>
    </el-table>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        tableData: []
      }
    },
    created () {
      this.$axios({
        type: 'post',
        url: '/Order/getofflineorderinfo',
        data: {package_order_id: this.$route.query.package_order_id},
        fuc: (res) => {
          this.tableData.push(res.data)
        }
      })
    },
    methods: {

    }
  }
</script>
<style scoped="true">
  .unlineOrderDetail{
    margin: 10px 20px 20px;
    overflow: hidden;
  }

</style>
<style>
  .unlineOrderDetail .el-table th {
    background: #f5f7fa;
  }
</style>
