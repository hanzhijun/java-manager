<template>
  <div class="indexOperatingArticList">
    <el-button @click='addSlideshow' style='margin-bottom: 10px;'>添加文章</el-button>
    
    <el-table
    :data="tableData"
    style="width: 100%">
      <el-table-column
        label="首页运营位文章列表（最少3个，最多六个）">
        <el-table-column
          prop="goods_activity_article_id"
          label="id"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="business_offline_id"
          label="缩略图"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <img style="width: 60px;height: 60px;" :src="scope.row.img_path + scope.row.img"/>
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="title_sub"
          label="副标题"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="url"
          label="url"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="name"
          label="显示状态"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-if='scope.row.status == 1'>显示</span>
            <span v-else>不显示</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="sort"
          label="顺序"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="240" align='center'>
          <template slot-scope='scope'>
            <el-button @click="goDetail(scope.row)">编辑</el-button>
            <el-button @click='deleteArtic(scope.row)'>删除</el-button>
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
          url: '/goods/activityarticlegetlist',
          data: {goods_activity_category_id: this.$route.query.goods_activity_category_id},
          fuc: (res) => {
            this.tableData = res.data
          }
        })
      },
      onSubmit () {
        
      },
      addSlideshow () {
        
        this.$router.push({path: '/interConfig/indexManage/indexOperatingArticDetail', query: {goods_activity_category_id: this.$route.query.goods_activity_category_id}})
      },
      goDetail (row) {
        this.$router.push({path: '/interConfig/indexManage/indexOperatingArticDetail', query: {goods_activity_category_id: row.goods_activity_category_id, goods_activity_article_id: row.goods_activity_article_id}})
      },
      deleteArtic (row) {
        this.$axios({
          type: 'post',
          url: '/goods/activityarticledelete',
          data: {goods_activity_article_id: row.goods_activity_article_id},
          fuc: (res) => {
            if (res.code == 200) {
              this.$message.success('删除成功')
              this.getTableData()
            }
          }
        })
      }
    }
  }
</script>
<style scoped="true">
  .indexOperatingArticList{
    margin: 10px 20px 0;
    overflow: hidden;
  }
</style>