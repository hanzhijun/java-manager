<template>
  <div class="onlineBusinessList">
    <el-button type="primary" @click="addBusiness('')">添加商家</el-button>
    
    <div class="searchForm">
      <p @click='showFormBool = !showFormBool'>筛选查询<i v-if='showFormBool' class="el-icon-arrow-down"></i><i v-else class="el-icon-arrow-up"></i></p>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" v-if='showFormBool'>
        <el-form-item label="输入搜索">
          <el-input v-model="formInline.search" placeholder="商家名称"></el-input>
        </el-form-item>
        <el-form-item label="商家类目">
          <el-select v-model='formInline.category_id' placeholder='请选择对应类目' clearable>
            <el-option v-for='item in categoryList' :label='item.c_name' :key='item.cid' :value='item.cid'></el-option>
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
        label="商家列表">
        <el-table-column
          prop="business_id"
          label="编号"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="name"
          label="商家名称"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="category_id"
          label="一级类目"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-for="(item2, index) in scope.row.category_id.slice(1, scope.row.category_id.length - 1).split(',')"><span v-for='item in categoryList' v-if='item.cid == item2'>{{item.c_name}}<i v-if="index < scope.row.category_id.slice(1, scope.row.category_id.length - 1).split(',').length - 1">,</i></span></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="spu"
          label="spu数"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="sku"
          label="sku数"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="account"
          label="商家账号"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="account"
          label="销售额"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <el-button @click='detailFinancial(scope.row.business_id)'>查看</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="运营状态"
          min-width="170" align='center'>
          <template slot-scope='scope'>
            <el-switch
              v-model="scope.row.status == 2"
              active-text="经营中"
              @change='changeStatus(scope.row.business_id)'
              inactive-text="已关店">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="180" align='center'>
          <template slot-scope='scope'>
            <el-button @click='addBusiness(scope.row.business_id)'>编辑</el-button>
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
    name: 'onlineBusinessList',
    data () {
      return {
        tableData: [],
        formInline: {
          search: '',
          category_id: ''
        },
        categoryList: [],
        start: 1,
        total: 0,
        showFormBool: true, // 是否显示过滤框
      }
    },
    created () {
      this.$axios({
        type: 'post',
        url: '/goods/category/getinfo',
        data: {},
        fuc: (res) => {
          this.categoryList = res.data
        }
      })
      this.getTableData()
    },
    mounted () {},
    methods: {
      detailFinancial (business_id) {
        this.$alert(business_id, '销售额', {
          confirmButtonText: '确定',
          callback: action => {
            
          }
        });
      },
      changeStatus (business_id) {
        this.$axios({
          type: 'post',
          url: '/business/changestatus',
          data: {business_id: business_id},
          fuc: (res) => {
            this.getTableData()
          }
        })
      },
      handleCurrentChange (val) {
        this.start = val 
        this.getTableData()
      },
      getTableData () {
        this.$axios({
          type: 'post',
          url: '/business/getlist',
          data: {page: this.start, ...this.formInline},
          fuc: (res) => {
            this.tableData = res.data.data
            this.total = res.data.total
          }
        })
      },
      addBusiness (business_id) {
        if (business_id) {
          this.$router.push({path: '/business/onlineBusinessDetail', query: {business_id: business_id}})
        } else {
          this.$router.push({path: '/business/onlineBusinessDetail'})
        }
      }
    }
  }
</script>
<style scoped="true">
  .onlineBusinessList{
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