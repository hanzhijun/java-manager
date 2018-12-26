<template>
  <div class="goodsList">
    <el-button style="margin: 10px;" @click="addGoods">添加商品</el-button>

    <div class="searchForm">
      <p @click='showFormBool = !showFormBool'>筛选查询<i v-if='showFormBool' class="el-icon-arrow-down"></i><i v-else class="el-icon-arrow-up"></i></p>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" v-if='showFormBool'>
        <el-form-item label="输入搜索">
          <el-input v-model="formInline.spuId" placeholder="商品编码"></el-input>
        </el-form-item>
        <el-form-item label="显示状态">
          <el-select v-model='formInline.status' placeholder="请选择" clearable>
            <el-option
              label="显示"
              value="1">
            </el-option>
            <el-option
              label="不显示"
              value="0">
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
        label="商品列表">
        <el-table-column
          prop="goodsInfo.name"
          label="商品名称"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="goodsInfo.businessName"
          label="所属商家"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="goodsInfo.categoryName"
          label="一级类目"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="goodsInfo.categoryPname"
          label="二级类目"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="goodsInfo.brandName"
          label="品牌"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="goodsInfo.stock"
          label="总库存"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="goodsInfo.sale_price"
          label="限购"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="status"
          label="显示状态"
          min-width="120" align='center'>
          <template slot-scope="scope">
            <el-switch
              @change="switchChangeGoods(scope.row.id, scope.row.status)"
              v-model="scope.row.status == 1">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="goodsInfo.status"
          label="商品状态"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-if='scope.row.status == -1'>审核中</span>
            <span v-if='scope.row.status == 0'>审核失败</span>
            <span v-if='scope.row.status == 1'>审核通过</span>
            <span v-if='scope.row.status == -2'>已下架</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          label="操作"
          min-width="240" align='center'>
          <template slot-scope='scope'>
            <el-button @click='detailGoodsDetail(scope.row)'>编辑</el-button>
            <el-button @click='removeGoods(scope.row.id)'>删除</el-button>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
<!--
    <div style="margin: 10px 0;text-align: right;">
      <span style="margin-right: 50px;display: inline-block;">总计商品数：{{totalArr.all_goods}}</span>
      <span style="margin-right: 20px;display: inline-block;">已上架：{{totalArr.online}}</span>
      <span style="margin-right: 20px;display: inline-block;">审核中：{{totalArr.review}}</span>
      <span style="margin-right: 20px;display: inline-block;">审核失败：{{totalArr.fail}}</span>
    </div>
-->
    <el-pagination
    layout="prev, pager, next"
    :total="total" :page-size="20" @current-change="handleCurrentChange"
      :current-page.sync="start">
    </el-pagination>

  </div>
</template>

<script>
  export default {
    name: 'goodsList',
    data () {
      return {
        tableData: [],
        formInline: {
          spuId: '',
          server_search_category_id: [],
          status: ''
        },
        categoryArr: [],
        brandArr: [],
        start: 1,
        total: 0,
//        totalArr: {},
        showFormBool: true, // 是否显示过滤框
      }
    },
    created () {
//      this.$axios({
//        type: 'post',
//        url: '/goods/brand/getinfo',
//        data: {},
//        fuc: (res) => {
//          this.brandArr = res.data.data
//        }
//      })
//      this.$axios({
//        type: 'post',
//        url: '/goods/category/getinfo',
//        data: {},
//        fuc: (res) => {
//          let arr = []
//          for (let val of res.data) {
//            let obj = {}
//            obj.label = val.c_name
//            obj.value = val.cid
//            if (val.data && val.data.length > 0) {
//              obj.children = []
//              for (let val2 of val.data) {
//                obj.children.push({
//                  label: val2.s_c_name,
//                  value: val2.s_cid
//                })
//              }
//            }
//            arr.push(obj)
//          }
//          this.categoryArr = arr
//        }
//      })
      this.getTableData()
    },
    mounted () {},
    methods: {
      getTableData () {
        this.$axios({
          type: 'get',url: '/bhs-management-admin/helpbuy/goods/getHelpbuyGoodsListByHid',
          data: {pageNumber: this.start, pageSize: 20, hid: this.$route.query.id, ...this.formInline},
          fuc: (res) => {
            if (res.code == 1) {
              this.tableData = res.data.data
              this.total = parseInt(res.data.count)
//              this.totalArr = res.data.count
            }
          }
        })
      },
      handleCurrentChange (val) {
        this.start = val
        this.getTableData()
      },
      onSubmit () {
        this.start = 1
        this.getTableData()
      },
      detailGoodsDetail (row) {
        this.$router.push({path: '/activeCenter/helpBuyGoodsDetail', query: {goodsId: row.id, hid: row.hid, id: this.$route.query.id}})
      },
      addGoods () {
        this.$router.push({path: '/activeCenter/helpBuyGoodsDetail', query: {id: this.$route.query.id}})
      },
      switchChangeGoods (id, status) {
        this.$axios({
            type: 'put',
            url: status == 1 ? '/bhs-management-admin/helpbuy/goods/closeHelpbuyGoodsStatus/' + id : '/bhs-management-admin/helpbuy/goods/openHelpbuyGoodsStatus/' + id,
            data: {},
            fuc: (res) => {
            if (res.code == 1) {
              this.$message.success('操作成功')
              this.getTableData()
            }
          }
        })
      },
      removeGoods (id) {
        this.$axios({
            type: 'put',
            url: '/bhs-management-admin/helpbuy/goods/removeHelpbuyGoodsStatus/' + id,
            data: {},
            fuc: (res) => {
            if (res.code == 1) {
              this.$message.success('操作成功')
              this.getTableData()
            }
          }
        })
      }
    }
  }
</script>
<style scoped="true">
  .goodsList{
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
