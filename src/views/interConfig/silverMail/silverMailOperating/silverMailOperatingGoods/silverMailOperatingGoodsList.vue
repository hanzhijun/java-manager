<template>
  <div class="indexOperatingGoddsList">
    <el-button @click='addSlideshow'>添加商品</el-button>
    <el-button @click='downExcell'>下载模板</el-button>
    <el-button type="primary" @click="importDialogVisible = true">批量添加商品</el-button>

    <div class="searchForm">
      <p @click='showFormBool = !showFormBool'>筛选查询<i v-if='showFormBool' class="el-icon-arrow-down"></i><i v-else class="el-icon-arrow-up"></i></p>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" v-if='showFormBool'>
        <el-form-item label="分类" v-if='categoryBool'>
          <el-select v-model='formInline.filter_category_id' placeholder="请选择" clearable>
            <el-option
            v-for='item in businesscategories'
            :label="item.name"
            :value="item.goods_activity_category_id"
            :key="item.goods_activity_category_id">
          </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="显示状态">
          <el-select v-model='formInline.status' placeholder="请选择" clearable>
            <el-option
              label="显示"
              value="1">
            </el-option>
            <el-option
              label="不显示"
              value="-1">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品编码">
          <el-input v-model="formInline.search" placeholder="商品编码"></el-input>
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
        label="首页运营商品列表">
        <el-table-column
          prop="goods_activity_id"
          label="商品id"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="business_name"
          label="店家"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="name"
          label="价格"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-if='scope.row.payment == 1'>{{scope.row.price / 100}}</span>
            <span v-if='scope.row.payment == 2'>{{scope.row.gold_price}}-{{scope.row.copper_price}}</span>
            <span v-if='scope.row.payment == 3'>{{scope.row.price}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="支付方式"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-if='scope.row.payment == 1'>金贝+现金</span>
            <span v-if='scope.row.payment == 2'>金贝+铜贝</span>
            <span v-if='scope.row.payment == 3'>银贝</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="num"
          label="数量"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          label="商品状态"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-if='scope.row.goods_status == -1'>冻结</span>
            <span v-else-if='scope.row.goods_status == 0'>审核中</span>
            <span v-else-if='scope.row.goods_status == 1'>上架</span>
            <span v-else-if='scope.row.goods_status == -2'>审核失败</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="activity_goods_status"
          label="显示状态"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-if='scope.row.activity_goods_status == 1'>显示</span>
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
            <el-button @click="editGoods(scope.row.goods_activity_id)">编辑</el-button>
            <el-button @click='deleteGoods(scope.row.goods_activity_id)'>删除</el-button>
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
      <el-select style='margin-bottom: 6px;' v-model='uploadFilter_category_id' placeholder="请选择" clearable v-if='categoryBool'>
        <el-option
          v-for='item in businesscategories'
          :label="item.name"
          :value="item.goods_activity_category_id"
          :key="item.goods_activity_category_id">
        </el-option>
      </el-select>
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
    name: 'unlineBusinessList',
    data () {
      return {
        tableData: [],
        businesscategories: [],
        uploadFilter_category_id: '',
        importDialogVisible: false,
        start: 1,
        categoryBool: false,
        formInline: {
          status: '',
          search: '',
          filter_category_id: ''
        },
        total: 0,
        showFormBool: true, // 是否显示过滤框
      }
    },
    created () {
      this.$axios({
        type: 'post',
        url: '/goods/activitycategorygetlist',
        data: {parent_id: this.$route.query.goods_activity_category_id, type: 4, offline_type_od: 1},
        fuc: (res) => {
          this.businesscategories = res.data
          if (res.data.length == 0) {
            this.categoryBool = false
          } else {
            this.categoryBool = true
          }
          this.getTableData()
        }
      })
    },
    mounted () {},
    methods: {
      getTableData () {
        let obj = {
          page: this.start,
          goods_activity_category_id: this.$route.query.goods_activity_category_id,
          ...this.formInline
        }
        if (!this.categoryBool) {
          obj.filter_category_id = this.$route.query.goods_activity_category_id
        }
        this.$axios({
          type: 'post',
          url: '/goods/activitygoodsgetlist',
          data: obj,
          fuc: (res) => {
            this.tableData = res.data.data
            this.total = res.data.total
          }
        })
      },
      onSubmit () {
        this.start = 1
        this.getTableData()
      },
      addSlideshow () {
        this.$router.push({path: '/interConfig/silverMail/silverMailOperatingGoodsDetail', query: {goods_activity_category_id: this.$route.query.goods_activity_category_id}})
      },
      handleCurrentChange (val) {
        this.start = val
        this.getTableData()
      },
      goGoodsDetail () {
        this.$router.push({path: '/silverMail/silverMailOperatingGoodsDetail', query: {goods_activity_category_id: this.$route.query.goods_activity_category_id}})
      },
      editGoods (goods_activity_id) {
        this.$router.push({path: '/interConfig/silverMail/silverMailOperatingGoodsDetail', query: {goods_activity_category_id: this.$route.query.goods_activity_category_id, goods_activity_id}})
      },
      downExcell () {
        this.$downloadExcell({url: '/resource/activity_goods_load.xlsx'})
      },
      beforeAvatarUpload (file) {
//        let _this = this
        if (this.categoryBool && this.uploadFilter_category_id == '') {
          this.$message.warning('请先选择分类')
          return false
        }
        let formData = new FormData()
        formData.append('activity_goods_excel', file)
        formData.append('goods_activity_category_id',this.categoryBool ? this.uploadFilter_category_id : this.$route.query.goods_activity_category_id)
        this.$axios({
          type: 'post',
          url: '/goods/activitygoodsload',
          data: formData,
          fuc: (res) => {
            console.log(res)
            if (res.code == 200) {
              this.importDialogVisible = false
              this.getTableData()
            }
          }
        }, 1)
        return false
      },
      deleteGoods (goods_activity_id) {
        this.$axios({
          type: 'post',
          url: '/goods/activitygoodsdelete',
          data: {goods_activity_id},
          fuc: (res) => {
            if (res.code == 200) {
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
  .indexOperatingGoddsList{
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
