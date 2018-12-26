<template>
  <div class="goodsPackagesList">
    <el-button @click="changeStatus('all')" :type="formInline.search_status == 'all' ? 'primary' : ''">全部</el-button>
    <el-button @click="changeStatus('-2')" :type="formInline.search_status == '-2' ? 'primary' : ''">审核失败</el-button>
    <el-button @click="changeStatus('0')" :type="formInline.search_status == '0' ? 'primary' : ''">审核中</el-button>
    <el-button @click="changeStatus('-1')" :type="formInline.search_status == '-1' ? 'primary' : ''">已下架</el-button>
    <el-button @click="changeStatus('1')" :type="formInline.search_status == '1' ? 'primary' : ''">审核成功</el-button>

    <div class="searchForm">
      <p @click='showFormBool = !showFormBool'>筛选查询<i v-if='showFormBool' class="el-icon-arrow-down"></i><i v-else class="el-icon-arrow-up"></i></p>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" v-if='showFormBool'>
        <el-form-item label="输入搜索">
          <el-input v-model="formInline.search_name_no_business" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="商品类目">
          <el-cascader
            :options="categoryArr" change-on-select
            v-model="formInline.search_category_id" clearable>
          </el-cascader>
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
        label="代金券列表">
        <el-table-column
          prop="package_id"
          label="id"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="package_name"
          label="代金券名称"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="business_name"
          label="所属商家"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="business_name"
          label="分类"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span>{{scope.row.first_category_name}} - {{scope.row.second_category_name}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="transfer_cash"
          label="价格"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-if='scope.row.transfer_type === 0'>{{scope.row.transfer_cash / 100}}元</span>
            <span v-else>{{scope.row.price * scope.row.transfer_ratio / 10000}}元</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="num"
          label="总库存"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-if='scope.row.status == -1'>冻结</span>
            <span v-if='scope.row.status == 0'>审核中</span>
            <span v-if='scope.row.status == 1'>上架</span>
            <span v-if='scope.row.status == -2'>审核失败</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          label="操作"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <el-button @click='detailGoodsDetail(scope.row)'>编辑</el-button>
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
    name: 'goodsList',
    data () {
      return {
        tableData: [],
        formInline: {
          search_name_no_business: '',
          search_category_id: [],
          search_status: 'all'
        },
        categoryArr: [],
        start: 1,
        total: 0,
        showFormBool: true, // 是否显示过滤框
      }
    },
    created () {
      this.$axios({
        type: 'post',
        url: '/package/getbusinesscategories',
        data: {},
        fuc: (res) => {
          let arr = []
          for (let val of res.data) {
            let obj = {}
            obj.label = val.name
            obj.value = val.business_category_id
            if (val.data && val.data.length > 0) {
              obj.children = []
              for (let val2 of val.data) {
                obj.children.push({
                  label: val2.s_name,
                  value: val2.s_business_category_id
                })
              }
            }
            arr.push(obj)
          }
          this.categoryArr = arr
        }
      })
      this.getTableData()
    },
    mounted () {},
    methods: {
      getTableData () {
        this.$axios({
          type: 'post',
          url: '/package/packagelists',
          data: {page: this.start, limit: 20, package_type: 2, ...this.formInline},
          fuc: (res) => {
            if (res.code === 200) {
              this.tableData = res.data.data
              this.total = res.data.count
            }
          }
        })
      },
      changeStatus (type) {
        this.formInline.search_status = type
        this.getTableData()
      },
      handleCurrentChange (val) {
        this.start = val
        this.getTableData()
      },
      onSubmit () {
        this.start = 1
        this.getTableData()
      },
      detailGoodsDetail (row) {
        this.$router.push({path: '/goods/goodsVouchersDetail', query: {package_id: row.package_id}})
      },
      addGoods () {
        this.$router.push({path: '/goods/goodsVouchersDetail', query: {business_id: this.$route.query.business_id}})
      }
    }
  }
</script>
<style scoped="true">
  .goodsPackagesList{
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
