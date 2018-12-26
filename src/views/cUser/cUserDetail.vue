<template>
  <div class="cUserDetail">
    <h5>基本信息</h5>
    <el-table
    :data="formData" border
    style="width: 100%">
      <el-table-column label='手机号' prop='user_phone' min-width="120" align='center'></el-table-column>
      <el-table-column label='姓名' prop='user_name' min-width="120" align='center'>
      </el-table-column>
      <el-table-column label='年龄' prop='user_age' min-width="120" align='center'></el-table-column>
      <el-table-column label='地域' prop='user_region' min-width="120" align='center'></el-table-column>
      <el-table-column label='学历' prop='user_education' min-width="120" align='center'></el-table-column>
      <el-table-column label='注册源' prop='reg_source' min-width="120" align='center'></el-table-column>
      <el-table-column label='' prop='' min-width="120" align='center'></el-table-column>
      <el-table-column label='' prop='' min-width="120" align='center'></el-table-column>
    </el-table>
    <h5>消费属性</h5>
    <el-table
    :data="formData" border
    style="width: 100%">
      <el-table-column label='获得金贝总额' prop='bring_goldshells' min-width="120" align='center'></el-table-column>
      <el-table-column label='使用金贝总额' prop='use_goldshells' min-width="120" align='center'></el-table-column>
      <el-table-column label='剩余金贝总额' prop='surplus_goldshells' min-width="120" align='center'></el-table-column>
      <el-table-column label='使用金贝次数' prop='use_goldnum' min-width="120" align='center'></el-table-column>
      <el-table-column label='获得银贝总额' prop='bring_silvershells' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span v-if='scope.row.roof_status == 0'>失败</span>
          <span v-else>成功</span>
        </template>
      </el-table-column>
      <el-table-column label='使用银贝总额' prop='use_silvershells' min-width="120" align='center'></el-table-column>
      <el-table-column label='剩余银贝总额' prop='surplus_silvershells' min-width="120" align='center'></el-table-column>
      <el-table-column label='使用银贝次数' prop='use_silvernum' min-width="120" align='center'></el-table-column>
      <el-table-column label='获得余额' prop='allbalance' min-width="120" align='center'></el-table-column>
      <el-table-column label='使用余额' prop='usebalance' min-width="120" align='center'></el-table-column>
      <el-table-column label='剩余余额' prop='balance' min-width="120" align='center'></el-table-column>
      <el-table-column label='已提现余额' prop='put_forward' min-width="120" align='center'></el-table-column>
      <el-table-column label='使用余额次数' prop='balance_num' min-width="120" align='center'></el-table-column>
    </el-table>
    <h5>消费明细</h5>
    <el-table
    :data="tableData" border
    style="width: 100%">
      <el-table-column label='订单时间' prop='create_at' min-width="120" align='center'></el-table-column>
      <el-table-column label='订单编号' prop='order_id' min-width="120" align='center'></el-table-column>
      <el-table-column label='商品店铺' prop='business_name' min-width="120" align='center'></el-table-column>
      <el-table-column label='一级类目' prop='category_one' min-width="120" align='center'></el-table-column>
      <el-table-column label='二级类目' prop='category_two' min-width="120" align='center'></el-table-column>
      <el-table-column label='三级类目' prop='category_three' min-width="120" align='center'></el-table-column>
      <el-table-column label='商品名称' prop='g_name' min-width="120" align='center'></el-table-column>
      <el-table-column label='商品规格' prop='g_format' min-width="120" align='center'></el-table-column>
      <el-table-column label='支付方式' prop='pay_way' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span v-for='item in order_type' v-if='item.value == scope.row.pay_way'>{{item.label}}</span>
        </template>
      </el-table-column>
      <el-table-column label='消费总额' prop='sum' min-width="120" align='center'></el-table-column>
    </el-table>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        tableData: [],
        formData: [],
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
        type: 'get',
        url: '/User/detial',
        data: {id: this.$route.query.id},
        fuc: (res) => {
          this.tableData = res.data.cost_info
          this.formData = [res.data.user_info]
        }
      })
    },
    methods: {
      changeStatus () {
        this.$axios({
          type: 'post',
          url: '/Financial/updateorderstatus',
          data: {
            id: this.tableData[0].id,
            info_id: this.tableData[0].info_id,
            is_prorate: this.status
          },
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
  .cUserDetail{
    margin: 10px 20px 20px;
    overflow: hidden;
  }
  
</style>
<style>
  .cUserDetail .el-table th {
    background: #f5f7fa;
  }
</style>
