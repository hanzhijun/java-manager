<template>
  <div class="goodsBrandsList">
    <el-button type='primary' @click='addBrands'>添加邮费模板</el-button>
    
    <el-table
    :data="tableData"
    style="width: 100%">
      <el-table-column
        label="邮费列表">
        <el-table-column
          prop="fid"
          label="编号"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="freight_name"
          label="模板名称"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="default_freight"
          label="默认"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span>{{$formatMoney((scope.row.default_freight / 100) + '')}}</span>
<!--            <span>{{$formatMoney(('125.1' / 100) + '')}}</span>-->
          </template>
        </el-table-column>
        <el-table-column
          prop="create_at"
          label="添加时间"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-if='scope.row.status == 1'>启用</span>
            <span v-else>禁用</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          label="操作"
          min-width="280" align='center'>
          <template slot-scope='scope'>
            <el-button @click='editBrand(scope.row.fid)'>编辑</el-button>
            <el-button @click='deleteBrand(scope.row.fid)'>删除</el-button>
            <el-button v-if='scope.row.status == 1' @click='changeStatus(scope.row)'>关闭</el-button>
            <el-button v-else @click='changeStatus(scope.row)'>开启</el-button>
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
    name: 'goodsBrandsList',
    data () {
      return {
        tableData: [],
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
          url: '/goods/freight/getlists',
          data: {page: this.start, business_id: this.$route.query.business_id, limit: 20},
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
      onSubmit () {
        
      },
      changeStatus (row) {
        this.$axios({
          type: 'post',
          url: '/goods/freight/power',
          data: {fid: row.fid, business_id: this.$route.query.business_id, status: row.status == 1 ? -1 : 1},
          fuc: (res) => {
            if (res.code === 200) {
              this.$message.success('操作成功')
              this.getTableData()
            }
          }
        })
      },
      addBrands () {
        this.$router.push({path: '/business/onlineBusinessBrandsDetail', query: {business_id: this.$route.query.business_id}})
      },
      editBrand (fid) {
        this.$router.push({path: '/business/onlineBusinessBrandsDetail', query: {fid: fid, business_id: this.$route.query.business_id}})
      },
      deleteBrand (fid) {
        this.$axios({
          type: 'post',
          url: '/goods/freight/delete',
          data: {fid: fid, business_id: this.$route.query.business_id},
          fuc: (res) => {
            if (res.code === 200) {
              this.$message.success('删除成功')
              this.start = 1
              this.getTableData()
            }
          }
        })
      }
    }
  }
</script>
<style scoped="true">
  .goodsBrandsList{
    margin: 10px 20px 0;
    overflow: hidden;
  }
</style>