<template>
  <div class="goodsList">
    <div class="searchForm">
      <p @click='showFormBool = !showFormBool'>筛选查询<i v-if='showFormBool' class="el-icon-arrow-down"></i><i v-else class="el-icon-arrow-up"></i></p>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" v-if='showFormBool'>
        <el-form-item label="输入搜索">
          <el-input v-model="formInline.search" placeholder="商品名称/商品编号"></el-input>
        </el-form-item>
        <el-form-item label="栏目名称">
          <el-select v-model='formInline.category_type' placeholder="请选择" clearable>
            <el-option
              v-for='item in brandArr'
              :label="item.label"
              :value="item.value"
              :key="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-button @click='addGoods' style='margin-bottom: 10px;'>添加商品</el-button>
    <el-button @click='downExcell'>下载商品excel模板</el-button>
    <el-button @click='importDialogVisible = true' style='margin-bottom: 10px;'>导入商品excel</el-button>
    <el-table
    :data="tableData"
    style="width: 100%">
      <el-table-column
        label="商品列表">
        <el-table-column
          prop="goods_id"
          label="id"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="goods_no"
          label="编码"
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
          prop="business_name"
          label="价格"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span>{{scope.row.min_price}}~{{scope.row.max_price}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="支付方式"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span>金贝+现金</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="nums"
          label="数量"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="category_type"
          label="所属栏目"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-for='item in brandArr' v-if='item.value == scope.row.category_type'>{{item.label}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_show"
          label="显示状态"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-if='scope.row.is_show == 1'>显示</span>
            <span v-if='scope.row.is_show == 0'>不显示</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          label="操作"
          min-width="200" align='center'>
          <template slot-scope='scope'>
            <el-button @click='detailGoodsDetail(scope.row)'>编辑</el-button>
            <el-button @click='offlineGoods(scope.row)'>删除</el-button>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-pagination
    layout="prev, pager, next"
    :total="total" :page-size="20" @current-change="handleCurrentChange"
      :current-page.sync="start">
    </el-pagination>

    <el-dialog title="批量导入" :visible.sync="importDialogVisible" :show-close='false'>
      <el-upload
        class="upload-demo"
        action="https://jsonplaceholder.typicode.com/posts/" :before-upload="beforeAvatarUpload">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传模板excel文件</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="importDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'goodsList',
    data () {
      return {
        tableData: [],
        formInline: {
          search: '',
          category_type: ''
        },
        brandArr: [{
          value: 0, label: '首页'
        },{
          value: 1, label: '美妆'
        },{
          value: 2, label: '食品'
        },{
          value: 3, label: '酒类'
        },{
          value: 4, label: '家居'
        }],
        start: 1,
        total: 0,
        importDialogVisible: false,
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
          url: '/active/getlistgoods',
          data: {page: this.start, limit: 20, ...this.formInline},
          fuc: (res) => {
            if (res.code === 200) {
              this.tableData = res.data.data
              this.total = res.data.total
            }
          }
        })
      },
      downExcell () {
        this.$downloadExcell({url: '/resource/active_goods_load.xlsx'})
      },
      beforeAvatarUpload (file) {
        let formData = new FormData()
        formData.append('active_goods_excel', file)
        this.$axios({
          type: 'post',
          url: '/active/loadgoods',
          data: formData,
          fuc: (res) => {
            if (res.code == 200) {
              this.importDialogVisible = false
              this.getTableData()
            }
          }
        }, 1)
        return false
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
        this.$router.push({path: '/activityManage/activityGoodsDetail', query: {active_goods_id: row.active_goods_id}})
      },
      addGoods () {
        this.$router.push({path: '/activityManage/activityGoodsDetail'})
      },
      offlineGoods (row) {
        this.$axios({
          type: 'post',
          url: '/active/deletegoods',
          data: {active_goods_id: row.active_goods_id},
          fuc: (res) => {
            if (res.code === 200) {
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
