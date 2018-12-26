<template>
  <div class="unlineBusinessList">
<!--
    <el-button type="primary" @click="addBusiness('1')">添加A类商家</el-button>
    <el-button type="primary" @click="addBusiness('2')">添加B类商家</el-button>
-->

    <div class="searchForm">
      <p @click='showFormBool = !showFormBool'>筛选查询<i v-if='showFormBool' class="el-icon-arrow-down"></i><i v-else class="el-icon-arrow-up"></i></p>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" v-if='showFormBool'>
        <el-form-item label="输入搜索">
          <el-input v-model="formInline.search" placeholder="商家名称"></el-input>
        </el-form-item>
        <el-form-item label="商家类目">
          <el-select v-model='formInline.first_category_id' placeholder='请选择对应类目' clearable>
            <el-option v-for='item in categoryList' :label='item.name' :key='item.business_category_id' :value='item.business_category_id'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商家分类">
          <el-select v-model="formInline.type">
            <el-option value='1' label='线下A类商家'></el-option>
            <el-option value='2' label='线下B类商家'></el-option>
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
          prop="first_category_name"
          label="类目"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="type"
          label="商家分类"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-if='scope.row.type == 1'>线下A类</span>
            <span v-else>线下B类</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="rating_ratio"
          label="费率设置"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span>{{scope.row.rating_ratio}}%</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="back_silver_ratio"
          label="反银贝比例"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span>{{scope.row.back_silver_ratio}}%</span>
          </template>
        </el-table-column>
        <el-table-column
          label="销售额"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <el-button @click='detailFinancial(scope.row.business_offline_id)'>查看</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="account"
          label="商家账号"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="status"
          label="运营状态"
          min-width="170" align='center'>
          <template slot-scope='scope'>
            <el-switch
              v-model="scope.row.status == 2"
              active-text="经营中"
              @change='changeStatus(scope.row.business_offline_id)'
              inactive-text="已关店">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="240" align='center'>
          <template slot-scope='scope'>
            <el-button @click='addBusiness(scope.row.type, scope.row.business_offline_id)'>编辑</el-button>
            <el-button @click='outExcell(scope.row.business_offline_id, scope.row.type)'>导出</el-button>
            <el-button v-if='scope.row.type == 1 && scope.row.is_alliance == 0 && scope.row.insert_package_status == 1' @click='detailPackages(scope.row.business_offline_id)' style='margin-top: 4px;'>查看服务</el-button>
            <el-button v-if='scope.row.type == 1 && scope.row.is_alliance == 0 && scope.row.insert_package_status == 1' @click='detailVouchers(scope.row.business_offline_id)' style='margin-top: 4px;'>代金券</el-button>
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
          type: '1',
          first_category_id: '',
          search: ''
        },
        categoryList: [],
        start: 1,
        total: 0,
        loading: '',
        showFormBool: true, // 是否显示过滤框
      }
    },
    created () {
      this.$axios({
        type: 'post',
        url: '/business/categorygettree',
        data: {},
        fuc: (res) => {
          this.categoryList = res.data
        }
      })
      this.getTableData()
    },
    mounted () {},
    methods: {
      getTableData () {
        this.$axios({
          type: 'post',
          url: '/business/offlinegetlist',
          data: {page: this.start, ...this.formInline},
          fuc: (res) => {
            this.tableData = res.data.data
            this.total = res.data.total
          }
        })
      },
      detailFinancial (business_offline_id) {
        this.$axios({
          type: 'post',
          url: '/business/offlinegetsales',
          data: { business_offline_id: business_offline_id },
          fuc: (res) => {
            this.$alert(res.data.saled, '销售额', {
              confirmButtonText: '确定',
              callback: action => {

              }
            })
          }
        })

      },
      changeStatus (business_offline_id) {
        this.$axios({
          type: 'post',
          url: '/business/offlinechangestatus',
          data: {business_offline_id: business_offline_id},
          fuc: (res) => {
            this.getTableData()
          }
        })
      },
      handleCurrentChange (val) {
        this.start = val
        this.getTableData()
      },
      addBusiness (type, business_offline_id) {
        if (business_offline_id) {
          this.$router.push({path: '/business/unlineBusinessDetail', query: {business_offline_id: business_offline_id, type: type}})
        } else {
          this.$router.push({path: '/business/unlineBusinessDetail', query: {type: type}})
        }
      },
      detailPackages (business_offline_id) {
        this.$router.push({path: '/business/unlineBusinessPackagesList', query: {business_id: business_offline_id}})
      },
      detailVouchers (business_offline_id) {
        this.$router.push({path: '/business/unlineBusinessVouchersList', query: {business_id: business_offline_id}})
      },
      outExcell (business_offline_id, type) {
        this.loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        try {
          this.$axios({
            type: 'post',
            url: type == 1 ? '/business/offlinecreatepayqrcode' : '/business/offlinecreatetableqrcode',
            data: {business_offline_id: business_offline_id},
            fuc: (res) => {
              if (res.code == 200) {
                this.$confirm('此二维码已经生成, 是否下载到本地?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {

                  this.loading.close()
                  this.$downloadExcell({
                    url: type == 1 ? '/business/offlineexportpayqrcode' : '/business/offlineexporttableqrcode',
                    name: res.data.name
                  })
//                  this.$axios({
//                    type: 'get',
//                    url: type == 1 ? '/business/offlineexportpayqrcode' : '/business/offlineexporttableqrcode',
//                    data: {name: res.data.name},
//                    fuc: (res) => {
//                      this.loading = false
//                    }
//                  })
//                  location.href = (type == 1 ? '/business/offlineexportpayqrcode?name=' : '/business/offlineexporttableqrcode?name=') + res.data.name

                }).catch(() => {
                  this.loading.close()
                  this.$message({
                    type: 'info',
                    message: '已取消下载'
                  });
                });
              }
            }
          })
        }
        catch (error) {
          this.loading.close()
          console.log(Error)
        }
      }
    }
  }
</script>
<style scoped="true">
  .unlineBusinessList{
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
