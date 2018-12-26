<template>
  <div class="offlineCaterClassifyList">
    <el-button style="margin-bottom: 10px;" @click="dialogFormVisible = true">添加分类</el-button>
    
    <el-table
    :data="tableData"
    style="width: 100%">
      <el-table-column
        label="线下餐饮-分类列表">
        <el-table-column
          prop="sort"
          label="排序"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="cname"
          label="分类名称"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="count"
          label="菜品数量"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="ordering_category_id"
          label="设置"
          min-width="240" align='center'>
          <template slot-scope='scope'>
            <el-button @click="changeOne(scope.row.ordering_category_id, '1')">上移一级</el-button>
            <el-button @click="changeOne(scope.row.ordering_category_id, '2')">下移一级</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="200" align='center'>
          <template slot-scope='scope'>
            <el-button type='primary' @click="editConfig(scope.row)">编辑</el-button>
            <el-button type='danger' @click="removeConfig(scope.row.ordering_category_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-pagination
    layout="prev, pager, next"
    :total="total" :page-size="20" @current-change="handleCurrentChange"
      :current-page.sync="start">
  </el-pagination>
    <el-dialog title="分类详情" :visible.sync="dialogFormVisible" @close='dialogClose' :show-close='false'>
      <el-form :model="form" ref='form' label-width="80px" :rules='rules'>
        <el-form-item label="分类名称" prop='cname'>
          <el-input v-model="form.cname" auto-complete="off" :maxlength='6' placeholder='请输入分类名称'></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisibleTrue">确 定</el-button>
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
        tableData: [],
        classListArr: [],
        ordering_category_id: '',
        formInline: {
          category_id: ''
        },
        start: 1,
        total: 0,
        form: {cname: ''},
        rules: {
          cname: [{ required: true, message: '请填写分类名称', trigger: 'blur' }]
        },
        showFormBool: true, // 是否显示过滤框
      }
    },
    created () {
      this.$axios({
        type: 'post',
        url: '/ordering/dishescategory',
        data: {paging: 1, businessid: this.$route.query.business_offline_id},
        fuc: (res) => {
          this.classListArr = res.data
        }
      })
      this.getTableData()
    },
    mounted () {},
    methods: {
      changeOne (ordering_category_id, move) {
        this.$axios({
          type: 'post',
          url: '/ordering/updatecategorysort',
          data: {ordering_category_id, move},
          fuc: (res) => {
            if (res.code == 200) {
              this.getTableData()
            }
          }
        })
      },
      getTableData () {
        this.$axios({
          type: 'post',
          url: '/ordering/dishescategory',
          data: {paging: 2, businessid: this.$route.query.business_offline_id, page: this.start},
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
      dialogFormVisibleTrue () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let _form = {cname: this.form.cname, businessid: this.$route.query.business_offline_id}
            if (this.ordering_category_id) {
              _form.ordering_category_id = this.ordering_category_id
            }
            this.$axios({
              type: 'post',
              url: this.ordering_category_id ? '/ordering/editcategory' : '/ordering/addcategory',
              data: _form,
              fuc: (res) => {
                if (res.code == 200) {
                  this.$message.success('添加成功')
                  this.dialogFormVisible = false
                  this.getTableData()
                }
              }
            })
          }
        })
      },
      dialogClose () {
        console.log('close')
        this.form.cname = ''
        this.ordering_category_id = ''
      },
      editConfig (row) {
        this.form.cname = row.cname
        this.ordering_category_id = row.ordering_category_id
        this.dialogFormVisible = true
      },
      removeConfig (ordering_category_id) {
        this.$confirm('是否删除此分类?', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios({
            type: 'post',
            url: '/ordering/deletecategory',
            data: {ordering_category_id: ordering_category_id, businessid: this.$route.query.business_offline_id},
            fuc: (res) => {
              if (res.code == 200) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.getTableData()
              }
            }
          })
        }).catch(() => {
                 
        })
      }
    }
  }
</script>
<style scoped="true">
  .offlineCaterClassifyList{
    margin: 10px 20px 0;
    overflow: hidden;
  }
</style>