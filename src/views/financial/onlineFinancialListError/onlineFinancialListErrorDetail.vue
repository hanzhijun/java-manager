<template>
  <div class="onlineFinancialListErrorDetail">
    <p>当前订单状态： <span v-if='tableData[0] && tableData[0].return_status == 0'>回款失败</span><span v-else>回款成功</span></p>
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
      <el-table-column label='商品SKU' prop='g_format' min-width="120" align='center'></el-table-column>
      <el-table-column label='商品件数' prop='g_num' min-width="120" align='center'></el-table-column>
      <el-table-column label='用户ID' prop='nickname' min-width="120" align='center'></el-table-column>
    </el-table>
    <el-table
    :data="tableData" border
    style="width: 100%">
      <el-table-column label='支付方式' prop='pay_way' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span v-for="item in order_type" v-if='item.value == scope.row.pay_way'>{{item.label}}</span>
        </template>
      </el-table-column>
      <el-table-column label='订单完成时间' prop='take_at' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span>{{$formatTime(scope.row.take_at)}}</span>
        </template>
      </el-table-column>
      <el-table-column label='应退金贝' prop='retreat_gold' min-width="120" align='center'></el-table-column>
      <el-table-column label='应扣金贝' prop='deduction_gold' min-width="120" align='center'></el-table-column>
      <el-table-column label='实退金贝' prop='actual_gold' min-width="120" align='center'></el-table-column>
      <el-table-column label='应退现金' prop='retreat_cash' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span>{{scope.row.retreat_cash / 100}}</span>
        </template>
      </el-table-column>
      <el-table-column label='实退现金' prop='actual_cash' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span>{{scope.row.actual_cash / 100}}</span>
        </template>
      </el-table-column>
      <el-table-column label='应退银贝' prop='retreat_silver' min-width="120" align='center'></el-table-column>
      <el-table-column label='实退银贝' prop='actual_silver' min-width="120" align='center'></el-table-column>
    </el-table>
    <h5>结算信息</h5>
    <el-table
    :data="tableData" border
    style="width: 100%">
      <el-table-column label='结算单号' prop='prorate_num' min-width="120" align='center'></el-table-column>
      <el-table-column label='结算渠道' prop='channel' min-width="120" align='center'></el-table-column>
      <el-table-column label='结算金额' prop='amount' min-width="120" align='center'></el-table-column>
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
    <h5>更改回款状态</h5>
    <span>回款状态： </span>
    <el-select v-model="status" placeholder="请选择">
      <el-option
        label="回款失败"
        value="0">
      </el-option>
      <el-option
        label="回款成功"
        value="1">
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
        ],
        status: ''
      }
    },
    created () {
      this.$axios({
        type: 'post',
        url: '/Financial/getexcfinancialdetial',
        data: {info_id: this.$route.query.info_id},
        fuc: (res) => {
          this.tableData = [res.data]
          this.status = this.tableData[0].return_status + ''
        }
      })
    },
    methods: {
      changeStatus () {
        this.$axios({
          type: 'post',
          url: '/Financial/updateexcorderstatus',
          data: {
            id: this.tableData[0].id,
            info_id: this.$route.query.info_id,
            is_prorate: this.status
          },
          fuc: (res) => {
            if (res.code == 200) {
              this.$message.success('操作成功')
              this.$deleteOneTag('/financial/onlineFinancialListError')
            }
          }
        })
      }
    }
  }
</script>
<style scoped="true">
  .onlineFinancialListErrorDetail{
    margin: 10px 20px 20px;
    overflow: hidden;
  }
  
</style>
<style>
  .onlineFinancialListErrorDetail .el-table th {
    background: #f5f7fa;
  }
</style>
