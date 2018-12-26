<template>
  <div class="onlineOrderList">
    <el-button @click="changeStatus('0')" :type="type == '0' ? 'primary' : ''">全部订单</el-button>
    <el-button @click="changeStatus('1')" :type="type == '1' ? 'primary' : ''">待使用</el-button>
    <el-button @click="changeStatus('2')" :type="type == '2' ? 'primary' : ''">已完成</el-button>
    <el-button @click="changeStatus('3')" :type="type == '3' ? 'primary' : ''">退款中</el-button>
    <el-button @click="changeStatus('4')" :type="type == '4' ? 'primary' : ''">已退款</el-button>

    <div class="searchForm">
      <p @click='showFormBool = !showFormBool'>筛选查询<i v-if='showFormBool' class="el-icon-arrow-down"></i><i v-else class="el-icon-arrow-up"></i></p>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" v-if='showFormBool'>
        <el-form-item label="输入搜索">
          <el-input v-model="formInline.search" placeholder="订单编号/商家名称"></el-input>
        </el-form-item>
        <el-form-item label="完成时间">
          <el-date-picker
            v-model="formInline.key_time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
    :data="tableData"
    style="width: 100%">
      <el-table-column
        label="服务订单列表">
        <el-table-column
          prop="package_order_no"
          label="订单编号"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="pay_at"
          label="付款时间"
          min-width="160" align='center'>
          <template slot-scope='scope'>
            <span v-if='scope.row.pay_at'>{{$formatTime(scope.row.pay_at)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="status_at"
          label="完成时间"
          min-width="160" align='center'>
          <template slot-scope='scope'>
            <span v-if='scope.row.status_at'>{{$formatTime(scope.row.status_at)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="business_name"
          label="商家名称"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="package_name"
          label="服务名称"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="user_id"
          label="购买人ID"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="price"
          label="服务售价"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="total_cost"
          label="订单状态"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-if='scope.row.status == 1'>待使用</span>
            <span v-if='scope.row.status == 2'>已完成</span>
            <span v-if='scope.row.status == 3'>退款中</span>
            <span v-if='scope.row.status == 4'>已退款</span>
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
          search: '',
          key_time: []
        },
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
        ginfo_deliver_statusArr: [
          {value: 1, label: '等待出库'},
          {value: 2, label: '配送中'},
          {value: 3, label: '已签收'}
        ],
        ginfo_except_statusArr: [
          {value: 0, label: '正常订单'},
          {value: 1, label: '申请退款'},
          {value: 2, label: '退款中'},
          {value: 3, label: '退款成功'},
          {value: 4, label: '驳回'},
          {value: 5, label: '退款失败'},
        ],
        type: '0',
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
        this.type = type
        this.start = 1
        this.getTableData()
      },
      getTableData () {
        this.$axios({
          type: 'post',
          url: '/order/getofflineorderlist',
          data: {package_type: 1, status: this.type, page : this.start, search: this.formInline.search, stime_finish: this.formInline.key_time[0] ? new Date(this.formInline.key_time[0]).getTime() / 1000 : '', etime_finish: this.formInline.key_time[1] ? new Date(this.formInline.key_time[1]).getTime() / 1000 : ''},
          fuc: (res) => {
            if (res.code !== 200) {
              return
            }
            this.tableData = res.data.data
            this.total = res.data.total
          }
        })
      },
      handleCurrentChange (val) {
        this.start = val
        this.getTableData()
      },
      detail (row) {
        this.$router.push({path: '/orderList/packagesOrderDetail',query: {package_order_id: row.package_order_id}})
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
