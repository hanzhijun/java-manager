<template>
  <div class="goodsClassifySecondList">
    <el-table
    :data="tableData"
    style="width: 100%">
      <el-table-column
        label="商家二级分类列表">
        <el-table-column
          prop="id"
          label="编号"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="name"
          label="类目名称"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="level"
          label="级别"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span>{{scope.row.level.split('_').length - 2}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="goods_num"
          label="商品数量"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="sort"
          label="排序"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="id"
          label="操作"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <el-button @click='editSecondClassify(scope.row.pid, scope.row.id, scope.row.parentName)'>编辑</el-button>
<!--
            <el-button @click='removeSecondClassify(scope.row.id)'>删除</el-button>
            <el-button @click='topSecondClassify(scope.row.id)'>置顶</el-button>
-->
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
    name: 'goodsClassifyList',
    data () {
      return {
        tableData: [],
        formInline: {
          title: ''
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
          type: 'get',
          url: '/bhs-management-admin/category/category/list',
          data: {pageNumber: this.start, pageSize: 20, onoffFlag: 2, pid: this.$route.query.pid},
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
      onSubmit () {
        
      },
      editSecondClassify (pid, id, name) {
        this.$router.push({path: '/business/unBusinessClassifyDetail', query: {level: 2, pid, id, name}})
      },
      removeSecondClassify (id) {
        this.$axios({
          type: 'post',
          url: '/goods/category/delete',
          data: {id},
          fuc: (res) => {
            if (res.code === 200) {
              this.$message.success('删除成功')
              this.getTableData()
            }
          }
        })
      },
      topSecondClassify (id) {
        this.$axios({
          type: 'post',
          url: '/goods/category/top',
          data: {id},
          fuc: (res) => {
            if (res.code === 200) {
              this.$message.success('置顶成功')
              this.getTableData()
            }
          }
        })
      }
    }
  }
</script>
<style scoped="true">
  .goodsClassifySecondList{
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