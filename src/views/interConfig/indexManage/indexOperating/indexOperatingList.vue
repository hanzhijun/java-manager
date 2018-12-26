<template>
  <div class="indexOperatingList">
    <el-table
    :data="tableData"
    style="width: 100%">
      <el-table-column
        label="首页运营位列表">
        <el-table-column
          prop="goods_activity_od_id"
          label="编号"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop=""
          label="位置"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span>{{tableDataAddress[scope.$index]}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="business_offline_id"
          label="缩略图"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <img style="width: 60px;height: 60px;" :src="scope.row.img_cover_path + scope.row.img_cover"/>
          </template>
        </el-table-column>
        <el-table-column
          prop="template_id"
          label="界面模板"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-if='scope.row.template_id == 1'>金贝商城模板</span>
            <span v-else-if='scope.row.template_id == 2'>银贝商城模板</span>
            <span v-else-if='scope.row.template_id == 3'>线下模板</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <el-button @click="editOperating(scope.row.goods_activity_od_id)">编辑</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="tel"
          label="商品管理"
          min-width="240" align='center'>
          <template slot-scope='scope'>
            <el-button @click="goOperatingGoodsRoute(scope.row.goods_activity_category_id, scope.row.template_id)" v-if="scope.row.type == 2 && scope.row.template_id != 3">商品管理</el-button>
            <el-button @click="goOperatingArticRoute(scope.row.goods_activity_category_id)" v-if="scope.row.type == 2 && scope.row.template_id == 2">文章管理</el-button>
            <el-button @click="goOperatingPackagesRoute(scope.row.goods_activity_category_id)" v-if="scope.row.type == 2 && scope.row.template_id == 3">服务管理</el-button>
            <el-button @click="goOperatingBusinessRoute(scope.row.goods_activity_category_id)" v-if="scope.row.type == 2 && scope.row.template_id == 3">商家管理</el-button>
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
        tableDataAddress: ['左一','右一','左二','右二'],
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
          data: {parent_id: 1, type: 3, is_fixed_od: 1},
          fuc: (res) => {
            this.tableData = res.data
          }
        })
      },
      editOperating (goods_activity_od_id) {
        this.$router.push({path: '/interConfig/indexManage/indexOperatingDetail', query: {goods_activity_od_id: goods_activity_od_id}})
      },
      goOperatingGoodsRoute (goods_activity_category_id, template_id) {
        this.$router.push({path: '/interConfig/indexManage/indexOperatingGoodsList', query: {goods_activity_category_id: goods_activity_category_id, template_id}})
      },
      goOperatingArticRoute (goods_activity_category_id) {
        this.$router.push({path: '/interConfig/indexManage/indexOperatingArticList', query: {goods_activity_category_id: goods_activity_category_id}})
      },
      goOperatingPackagesRoute (goods_activity_category_id) {
        this.$router.push({path: '/interConfig/indexManage/indexOperatingPackagesList', query: {goods_activity_category_id: goods_activity_category_id}})
      },
      goOperatingBusinessRoute (goods_activity_category_id) {
        this.$router.push({path: '/interConfig/indexManage/indexOperatingBusinessList', query: {goods_activity_category_id: goods_activity_category_id}})
      }
    }
  }
</script>
<style scoped="true">
  .indexOperatingList{
    margin: 10px 20px 0;
    overflow: hidden;
  }
</style>
