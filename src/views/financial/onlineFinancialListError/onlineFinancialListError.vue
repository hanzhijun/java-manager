<template>
  <div class="onlineFinancialListNormal">
    <el-button @click="changeStatus('all')" :type="type == 'all' ? 'primary' : ''">全部</el-button>
    <el-button @click="changeStatus('0')" :type="type == '0' ? 'primary' : ''">未回款</el-button>
    <el-button @click="changeStatus('1')" :type="type == '1' ? 'primary' : ''">已回款</el-button>

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
        label="异常结算列表">
        <el-table-column
          prop="order_id"
          label="订单编号"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="prorate_num"
          label="结算编号"
          min-width="120" align='center'>
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
          prop="nickname"
          label="用户ID"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="retreat_gold"
          label="应退金贝（银贝）"
          min-width="140" align='center'>
          <template slot-scope='scope'>
            <span>{{scope.row.retreat_gold}}金贝/{{scope.row.retreat_silver}}银贝</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="actual_gold"
          label="实退金贝（银贝）"
          min-width="140" align='center'>
          <template slot-scope='scope'>
            <span>{{scope.row.actual_gold}}金贝/{{scope.row.actual_silver}}银贝</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="retreat_cash"
          label="应退现金"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span>{{scope.row.retreat_cash / 100}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="actual_cash"
          label="实退现金"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span>{{scope.row.actual_cash / 100}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="return_status"
          label="是否回款"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-if='scope.row.return_status == 0'>否</span>
            <span v-else>是</span>
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
        ginfo_deliver_statusArr: [
          {value: 1, label: '等待出库'},
          {value: 2, label: '配送中'},
          {value: 3, label: '已签收'}
        ],
        type: 'all',
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
        this.$axios({
          type: 'post',
          url: '/Financial/excfinancialonlinelist',
          data: {page: this.start, opt: this.type, ...this.formInline},
          fuc: (res) => {
            if (res.code === 200) {
              this.tableData = res.data.exc_info
              this.total = res.data.all_num
            }
          }
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
      onSubmit () {

      },
      downloadExcell () {
        this.$downloadExcell({
          url: '/Financial/excCreateExcel',
          ...this.formInline
        })
      },
      searchFormBtn () {
        this.start = 1
        this.getTableData()
      },
      detailFinancial (row) {
        this.$router.push({path: '/financial/onlineFinancialListErrorDetail', query: {info_id: row.info_id}})
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
