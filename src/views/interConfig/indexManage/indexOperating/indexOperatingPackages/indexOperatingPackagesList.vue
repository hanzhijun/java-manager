<template>
  <div class="indexOperatingPackagesList">
    <el-button @click='selectedVisible = true' style='margin-bottom: 10px;'>添加服务</el-button>

    <div class="searchForm">
      <p @click='showFormBool = !showFormBool'>筛选查询<i v-if='showFormBool' class="el-icon-arrow-down"></i><i v-else class="el-icon-arrow-up"></i></p>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" v-if='showFormBool'>
        <el-form-item label="分类">
          <el-select v-model='formInline.filter_category_id' placeholder="请选择" clearable>
            <el-option
              v-for='item in businesscategories'
              :label="item.name"
              :value="item.goods_activity_category_id"
              :key="item.goods_activity_category_id"
            v-if='item.offline_type_od == 3'>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品状态">
          <el-select v-model='formInline.package_status' placeholder="请选择" clearable>
            <el-option
              label="冻结"
              value="-1">
            </el-option>
            <el-option
              label="审核中"
              value="0">
            </el-option>
            <el-option
              label="上架"
              value="1">
            </el-option>
            <el-option
              label="审核失败"
              value="-2">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="搜索">
          <el-input v-model="formInline.search" placeholder="名称/店家"></el-input>
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
        label="首页运营位文章列表（最少3个，最多六个）">
        <el-table-column
          prop="goods_activity_package_id"
          label="服务id"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="package_name"
          label="服务名称"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="business_name"
          label="店家"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="category_name"
          label="分类"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="silver_price"
          label="价格"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="name"
          label="支付方式"
          min-width="120" align='center'>
          <template slot-scope='scope'>
<!--
            <span v-if='scope.row.status == 1'>显示</span>
            <span v-else>不显示</span>
-->
            <span>缺</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="num"
          label="数量"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="package_status"
          label="商品状态"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-if='scope.row.package_status == -1'>冻结</span>
            <span v-else-if='scope.row.package_status == 0'>审核中</span>
            <span v-else-if='scope.row.package_status == 1'>上架</span>
            <span v-else-if='scope.row.package_status == -2'>审核失败</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <el-button @click='deleteArtic(scope.row)'>删除</el-button>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-pagination
    layout="prev, pager, next"
    :total="total" :page-size="20" @current-change="handleCurrentChange"
      :current-page.sync="start">
    </el-pagination>

    <el-dialog title="添加服务" width='80%' @close='dialogClose' :visible.sync="dialogTableVisible">
      <div class="searchForm">
        <el-form :inline="true" :model="formInlineDialog" class="demo-form-inline" v-if='showFormBool'>
          <el-form-item>
            <el-button type="primary" @click="addPackages">添加</el-button>
          </el-form-item>
          <el-form-item label="输入搜索">
            <el-input v-model="formInlineDialog.search_name_no_business" placeholder="商品名称/商品编号/商家"></el-input>
          </el-form-item>
          <el-form-item label="服务类目">
            <el-cascader
              :options="categoryArr" change-on-select
              v-model="formInlineDialog.search_category_id" clearable>
            </el-cascader>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmitDialog">查询</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table
      :data="dialogTableData" ref='multipleTable'
      style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column
          label="服务列表">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="package_id"
            label="id"
            min-width="120" align='center'>
          </el-table-column>
          <el-table-column
            prop="package_name"
            label="服务名称"
            min-width="120" align='center'>
          </el-table-column>
          <el-table-column
            prop="package_no"
            label="服务编码"
            min-width="120" align='center'>
          </el-table-column>
          <el-table-column
            prop="silver_price"
            label="服务价格"
            min-width="120" align='center'>
          </el-table-column>
          <el-table-column
            prop="second_category_name"
            label="类目"
            min-width="120" align='center'>
            <template slot-scope='scope'>
              <span>{{scope.row.package_name}}-{{scope.row.second_category_name}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="num"
            label="总库存"
            min-width="120" align='center'>
          </el-table-column>
          <el-table-column
            prop="status"
            label="商品状态"
            min-width="120" align='center'>
            <template slot-scope='scope'>
              <span v-if='scope.row.status == -1'>冻结</span>
              <span v-if='scope.row.status == 0'>审核中</span>
              <span v-if='scope.row.status == 1'>上架</span>
              <span v-if='scope.row.status == -2'>审核失败</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="id"
            label="操作"
            min-width="120" align='center'>
            <template slot-scope='scope'>
              <el-button @click='addSinglePackage(scope.row)'>添加</el-button>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <el-pagination
      layout="prev, pager, next"
      :total="dialogTotal" :page-size="10" @current-change="handleCurrentChangeDiaolog"
        :current-page.sync="dialogStart">
      </el-pagination>
    </el-dialog>
    <el-dialog title='选择添加到的分类' :visible.sync="selectedVisible">
      <el-select v-model='selectedCategoryId' placeholder="请选择" clearable>
        <el-option
          v-for='item in businesscategories'
          :label="item.name"
          :value="item.goods_activity_category_id"
          :key="item.goods_activity_category_id"
            v-if='item.offline_type_od == 3'>
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="selectedVisible = false">取 消</el-button>
        <el-button type="primary" @click="selectedVisibleTrue">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'unlineBusinessList',
    data () {
      return {
        tableData: [],
        dialogTableData: [],
        businesscategories: [],
        selectedArr: [], // 选中服务id
        categoryArr: [],
        formInline: {
          filter_category_id: '',
          package_status: '',
          search: ''
        },
        selectedCategoryId: '', // 选择添加到的分类
        formInlineDialog: {
          search_name_no_business: '',
          search_category_id: []
        },
        start: 1,
        total: 0,
        dialogStart: 1,
        dialogTotal: 0,
        dialogTableVisible: false,
        selectedVisible: false,
        showFormBool: true, // 是否显示过滤框
      }
    },
    created () {
      this.$axios({
        type: 'post',
        url: '/goods/activitycategorygetlist',
        data: {parent_id: this.$route.query.goods_activity_category_id, type: 4, is_fixed_od: 0},
        fuc: (res) => {
          this.businesscategories = res.data
        }
      })
      this.$axios({
        type: 'post',
        url: '/package/getbusinesscategories',
        data: {},
        fuc: (res) => {
          if (res.code == 200) {
            let arr = []
            for (let val of res.data) {
              let obj = {}
              obj.label = val.name
              obj.value = val.business_category_id
              if (val.data && val.data.length > 0) {
                obj.children = []
                for (let val2 of val.data) {
                  obj.children.push({
                    label: val2.s_name,
                    value: val2.s_business_category_id
                  })
                }
              }
              arr.push(obj)
            }
            this.categoryArr = arr
          }
        }
      })
      this.getTableData()
      this.getDialogTableData()
    },
    mounted () {},
    methods: {
      getTableData () {
        this.$axios({
          type: 'post',
          url: '/goods/activitypackagegetlist',
          data: {page: this.start, goods_activity_category_id: this.$route.query.goods_activity_category_id, ...this.formInline},
          fuc: (res) => {
            this.tableData = res.data.data
            this.total = res.data.total
          }
        })
      },
      handleSelectionChange (selected) {
        this.selectedArr = []
        for (let val of selected) {
          this.selectedArr.push(val.package_id)
        }
      },
      getDialogTableData () {
        this.$axios({
          type: 'post',
          url: '/package/packagelists',
          data: {page: this.dialogStart, limit: 10, ...this.formInlineDialog},
          fuc: (res) => {
            if (res.code === 200) {
              this.dialogTableData = res.data.data
              this.dialogTotal = res.data.count
            }
          }
        })
      },
      onSubmit () {
        this.start = 1
        this.getTableData()
      },
      onSubmitDialog () {
        this.dialogStart = 1
        this.getTableData()
      },
      handleCurrentChange (val) {
        this.start = val
        this.getTableData()
      },
      handleCurrentChangeDiaolog (val) {
        this.dialogStart = val
        this.getDialogTableData()
      },
      deleteArtic (row) {
        this.$axios({
          type: 'post',
          url: '/goods/activitypackagedelete',
          data: {goods_activity_package_id: row.goods_activity_package_id},
          fuc: (res) => {
            if (res.code == 200) {
              this.$message.success('删除成功')
              this.getTableData()
            }
          }
        })
      },
      selectedVisibleTrue () {
        if (this.selectedCategoryId != '') {
          this.selectedVisible = false
          this.dialogTableVisible = true
        } else {
          this.$message.warning('请选择添加到的分类')
        }
      },
      addSinglePackage (row) {
        this.$axios({
          type: 'post',
          url: '/goods/activitypackageadd',
          data: { goods_activity_category_id: this.selectedCategoryId, package_id: row.package_id},
          fuc: (res) => {
            if (res.code == 200) {
              this.$message.success('添加成功')
            }
          }
        })
      },
      addPackages () {
        if (this.selectedArr.length < 1) {
          this.$message.warning('请先选择服务')
        } else {
          this.$axios({
            type: 'post',
            url: '/goods/activitypackageadd',
            data: { goods_activity_category_id: this.selectedCategoryId, package_id: this.selectedArr},
            fuc: (res) => {
              if (res.code == 200) {
                this.$message.success('添加成功')
                this.$refs.multipleTable.clearSelection();
              }
            }
          })
        }

      },
      dialogClose () {
        this.getTableData()
      }
    }
  }
</script>
<style scoped="true">
  .indexOperatingPackagesList{
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
