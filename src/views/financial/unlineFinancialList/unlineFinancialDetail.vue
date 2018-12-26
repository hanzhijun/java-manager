<template>
  <div class="unlineFinancialrDetail">
    <p>当前结算状态： <span v-if='tableData[0] && tableData[0].bstatus == 0'>待转账</span><span v-else-if='tableData[0] && tableData[0].bstatus == 1'>结算成功</span><span v-else-if='tableData[0] && tableData[0].bstatus == -1'>结算失败</span></p>
    <h5>订单信息</h5>
    <el-table
    :data="tableData" border
    style="width: 100%">
      <el-table-column label='订单编号' prop='package_order_no' min-width="120" align='center'></el-table-column>
      <el-table-column label='订单状态' prop='astatus' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span v-if='scope.row.astatus == 0'>待支付</span>
          <span v-else-if='scope.row.astatus == 1'>已支付</span>
          <span v-else-if='scope.row.astatus == -1'>取消订单</span>
          <span v-else-if='scope.row.astatus == 2'>已完成</span>
          <span v-else-if='scope.row.astatus == 3'>已退款</span>
        </template>
      </el-table-column>
      <el-table-column label='商家名称' prop='name' min-width="120" align='center'></el-table-column>
      <el-table-column label='消费金额' prop='' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span>{{scope.row.total_cost / 100}}</span>
        </template>
      </el-table-column>
      <el-table-column label='消费方式' prop='g_income' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span>扫码支付</span>
        </template>
      </el-table-column>
      <el-table-column label='银贝产生' prop='return_silver' min-width="120" align='center'></el-table-column>
      <el-table-column label='订单完成时间' prop='pay_at' min-width="120" align='center'></el-table-column>
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
      <el-table-column label='结算金额' prop='' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span>{{scope.row.amount / 100}}</span>
        </template>
      </el-table-column>
      <el-table-column label='结算状态' prop='bstatus' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span v-if='scope.row.bstatus == 0'>待转账</span>
          <span v-else-if='scope.row.bstatus == 1'>成功</span>
          <span v-else-if='scope.row.bstatus == -1'>失败</span>
        </template>
      </el-table-column>
      <el-table-column label='结算完成时间' prop='finish_at' min-width="120" align='center'></el-table-column>
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
        label="未结算"
        value="-1">
      </el-option>
      <el-option
        label="已结算"
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
        status: ''
      }
    },
    created () {
      this.$axios({
        type: 'post',
        url: '/Financial/getdownfinancialdetial',
        data: {oid: this.$route.query.package_order_id},
        fuc: (res) => {
          this.tableData = [res.data]
        }
      })
    },
    methods: {
      
      changeStatus () {
        this.$axios({
          type: 'post',
          url: '/Financial/updatedownstatus',
          data: {
            id: this.tableData[0].package_order_id,
            is_prorate: this.status
          },
          fuc: (res) => {
            if (res.code == 200) {
              this.$message.success('操作成功')
              this.$deleteOneTag('/financial/unlineFinancialList')
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
