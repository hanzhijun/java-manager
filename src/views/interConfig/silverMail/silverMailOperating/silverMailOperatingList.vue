<template>
  <div class="indexOperatingList">
    
    <div class="searchForm">
      <p @click='showFormBool = !showFormBool'>筛选查询<i v-if='showFormBool' class="el-icon-arrow-down"></i><i v-else class="el-icon-arrow-up"></i></p>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" v-if='showFormBool'>
        <el-form-item label="区域">
          <el-select v-model='formInline.filter_category_id' placeholder="请选择" clearable>
            <el-option
            v-for='item in businesscategories'
            :label="item.name"
            :value="item.goods_activity_category_id"
            :key="item.goods_activity_category_id">
          </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
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
          prop="area_name"
          label="位置"
          min-width="120" align='center'>
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
        businesscategories: [],
        formInline: {
          filter_category_id: ''
        },
        showFormBool: true, // 是否显示过滤框
      }
    },
    created () {
      this.$axios({
        type: 'post',
        url: '/goods/activitycategorygetlist',
        data: {parent_id: 4, type: 1},
        fuc: (res) => {
          this.businesscategories = res.data
        }
      })
      this.getTableData()
    },
    mounted () {},
    methods: {
      getTableData () {
        this.$axios({
          type: 'post',
          url: '/goods/activityodgetlist',
          data: {parent_id: 4, type: 3, is_fixed_od: 1, ...this.formInline},
          fuc: (res) => {
            this.tableData = res.data
          }
        })
      },
      onSubmit () {
        this.getTableData()
      },
      editOperating (goods_activity_od_id) {
        this.$router.push({path: '/interConfig/silverMail/silverMailOperatingDetail', query: {goods_activity_od_id: goods_activity_od_id}})
      },
      goOperatingGoodsRoute (goods_activity_category_id) {
        this.$router.push({path: '/interConfig/silverMail/silverMailOperatingGoodsList', query: {goods_activity_category_id: goods_activity_category_id}})
      }
    }
  }
</script>
<style scoped="true">
  .indexOperatingList{
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