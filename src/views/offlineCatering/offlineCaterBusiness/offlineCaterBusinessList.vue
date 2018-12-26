<template>
  <div class="offlineCaterBusinessList">
    <div class="searchForm">
      <p @click='showFormBool = !showFormBool'>筛选查询<i v-if='showFormBool' class="el-icon-arrow-down"></i><i v-else class="el-icon-arrow-up"></i></p>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" v-if='showFormBool'>
        <el-form-item label="输入搜索">
          <el-input v-model="formInline.search" placeholder="商家名称"></el-input>
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
        label="商家列表">
        <el-table-column
          prop="business_offline_id"
          label="编号"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="name"
          label="商家名称"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="tel"
          label="联系电话"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="category_count"
          label="菜品分类（个）"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="dishes_count"
          label="菜品数量"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="order_count"
          label="订单数"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          label="营业额(月)"
          prop='total_sum'
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="360" align='center'>
          <template slot-scope='scope'>
            <el-button @click="goCaterRoute(scope.row.business_offline_id, 1)">订单管理</el-button>
            <el-button @click='goCaterRoute(scope.row.business_offline_id, 2)'>菜品管理</el-button>
            <el-button @click='goCaterRoute(scope.row.business_offline_id, 3)'>分类管理</el-button>
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
          search: '',
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
        this.$axios({
          type: 'post',
          url: '/ordering/businesslist',
          data: {page: this.start, ...this.formInline},
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
      goCaterRoute (business_offline_id, num) {
        if (num == 1) {
          this.$router.push({path: '/offlineCatering/offlineCaterOrderList', query: {business_offline_id: business_offline_id}})
        } else if (num == 2) {
          this.$router.push({path: '/offlineCatering/offlineCaterDishesList', query: {business_offline_id: business_offline_id}})
        } else {
          this.$router.push({path: '/offlineCatering/offlineCaterClassify', query: {business_offline_id: business_offline_id}})
        }
      }
    }
  }
</script>
<style scoped="true">
  .offlineCaterBusinessList{
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