<template>
  <div class="indexIconClassifyList">
    <el-button style='margin-bottom: 10px' @click='dialogFormVisible = true'>添加区域</el-button>
    <el-table
    :data="tableData"
    style="width: 100%">
      <el-table-column
        label="金贝商城推荐运营位列表">
        <el-table-column
          prop="goods_activity_category_id"
          label="编号"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="sort"
          label="排序"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="name"
          label="界面模板"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="240" align='center'>
          <template slot-scope='scope'>
            <el-button @click="editIconClassify(scope.row)">编辑</el-button>
            <el-button @click="removeIconClassify(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="其他操作"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <el-button v-if='scope.row.type == 2' @click="goGoods(scope.row)">商品管理</el-button>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-dialog title="添加区域" :visible.sync="dialogFormVisible">
      <el-form ref='form' :model="form" label-width='80px' :rules='rules'>
        <el-form-item label="界面名称" prop='name'>
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop='sort'>
          <el-input v-model="form.sort" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisibleSure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'unlineBusinessList',
    data () {
      return {
        tableData: [],
        form: {
          name: '',
          sort: ''
        },
        rules: {
          name: [{ required: true, message: '请输入', trigger: 'blur' }],
          sort: [{ required: true, message: '请输入', trigger: 'blur' }]
        },
        dialogFormVisible: false,
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
          url: '/goods/activityodgetlist',
          data: {parent_id: 3, type: 3, is_fixed_od: 0},
          fuc: (res) => {
            this.tableData = res.data
          }
        })
      },
      dialogFormVisibleSure () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$axios({
              type: 'post',
              url: '/goods/activitycategoryadd',
              data: {parent_id: 3, type: 3, is_fixed_od: 0, ...this.form},
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
      editIconClassify (row) {
        if (row.goods_activity_od_id) {
          this.$router.push({path: '/interConfig/goldMail/goldMailRecommendedOperatingDetail', query: {goods_activity_category_id: row.goods_activity_category_id, goods_activity_od_id: row.goods_activity_od_id}})
        } else {
          this.$router.push({path: '/interConfig/goldMail/goldMailRecommendedOperatingDetail', query: {goods_activity_category_id: row.goods_activity_category_id}})
        }
        
      },
      goGoods (row) {
        this.$router.push({path: '/interConfig/goldMail/goldMailRecommendedOperatingGoodsList', query: {goods_activity_category_id: row.goods_activity_category_id}})
      },
      removeIconClassify (row) {
        this.$axios({
          type: 'post',
          url: '/goods/activityoddelete',
          data: {goods_activity_category_id: row.goods_activity_category_id},
          fuc: (res) => {
            if (res.code == 200) {
              this.$message.warning('操作成功')
              this.getTableData()
            }
          }
        })
      }
    }
  }
</script>
<style scoped="true">
  .indexIconClassifyList{
    margin: 10px 20px 0;
    overflow: hidden;
  }
</style>