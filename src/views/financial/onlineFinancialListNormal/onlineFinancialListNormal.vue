<template>
  <div class="onlineFinancialListNormal">
    <el-button @click="changeStatus('all')" :type="type == 'all' ? 'primary' : ''">全部</el-button>
    <el-button @click="changeStatus('0')" :type="type == '0' ? 'primary' : ''">分账中</el-button>
    <el-button @click="changeStatus('1')" :type="type == '1' ? 'primary' : ''">分账成功</el-button>
    <el-button @click="changeStatus('-1')" :type="type == '-1' ? 'primary' : ''">分账失败</el-button>

    <div class="searchForm">
      <p @click='showFormBool = !showFormBool'>筛选查询<i v-if='showFormBool' class="el-icon-arrow-down"></i><i v-else class="el-icon-arrow-up"></i></p>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" v-if='showFormBool'>
        <el-form-item label="输入搜索">
          <el-input v-model="formInline.key_a" placeholder="商家名称/订单号"></el-input>
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
          <el-button type="primary" @click='searchFormBtn'>查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click='downloadExcell'>导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
    :data="tableData"
    style="width: 100%" border>
      <el-table-column
        label="管理组列表">
        <el-table-column
          prop="order_id"
          label="订单编号"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="order_id"
          label="订单支付时间"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span>{{$formatTime(scope.row.payment_at)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="transfer_no"
          label="结算编号"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="prorate_at"
          label="结算时间"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span>{{$formatTime(scope.row.prorate_at)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="deliver_status"
          label="订单状态"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-for='item in ginfo_deliver_statusArr' v-if='item.value == scope.row.deliver_status'>{{item.label}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="business_name"
          label="商家名称"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="g_format"
          label="商品sku"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="g_income"
          label="商品进价"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span>{{scope.row.g_income / 100}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="amount"
          label="结算金额"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-if='scope.row.amount'>{{scope.row.amount / 100}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="freight"
          label="结算邮费"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-if='scope.row.freight'>{{scope.row.freight / 100}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="channel"
          label="结算渠道"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-if='scope.row.channel == 0'>未分账</span>
            <span v-else-if='scope.row.channel == 1'>支付宝</span>
            <span v-else-if='scope.row.channel == 2'>微信</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="roof_status"
          label="结算状态"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <p v-if='scope.row.channel != 0'>
              <span v-if='scope.row.roof_status == 0'>失败</span>
              <span v-else-if='scope.row.roof_status == 1'>成功</span>
            </p>
            <p v-else>未分账</p>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="140" align='center'>
          <template slot-scope='scope'>
            <el-button @click='detailFinancial(scope.row)'>查看详情</el-button>
<!--            <el-button @click='assignMoney(scope.row)'>分账</el-button>-->
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
          key_time: []
        },
        type: 'all',
        start: 1,
        total: 0,
        ginfo_deliver_statusArr: [
          {value: 1, label: '等待出库'},
          {value: 2, label: '配送中'},
          {value: 3, label: '已签收'}
        ],
        showFormBool: true, // 是否显示过滤框
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
          url: '/Financial/financialonlinelist',
          data: {page: this.start, opt: this.type, ...this.formInline},
          fuc: (res) => {
            this.tableData = res.data.exc_info
            this.total = res.data.all_num
          }
        })
      },
      onSubmit () {

      },
      downloadExcell () {
        this.$downloadExcell({
          url: '/Financial/createExcel',
          ...this.formInline
        })
      },
      handleCurrentChange (val) {
        this.start = val
        this.getTableData()
      },
      changeStatus (type) {
        this.type = type
        this.start = 1
        this.getTableData()
      },
      searchFormBtn () {
        this.start = 1
        this.getTableData()
      },
      detailFinancial (row) {
        this.$router.push({path: '/financial/onlineFinancialListNormalDetail', query: {id: row.info_id}})
      }
    }
  }
</script>
<style scoped="true">
  .onlineFinancialListNormal{
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
