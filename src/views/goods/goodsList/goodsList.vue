<template>
  <div class="goodsList">
    <el-button @click="changeStatus('all')" :type="formInline.server_search_status == 'all' ? 'primary' : ''">全部</el-button>
    <el-button @click="changeStatus('-2')" :type="formInline.server_search_status == '-2' ? 'primary' : ''">已下架</el-button>
    <el-button @click="changeStatus('-1')" :type="formInline.server_search_status == '-1' ? 'primary' : ''">审核中</el-button>
    <el-button @click="changeStatus('0')" :type="formInline.server_search_status == '0' ? 'primary' : ''">审核失败</el-button>
    <el-button @click="changeStatus('1')" :type="formInline.server_search_status == '1' ? 'primary' : ''">审核通过</el-button>

    <div class="searchForm">
      <p @click='showFormBool = !showFormBool'>筛选查询<i v-if='showFormBool' class="el-icon-arrow-down"></i><i v-else class="el-icon-arrow-up"></i></p>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" v-if='showFormBool'>
        <el-form-item label="输入搜索">
          <el-input v-model="formInline.server_search_nameandno" placeholder="商品名称/商品编号/商家"></el-input>
        </el-form-item>
        <el-form-item label="商品类目">
          <el-cascader
            :options="categoryArr" change-on-select
            v-model="formInline.server_search_category_id" clearable>
          </el-cascader>
        </el-form-item>
        <el-form-item label="商品品牌">
          <el-select v-model='formInline.search_brand_id' placeholder="请选择" clearable>
            <el-option
              v-for='item in brandArr'
              :label="item.brand_name"
              :value="item.bid"
              :key="item.bid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品类型">
          <el-select v-model='formInline.server_search_type' placeholder="请选择" clearable>
            <el-option
              label="A类"
              value="1">
            </el-option>
            <el-option
              label="B类"
              value="-1">
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
          prop="gid"
          label="商品id"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          label="商品分类"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-if='scope.row.type == 1'>A类</span>
            <span v-else>B类</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="goods_no"
          label="编码"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="create_at"
          label="创建时间"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="business_name"
          label="所属商家"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="first_class_category"
          label="一级类目"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="second_class_category"
          label="二级类目"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="brand_name"
          label="品牌"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="sku_nums"
          label="SKU数量"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="all_nums"
          label="总库存"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="sale_price"
          label="最低价格"
          min-width="120" align='center'>
          <template slot-scope="scope">
            <span>{{scope.row.sale_price / 100}}元</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
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
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <el-button @click='detailGoodsDetail(scope.row)'>编辑</el-button>
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
          server_search_nameandno: '',
          server_search_category_id: [],
          server_search_status: 'all',
          search_brand_id: '',
          server_search_type: ''
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
      this.$axios({
        type: 'post',
        url: '/goods/brand/getinfo',
        data: {},
        fuc: (res) => {
          this.brandArr = res.data.data
        }
      })
      this.$axios({
        type: 'post',
        url: '/goods/category/getinfo',
        data: {},
        fuc: (res) => {
          let arr = []
          for (let val of res.data) {
            let obj = {}
            obj.label = val.c_name
            obj.value = val.cid
            if (val.data && val.data.length > 0) {
              obj.children = []
              for (let val2 of val.data) {
                obj.children.push({
                  label: val2.s_c_name,
                  value: val2.s_cid
                })
              }
            }
            arr.push(obj)
          }
          this.categoryArr = arr
        }
      })
      this.getTableData()
    },
    mounted () {},
    methods: {
      getTableData () {
        this.$axios({
          type: 'post',url: '/bhs-management-admin/goodsInfo/list',
          data: {pageNumber: this.start, pageSize: 20, ...this.formInline},
          fuc: (res) => {
            if (res.code == 1) {
              this.tableData = res.data.data
              this.total = parseInt(res.data.count)
//              this.totalArr = res.data.count
            }
          }
        })
      },
      changeStatus (type) {
        this.formInline.server_search_status = type
        this.getTableData()
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
        this.$router.push({path: '/goods/goodsDetail', query: {gid: row.gid}})
      },
      addGoods () {
        this.$router.push({path: '/goods/goodsDetail'})
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
