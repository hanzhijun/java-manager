<template>
  <div class="onlineBusinessList">
    <el-button @click="addBusiness('')">添加商家</el-button>
    
    <div class="searchForm">
      <p @click='showFormBool = !showFormBool'>筛选查询<i v-if='showFormBool' class="el-icon-arrow-down"></i><i v-else class="el-icon-arrow-up"></i></p>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" v-if='showFormBool'>
        <el-form-item label="输入搜索">
          <el-input v-model="formInline.keywords" placeholder="编号/名称/商家账号"></el-input>
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
        label="商家账号列表">
        <el-table-column
          prop="id"
          label="编号"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="name"
          label="商家名称"
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
          prop="businessModuleResultVos"
          label="运营状态"
          min-width="170" align='center'>
          <template slot-scope='scope'>
            <p v-for="item in scope.row.businessModuleResultVos">
              <span v-if="item.type == 1">线上</span>
              <span v-if="item.type == 2">线下</span>
              <span v-if="item.type == 3">点餐</span>
              <el-switch
                v-model="item.status == 1"
                active-text=""
                @change='changeBusinessModule(item)'
                inactive-text="">
              </el-switch>
            </p>
            
          </template>
        </el-table-column>
        
        <el-table-column
          prop="status"
          label="状态"
          min-width="170" align='center'>
          <template slot-scope='scope'>
            <el-switch
              v-model="scope.row.status == 1"
              active-text="启用"
              @change='changeStatus(scope.row.business_id)'
              inactive-text="禁用">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <el-button @click='addBusiness(scope.row.id)'>编辑</el-button>
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
          keywords: '',
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
      detailFinancial (business_id) {
        this.$axios({
          type: 'post',
          url: '/business/getsales',
          data: { business_id: business_id },
          fuc: (res) => {
            this.$alert(res.data.saled, '销售额', {
              confirmButtonText: '确定',
              callback: action => {

              }
            })
          }
        })
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
      changeBusinessModule (item) {
        let url = '/bhs-management-admin/businessModule/freeze/'
        if (item.status == 1) {
          
        } else {
          url = '/bhs-management-admin/businessModule/open/'
        }
        
        this.$axios({
          type: 'put',
          url: url + item.businessId + '/' + item.type,
          data: {},
          fuc: (res) => {
            if (res.code == 1) {
              this.$message.success('操作成功')
              this.getTableData()
            }
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
          url: '/bhs-management-admin/business/list',
          data: {pageNumber: this.start, pageSize: 20, onoffFlag: 1, ...this.formInline},
          fuc: (res) => {
            this.tableData = res.data.data
            this.total = parseInt(res.data.count)
          }
        })
      },
      addBusiness (business_id) {
        if (business_id) {
          this.$router.push({path: '/business/onlineBusinessDetail', query: {business_id: business_id, type: 1}})
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