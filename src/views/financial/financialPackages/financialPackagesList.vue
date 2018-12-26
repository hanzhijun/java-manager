<template>
  <div class="unlineFinancialList">
    <el-button @click="changeStatus('all')" :type="type == 'all' ? 'primary' : ''">全部</el-button>
    <el-button @click="changeStatus('1')" :type="type == '1' ? 'primary' : ''">结算成功</el-button>
    <el-button @click="changeStatus('-1')" :type="type == '-1' ? 'primary' : ''">结算失败</el-button>

    <div class="searchForm">
      <p @click='showFormBool = !showFormBool'>筛选查询<i v-if='showFormBool' class="el-icon-arrow-down"></i><i v-else class="el-icon-arrow-up"></i></p>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" v-if='showFormBool'>
        <el-form-item label="输入搜索">
          <el-input v-model="formInline.search_business_name" placeholder="商家名称"></el-input>
        </el-form-item>
        <el-form-item label="提交时间">
          <el-date-picker
            v-model="formInline.search_time"
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
    style="width: 100%">
      <el-table-column
        label="线下结算列表">
        <el-table-column
          prop="package_order_no"
          label="订单编号"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="transfer_no"
          label="结算编号"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="business_name"
          label="商家名称"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="transfer_type"
          label="订单状态"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-if='scope.row.order_status == 0'>待支付</span>
            <span v-else-if='scope.row.order_status == 1'>已支付</span>
            <span v-else-if='scope.row.order_status == -1'>取消订单</span>
            <span v-else-if='scope.row.order_status == 2'>已完成</span>
            <span v-else-if='scope.row.order_status == 3'>退款中</span>
            <span v-else-if='scope.row.order_status == 4'>已退款</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="package_name"
          label="服务名称"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="total_cost"
          label="售价"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span>{{scope.row.total_cost / 100}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="transfer_amount"
          label="结算金额"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span>{{scope.row.transfer_amount / 100}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="transfer_type"
          label="结算渠道"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-if='scope.row.transfer_type == 1'>微信</span>
            <span v-else-if='scope.row.transfer_type == 2'>支付宝</span>
            <span v-else-if='scope.row.transfer_type == 3'>人工</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="transfer_status"
          label="结算状态"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-if='scope.row.transfer_status == 0'>待转账</span>
            <span v-else-if='scope.row.transfer_status == 1'>成功</span>
            <span v-else-if='scope.row.transfer_status == -1'>失败</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          label="操作"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <el-button @click='detailFinancial(scope.row)'>查看详情</el-button>
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
          search_business_name: '',
          search_time: []
        },
        start: 1,
        total: 0,
        type: 'all',
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
          url: '/Financial/normalpackage',
          data: {page: this.start, type: 1, transfer_status: this.type, package_type: 1, ...this.formInline},
          fuc: (res) => {
            if (res.code === 200) {
              this.tableData = res.data.data
              this.total = res.data.count
            }
          }
        })
      },
      handleCurrentChange (val) {
        this.start = val
        this.getTableData()
      },
      searchFormBtn () {
        this.start = 1
        this.getTableData()
      },
      downloadExcell () {
        this.$downloadExcell({
          url: '/Financial/export',
          package_type: 1,
          export_type: 'normal',
          ...this.formInline
        })
      },
      changeStatus (type) {
        this.type = type
        this.start = 1
        this.getTableData()
      },
      detailFinancial (row) {
        this.$router.push({path: '/financial/financialPackagesDetail', query: {union_business_transfer_id: row.union_business_transfer_id}})
      }
    }
  }
</script>
<style scoped="true">
  .unlineFinancialList{
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
