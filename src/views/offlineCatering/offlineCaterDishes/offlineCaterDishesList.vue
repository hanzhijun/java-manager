<template>
  <div class="offlineCaterDishesList">
    <el-button @click='addDishes'>添加菜品</el-button>
    <div class="searchForm">
      <p @click='showFormBool = !showFormBool'>筛选查询<i v-if='showFormBool' class="el-icon-arrow-down"></i><i v-else class="el-icon-arrow-up"></i></p>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" v-if='showFormBool'>
        <el-form-item label="菜品搜索">
          <el-input placeholder='菜品名称' v-model='formInline.dishesname'></el-input>
        </el-form-item>
        <el-form-item label="菜品分类">
          <el-select clearable v-model='formInline.ordering_categoryid' placeholder='请选择'>
            <el-option v-for='item in classListArr' :label='item.cname' :value='item.ordering_category_id' :key='item.ordering_category_id'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getTableDataFuc">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
    :data="tableData"
    style="width: 100%">
      <el-table-column
        label="线下餐饮-菜品列表">
        <el-table-column
          prop="num"
          label="编号"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="dishespicture"
          label="图片"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <img style="width: 60px;height: 60px;" :src="scope.row.dishespicture"/>
          </template>
        </el-table-column>
        <el-table-column
          prop="dishesname"
          label="菜品名称"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="ordering_categoryid"
          label="所属分类"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-for="item in classListArr" v-if='item.ordering_category_id == scope.row.ordering_categoryid'>{{item.cname}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="dishesprice"
          label="价格（起）"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span>{{scope.row.dishesprice / 100}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="specifications_name"
          label="规格"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <p v-for='item in scope.row.specifications'>{{item.specifications_name}} {{item.gprice / 100}}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="240" align='center'>
          <template slot-scope='scope'>
            <el-button @click="editDishes(scope.row.ordering_dishes_id)">编辑</el-button>
            <el-button @click="removeDishes(scope.row.ordering_dishes_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-pagination
    layout="prev, pager, next"
    :total="total" :page-size="20" @current-change="handleCurrentChange"
      :current-page.sync="start">
  </el-pagination>

  </div>
</template>

<script>
  export default {
    name: 'unlineBusinessList',
    data () {
      return {
        tableData: [],
        formInline: {
          dishesname: '',
          ordering_categoryid: ''
        },
        classListArr: [],
        start: 1,
        total: 0,
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
      getTableData () {
        console.log(this.formInline)
        this.$axios({
          type: 'post',
          url: '/ordering/disheslist',
          data: {page: this.start, businessid: this.$route.query.business_offline_id, ...this.formInline},
          fuc: (res) => {
            this.tableData = res.data.data
            this.total = res.data.total
          }
        })
      },
      translateDishes () {
        
      },
      handleCurrentChange (val) {
        this.start = val
        this.getTableData()
      },
      getTableDataFuc (val) {
        this.start = 1
        this.getTableData()
      },
      addDishes () {
        this.$router.push({path: '/offlineCatering/offlineCaterDishesDetail', query: {business_offline_id: this.$route.query.business_offline_id}})
      },
      editDishes (ordering_dishes_id) {
        this.$router.push({path: '/offlineCatering/offlineCaterDishesDetail', query: {ordering_dishes_id: ordering_dishes_id,business_offline_id: this.$route.query.business_offline_id}})
      },
      removeDishes (ordering_dishes_id) {
        this.$confirm('是否删除此菜品?', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios({
            type: 'post',
            url: '/ordering/deletedishes',
            data: {ordering_dishes_id: ordering_dishes_id, businessid: this.$route.query.business_offline_id},
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
  .offlineCaterDishesList{
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
