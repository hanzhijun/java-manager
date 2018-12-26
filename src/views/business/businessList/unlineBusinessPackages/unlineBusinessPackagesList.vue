<template>
  <div class="goodsPackagesList">
    <el-button @click="changeStatus('')" :type="formInline.status == '' ? 'primary' : ''">全部</el-button>
    <el-button @click="changeStatus('-2')" :type="formInline.status == '-2' ? 'primary' : ''">审核失败</el-button>
    <el-button @click="changeStatus('0')" :type="formInline.status == '0' ? 'primary' : ''">审核中</el-button>
    <el-button @click="changeStatus('-1')" :type="formInline.status == '-1' ? 'primary' : ''">冻结</el-button>
    <el-button @click="changeStatus('1')" :type="formInline.status == '1' ? 'primary' : ''">审核成功</el-button>

    <div class="searchForm">
      <p @click='showFormBool = !showFormBool'>筛选查询<i v-if='showFormBool' class="el-icon-arrow-down"></i><i v-else class="el-icon-arrow-up"></i></p>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" v-if='showFormBool'>
        <el-form-item label="输入搜索">
          <el-input v-model="formInline.name" placeholder="服务名称/商家"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-button @click='addGoods' style='margin-bottom: 10px;'>添加</el-button>

    <el-table
    :data="tableData"
    style="width: 100%">
      <el-table-column
        label="商品管理-服务列表">
        <el-table-column
          prop="id"
          label="id"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="name"
          label="服务名称"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="businessName"
          label="所属商家"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="salesPrice"
          label="售价"
          min-width="120" align='center'>
          <template slot-scope="scope">
            <span>现金： {{JSON.parse(scope.row.salesPrice).cash}}, 金贝：{{ JSON.parse(scope.row.salesPrice).gold}}, 铜贝： {{JSON.parse(scope.row.salesPrice).copper}} </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="stock"
          label="总库存"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="status"
          label="服务状态"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-if='scope.row.status == 0'>已下架</span>
            <span v-if='scope.row.status == 1'>已上架</span>
            <span v-if='scope.row.status == 2'>审核中</span>
            <span v-if='scope.row.status == 3'>审核失败</span>
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
          name: '',
          status: ''
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
          url: '/bhs-management-admin/specialGoods/list',
          data: {bizType: 1, pageNumber: this.start, pageSize: 20, businessId: this.$route.query.business_id , ...this.formInline},
          fuc: (res) => {
            if (res.code == 1) {
              this.tableData = res.data.data
              this.total = parseInt(res.data.count)
            }
          }
        })
      },
      changeStatus (type) {
        this.formInline.status = type
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
        this.$router.push({path: '/business/unlineBusinessPackagesDetail', query: {id: row.id, business_id: this.$route.query.business_id}})
      },
      addGoods () {
        this.$router.push({path: '/business/unlineBusinessPackagesDetail', query: {business_id: this.$route.query.business_id}})
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
