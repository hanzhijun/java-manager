<template>
  <div class="offlineCaterOrderDetail">
    <h3>订单详情</h3>
    <div class="titleDiv">
      <p>
        <span>订单号:{{form.ordernum}}</span>
        <span>桌号:{{form.tablenum}}</span>
        <span>订单时间:{{form.create_at}}</span>
      </p>
      <p>
        <span v-if='form.pay_type == 1'>支付方式:线上支付</span>
        <span v-else-if='form.pay_type == 2'>支付方式:现金/支付宝支付</span>
        <span v-if='form.pay_status == 1'>订单状态:未确认收款</span>
        <span v-else-if='form.pay_status == 2'>订单状态:已支付</span>
        <span v-else-if='form.pay_status == 3'>订单状态:已确认收款</span>
      </p>
    </div>
    <el-table
    :data="form.dishes" border
    style="width: 100%">
      <el-table-column
        prop=""
        type="index"
        label="编号"
        width="120" align='center'>
      </el-table-column>
      <el-table-column
        prop="dishes_name"
        label="菜品名称"
        min-width="160" align='center'>
        <template slot-scope='scope'>
          <p>{{scope.row.specification_name}}</p>
          <p>{{scope.row.dishes_name}}{{scope.row.adddish_name}}{{scope.row.flavor_name}}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="remakers"
        label="备注"
        min-width="120" align='center'>
      </el-table-column>
      <el-table-column
        prop="dishes_num"
        label="数量"
        min-width="120" align='center'>
      </el-table-column>
    </el-table>
    <p><span>合计：{{form.total_price / 100}}元</span></p>
  </div>
</template>

<script>
  export default {
    name: 'offlineCaterOrderDetail',
    data () {
      return {
        form: {}
      }
    },
    created () {
      this.getTableData()
    },
    mounted () {},
    methods: {
      getTableData () {
        this.$axios({
          type: 'post',
          url: '/ordering/orderdetail',
          data: {order_num: this.$route.query.ordernum},
          fuc: (res) => {
            this.form = res.data
          }
        })
      }
    }
  }
</script>
<style scoped="true">
  .offlineCaterOrderDetail{
    margin: 10px 20px 0;
    overflow: hidden;
  }
  .offlineCaterOrderDetail>.titleDiv{
    width: 100%;
    overflow: hidden;
    border: 1px solid #ebebeb;
  }
  .offlineCaterOrderDetail>.titleDiv>p{
    width: 100%;
    margin: 0 0;
  }
  .offlineCaterOrderDetail>.titleDiv>p>span{
    width: 32%;
    display: inline-block;
    text-align: center;
    min-width: 180px;
    margin: 10px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
</style>
