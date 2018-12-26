<template>
  <div class="goodsBrandsList">
    <el-button type='primary' @click='addBrand'>添加邮费</el-button>
    
    <el-table
    :data="tableData"
    style="width: 100%">
      <el-table-column
        label="邮费列表">
        <el-table-column
          prop="id"
          label="ID"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="id"
          label="操作"
          min-width="240" align='center'>
          <template slot-scope='scope'>
            <el-button @click='editBrand(scope.row)'>编辑</el-button>
            <el-button @click='delBrand(scope.row)'>删除</el-button>
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
        total: 0
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
          url: '/bhs-management-admin/userFreight/list',
          data: {pageNumber: this.start, pageSize: 20},
          fuc: (res) => {
            if (res.code == 1) {
              this.tableData = res.data.data
              this.total = parseInt(res.data.count)
            }
          }
        })
      },
      handleCurrentChange (val) {
        this.start = val 
        this.getTableData()
      },
      editBrand (row) {
        this.$router.push({path: '/otherConfig/userFreightDetail', query: {id: row.id}})
      },
      addBrand () {
        this.$router.push({path: '/otherConfig/userFreightDetail'})
      },
      delBrand (row) {
        this.$axios({
          type: 'delete',
          url: '/bhs-management-admin/userFreight/' + row.id,
          data: {},
          fuc: (res) => {
            if (res.code == 1) {
              this.$message.success('删除成功')
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