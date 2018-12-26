<template>
  <div class="unlineBusinessList">
    <el-button @click="addPgc('')" v-if="formInline.type != 3">添加</el-button>
    <el-button @click='addGoodsDialog = true' v-if="formInline.type == 3">添加商品</el-button>
    <el-button @click='downExcell' v-if="formInline.type == 3">下载模板</el-button>
    <el-button @click='importDialogVisible = true' v-if="formInline.type == 3">导入商品</el-button>
    <div class="searchForm">
      <p @click='showFormBool = !showFormBool'>筛选查询<i v-if='showFormBool' class="el-icon-arrow-down"></i><i v-else class="el-icon-arrow-up"></i></p>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" v-if='showFormBool'>
        <el-form-item label="区域">
          <el-select v-model="formInline.type" @change="selectChange">
            <el-option value='1' label='轮播图'></el-option>
            <el-option value='2' label='分类区域'></el-option>
            <el-option value='3' label='推荐区域'></el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item>-->
          <!--<el-button type="primary" @click="getTableData">查询</el-button>-->
        <!--</el-form-item>-->
      </el-form>
    </div>

    <el-table
      :data="tableData" key="typeTable"
      style="width: 100%" v-if="this.formInline.type != 3">
      <el-table-column
        label="数据列表">
        <el-table-column
          prop="id"
          label="编号"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="thumbnail"
          label="缩略图"
          min-width="120" align='center'>
          <template slot-scope="scope">
            <img :src="scope.row.thumbnail" style="width: 50px;height: 50px;">
          </template>
        </el-table-column>
        <el-table-column
          prop="jumpType"
          label="跳转类型"
          min-width="120" align='center'>
          <template slot-scope="scope">
            <span v-for="item in jumpArr" v-if="item.value == scope.row.jumpType">{{item.label}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="jumpParam"
          label="跳转后的页面名称或url"
          min-width="120" align='center'>
<!--
          <template slot-scope="scope">
            <span v-if="scope.type == 5 || scope.type == 7">{{scope.row.jump_data_remark}}</span>
            <span v-else>{{scope.row.jump_data}}</span>
          </template>
-->
        </el-table-column>
        <el-table-column
          prop="remarks"
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
          prop="status"
          label="显示状态"
          min-width="120" align='center'>
          <template slot-scope="scope">
            <el-switch
              @change="switchChange(scope.row.id, scope.row.status)"
              v-model="scope.row.status == 1">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="240" align='center'>
          <template slot-scope='scope'>
            <el-button @click='addPgc(scope.row.id)'>编辑</el-button>
            <el-button @click='editPgc(scope.row.id)'>删除</el-button>
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
          prop="bizId"
          label="商品id"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="name"
          label="商品名称"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="businessName"
          label="店家"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="价格"
          min-width="120" align='center'>
          <template slot-scope="scope">
            <span>{{scope.row.price / 100}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="stock"
          label="数量"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="status"
          label="商品状态"
          min-width="120" align='center'>
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">上架</span>
            <span v-else>下架</span>
          </template>
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
          prop="displayStatus"
          label="显示状态"
          min-width="120" align='center'>
          <template slot-scope="scope">
            <el-switch
              @change="switchChangeGoods(scope.row.id, scope.row.displayStatus)"
              v-model="scope.row.displayStatus == 1">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <el-button @click='editGoods(scope.row.id)'>删除</el-button>
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
        importDialogVisible: false,
        addGoodsDialog: false,
        addGoodsInput: '',
        operation_area_category_id: '',
        operation_area_category_idArr: [],
        operation_area_category_idArrCopy: [],
        type: '',
        formInline: {
          type: '1'
        },
        selectArr: [],
        jumpArr: [
          {label: '不跳转', value: 1},
          {label: 'h5', value: 2},
          {label: '商品', value: 3},
          {label: '区域', value: 4},
          {label: '商品分类', value: 5}
        ],
        showFormBool: true, // 是否显示过滤框
        pageShow: true, // 是否显示分页
        start: 1,
        total: 0,
      }
    },
    created () {
//      this.$axios({
//        type: 'post',
//        url: '/Operation/returnPagesOption',
//        data: {operation_pages_id: this.operation_pages_id},
//        fuc: (res) => {
//          this.selectArr = res.data
//          this.formInline.operation_template_area_id = res.data[0].operation_template_area_id
//          if (res.data[0].is_page == 1) {
//            this.pageShow = true
//            this.start = 1
//          } else {
//            this.pageShow = false
//          }
//          this.type = res.data[0].type
//          if (this.type != 1) {
//            this.getOperation_area_category_idArr()
//          } else {
            this.getTableData()
//          }
//        }
//      })
    },
    mounted () {},
    methods: {
      sortBlur (e) {
        this.$axios({
            type: 'put',
            url: '/bhs-management-admin/showpageConfig',
            data: {id: e.id, sort: e.sort},
            fuc: (res) => {
            if (res.code == 1) {
          this.$message.success('操作成功')
        }
        this.getTableData()
      }
      })
      },
      sortGoodsBlur (e) {
        this.$axios({
            type: 'put',
            url: '/bhs-management-admin/showpageContent',
            data: {id: e.id, sort: e.sort},
            fuc: (res) => {
            if (res.code == 1) {
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
          url: '/bhs-management-admin/showpageContent',
          data: {bizId: this.addGoodsInput, type: 1},
          fuc: (res) => {
            if (res.code == 1) {
              this.$message.success('操作成功')
              this.addGoodsDialog = false
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

      handleCurrentChange (val) {
        this.start = val
        this.getTableData()
      },
      selectChange (value) {
//        if (value == 3) {
//          
//        }
        this.start = 1
        this.getTableData()
      },
      getTableData () {
//        let searchData = {operation_pages_id: this.operation_pages_id, ...this.formInline}
//        if (this.pageShow) {
//          searchData.page = this.start
//        }
//        if (this.operation_area_category_id) {
//          searchData.operation_area_category_id = this.operation_area_category_id
//        }
        this.$axios({
            type: 'post',
            url: this.formInline.type == 3 ? '/bhs-management-admin/showpageContent/list' : '/bhs-management-admin/showpageConfig/list',
            data: {pageNumber: this.start, pageSize: 20, type: this.formInline.type == 3 ? 1 : this.formInline.type},
          fuc: (res) => {
            this.tableData = res.data.data
            this.total = parseInt(res.data.count)
          }
        })
      },
      addPgc (id) {
        let _form = {type: this.formInline.type}
        if (id) {
          _form.id = id
        }
        this.$router.push({path: "/indexConfigJava/indexConfigJavaDetail", query: _form})

      },
      editPgc (id) {
        this.$axios({
            type: 'delete',
            url: '/bhs-management-admin/showpageConfig/' + id,
            data: {},
            fuc: (res) => {
            if (res.code == 1) {
          this.$message.success('操作成功')
          this.getTableData()
        }
      }
      })
      },
      editGoods (id) {
        this.$axios({
            type: 'delete',
            url: '/bhs-management-admin/showpageContent/' + id,
            data: {},
            fuc: (res) => {
            if (res.code == 1) {
          this.$message.success('操作成功')
          this.getTableData()
        }
      }
      })
      },
      switchChange (id, status) {
        this.$axios({
            type: 'put',
            url: '/bhs-management-admin/showpageConfig',
            data: {id, status: status == 1 ? 2 : 1},
            fuc: (res) => {
            if (res.code == 1) {
          this.$message.success('操作成功')
          this.getTableData()
        }
      }
      })
      },
      switchChangeGoods (id, displayStatus) {
        this.$axios({
            type: 'put',
            url: '/bhs-management-admin/showpageContent',
            data: {id, displayStatus: displayStatus == 1 ? 2 : 1},
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
