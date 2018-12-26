<template>
  <div class="unlineOrderDetail">
    <p v-if="formData[0]">当前订单状态： <span v-for='item in ginfo_except_statusArr' v-if='item.value == formData[0].status'>{{item.label}}</span></p>
    <h5>基本信息</h5>
    <el-table
    :data="formData" border
    style="width: 100%">
      <el-table-column label='子订单编号' prop='id' min-width="120" align='center'></el-table-column>
      <el-table-column label='母订单编号' prop='parentId' min-width="120" align='center'></el-table-column>
      <el-table-column label='订单创建时间' prop='createTime' min-width="120" align='center'></el-table-column>
      <el-table-column label='订单付款时间' prop='paySuccessTime' min-width="120" align='center'>
      </el-table-column>
      <el-table-column label='订单收货时间' prop='collectTime' min-width="120" align='center'>
      </el-table-column>
      <el-table-column label='订单完成时间' prop='finishTime' min-width="120" align='center'>
      </el-table-column>
      <el-table-column label='订单关闭时间' prop='closeTime' min-width="120" align='center'>
      </el-table-column>
      <el-table-column label='订单关闭原因' prop='closeInfo' min-width="120" align='center'>
      </el-table-column>
    </el-table>
    <el-table
    :data="formData" border
    style="width: 100%">
      <el-table-column label='流水号' prop='paymentRecordId' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span v-if='scope.row.paymentRecordId'>{{scope.row.paymentRecordId}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label='商家名称' prop='businessName' min-width="120" align='center'></el-table-column>
      <el-table-column label='购买人ID' prop='buyerId' min-width="120" align='center'></el-table-column>
      <el-table-column label='购买人电话' prop='buyerPhone' min-width="120" align='center'></el-table-column>
      <el-table-column label='物流服务商' prop='ginfo_logistics' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span v-if='scope.row.orderTrafficResultVo'>{{scope.row.orderTrafficResultVo.trafficCompany}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label='物流单号' prop='ginfo_logistics_id' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span v-if='scope.row.orderTrafficResultVo'>{{scope.row.orderTrafficResultVo.trafficNo}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label='留言信息' prop='remarks' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span v-if='scope.row.remarks'>{{scope.row.remarks}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label='异常信息' prop='otherInfo' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span v-if='scope.row.otherInfo'>{{scope.row.otherInfo}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
    </el-table>
    <h5>收货人信息</h5>
    <el-table
    :data="formData" border
    style="width: 100%">
      <el-table-column label='收货人' prop='receiver_receiver_name' min-width="160" align='center'>
        <template slot-scope='scope'>
          <span v-if='scope.row.userOrderAddress'>{{scope.row.userOrderAddress.userName}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label='手机号码' prop='receiver_receiver_phone' min-width="160" align='center'>
        <template slot-scope='scope'>
          <span v-if='scope.row.userOrderAddress'>{{scope.row.userOrderAddress.userPhone}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label='收货地址' prop='receiver_receiver_address' min-width="400" align='center'>
        <template slot-scope='scope'>
          <span v-if='scope.row.userOrderAddress'>{{scope.row.userOrderAddress.province + scope.row.userOrderAddress.city + scope.row.userOrderAddress.district + scope.row.userOrderAddress.detailAddress}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
    </el-table>
    <h5>商品信息<el-button @click="dialogTableVisible = true" style="margin-left: 10px;" v-if="formData[0] && formData[0].status == 2">更换供应商</el-button></h5>
    <el-table
    :data="formData[0].orderAndTrafficResultVoList" border
    style="width: 100%">
      <el-table-column label='商品图片' prop='ginfo_g_pic' min-width="120" align='center'>
        <template slot-scope='scope'>
          <img :src='scope.row.goodsImage' width="50px;">
        </template>
      </el-table-column>
      <el-table-column label='商家名称' prop='businessName' min-width="120" align='center'></el-table-column>
      <el-table-column label='商品名称' prop='goodsName' min-width="120" align='center'></el-table-column>
      <el-table-column label='货号' prop='goodsNo' min-width="120" align='center'></el-table-column>
      <el-table-column label='商品规格' prop='goodsSpec' min-width="120" align='center'></el-table-column>
      <el-table-column label='单价' prop='payPrice' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span v-for="(value, key) in scope.row.payPrice" :key="key"><span v-if="key == 'cash'">现金支付：{{value / 100}},</span><span v-else-if="key == 'gold'">金贝支付：{{value}},</span><span v-else-if="key == 'silver'">银贝支付：{{value}},</span></span>
        </template>
      </el-table-column>
      <el-table-column label='运费' prop='ginfo_freight' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span v-if='scope.row.orderTrafficResultVo'>{{scope.row.orderTrafficResultVo.trafficPrice / 100}}</span>
        </template>
      </el-table-column>
      <el-table-column label='数量' prop='quantity' min-width="120" align='center'></el-table-column>
      <el-table-column label='小计' prop='minPayPrice' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span v-for="(value, key) in scope.row.minPayPrice" :key="key"><span v-if="key == 'cash'">现金支付：{{value / 100}},</span><span v-else-if="key == 'gold'">金贝支付：{{value}},</span><span v-else-if="key == 'silver'">银贝支付：{{value}},</span></span>
        </template>
      </el-table-column>
    </el-table>
    <h5>费用信息</h5>
    <el-table
    :data="formData" border
    style="width: 100%">
      <el-table-column label='支付现金' prop='ginfo_g_num' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span v-for="(value, key) in scope.row.payPrice" :key="key"><span v-if="key == 'cash'">现金支付：{{value / 100}}</span></span>
        </template>
      </el-table-column>
      <el-table-column label='支付余额' prop='consume_silvershell_change' min-width="120" align='center'>
        <template slot-scope="scope">
          -
        </template>
      </el-table-column>
      <el-table-column label='支付金贝' prop='consume_goldshell_deduct' min-width="120" align='center'>
        <template slot-scope="scope">
          <span v-for="(value, key) in scope.row.payPrice" :key="key"><span v-if="key == 'gold'">金贝支付：{{value}}</span></span>
        </template>
      </el-table-column>
      <el-table-column label='支付银贝' prop='onorder_payment_at' min-width="120" align='center'>
        <template slot-scope="scope">
          <span v-for="(value, key) in scope.row.payPrice" :key="key"><span v-if="key == 'silver'">银贝支付：{{value}}</span></span>
        </template>
      </el-table-column>
      <el-table-column label='支付铜贝' prop='copper' min-width="120" align='center'>
        <template slot-scope="scope">
          <span v-for="(value, key) in scope.row.payPrice" :key="key"><span v-if="key == 'copper'">铜贝支付：{{value}}</span></span>
        </template>
      </el-table-column>
      <el-table-column label='返还金贝' prop='onorder_payment_at' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span>-</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        formData: [],
        ginfo_except_statusArr: [
          {value: 0, label: '待付款'},
          {value: 1, label: '已关闭'},
          {value: 2, label: '待发货(已支付)'},
          {value: 3, label: '已发货'},
          {value: 4, label: '已完成'},
          {value: 5, label: '申请退款'},
          {value: 6, label: '拒绝退款'},
          {value: 7, label: '等待退款'},
          {value: 8, label: '退款完成'}
        ]
      }
    },
    created () {
      this.getFormData()
    },
    methods: {
      getFormData () {
        this.$axios({
          type: 'get',
          url: '/bhs-management-admin/order/detailByParentId/' + this.$route.query.parentId,
          data: {},
          fuc: (res) => {
            if (res.code == 1) {
              this.formData = [res.data]
            }
  //          this.tableData.push(res.data)
          }
        })
      }
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
