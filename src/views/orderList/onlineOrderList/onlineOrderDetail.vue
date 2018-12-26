<template>
  <div class="onlineOrderDetail">
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
    :data="tableData" border
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
      <el-table-column label='单价' prop='goodsPrice' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span v-for="(value, key) in scope.row.goodsPrice" :key="key"><span v-if="key == 'cash'">现金支付：{{value / 100}},</span><span v-else-if="key == 'gold'">金贝支付：{{value}},</span><span v-else-if="key == 'silver'">银贝支付：{{value}},</span></span>
        </template>
      </el-table-column>
      <el-table-column label='运费' prop='ginfo_freight' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span v-if='scope.row.orderTrafficResultVo'>{{scope.row.orderTrafficResultVo.trafficPrice / 100}}</span>
        </template>
      </el-table-column>
      <el-table-column label='数量' prop='quantity' min-width="120" align='center'></el-table-column>
      <el-table-column label='小计' prop='ginfo_subtotal' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span v-for="(value, key) in scope.row.minGoodsPrice" :key="key"><span v-if="key == 'cash'">现金支付：{{value / 100}},</span><span v-else-if="key == 'gold'">金贝支付：{{value}},</span><span v-else-if="key == 'silver'">银贝支付：{{value}},</span></span>
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
    <h5 v-if="changeBusinessData.length > 0">变更记录</h5>
    <el-table
    :data="changeBusinessData" border
    style="width: 100%" v-if="changeBusinessData.length > 0">
      <el-table-column label='变更时间' prop='changeTime' min-width="120" align='center'>
      </el-table-column>
      <el-table-column label='变更前商家' prop='businessName' min-width="120" align='center'>
      </el-table-column>
      <el-table-column label='变更前商家进价' prop='price' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span>{{scope.row.price / 100}}</span>
        </template>
      </el-table-column>
      <el-table-column label='变更后商家' prop='businessName2' min-width="120" align='center'>
      </el-table-column>
      <el-table-column label='变更后商家进价' prop='price2' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span>{{scope.row.price2 / 100}}</span>
        </template>
      </el-table-column>
      <el-table-column label='变更人账号' prop='userName' min-width="120" align='center'>
      </el-table-column>
      <el-table-column label='更换原因' prop='info' min-width="120" align='center'>
      </el-table-column>
    </el-table>
    <h5 v-if="formData[0] && (formData[0].status == 5 || formData[0].status == 6 || formData[0].status == 7 || formData[0].status == 8)">退款信息</h5>
    <el-table
    :data="[formData[0].orderReturnResultVo]" border
    style="width: 100%" v-if="formData[0] && (formData[0].status == 5 || formData[0].status == 6 || formData[0].status == 7 || formData[0].status == 8)">
      <el-table-column label='申请时间' prop='createTime' min-width="120" align='center'>
      </el-table-column>
      <el-table-column label='退款原因' prop='reason' min-width="120" align='center'>
      </el-table-column>
      <el-table-column label='退款说明' prop='remark' min-width="120" align='center'>
      </el-table-column>
      <el-table-column label='退款人' prop='updateName' min-width="120" align='center'>
      </el-table-column>
      <el-table-column label='退款凭证' prop='remark' min-width="120" align='center'>
      </el-table-column>
    </el-table>
<!--
    <el-table
    :data="formData" border
    style="width: 100%">
      <el-table-column label='活动优惠' prop='consume_activity' min-width="120" align='center'></el-table-column>
      <el-table-column label='折扣金额' prop='consume_discount' min-width="120" align='center'></el-table-column>
      <el-table-column label='订单总金额' prop='consume_total_amount' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span v-if='scope.row.consume_total_amount'>{{scope.row.consume_total_amount / 100}}</span>
        </template>
      </el-table-column>
      <el-table-column label='应付款金额' prop='consume_amount_payable' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span v-if='scope.row.consume_amount_payable'>{{scope.row.consume_amount_payable / 100}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div style="width: 100%;height: 44px;border: 1px solid #ebeef5;background: #f5f7fa;">
      <p style="text-align: right;" v-if='formData[0]'>合计：￥<span>{{formData[0].consume_amount_payable / 100}}</span></p>
    </div>
    <h5 v-if='tableData[0] && tableData[0].ginfo_except_status != 0'>异常信息</h5>
    <el-table
    :data="tableData" border v-if='tableData[0] && tableData[0].ginfo_except_status != 0'
    style="width: 100%">
      <el-table-column label='异常类型' prop='exception_info_exc_type' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span v-if='scope.row.except_status == 1'>换货</span>
          <span v-else>退货</span>
        </template>
      </el-table-column>
      <el-table-column label='申请时间' prop='exception_info_create_at' min-width="120" align='center'></el-table-column>
      <el-table-column label='退款编号' prop='exception_info_goods_id' min-width="120" align='center'></el-table-column>
      <el-table-column label='异常原因' prop='exception_info_exc_resason' min-width="120" align='center'></el-table-column>
    </el-table>
    <el-table
    :data="tableData" border v-if='tableData[0] && tableData[0].ginfo_except_status != 0'
    style="width: 100%">
      <el-table-column label='异常说明' prop='exception_info_exc_desc' min-width="120" align='center'></el-table-column>
      <el-table-column label='退款金额' prop='' min-width="120" align='center'></el-table-column>
      <el-table-column label='退款状态' prop='' min-width="120" align='center'></el-table-column>
      <el-table-column label='' prop='' min-width="120" align='center'></el-table-column>
    </el-table>
-->
<!--
    <div v-if='tableData[0] && tableData[0].ginfo_except_status != 0'>
      用户凭证：
      <img v-for='item in JSON.parse(tableData[0].exception_info_p_url)' :src='item.url' style="width: 50px;height: 50px; margin: 6px;" @click='showBigImg(item.url)'>
      <el-dialog :visible.sync="imgDialog">
        <img :src='imgUrl'>
      </el-dialog>
    </div>
-->
    <el-button style='margin: 15px;' v-if='formData[0] && formData[0].status == 5' type='success' @click='dialogSuccess = true'>审核通过</el-button>
    <el-button style='margin: 15px;' v-if='formData[0] && formData[0].status == 5' type='danger' @click='dialogRefuse = true'>驳回</el-button>
    
    <el-button style='margin: 15px;' v-if='formData[0] && formData[0].status == 7' type='primary' @click='refuseSure'>确定退款</el-button>
    
    <el-button style='margin: 15px;' v-if='formData[0] && (formData[0].status == 2 || formData[0].status == 3 || formData[0].status == 4)' type='primary' @click='returnMoneyDialog = true'>退款</el-button>
    
    <el-dialog title="填写退款理由" :visible.sync="returnMoneyDialog">
      <el-input type='textarea' v-model='returnMoneyData' placeholder='请务必填写驳回理由'></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="returnMoneyDialog = false">取 消</el-button>
        <el-button type="primary" @click="returnMoney">确 定</el-button>
      </div>
    </el-dialog>
    
    <el-dialog title="商家" :visible.sync="dialogTableVisible">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="输入搜索">
          <el-input v-model="formInline.keywords" placeholder="编号/名称/商家账号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="tableSearch">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="dialogTableData">
        <el-table-column property="id" label="编号" width="200"></el-table-column>
        <el-table-column property="name" label="商家名称" width="200"></el-table-column>
        <el-table-column property="address" label="账号状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">开启</span>
            <span v-else>关闭</span>
          </template>
        </el-table-column>
        <el-table-column property="address" label="操作">
          <template slot-scope="scope">
            <el-button @click="openInnerDialog(scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <el-pagination
      layout="prev, pager, next"
      :total="tableTotal" :page-size="20" @current-change="handleCurrentTableChange"
        :current-page.sync="tablePage">
      </el-pagination>
      
      <el-dialog
      width="30%"
      title="更换理由"
      :visible.sync="innerVisible"
      append-to-body>
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" v-model='tableForm.info'></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="changeBusiness">确 定</el-button>
        </span>
      </el-dialog>
    </el-dialog>
    
    <el-dialog title="审核通过" :visible.sync="dialogSuccess">
      <el-radio v-model="successType" label="both">不退货退款</el-radio>
      <el-radio v-model="successType" label="only">退货退款</el-radio>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSuccess = false">取 消</el-button>
        <el-button type="primary" @click="orderSuccess">确 定</el-button>
      </div>
    </el-dialog>
    
    <el-dialog title="填写驳回理由" :visible.sync="dialogRefuse">
<!--      <el-checkbox v-model="refuseType">发送短信</el-checkbox>-->
      <el-input type='textarea' v-model='refuseInput' placeholder='请务必填写驳回理由'></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRefuse = false">取 消</el-button>
        <el-button type="primary" @click="orderRefuse">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        returnMoneyDialog: false,
        returnMoneyData: '', // 退款理由
        
        formInline: {
          keywords: ''
        },
        tableForm: {
          info: ''
        },
        tableTotal: 0,
        tablePage: 1,
        
        dialogTableVisible: false,
        dialogTableData: [],
        innerVisible: false,
        
        tableData: [],
        formData: [],
        changeBusinessData: [], //变更记录
        total: '',
        url: '',
        imgDialog: false,
        imgUrl: '',
        dialogSuccess: false,
        dialogRefuse: false,
        successType: 'both',
        refuseType: true,
        refuseInput: '',
        info_id: '',
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
//      if (this.$route.query.info_id) {
//        this.info_id = this.$route.query.info_id
//        form.info_id = this.info_id
//      }
      this.getFormData()
    },
    methods: {
      getFormData () {
        this.$axios({
          type: 'get',
          url: '/bhs-management-admin/order/detail/' + this.$route.query.id,
  //        url: '/dsb/public/',
          data: {},
  //        data: {},
          fuc: (res) => {
            if (res.code != 1) {
              return
            }
            if (this.info_id) {
              this.formData = [res.data]
              this.tableData = [res.data]
              this.total = res.data.ginfo_subtotal + res.data.consume_freight
              this.url = res.category_logo_url
            } else {
              this.formData = [res.data]
              this.tableData = [res.data]
              console.log(this.formData)
              let arr = []
              if (res.data.changeCount > 0) {
                let lastData = res.data.changeData[res.data.changeData.length - 1]
                arr.push({businessName: res.data.changeData[0].businessName, businessName2: lastData.businessName, changeTime: lastData.time, userName: lastData.userName, info: lastData.info, price: res.data.costPrice[0].price, price2: res.data.costPrice[res.data.costPrice.length - 1].price})
              } else if (res.data.costPrice.length > 1) {
                let lastData = res.data.costPrice[res.data.costPrice.length - 1]
                arr.push({businessName: res.data.businessName, businessName2: res.data.businessName, changeTime: lastData.time, userName: lastData.userName, info: lastData.info, price: res.data.costPrice[0].price, price2: lastData.price})
              }
              this.changeBusinessData = arr
              console.log(1, this.changeBusinessData)
  //            this.total = res.data.total
  //            this.url = res.category_logo_url
            }
          }
        })
        
      },
      
      // 直接退款退款
      returnMoney () { 
        if (this.returnMoneyData.length < 1) {
          this.$message.warning('请输入退款理由')
          return
        }
        this.$axios({
          type: 'post',
          url: '/bhs-management-admin/cancelOrder/sysRefund',
          data: {orderInfoId: this.formData[0].id, reason: this.returnMoneyData, type: 0},
          fuc: (res) => {
            if (res.code != 1) {
              return
            }
            this.$message.success('操作成功')
            this.returnMoneyDialog = false
            this.getFormData()
          }
        })
      },
      
      refuseSure () {
        this.$axios({
          type: 'post',
          url: '/bhs-management-admin/cancelOrder/confirm',
          data: {orderInfoId: this.formData[0].id},
          fuc: (res) => {
            if (res.code != 1) {
              return
            }
            this.$message.success('操作成功')
            this.getFormData()
          }
        })
      },
      
      tableSearch () {
        this.$axios({
          type: 'post',
          url: '/bhs-management-admin/business/onlineModuleList',
          data: {pageNumber: this.tablePage, pageSize: 20, onoffFlag: 1, ...this.formInline},
          fuc: (res) => {
            if (res.code != 1) {
              return
            }
            this.dialogTableData = res.data.data
            this.tableTotal = parseInt(res.data.count)
          }
        })
      },
      handleCurrentTableChange (val) {
        this.tablePage = val
        this.tableSearch()
      },
      openInnerDialog (row) {
        this.tableForm.businessId = row.businessId
        this.tableForm.businessName = row.name
        this.innerVisible = true
      },
      changeBusiness () {
        this.$axios({
          type: 'put',
          url: '/bhs-management-admin/order/updateSupplier',
          data: {id: this.formData[0].id, ...this.tableForm},
          fuc: (res) => {
            if (res.code != 1) {
              return
            }
            this.innerVisible = false
            this.dialogTableVisible = false
            this.$message.success('操作成功')
          }
        })
      },
      
      showBigImg (url) {
        this.imgUrl = url
        this.imgDialog = true
      },
      orderSuccess () {
        this.$axios({
          type: 'post',
          url: this.successType == "both" ? '/bhs-management-admin/cancelOrder/confirm' : '/bhs-management-admin/cancelOrder/allow',
          data: {
            orderInfoId: this.formData[0].id
          },
          fuc: (res) => {
            if (res.code == 1) {
              this.$message.success('操作成功')
              this.dialogSuccess = false
              this.getFormData()
            }
          }
        })
      },
      orderRefuse () {
        if (this.refuseInput == '') {
          this.$message.warning('驳回理由为空，请重新填写')
          return false
        }
        this.$axios({
          type: 'post',
          url: '/bhs-management-admin/cancelOrder/refuse',
          data: {
            orderInfoId: this.formData[0].id,
            refusalReason: this.refuseInput,
//            is_send: this.refuseType ? 1 : -1,
          },
          fuc: (res) => {
            if (res.code == 1) {
              this.$message.success('操作成功')
              this.dialogRefuse = false
              this.getFormData()
            }
          }
        })
      }
    }
  }
</script>
<style scoped="true">
  .onlineOrderDetail{
    margin: 10px 20px 20px;
    overflow: hidden;
  }
  
</style>
<style>
  .onlineOrderDetail .el-table th {
    background: #f5f7fa;
  }
</style>
