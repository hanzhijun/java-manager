<template>
  <div class="unlineFinancialList">
    <el-button @click="changeStatus('all')" :type="type == 'all' ? 'primary' : ''">全部</el-button>
    <el-button @click="changeStatus('1')" :type="type == '1' ? 'primary' : ''">结算成功</el-button>
    <el-button @click="changeStatus('0')" :type="type == '0' ? 'primary' : ''">结算失败</el-button>

    <div class="searchForm">
      <p @click='showFormBool = !showFormBool'>筛选查询<i v-if='showFormBool' class="el-icon-arrow-down"></i><i v-else class="el-icon-arrow-up"></i></p>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" v-if='showFormBool'>
        <el-form-item label="输入搜索">
          <el-input v-model="formInline.key_a" placeholder="商家名称"></el-input>
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
          prop="name"
          label="商家名称"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="nickname"
          label="用户ID"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="pay_way"
          label="消费方式"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span>扫码支付</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="total_cost"
          label="消费金额"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span>{{scope.row.total_cost / 100}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="return_silver"
          label="银贝产生"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="amount"
          label="结算金额"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span>{{scope.row.amount / 100}}</span>
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
          prop="create_at"
          label="结算时间"
          min-width="120" align='center'>
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
          key_a: '',
          key_time: []
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
          url: '/Financial/downFinancialList',
          data: {page: this.start, type: -1, opt: this.type, ...this.formInline},
          fuc: (res) => {
            if (res.code === 200) {
              this.tableData = res.data.order_list
              this.total = res.data.all_num
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
          url: '/Financial/createExcel',
          ...this.formInline
        })
      },
      changeStatus (type) {
        this.type = type
        this.start = 1
        this.getTableData()
      },
      detailFinancial (row) {
        this.$router.push({path: '/financial/unlineFinancialDetail', query: {package_order_id: row.package_order_id}})
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
