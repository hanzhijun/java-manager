<template>
  <div class="offlineCaterOrderList">
    <div class="searchForm">
      <p @click='showFormBool = !showFormBool'>筛选查询<i v-if='showFormBool' class="el-icon-arrow-down"></i><i v-else class="el-icon-arrow-up"></i></p>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" v-if='showFormBool'>
        <el-form-item label="提交时间">
          <el-date-picker
            v-model="formInline.time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="支付方式">
          <el-select clearable v-model='formInline.pay_type' placeholder='请选择'>
            <el-option label='在线支付' value='1'></el-option>
            <el-option label='现金/支付宝支付' value='2'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付状态">
          <el-select clearable v-model='formInline.pay_status' placeholder='请选择'>
            <el-option label='未确认收款' value='1'></el-option>
            <el-option label='已支付' value='2'></el-option>
            <el-option label='已确认收款' value='3'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getTableData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
    :data="tableData"
    style="width: 100%">
      <el-table-column
        label="线下餐饮-订单列表">
        <el-table-column
          prop="ordering_order_id"
          label="编号"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="create_at"
          label="订单时间"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="ordernum"
          label="订单号"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="tablenum"
          label="桌号"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="pay_type"
          label="支付方式"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-if='scope.row.pay_type == 1'>在线支付</span>
            <span v-else-if='scope.row.pay_type == 2'>现金/支付宝</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="pay_status"
          label="支付状态"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-if='scope.row.pay_status == 1'>未确认收款</span>
            <span v-else-if='scope.row.pay_status == 2'>已支付</span>
            <span v-else-if='scope.row.pay_status == 3'>已确认收款</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <el-button @click="goDetail(scope.row.ordernum)">查看详情</el-button>
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
    name: 'unlineBusinessList',
    data () {
      return {
        tableData: [],
        formInline: {
          pay_type: '',
          pay_status: '',
          time: []
        },
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
      getTableData () {
        console.log(this.formInline)
        this.$axios({
          type: 'post',
          url: '/ordering/businessorderlist',
          data: {businessid: this.$route.query.business_offline_id, page: this.start, ...this.formInline},
          fuc: (res) => {
            this.tableData = res.data.data
            this.total = res.data.total
          }
        })
      },
      handleCurrentChange (val) {
        this.start = val 
        this.getTableData()
      },
      goDetail (ordernum) {
        this.$router.push({path: '/offlineCatering/offlineCaterOrderDetail', query: {ordernum: ordernum}})
      }
    }
  }
</script>
<style scoped="true">
  .offlineCaterOrderList{
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