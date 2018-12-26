<template>
  <div class="indexOperatingList">
    <el-table
    :data="tableData"
    style="width: 100%">
      <el-table-column
        label="商城运营位列表">
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
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <el-button @click="editOperating(scope.row.goods_activity_od_id)">编辑</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="tel"
          label="商品管理"
          min-width="140" align='center'>
          <template slot-scope='scope'>
            <el-button v-if='scope.row.type == 2' @click="goOperatingGoodsRoute(scope.row.goods_activity_category_id)">商品管理</el-button>
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
        tableDataAddress: ['左一','右一','右二', '下一', '下二', '下三'],
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
          data: {parent_id: 3, type: 3, is_fixed_od: 1},
          fuc: (res) => {
            this.tableData = res.data
          }
        })
      },
      editOperating (goods_activity_od_id) {
        this.$router.push({path: '/interConfig/goldMail/goldMailOperatingDetail', query: {goods_activity_od_id: goods_activity_od_id}})
      },
      goOperatingGoodsRoute (goods_activity_category_id) {
        this.$router.push({path: '/interConfig/goldMail/goldMailOperatingGoodsList', query: {goods_activity_category_id: goods_activity_category_id}})
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