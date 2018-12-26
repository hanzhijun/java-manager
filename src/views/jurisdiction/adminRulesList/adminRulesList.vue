<template>
  <div class="adminRulesList">
    <el-button type="primary" @click='addRules'>添加规则</el-button>
    
    <div class="searchForm">
      <p @click='showFormBool = !showFormBool'>筛选查询<i v-if='showFormBool' class="el-icon-arrow-down"></i><i v-else class="el-icon-arrow-up"></i></p>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" v-if='showFormBool'>
        <el-form-item label="输入搜索">
          <el-input v-model="formInline.key" placeholder="名称"></el-input>
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
        label="规则列表">
        <el-table-column
          prop="id"
          label="Id"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="module"
          label="所属模块"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="name"
          label="方法路径"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="title"
          label="名称"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="status"
          label="当前状态"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-if='scope.row.status == 1'>开启</span>
            <span v-else>关闭</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="180" align='center'>
          <template slot-scope='scope'>
            <el-button @click='changeStatus(scope.row.id)'>开启/禁用</el-button>
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
    name: 'adminRulesList',
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
      getTableData () {
        this.$axios({
          type: 'post',
          url: '/Auth/getrulelist',
          data: {page: this.start, ...this.formInline},
          fuc: (res) => {
            this.tableData = res.data.rules_list
            this.total = res.data.all_num
          }
        })
      },
      changeStatus (id) {
        this.$axios({
          type: 'get',
          url: '/Auth/modifyrulestatusbyid',
          data: {rid: id},
          fuc: (res) => {
            this.getTableData()
          }
        })
      },
      addRules () {
        this.$router.push({path: '/jurisdiction/adminRulesDetail'})
      },
      handleCurrentChange (val) {
        this.start = val 
        this.getTableData()
      },
      onSubmit () {
        
      }
    }
  }
</script>
<style scoped="true">
  .adminRulesList{
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