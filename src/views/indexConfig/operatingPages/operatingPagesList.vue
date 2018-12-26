<template>
  <div class="unlineBusinessList">
    <el-button type="primary" @click="addPgc('')">添加运营页面</el-button>

    <div class="searchForm">
      <p @click='showFormBool = !showFormBool'>筛选查询<i v-if='showFormBool' class="el-icon-arrow-down"></i><i v-else class="el-icon-arrow-up"></i></p>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" v-if='showFormBool'>
        <el-form-item label="输入搜索">
          <el-input v-model="formInline.search" placeholder="编号/页面名称/所在位置/撰写人名称"></el-input>
        </el-form-item>
        <el-form-item label="显示状态">
          <el-select v-model="formInline.isshow" clearable>
            <el-option value='1' label='显示'></el-option>
            <el-option value='0' label='不显示'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="使用状态">
          <el-select v-model="formInline.isuse" clearable>
            <el-option value='1' label='已使用'></el-option>
            <el-option value='0' label='未使用'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模板类型">
          <el-select v-model="formInline.operation_template_id" clearable>
            <el-option v-for="item in pagesList" :value='item.operation_template_id' :label='item.name' :key="item.operation_template_id"></el-option>
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
          prop="operation_pages_id"
          label="编号"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="name"
          label="运营页面名称"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="sort"
          label="顺序"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="area"
          label="所在位置"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="is_show"
          label="显示状态"
          min-width="120" align='center'>
          <template slot-scope="scope">
            <el-switch
              @change="switchChange(scope.row.operation_pages_id, scope.row.is_show)"
              v-model="scope.row.is_show == 1">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          min-width="170" align='center' show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="页面操作"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <el-button @click='pagesConfig(scope.row.operation_pages_id)'>页面配置</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="240" align='center'>
          <template slot-scope='scope'>
            <el-button @click='addPgc(scope.row.operation_pages_id, scope.row.name, scope.row.sort, scope.row.operation_template_id, scope.row.remark)'>编辑</el-button>
            <el-button @click='editPgc(scope.row.operation_pages_id)'>删除</el-button>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="prev, pager, next"
      :total="total" :page-size="20" @current-change="handleCurrentChange"
      :current-page.sync="start">
    </el-pagination>

    <el-dialog title="运营页面详情" :visible.sync="dialogFormVisible" @close="dialogClose">
      <el-form :model="form" ref="form" :rules="rules" label-width="120px">
        <el-form-item label="模板类型" prop="operation_template_id">
          <el-select v-model="form.operation_template_id" clearable>
            <el-option v-for="item in pagesList" :value='item.operation_template_id' :label='item.name' :key="item.operation_template_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="运营页面名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="顺序" prop="sort">
          <el-input v-model="form.sort"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'unlineBusinessList',
    data () {
      return {
        dialogFormVisible: false,
        dialogOperation_pages_id: '',
        form: {
          operation_template_id: '',
          name: '',
          remark: '',
          sort: '',
        },
        rules: {
          operation_template_id: [{ required: true, message: '请选择', trigger: 'blur' }],
          name: [{ required: true, message: '请输入', trigger: 'blur' }],
          sort: [{ required: true, message: '请输入', trigger: 'blur' }]
        },
        tableData: [],
        pagesList: [],
        formInline: {
          isuse: '',
          isshow: '',
          search: '',
          operation_template_id: ''
        },
        start: 1,
        total: 0,
        loading: '',
        showFormBool: true, // 是否显示过滤框
      }
    },
    created () {
      this.$axios({
        type: 'post',
        url: '/Operation/getTemplateOption',
        data: {},
        fuc: (res) => {
          this.pagesList = res.data
        }
      })
      this.getTableData()
    },
    mounted () {},
    methods: {
      dialogClose () {
        this.dialogOperation_pages_id = ''
        this.$refs['form'].resetFields()
      },
      submit () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let _form = JSON.parse(JSON.stringify(this.form))
            if (this.dialogOperation_pages_id) {
              _form.operation_pages_id = this.dialogOperation_pages_id
            }
            this.$axios({
              type: 'post',
              url: this.dialogOperation_pages_id ? '/Operation/updateOperationPages' : '/Operation/writeOperationPages',
              data: _form,
            fuc: (res) => {
              if (res.code == 200) {
                this.$message.success('操作成功')
                this.dialogFormVisible = false
                this.getTableData()
              }
            }
          })
          }
        })
      },
      getTableData () {
        this.$axios({
            type: 'post',
            url: '/Operation/getOperationPagesList',
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
      addPgc (operation_pages_id, name, sort, operation_template_id, remark) {
        if (operation_pages_id) {
          this.dialogOperation_pages_id = operation_pages_id
          this.form.operation_template_id = operation_template_id
          this.form.name = name
          this.form.sort = sort
          this.form.remark = remark
        }
        this.dialogFormVisible = true
      },
      pagesConfig (operation_pages_id) {
        this.$router.push({path: '/indexConfig/operatingConfigList', query: {operation_pages_id}})
      },
      editPgc (operation_pages_id) {
        this.$axios({
            type: 'post',
            url: '/Operation/deloOperationPages',
            data: {operation_pages_id},
            fuc: (res) => {
            if (res.code == 200) {
          this.$message.success('操作成功')
          this.getTableData()
        }
      }
      })
      },
      switchChange (operation_pages_id, is_show) {
        this.$axios({
            type: 'post',
            url: '/Operation/updateOperationPagesIsShow',
            data: {operation_pages_id, is_show: is_show == 1 ? 0 : 1},
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
