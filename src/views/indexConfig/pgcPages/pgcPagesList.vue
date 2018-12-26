<template>
  <div class="unlineBusinessList">
    <el-button type="primary" @click="addPgc('')">添加pgc页面</el-button>

    <div class="searchForm">
      <p @click='showFormBool = !showFormBool'>筛选查询<i v-if='showFormBool' class="el-icon-arrow-down"></i><i v-else class="el-icon-arrow-up"></i></p>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" v-if='showFormBool'>
        <el-form-item label="输入搜索">
          <el-input v-model="formInline.search" placeholder="编号/页面名称/所在位置/撰写人名称"></el-input>
        </el-form-item>
        <el-form-item label="显示状态">
          <el-select v-model="formInline.publish" clearable>
            <el-option value='1' label='显示'></el-option>
            <el-option value='0' label='不显示'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="使用状态">
          <el-select v-model="formInline.use_status" clearable>
            <el-option value='1' label='已使用'></el-option>
            <el-option value='0' label='未使用'></el-option>
          </el-select>
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
        label="数据列表">
        <el-table-column
          prop="id"
          label="编号"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="title"
          label="pgc名称"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="title_sub"
          label="副标题"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="sort"
          label="顺序"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="user_name"
          label="撰写人"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="area"
          label="所在位置"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="publish"
          label="显示状态"
          min-width="120" align='center'>
          <template slot-scope="scope">
            <el-switch
              @change="switchChange(scope.row.id, scope.row.publish)"
              v-model="scope.row.publish == 1">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          min-width="170" align='center' show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="240" align='center'>
          <template slot-scope='scope'>
            <el-button @click='addPgc(scope.row.id)'>编辑</el-button>
            <el-button @click='editPgc(scope.row.id)'>删除</el-button>
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
    name: 'unlineBusinessList',
    data () {
      return {
        tableData: [],
        formInline: {
          use_status: '',
          publish: '',
          search: ''
        },
        start: 1,
        total: 0,
        loading: '',
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
            url: '/Operation/pgclist',
            data: {page: this.start, limit: 20, ...this.formInline},
          fuc: (res) => {
          this.tableData = res.data.data
          this.total = res.data.total
        }
      })
      },
      handleCurrentChange (val) {
        this.start = val
        this.getTableData()
      },
      addPgc (id) {
        if (id) {
          this.$router.push({path: '/indexConfig/pgcPagesDetail', query: {id: id}})
        } else {
          this.$router.push({path: '/indexConfig/pgcPagesDetail'})
        }
      },
      editPgc (id) {
        this.$axios({
          type: 'post',
          url: '/Operation/deletepgc',
          data: {id},
          fuc: (res) => {
            if (res.code == 200) {
              this.$message.success('操作成功')
              this.getTableData()
            }
          }
        })
      },
      switchChange (id, publish) {
        this.$axios({
            type: 'post',
            url: '/Operation/setattr',
            data: {id, type: 'publish', publish: publish == 1 ? 0 : 1},
            fuc: (res) => {
              if (res.code == 200) {
                this.$message.success('操作成功')
                this.getTableData()
              }
            }
        })
      }
    }
  }
</script>
<style scoped="true">
  .unlineBusinessList{
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
