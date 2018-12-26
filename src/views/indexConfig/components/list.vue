<template>
  <div class="unlineBusinessList">
    <el-button @click="addPgc('')" v-if="type != 6">添加</el-button>
    <el-button @click='addGoodsDialog = true' v-if="type == 6">添加商品</el-button>
    <el-button @click='downExcell' v-if="type == 6">下载模板</el-button>
    <el-button @click='importDialogVisible = true' v-if="type == 6">导入商品</el-button>
    <div class="searchForm">
      <p @click='showFormBool = !showFormBool'>筛选查询<i v-if='showFormBool' class="el-icon-arrow-down"></i><i v-else class="el-icon-arrow-up"></i></p>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" v-if='showFormBool'>
        <el-form-item label="区域">
          <el-select v-model="formInline.operation_template_area_id" @change="selectChange">
            <el-option v-for="item in selectArr" :value='item.operation_template_area_id' :label='item.area_name' :key="item.operation_template_area_id"></el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item>-->
          <!--<el-button type="primary" @click="getTableData">查询</el-button>-->
        <!--</el-form-item>-->
      </el-form>
    </div>

      <el-select v-model="operation_area_category_id" style="margin: 10px;" v-if="type != 1" @change="operation_area_category_idChange">
        <el-option v-for="item in operation_area_category_idArr" :value='item.operation_area_category_id' :label='item.name' :key="item.operation_area_category_id"></el-option>
      </el-select>
      <el-button v-if="type != 1" @click="openCategoryDialog">分类管理</el-button>

    <el-table
      :data="tableData" key="typeTable"
      style="width: 100%" v-if="type != 6">
      <el-table-column
        label="数据列表">
        <el-table-column
          prop="operation_content_id"
          label="编号"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="img"
          label="缩略图"
          min-width="120" align='center'>
          <template slot-scope="scope">
            <img :src="scope.row.img_path + scope.row.img" style="width: 50px;height: 50px;">
          </template>
        </el-table-column>
        <el-table-column
          prop="jump_type"
          label="跳转类型"
          min-width="120" align='center'>
          <template slot-scope="scope">
            <span v-for="item in jumpArr" v-if="item.value == scope.row.jump_type">{{item.label}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="jump_data"
          label="跳转后的页面名称或url"
          min-width="120" align='center'>
          <template slot-scope="scope">
            <span v-if="scope.type == 5 || scope.type == 7">{{scope.row.jump_data_remark}}</span>
            <span v-else>{{scope.row.jump_data}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          min-width="120" align='center' show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="sort"
          label="顺序"
          min-width="120" align='center'>
          <template slot-scope="scope">
            <el-input v-model="scope.row.sort" @blur="sortBlur(scope.row)" @keyup.native="scope.row.sort = $inputKeyUp($event)" @afterpaste.native="scope.row.sort = $inputKeyUp($event)"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_show"
          label="显示状态"
          min-width="120" align='center'>
          <template slot-scope="scope">
            <el-switch
              @change="switchChange(scope.row.operation_content_id, scope.row.is_show)"
              v-model="scope.row.is_show == 1">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="240" align='center'>
          <template slot-scope='scope'>
            <el-button @click='addPgc(scope.row.operation_content_id)'>编辑</el-button>
            <el-button @click='editPgc(scope.row.operation_content_id)'>删除</el-button>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-table
      :data="tableData"
      style="width: 100%" v-else key="goodsTable">
      <el-table-column
        label="数据列表">
        <el-table-column
          prop="goods_id"
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
          prop="operation_area_category_name"
          label="区域"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="价格"
          min-width="120" align='center'>
          <template slot-scope="scope">
            <span>{{scope.row.min_price}} - {{scope.row.max_price}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="nums"
          label="数量"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="sort"
          label="顺序"
          min-width="120" align='center'>
          <template slot-scope="scope">
            <el-input v-model="scope.row.sort" @blur="sortGoodsBlur(scope.row)" @keyup.native="scope.row.sort = $inputKeyUp($event)" @afterpaste.native="scope.row.sort = $inputKeyUp($event)"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_show"
          label="显示状态"
          min-width="120" align='center'>
          <template slot-scope="scope">
            <el-switch
              @change="switchChangeGoods(scope.row.operation_goods_id, scope.row.is_show)"
              v-model="scope.row.is_show == 1">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <el-button @click='editGoods(scope.row.operation_goods_id)'>删除</el-button>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>

    <el-pagination
      v-if="pageShow"
      layout="prev, pager, next"
      :total="total" :page-size="20" @current-change="handleCurrentChange"
      :current-page.sync="start">
    </el-pagination>

    <el-dialog
      title="分类管理"
      :visible.sync="dialogVisible"
      width="500px"
      label-width="80px">
      <el-button @click="addCategory" style="margin-bottom: 6px;">添加</el-button>
      <el-form>
        <el-form-item :label="'第' + (item.sort + 1) + '类'" v-for="item in operation_area_category_idArrCopy" :key="item.sort">
          <el-input v-model="item.name" style="width: 200px" :maxlength="10"></el-input>
          <el-button @click="deleteCategory(item.sort)">删除</el-button>
          <el-button @click="topCategory(item.sort)">置顶</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureCategoryBtn">确 定</el-button>
      </span>
    </el-dialog>

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

    <el-dialog title="添加商品" :visible.sync="addGoodsDialog" @close="addGoodsDialogClose">
      <el-input v-model="addGoodsInput" placeholder="商品编码"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogTrue">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'unlineBusinessList',
    props: [
      'operation_pages_id', 'detailUrl'
    ],
    data () {
      return {
        tableData: [],
        dialogVisible: false,
        importDialogVisible: false,
        addGoodsDialog: false,
        addGoodsInput: '',
        operation_area_category_id: '',
        operation_area_category_idArr: [],
        operation_area_category_idArrCopy: [],
        type: '',
        formInline: {
          operation_template_area_id: ''
        },
        selectArr: [],
        jumpArr: [
          {label: '不跳转', value: 1},
          {label: 'h5', value: 2},
          {label: '商品', value: 3},
          {label: '区域', value: 4},
          {label: 'pgc页面', value: 5},
          {label: '商品分类', value: 6},
          {label: '运营位模板', value: 7},
          {label: '线下分类', value: 8}
        ],
        showFormBool: true, // 是否显示过滤框
        pageShow: true, // 是否显示分页
        start: 1,
        total: 0,
      }
    },
    created () {
      this.$axios({
        type: 'post',
        url: '/Operation/returnPagesOption',
        data: {operation_pages_id: this.operation_pages_id},
        fuc: (res) => {
          this.selectArr = res.data
          this.formInline.operation_template_area_id = res.data[0].operation_template_area_id
          if (res.data[0].is_page == 1) {
            this.pageShow = true
            this.start = 1
          } else {
            this.pageShow = false
          }
          this.type = res.data[0].type
          if (this.type != 1) {
            this.getOperation_area_category_idArr()
          } else {
            this.getTableData()
          }
        }
      })
    },
    mounted () {},
    methods: {
      sortBlur (e) {
        this.$axios({
            type: 'post',
            url: '/operation/setcontentsort',
            data: {operation_content_id: e.operation_content_id, sort: e.sort},
            fuc: (res) => {
            if (res.code == 200) {
          this.$message.success('操作成功')
        }
        this.getTableData()
      }
      })
      },
      sortGoodsBlur (e) {
        this.$axios({
            type: 'post',
            url: '/operation/setgoodssort',
            data: {operation_goods_id: e.operation_goods_id, sort: e.sort},
            fuc: (res) => {
            if (res.code == 200) {
          this.$message.success('操作成功')
        }
        this.getTableData()
      }
      })
      },

//      商品
      addDialogTrue () {
        if (this.addGoodsInput === '') {
          this.$message.warning('请填写商品id')
          return
        }
        this.$axios({
          type: 'post',
          url: '/operation/addgoods',
          data: {operation_area_category_id: this.operation_area_category_id ? this.operation_area_category_id : 0, operation_pages_id: this.operation_pages_id, operation_template_area_id: this.formInline.operation_template_area_id, goods_no: this.addGoodsInput},
          fuc: (res) => {
            if (res.code == 200) {
              this.$message.success('操作成功')
              this.getTableData()
            }
          }
        })
      },
      addGoodsDialogClose () {
        this.addGoodsInput = ''
      },
      downExcell () {
        this.$downloadExcell({url: '/resource/operation_goods_load.xlsx'})
      },
      beforeAvatarUpload (file) {
        let formData = new FormData()
        formData.append('operation_goods_excel', file)
        formData.append('operation_template_area_id',this.formInline.operation_template_area_id)
        formData.append('operation_area_category_id',this.operation_area_category_id ? this.operation_area_category_id : 0)
        formData.append('operation_pages_id',this.operation_pages_id)
        this.$axios({
            type: 'post',
            url: '/operation/loadgoods',
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

//      分类
      openCategoryDialog () {
        this.operation_area_category_idArrCopy = JSON.parse(JSON.stringify(this.operation_area_category_idArr))
        this.dialogVisible = true
      },
      addCategory () {
        if (this.operation_area_category_idArrCopy.length >= 4) {
          this.$message.warning('最多添加四个分类')
          return
        }
        this.operation_area_category_idArrCopy.push({name: '', sort: this.operation_area_category_idArrCopy.length})
      },
      sortCategory () {
        for (let index in this.operation_area_category_idArrCopy) {
          this.operation_area_category_idArrCopy[index].sort = Number(index)
        }
        console.log('operation_area_category_idArrCopy', this.operation_area_category_idArrCopy)
      },
      deleteCategory (sort) {
        this.operation_area_category_idArrCopy.splice(sort, 1)
        this.sortCategory()
      },
      topCategory (sort) {
        this.operation_area_category_idArrCopy.unshift(this.operation_area_category_idArrCopy.splice(sort, 1)[0])
        this.sortCategory()
      },
      sureCategoryBtn () {
        for (let val of this.operation_area_category_idArrCopy) {
          if (val.name == '') {
            this.$message.warning('分类名称不能为空')
            return false
          }
        }
        this.$axios({
          type: 'post',
          url: '/operation/setareacategory',
          data: {operation_pages_id: this.operation_pages_id, operation_template_area_id: this.formInline.operation_template_area_id, data: this.operation_area_category_idArrCopy},
          fuc: (res) => {
            if (res.code == 200) {
              this.$message.success('操作成功')
              this.getOperation_area_category_idArr()
              this.dialogVisible = false
            }
          }
        })
      },

      handleCurrentChange (val) {
        this.start = val
        this.getTableData()
      },
      getOperation_area_category_idArr () {
        this.$axios({
            type: 'post',
            url: '/operation/getareacategorylist',
            data: {operation_pages_id: this.operation_pages_id, operation_template_area_id: this.formInline.operation_template_area_id},
            fuc: (res) => {
              this.operation_area_category_idArr = res.data
              if (res.data.length > 0) {
                this.operation_area_category_id = res.data[0].operation_area_category_id
              }
              this.getTableData()
            }
        })
      },
      selectChange (value) {
        for (let val of this.selectArr) {
          if (val.operation_template_area_id == value) {

//            分页判断
            if (val.is_page == 1) {
              this.pageShow = true
              this.start = 1
            } else {
              this.pageShow = false
            }

//            类型判断
            this.type = val.type
            if (this.type != 1) {
              this.getOperation_area_category_idArr()
            } else {
              this.operation_area_category_id = ''
              this.getTableData()
            }
          }
        }
      },
      operation_area_category_idChange () {
        this.start = 1
        this.getTableData()
      },
      getTableData () {
        let searchData = {operation_pages_id: this.operation_pages_id, ...this.formInline}
        if (this.pageShow) {
          searchData.page = this.start
        }
        if (this.operation_area_category_id) {
          searchData.operation_area_category_id = this.operation_area_category_id
        }
        this.$axios({
            type: 'post',
            url: this.type == 6 ? '/operation/getgoodslist' : '/operation/getcontentlist',
            data: searchData,
          fuc: (res) => {
          if (this.pageShow) {
            this.tableData = res.data.data
            this.total = res.data.total
          } else {
            this.tableData = res.data
          }
        }
      })
      },
      addPgc (operation_content_id) {
        let _form = {operation_template_area_id: this.formInline.operation_template_area_id}
        if (operation_content_id) {
          _form.operation_content_id = operation_content_id
        }
        if (this.operation_pages_id != 10000 && this.operation_pages_id != 10001) {
          _form.operation_pages_id = this.operation_pages_id
        }
        if (this.type != 1) {
          if (this.operation_area_category_idArr.length > 0) {
            if (this.operation_area_category_id !== '') {
              _form.operation_area_category_id = this.operation_area_category_id
            } else {
              this.$message.warning('清闲选择分类')
              return false
            }
          }
        }
        this.$router.push({path: this.detailUrl, query: _form})

      },
      editPgc (operation_content_id) {
        this.$axios({
            type: 'post',
            url: '/operation/deletecontent',
            data: {operation_content_id},
            fuc: (res) => {
            if (res.code == 200) {
          this.$message.success('操作成功')
          this.getTableData()
        }
      }
      })
      },
      editGoods (operation_goods_id) {
        this.$axios({
            type: 'post',
            url: '/operation/deletegoods',
            data: {operation_goods_id},
            fuc: (res) => {
            if (res.code == 200) {
          this.$message.success('操作成功')
          this.getTableData()
        }
      }
      })
      },
      switchChange (operation_content_id, is_show) {
        this.$axios({
            type: 'post',
            url: '/operation/setcontentshow',
            data: {operation_content_id, is_show: is_show == 1 ? 0 : 1},
            fuc: (res) => {
            if (res.code == 200) {
          this.$message.success('操作成功')
          this.getTableData()
        }
      }
      })
      },
      switchChangeGoods (operation_goods_id, is_show) {
        this.$axios({
            type: 'post',
            url: '/operation/setcontentshow',
            data: {operation_goods_id, is_show: is_show == 1 ? 0 : 1},
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
  .unlineBusinessList{
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
