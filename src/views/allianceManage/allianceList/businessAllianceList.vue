<template>
  <div class="onlineBusinessList">
    <el-button type="primary" @click="businessDialogVisible = true">添加联盟商家</el-button>

    <el-button type="primary" @click="importDialogVisible = true">批量添加联盟商家</el-button>

    <div class="searchForm">
      <p @click='showFormBool = !showFormBool'>筛选查询<i v-if='showFormBool' class="el-icon-arrow-down"></i><i v-else class="el-icon-arrow-up"></i></p>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" v-if='showFormBool'>
        <el-form-item label="输入搜索">
          <el-input v-model="formInline.business_name" placeholder="商家名称"></el-input>
        </el-form-item>
        <el-form-item label="商家类目">
          <el-cascader
            :options="categoryList" change-on-select
            v-model="formInline.server_search_category_id" clearable>
          </el-cascader>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getTableData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
    :data="tableData"
    style="width: 100%">
      <el-table-column
        label="商家列表">
        <el-table-column
          prop="business_offline_id"
          label="编号"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="name"
          label="商家名称"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="category_name"
          label="类目"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="account"
          label="商家账号"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="account"
          label="销售额"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <el-button @click='detailFinancial(scope.row.business_offline_id, 1)'>查看</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="account"
          label="提成额"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <el-button @click='detailFinancial(scope.row.business_offline_id, 2)'>查看</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="运营状态"
          min-width="170" align='center'>
          <template slot-scope='scope'>
            <el-switch
              v-model="scope.row.status == 2"
              active-text="经营中"
              @change='changeStatus(scope.row.business_offline_id)'
              inactive-text="已关店">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="240" align='center'>
          <template slot-scope='scope'>
            <el-button @click='editAlliance(scope.row)'>编辑</el-button>
            <el-button @click='packageGoods(scope.row.business_offline_id)'>服务列表</el-button>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
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

    <el-dialog title="商家信息" :visible.sync="businessDialogVisible" :show-close='false' @close='dialogClose'>

      <el-form :model="businessSaveForm" ref='businessSaveForm' label-width="200px" :rules='rules'>
        <el-form-item label="商家账号" prop='account'>
          <el-input v-model="businessSaveForm.account" placeholder='请输入商家账号'></el-input>
        </el-form-item>
        <el-form-item label="是否允许商家上架商品" prop='is_allowed_up_goods'>
          <el-select v-model='businessSaveForm.is_allowed_up_goods' placeholder="请选择">
            <el-option
              label="允许"
              :value="1">
            </el-option>
            <el-option
              label="不允许"
              :value="2">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="businessDialogVisible = false">取 消</el-button>
        <el-button @click="dialogTrue(0)" v-if='editAbled'>退出联盟</el-button>
        <el-button type="primary" @click="dialogTrue(1)">提 交</el-button>
      </div>
    </el-dialog>

    <el-pagination
    layout="prev, pager, next"
    :total="total" :page-size="20" @current-change="handleCurrentChange"
      :current-page.sync="start">
  </el-pagination>

  </div>
</template>

<script>
  export default {
    name: 'businessAllianceList',
    data() {
      return {
        importDialogVisible: false,
        businessDialogVisible: false,
        editAbled: false, // 编辑状态
        tableData: [],
        formInline: {
          business_name: '',
          server_search_category_id: []
        },
        businessSaveForm: {
          account: '',
          is_allowed_up_goods: 1
        },
        rules: {
          account: [{ required: true, message: '请输入', trigger: 'blur' }],
          is_allowed_up_goods: [{ required: true, message: '请输入', trigger: 'blur' }]
        },
        categoryList: [],
        start: 1,
        total: 0,
        showFormBool: true // 是否显示过滤框
      }
    },
    created() {
      this.$axios({
        type: 'post',
        url: '/business/categorygettree',
        data: {},
        fuc: (res) => {
          let arr = []
          for (let val of res.data) {
            let obj = {}
            obj.label = val.name
            obj.value = val.business_category_id
            if (val.child && val.child.length > 0) {
              obj.children = []
              for (let val2 of val.child) {
                obj.children.push({
                  label: val2.name,
                  value: val2.business_category_id
                })
              }
            }
            arr.push(obj)
          }
          this.categoryList = arr
          console.log(1, arr)
        }
      })
      this.getTableData()
    },
    mounted() {},
    methods: {
      detailFinancial(business_id, type) {
        this.$axios({
          type: 'post',
          url: '/union/getunionamount',
          data: { type: type == 1 ? 1 : -1 },
          fuc: (res) => {
            this.$alert(res.data.amount, type == 1 ? '销售额' : '提成额', {
              confirmButtonText: '确定',
              callback: action => {
              }
            })
          }
        })
      },
      editAlliance(row) {
        this.businessSaveForm.account = row.account
        this.businessSaveForm.is_allowed_up_goods = row.is_allowed_up_goods
        this.businessDialogVisible = true
        this.editAbled = true
      },
      packageGoods(business_id) {
        this.$router.push({ path: '/allianceManage/packageGoodsList', query: { business_id: business_id }})
      },
      changeStatus(business_id) {
        this.$axios({
          type: 'post',
          url: '/business/offlinechangestatus',
          data: { business_offline_id: business_id },
          fuc: (res) => {
            this.getTableData()
          }
        })
      },
      handleCurrentChange(val) {
        this.start = val
        this.getTableData()
      },
      dialogClose () {
        this.businessSaveForm.account = ''
        this.businessSaveForm.is_allowed_up_goods = 1
        this.editAbled = false
      },
      dialogTrue (status) {
        this.$refs['businessSaveForm'].validate((valid) => {
          if (valid) {
            this.$axios({
              type: 'post',
              url: '/business/bealliance',
              data: { is_alliance: status, ...this.businessSaveForm },
              fuc: (res) => {
                this.$message.success('操作成功')
                this.businessDialogVisible = false
                this.getTableData()
              }
            })
          }
        })

      },
      beforeAvatarUpload (file) {
        let formData = new FormData()
        formData.append('excel', file)
        this.$axios({
          type: 'post',
          url: '/business/addmanyalliance',
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
      getTableData() {
        this.$axios({
          type: 'post',
          url: '/union/adminunion',
          data: { page: this.start, limit: 20, ...this.formInline },
          fuc: (res) => {
            this.tableData = res.data.data
            this.total = res.data.count
          }
        })
      }
    }
  }
</script>
<style scoped="true">
  .onlineBusinessList{
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
