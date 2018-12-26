<template>
  <div class="indexIconClassifyDetail">
    <el-form ref="form" :model="form" label-width="120px" :rules='rules'>
      <el-form-item label='图片' required>
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :before-upload="beforeAvatarUploadLogo">
          <img v-if="form.img" :src="form.img" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label='标题'>
        <el-input v-model="form.title" placeholder='请输入url' :maxlength='40'></el-input>
      </el-form-item>
      <el-form-item label='副标题'>
        <el-input v-model="form.title_sub" placeholder='请输入url' :maxlength='40'></el-input>
      </el-form-item>
      <el-form-item label='跳转类型' prop='jump_type'>
        <el-select v-model='form.jump_type' placeholder="请选择" @change="form.jump_data = form.jump_data_remark = ''">
          <el-option v-for='item in jumpArr'
                     :label="item.label"
                     :value="item.value" :key="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='url地址' prop='jump_data' v-if="form.jump_type == 2">
        <el-input type='textarea' v-model="form.jump_data" placeholder='请输入'></el-input>
      </el-form-item>
      <el-form-item label='商品id' prop='jump_data' v-else-if="form.jump_type == 3">
        <el-input v-model="form.jump_data" placeholder='请输入'></el-input>
      </el-form-item>
      <el-form-item label='区域位置' prop='jump_data' v-else-if="form.jump_type == 4">
        <el-input type='textarea' v-model="form.jump_data" placeholder='请输入'></el-input>
      </el-form-item>
      <el-form-item label='商品分类' prop='jump_data' v-else-if="form.jump_type == 6">
        <el-select v-model='form.jump_data' placeholder="请选择">
          <el-option v-for='item in goodsClassifyArr'
                     :label="item.c_name"
                     :value="item.cid + ''" :key="item.cid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='线下分类' prop='jump_data' v-else-if="form.jump_type == 8">
        <el-select v-model='form.jump_data' placeholder="请选择">
          <el-option v-for='item in businessClassifyArr'
                     :label="item.name"
                     :value="item.business_category_id + ''" :key="item.business_category_id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='pgc' prop='jump_data' v-else-if="form.jump_type == 5">
        <el-button @click="openDialog">选择pgc</el-button><span v-if="form.jump_data_remark">{{'<' + form.jump_data_remark + '>'}}</span>
      </el-form-item>
      <el-form-item label='运营页面' prop='jump_data' v-else-if="form.jump_type == 7">
        <el-button @click="openDialog">选择运营页面</el-button><span v-if="form.jump_data_remark">{{'<' + form.jump_data_remark + '>'}}</span>
      </el-form-item>
      <el-form-item label='备注'>
        <el-input type='textarea' v-model="form.remark" placeholder='请输入备注' :maxlength='40'></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click='submit'>保存</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="选择页面" :visible.sync="dialogTableVisible">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="输入搜索">
          <el-input v-model="formInline.search" placeholder="编号/页面名称/所在位置"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getTableData">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="gridData">
        <el-table-column
          v-if="form.jump_type == 5"
          prop="id"
          label="编号"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          v-else
          prop="operation_pages_id"
          label="编号"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          v-if="form.jump_type == 5"
          prop="title"
          label="pgc名称"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          v-else
          prop="name"
          label="运营页面名称"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="sort"
          label="顺序"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          v-if="form.jump_type == 5"
          prop="user_name"
          label="撰写人"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="area"
          label="所在位置"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          min-width="170" align='center'>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <el-button v-if="form.jump_type == 5" @click='selectPage(scope.row.title, scope.row.id)'>选择</el-button>
            <el-button v-else @click='selectPage(scope.row.name, scope.row.operation_pages_id, scope.row.operation_template_id)'>选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        layout="prev, pager, next"
        :total="total" :page-size="20" @current-change="handleCurrentChange"
        :current-page.sync="start">
      </el-pagination>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    props: [
      'operation_pages_id', 'listUrl'
    ],
    data () {
      return {
        dialogTableVisible: false,
        gridData: [],
        formInline: {
          search: ''
        },
        start: 1,
        total: 0,
        form: {
          img: '',
          title: '',
          title_sub: '',
          jump_type: '',
          jump_data: '',
          remark: '',
          jump_data_remark: ''
        },
        goodsClassifyArr: [],
        businessClassifyArr: [],
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
        rules: {
          jump_type: [{ required: true, message: '请选择', trigger: 'blur' }],
          jump_data: [{ required: true, message: '请输入', trigger: 'blur' }]
        }
      }
    },
    created () {
      console.log('operation_pages_id', this.operation_pages_id)
      this.$axios({
        type: 'post',
        url: '/goods/category/getinfo',
        data: {},
        fuc: (res) => {
        this.goodsClassifyArr = res.data
    }
    })
      this.$axios({
        type: 'post',
        url: '/business/categorygetlist',
        data: {is_all: 1},
        fuc: (res) => {
        this.businessClassifyArr = res.data
    }
    })
      if (this.$route.query.operation_content_id) {
        this.$axios({
            type: 'post',
            url: '/operation/getcontentdetailed',
            data: {operation_content_id: this.$route.query.operation_content_id},
            fuc: (res) => {
            if (res.code == 200) {
          for (let val in this.form) {
            if (val == 'img') {
              this.form.img = res.data.img_path + res.data.img
            } else if (res.data[val] == 0 || res.data[val]) {
              this.form[val] = res.data[val]
            }
          }
          console.log(this.form)
          this.form.operation_content_id = res.data.operation_content_id
          this.form.img_path = res.data.img_path
        }
      }
      })
      }
    },
    methods: {
      submit () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            if (this.form.image == '') {
              this.$message.warning('请上传图片')
              return
            }
            let _form = JSON.parse(JSON.stringify(this.form))
            if (_form.img.indexOf(_form.img_path) > -1) {
              _form.img = _form.img.split(_form.img_path)[1]
            }
            let searchData = {operation_template_area_id: this.$route.query.operation_template_area_id, operation_pages_id: this.operation_pages_id, ..._form}
            if (this.$route.query.operation_area_category_id) {
              searchData.operation_area_category_id = this.$route.query.operation_area_category_id
            }
            this.$axios({
                type: 'post',
                url: this.$route.query.operation_content_id ? '/operation/editcontent' : '/operation/addcontent',
                data: {operation_template_area_id: this.$route.query.operation_template_area_id, operation_pages_id: this.operation_pages_id, ..._form},
              fuc: (res) => {
              console.log('res', res)
              if (res.code == 200) {
                this.$message.success('操作成功')
                if (this.operation_pages_id == 10000 || this.operation_pages_id == 10001) {
                  this.$deleteOneTag(this.listUrl)
                } else {
                  this.$deleteOneTag(this.listUrl, {operation_pages_id: this.operation_pages_id})
                }

              }
            }
          })
          }
        })
      },
      beforeAvatarUploadLogo (file) {
        let _this = this
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e){
          _this.form.img = this.result // 这个就是base64编码了
        }
        return false
      },
      handleCurrentChange (val) {
        this.start = val
        this.getTableData()
      },
      openDialog () {
        this.dialogTableVisible = true
        this.getTableData()
      },
      getTableData () {
        this.$axios({
            type: 'post',
            url: this.form.jump_type == 5 ? '/Operation/pgclist' : '/Operation/getOperationPagesList',
            data: {publish: 1, isshow: 1, page: this.start, limit: 20, ...this.formInline},
          fuc: (res) => {
          this.gridData = res.data.data
          this.total = res.data.total
        }
      })
      },
      selectPage (name, id, area_id) {
        if (this.form.jump_type == 7) {
          this.form.jump_data = id + '_' + area_id
        } else {
          this.form.jump_data = id
        }
        this.form.jump_data_remark = name
        this.dialogTableVisible = false
      }
    }
  }
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
<style scoped="true">
  .indexIconClassifyDetail{
    margin: 10px 20px 0;
    overflow: hidden;
  }
  .indexIconClassifyDetail>.el-form .el-input{
    max-width: 400px;
  }
  .indexIconClassifyDetail>.el-form .el-textarea{
    max-width: 400px;
  }
</style>
