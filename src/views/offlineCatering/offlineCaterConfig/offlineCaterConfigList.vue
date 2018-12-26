<template>
  <div class="offlineCaterConfigList">
    <el-button style="margin-bottom: 10px;" @click="dialogFormVisible = true">添加规格</el-button>
    <el-table
    :data="tableData"
    style="width: 100%">
      <el-table-column
        label="线下餐饮-规格列表">
        <el-table-column
          prop="sort"
          label="排序"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="specifications_name"
          label="规格名称"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="sp_count"
          label="规格数量"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="ordering_categoryid"
          label="排序"
          min-width="240" align='center'>
          <template slot-scope='scope'>
            <el-button @click="changeOne(scope.row.ordering_specifications_id, '1')">上移一级</el-button>
            <el-button @click="changeOne(scope.row.ordering_specifications_id, '2')">下移一级</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="200" align='center'>
          <template slot-scope='scope'>
            <el-button type='primary' @click="editConfig(scope.row)">编辑</el-button>
            <el-button type='danger' @click="removeConfig(scope.row.ordering_specifications_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-dialog title="规格详情" :visible.sync="dialogFormVisible" :show-close='false'>
      <el-form :model="form" ref='form' label-width="80px" :rules='rules'>
        <el-form-item label="规格名称" prop='name'>
          <el-input v-model="form.name" auto-complete="off" placeholder='请输入规格名称'></el-input>
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
        ordering_specifications_id: '',
        form: {name: ''},
        rules: {
          name: [{ required: true, message: '请填写规格名称', trigger: 'blur' }]
        },
        showFormBool: true, // 是否显示过滤框
      }
    },
    created () {
      this.getTableData()
    },
    mounted () {},
    methods: {
      changeOne (ordering_specifications_id, move) {
        this.$axios({
          type: 'post',
          url: '/ordering/specificationssort',
          data: {ordering_specifications_id, move},
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
          url: '/ordering/specifications',
          data: {},
          fuc: (res) => {
            this.tableData = res.data
          }
        })
      },
      dialogFormVisibleTrue () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let _form = {specifications_name: this.form.name}
            if (this.ordering_specifications_id) {
              _form.ordering_specifications_id = this.ordering_specifications_id
            }
            this.$axios({
              type: 'post',
              url: this.ordering_specifications_id ? '/ordering/editspecifications' : '/ordering/addspecifications',
              data: _form,
              fuc: (res) => {
                if (res.code == 200) {
                  this.$message.success('添加成功')
                  this.dialogFormVisible = false
                  this.form.name = ''
                  this.ordering_specifications_id = ''
                  this.getTableData()
                }
              }
            })
          }
        })
      },
      editConfig (row) {
        this.form.name = row.specifications_name
        this.ordering_specifications_id = row.ordering_specifications_id
        this.dialogFormVisible = true
      },
      removeConfig (ordering_specifications_id) {
        this.$confirm('是否删除此规格?', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios({
            type: 'post',
            url: '/ordering/deletespecifications',
            data: {ordering_specifications_id: ordering_specifications_id},
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
  .offlineCaterConfigList{
    margin: 10px 20px 0;
    overflow: hidden;
  }
</style>