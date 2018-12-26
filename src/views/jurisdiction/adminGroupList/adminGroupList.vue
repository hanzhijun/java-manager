<template>
  <div class="adminGroupList">
    <el-button type="primary" @click='addGroup'>添加管理组</el-button>
    
    <div class="searchForm">
      <p @click='showFormBool = !showFormBool'>筛选查询<i v-if='showFormBool' class="el-icon-arrow-down"></i><i v-else class="el-icon-arrow-up"></i></p>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" v-if='showFormBool'>
        <el-form-item label="输入搜索">
          <el-input v-model="formInline.key" placeholder="管理组名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getTableData(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
    :data="tableData"
    style="width: 100%">
      <el-table-column
        label="管理组列表">
        <el-table-column
          prop="id"
          label="id"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="title"
          label="管理组名称"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-if='scope.row.status == 1'>开启</span>
            <span v-else>关闭</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="300" align='center'>
          <template slot-scope='scope'>
            <el-button @click='editAdminGroup(scope.row.id)'>修改</el-button>
            <el-button @click='setAccess(scope.row.id)'>配置权限</el-button>
            <el-button @click='changeStatus(scope.row.id)'>开启/禁用</el-button>
            <el-button @click='deleteGroup(scope.row.id)'>删除</el-button>
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
    name: 'adminGroupDetail',
    data () {
      return {
        tableData: [],
        formInline: {
          key: ''
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
      getTableData (page = 0) {
        if (page == 1) {
          this.start = 1
        }
        this.$axios({
          type: 'post',
          url: '/Auth/grouplist',
          data: {page: this.start, ...this.formInline},
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
      addGroup () {
        this.$router.push({path: '/jurisdiction/adminGroupDetail'})
      },
      editAdminGroup (id) {
        this.$router.push({path: '/jurisdiction/adminGroupDetail', query: {id: id}})
      },
      setAccess (id) {
        this.$router.push({path: '/jurisdiction/adminAccessDetail', query: {id: id}})
      },
      changeStatus (id) {
        this.$axios({
          type: 'get',
          url: '/Auth/modifygroupstatusbyid',
          data: {gid: id},
          fuc: (res) => {
            this.getTableData()
          }
        })
      },
      deleteGroup (id) {
        this.$axios({
          type: 'get',
          url: '/Auth/delgroupbyid',
          data: {gid: id},
          fuc: (res) => {
            console.log(res)
            debugger
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
  .adminGroupList{
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