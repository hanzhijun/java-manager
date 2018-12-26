<template>
  <div class="cUserList">
    <div class="searchForm">
      <p @click='showFormBool = !showFormBool'>筛选查询<i v-if='showFormBool' class="el-icon-arrow-down"></i><i v-else class="el-icon-arrow-up"></i></p>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" v-if='showFormBool'>
        <el-form-item label="注册源">
          <el-select v-model="formInline.key_a">
            <el-option value='1' label='小程序'></el-option>
            <el-option value='2' label='app'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="注册时间">
          <el-date-picker
            v-model="formInline.key_time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click='downloadExcell'>导出</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
    :data="tableData"
    style="width: 100%">
      <el-table-column
        label="用户列表" width='100%'>
        <el-table-column
          prop="user_phone"
          label="手机号"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="nickname"
          label="昵称"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="reg_source"
          label="注册源"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="surplus_goldshells"
          label="剩余金贝数量"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="surplus_silvershells"
          label="剩余银贝数"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="balance"
          label="剩余余额"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="allbalance"
          label="获得总余额"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="create_at"
          label="注册时间"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="recommend_code"
          label="用户推荐码"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="recommend_num"
          label="用户推荐人数"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="id"
          label="操作"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <el-button @click='detailUser(scope.row)'>查看详情</el-button>
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
    name: 'cUserList',
    data () {
      return {
        tableData: [],
        formInline: {
          key_a: '',
          key_time: []
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
          url: '/User/userlist',
          data: {page: this.start, ...this.formInline},
          fuc: (res) => {
            this.tableData = res.data.userlist
            this.total = res.data.allnum
          }
        })
      },
      downloadExcell () {
        this.$downloadExcell({
          url: '/User/createUserListExcel',
          ...this.formInline
        })
      },
      handleCurrentChange (val) {
        this.start = val 
        this.getTableData()
      },
      onSubmit () {
        this.start = 1
        this.getTableData()
      },
      detailUser (row) {
        this.$router.push({path: '/cUser/cUserDetail', query: {id: row.user_id}})
      }
    }
  }
</script>
<style scoped="true">
  .cUserList{
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