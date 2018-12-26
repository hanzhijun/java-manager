<template>
  <div class="goodsList">
    <div class="searchForm">
      <p @click='showFormBool = !showFormBool'>筛选查询<i v-if='showFormBool' class="el-icon-arrow-down"></i><i v-else class="el-icon-arrow-up"></i></p>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" v-if='showFormBool'>
        <el-form-item label="输入搜索">
          <el-input v-model="formInline.search" placeholder="商品编号"></el-input>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-select v-model='formInline.product_group' placeholder="请选择" clearable>
            <el-option
              v-for='item in brandArr'
              :label="item.label"
              :value="item.value"
              :key="item.value">
            </el-option>
          </el-select>
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
        label="订单列表">
        <el-table-column
          prop="order_no"
          label="订单编号"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="goods_no"
          label="订单时间"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            {{$formatTime(scope.row.create_at)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="product_name"
          label="商品名称"
          min-width="140" align='center'>
        </el-table-column>
        <el-table-column
          prop="user_id"
          label="购买人ID"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="nickname"
          label="购买人名称"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="gold"
          label="支付金贝"
          min-width="100" align='center'>
        </el-table-column>
        <el-table-column
          prop="cash"
          label="支付现金"
          min-width="100" align='center'>
        </el-table-column>
        <el-table-column
          prop="price"
          label="订单总额"
          min-width="100" align='center'>
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
    name: 'goodsList',
    data () {
      return {
        tableData: [],
        formInline: {
          search: '',
          product_group: ''
        },
        brandArr: [{
          value: 1, label: '20元话费'
        },{
          value: 2, label: '30元话费'
        },{
          value: 3, label: '50元话费'
        },{
          value: 4, label: '100元话费'
        },{
          value: 5, label: '猫眼电影'
        },{
          value: 6, label: '腾讯视频'
        },{
          value: 7, label: '爱奇艺'
        },{
          value: 8, label: '优酷'
        }],
        start: 1,
        total: 0,
        importDialogVisible: false,
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
          url: '/statistics/fictitousOrderList',
          data: {page: this.start, page_size: 20, ...this.formInline},
          fuc: (res) => {
            if (res.code == 200) {
              this.tableData = res.data.data
              this.total = res.data.total
            }
          }
        })
      },
      handleCurrentChange (val) {
        this.start = val
        this.getTableData()
      },
      onSubmit () {
        this.start = 1
        this.getTableData()
      }
    }
  }
</script>
<style scoped="true">
  .goodsList{
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
