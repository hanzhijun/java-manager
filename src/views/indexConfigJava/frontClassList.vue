<template>
  <div class="goodsClassifyList">
    <el-button type='primary' @click='addClassify'>添加类目</el-button>
    
    <el-table
    :data="tableData"
    style="width: 100%">
      <el-table-column
        label="分类列表">
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
            <span>一级</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="number"
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
          min-width="400" align='center'>
          <template slot-scope='scope'>
            <el-button @click='editSecondClassify(scope.row.id)'>编辑</el-button>
            <el-button @click='addSecondClassify(scope.row.id, scope.row.name)'>新增下级</el-button>
            <el-button @click='goSecondClassify(scope.row.id)'>查看下级</el-button>
            <el-button @click='removeSecondClassify(scope.row.id)'>删除</el-button>
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
          name: ''
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
          url: '/bhs-management-admin/showpageCategory/list',
          data: {pageNumber: this.start, pageSize: 20, pid: 0},
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
      addSecondClassify (pid, name) {
        this.$router.push({path: '/indexConfigJava/frontClassDetail', query: {level: 2, pid, name}})
      },
      goSecondClassify (pid) {
        this.$router.push({path: '/indexConfigJava/frontClassSecList', query: {pid}})
      },
      editSecondClassify (id) {
        this.$router.push({path: '/indexConfigJava/frontClassDetail', query: {level: 1, id}})
      },
      removeSecondClassify (id) {
        this.$axios({
          type: 'delete',
          url: '/bhs-management-admin/showpageCategory/' + id,
          data: {},
          fuc: (res) => {
            if (res.code == 1) {
              this.$message.success('删除成功')
              this.getTableData()
            }
          }
        })
      },
      addClassify () {
        this.$router.push({path: '/indexConfigJava/frontClassDetail', query: {level: 1}})
      }
    }
  }
</script>
<style scoped="true">
  .goodsClassifyList{
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