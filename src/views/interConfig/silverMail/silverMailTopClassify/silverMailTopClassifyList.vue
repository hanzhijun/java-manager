<template>
  <div class="indexIconClassifyList">
    
    <el-table
    :data="tableData"
    style="width: 100%">
      <el-table-column
        label="首页图标分类列表">
        <el-table-column
          prop="goods_activity_category_id"
          label="编号"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="template_id"
          label="展示模板"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-if='scope.row.template_id == 1'>模板一</span>
            <span v-else-if='scope.row.template_id == 2'>模板二</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <el-button @click="editIconClassify(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
  export default {
    name: 'unlineBusinessList',
    data () {
      return {
        tableData: [],
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
          url: '/goods/activitycategorygetlist',
          data: {parent_id: 4, type: 1},
          fuc: (res) => {
            this.tableData = res.data
          }
        })
      },
      editIconClassify (row) {
        this.$router.push({path: '/interConfig/silverMail/silverMailTopClassifyDetail', query: {goods_activity_category_id: row.goods_activity_category_id}})
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