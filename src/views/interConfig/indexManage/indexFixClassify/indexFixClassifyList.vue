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
          prop="goods_activity_category_id"
          label="位置"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span>第{{scope.$index + 1}}个</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="界面名称"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="offline_type_od"
          label="分类"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-if='scope.row.offline_type_od == 1'>商品</span>
            <span v-if='scope.row.offline_type_od == 2'>商家</span>
            <span v-if='scope.row.offline_type_od == 3'>服务</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <el-button @click="editIconClassify(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="其他操作"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <el-button v-if='scope.row.offline_type_od == 1' @click="goGoods(scope.row)">商品管理</el-button>
            <el-button v-if='scope.row.offline_type_od == 2' @click="goBusiness(scope.row)">商家管理</el-button>
            <el-button v-if='scope.row.offline_type_od == 3' @click="goPackages(scope.row)">服务管理</el-button>
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
          data: {parent_id: 1, type: 4},
          fuc: (res) => {
            this.tableData = res.data
          }
        })
      },
      editIconClassify (row) {
        this.$router.push({path: '/interConfig/indexManage/indexFixClassifyDetail', query: {goods_activity_category_id: row.goods_activity_category_id, type: row.type}})
      },
      goGoods (row) {
        this.$router.push({path: '/interConfig/indexManage/indexGoodsList', query: {goods_activity_category_id: row.goods_activity_category_id}})
      },
      goBusiness (row) {
        this.$router.push({path: '/interConfig/indexManage/indexBusinessList', query: {goods_activity_category_id: row.goods_activity_category_id}})
      },
      goPackages (row) {
        this.$router.push({path: '/interConfig/indexManage/indexPackagesList', query: {goods_activity_category_id: row.goods_activity_category_id}})
      },
      removeIconClassify (row) {
        this.$axios({
          type: 'post',
          url: '/goods/activitycarouseldelete',
          data: {goods_activity_carousel_id: row.goods_activity_carousel_id},
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
  .indexIconClassifyList{
    margin: 10px 20px 0;
    overflow: hidden;
  }
</style>
