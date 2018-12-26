<template>
  <div class="onlineOrderList">
    <el-button @click="changeStatus('')" :type="status === '' ? 'primary' : ''">全部订单</el-button>
    <el-button v-for="item in ginfo_except_statusArr" @click="changeStatus(item.value)" :type="status === item.value ? 'primary' : ''" :key="item.value">{{item.label}}</el-button>
<!--
    <el-button @click="changeStatus('df')" :type="type == 'df' ? 'primary' : ''">待发货</el-button>
    <el-button @click="changeStatus('yf')" :type="type == 'yf' ? 'primary' : ''">已发货</el-button>
    <el-button @click="changeStatus('yd')" :type="type == 'yd' ? 'primary' : ''">已完成</el-button>
    <el-button @click="changeStatus('applyrefund ')" :type="type == 'applyrefund ' ? 'primary' : ''">退款申请</el-button>
    <el-button @click="changeStatus('waitrefund')" :type="type == 'waitrefund' ? 'primary' : ''">等待退款</el-button>
    <el-button @click="changeStatus('seccussrefund')" :type="type == 'seccussrefund' ? 'primary' : ''">退款成功</el-button>
-->

    <div class="searchForm">
      <p @click='showFormBool = !showFormBool'>筛选查询<i v-if='showFormBool' class="el-icon-arrow-down"></i><i v-else class="el-icon-arrow-up"></i></p>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" v-if='showFormBool'>
        <el-form-item label="输入搜索">
          <el-input v-model="formInline.key_a" placeholder="订单编号/商品货号"></el-input>
        </el-form-item>
        <el-form-item label="收货人">
          <el-input v-model="formInline.key_b" placeholder="收货人姓名/手机号"></el-input>
        </el-form-item>
        <el-form-item label="购买人">
          <el-input v-model="formInline.key_c" placeholder="购买人"></el-input>
        </el-form-item>
        <el-form-item label="提交时间">
          <el-date-picker
            v-model="formInline.key_time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button type="primary" @click="downloadExcell">导出Excell</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
    :data="tableData"
    style="width: 100%">
      <el-table-column
        label="线上订单列表">
        <el-table-column
          prop="parentId"
          label="母订单编号"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="id"
          label="子订单编号"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="订单生成时间"
          min-width="160" align='center'>
        </el-table-column>
        <el-table-column
          prop="buyerId"
          label="购买人ID"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="goodsName"
          label="商品名称"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="goodsSpec"
          label="商品规格"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="goodsNo"
          label="货号"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="businessName"
          label="商家名称"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="quantity"
          label="商品数量"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="pay_way"
          label="支付方式"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-for="(value, key) in JSON.parse(scope.row.payPrice)" :key="key"><span v-if="key == 'cash'">现金支付：{{value / 100}},</span><span v-else-if="key == 'gold'">金贝支付：{{value}},</span><span v-else-if="key == 'silver'">银贝支付：{{value}},</span></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="payPrice"
          label="订单金额"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-for="(value, key) in JSON.parse(scope.row.goodsPrice)" :key="key"><span v-if="key == 'cash'">现金支付：{{value / 100}},</span><span v-else-if="key == 'gold'">金贝支付：{{value}},</span><span v-else-if="key == 'silver'">银贝支付：{{value}},</span></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="订单状态"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-for="item in ginfo_except_statusArr" v-if='scope.row.status == item.value'>{{item.label}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          label="操作"
          min-width="120" align='center'>
          <template slot-scope="scope">
            <el-button @click="detail(scope.row)" type="primary" plain>查看</el-button>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-pagination
    layout="prev, pager, next"
    :total="total" :page-size="20" @current-change="handleCurrentChange"
      :current-page.sync="start">
  </el-pagination>

  </div>
</template>

<script>
  export default {
    name: 'adminGroupDetail',
    data () {
      return {
        tableData: [],
        formInline: {
          key_a: '',
          key_b: '',
          key_c: '',
          key_time: ''
        },
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
        ],
        status: '',
        start: 1,
        total: 0,
        showFormBool: true, // 是否显示过滤框
      }
    },
    created () {
      this.getTableData()
    },
    mounted () {},
    methods: {
      changeStatus (type) {
        this.status = type
        this.start = 1
        this.getTableData()
      },
      getTableData () {
        this.$axios({
          type: 'post',
          url: '/bhs-management-admin/order/list',
          data: {status: this.status, pageNumber: this.start, pageSize: 20, ...this.formInline},
          fuc: (res) => {
            if (res.code != 1) {
              return
            }
            this.tableData = res.data.data
//            console.log(arr)
            this.total = parseInt(res.data.count)
          }
        })
      },
      handleCurrentChange (val) {
        this.start = val
        this.getTableData()
      },
      detail (row) {
//        if (row.except_status && row.except_status > 0) {
//          this.$router.push({path: '/orderList/onlineOrderDetail',query: {oid: row.oid, info_id: row.info_id}})
//        } else {
          this.$router.push({path: '/orderList/onlineOrderDetail',query: {id: row.id}})
//        }
      },
      downloadExcell () {
        this.$downloadExcell({
          url: '/order/export', type: this.type,
          ...this.formInline
        })
      },
      onSubmit () {
        this.start = 1
        this.getTableData()
      }
    }
  }
</script>
<style scoped="true">
  .onlineOrderList{
    margin: 10px 20px 0;
    overflow: hidden;
  }
  .searchForm{
    margin: 10px 0;
  }
  .searchForm>p{
    width: 100%;
    background-color: #f5f7fa;
    padding: 10px;
    color: #909399;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
  }
  .searchForm>p>i{
    margin-left: 20px;
  }
</style>
