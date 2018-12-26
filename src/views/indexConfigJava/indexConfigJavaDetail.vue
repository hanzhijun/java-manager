<template>
  <div class="indexIconClassifyDetail">
    <el-form ref="form" :model="form" label-width="120px" :rules='rules'>
      <el-form-item label='图片' required>
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :before-upload="beforeAvatarUploadLogo">
          <img v-if="form.thumbnail" :src="form.thumbnail" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label='跳转类型' prop='jumpType'>
        <el-select v-model='form.jumpType' placeholder="请选择" @change="form.jumpParam = ''">
          <el-option v-for='item in jumpArr'
                     :label="item.label"
                     :value="item.value" :key="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='url地址' prop='jumpParam' v-if="form.jumpType == 2">
        <el-input type='textarea' v-model="form.jumpParam" placeholder='请输入'></el-input>
      </el-form-item>
      <el-form-item label='商品id' prop='jumpParam' v-else-if="form.jumpType == 3">
        <el-input v-model="form.jumpParam" placeholder='请输入'></el-input>
      </el-form-item>
      <el-form-item label='区域位置' prop='jumpParam' v-else-if="form.jumpType == 4">
        <el-input type='textarea' v-model="form.jumpParam" placeholder='请输入'></el-input>
      </el-form-item>
      <el-form-item label='商品分类' prop='jumpParam' v-else-if="form.jumpType == 5">
        <el-select v-model='form.jumpParam' placeholder="请选择">
          <el-option v-for='item in goodsClassifyArr'
                     :label="item.name"
                     :value="item.id + ''" :key="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='备注'>
        <el-input type='textarea' v-model="form.remarks" placeholder='请输入备注' :maxlength='40'></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click='submit'>保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    props: [
      'operation_pages_id', 'listUrl'
    ],
    data () {
      return {
        formInline: {
          search: ''
        },
        form: {
          thumbnail: '',
          jumpType: '',
          jumpParam: '',
          remarks: ''
        },
        goodsClassifyArr: [],
        jumpArr: [
          {label: '不跳转', value: 1},
          {label: 'h5', value: 2},
          {label: '商品', value: 3},
          {label: '区域', value: 4},
          {label: '商品分类', value: 5}
        ],
        rules: {
          jumpType: [{ required: true, message: '请选择', trigger: 'blur' }],
          thumbnail: [{ required: true, message: '请选择', trigger: 'blur' }],
          jumpParam: [{ required: true, message: '请输入', trigger: 'blur' }]
        }
      }
    },
    created () {
      this.$axios({
        type: 'post',
        url: '/bhs-management-admin/showpageCategory/selectList',
        data: {pid: 0, type: 1},
        fuc: (res) => {
        this.goodsClassifyArr = res.data
    }
    })
      if (this.$route.query.id) {
        this.$axios({
            type: 'get',
            url: '/bhs-management-admin/showpageConfig/' + this.$route.query.id,
            data: {},
            fuc: (res) => {
            if (res.code == 1) {
          for (let val in this.form) {
//            if (val == 'thumbnail') {
//              this.form.thumbnail = res.data.thumbnail_path + res.data.thumbnail
//            } else if (res.data[val] == 0 || res.data[val]) {
              this.form[val] = res.data[val]
//            }
          }
          this.form.id = res.data.id
//          this.form.thumbnail_path = res.data.thumbnail_path
        }
      }
      })
      }
    },
    methods: {
      submit () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let _form = JSON.parse(JSON.stringify(this.form))
            _form.type = this.$route.query.type
            this.$axios({
                type: this.$route.query.id ? 'put' : 'post',
                url: '/bhs-management-admin/showpageConfig',
                data: _form,
              fuc: (res) => {
              if (res.code == 1) {
                this.$message.success('操作成功')
                this.$deleteOneTag("/indexConfigJava/indexConfigJavaList")
              }
            }
          })
          }
        })
      },
      beforeAvatarUploadLogo (file) {
        let formData = new FormData()
        formData.append('file', file)
        formData.append('folder', "face/carousel")
        this.$axios({
          type: 'post',
          url: '/bhs-fileserver/file/uploadSingle',
          data: formData,
          fuc: (res) => {
            if (res.code == 1) {
              this.form.thumbnail = res.data
            }
          }
        }, 1)
        return false
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
