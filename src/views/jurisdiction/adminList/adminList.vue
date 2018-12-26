<template>
  <div class="adminList">
    <el-button type="primary" @click='addAdmin'>添加管理员</el-button>
    
    <div class="searchForm">
      <p @click='showFormBool = !showFormBool'>筛选查询<i v-if='showFormBool' class="el-icon-arrow-down"></i><i v-else class="el-icon-arrow-up"></i></p>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" v-if='showFormBool'>
        <el-form-item label="输入搜索">
          <el-input v-model="formInline.title" placeholder="账户名称"></el-input>
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
        label="管理组列表">
        <el-table-column
          prop="uid"
          label="Id"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="username"
          label="账户名称"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="title"
          label="所属组别"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="ustatus"
          label="状态"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-if='scope.row.ustatus == 1'>开启</span>
            <span v-else>关闭</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="300" align='center'>
          <template slot-scope='scope'>
            <el-button @click='editAdmin(scope.row.uid)'>修改</el-button>
            <el-button @click='changeStatus(scope.row.uid)'>开启/禁用</el-button>
            <el-button @click='deleteAdmin(scope.row.uid)'>删除</el-button>
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
    name: 'adminList',
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
          type: 'post',
          url: '/Auth/adminlist',
          data: {type: 2},
          fuc: (res) => {
            this.tableData = res.data.list
            this.total = res.data.all_num
          }
        })
      },
      handleCurrentChange (val) {
        this.start = val 
        this.getTableData()
      },
      changeStatus (id) {
        this.$axios({
          type: 'get',
          url: '/Auth/modifyadminstatusbyid',
          data: {uid: id},
          fuc: (res) => {
            this.getTableData()
          }
        })
      },
      addAdmin () {
        this.$router.push({path: '/jurisdiction/adminDetail'})
      },
      editAdmin (id) {
        this.$router.push({path: '/jurisdiction/adminDetail', query: {id: id}})
      },
      deleteAdmin (id) {
        this.$axios({
          type: 'post',
          url: '/Auth/deladmininfobyid',
          data: {id: id},
          fuc: (res) => {
            this.getTableData()
          }
        })
      },
      onSubmit () {
        
      }
    }
  }
</script>
<style scoped="true">
  .adminList{
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