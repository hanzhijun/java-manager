<template>
  <div class="goodsBrandsDetail">
    <el-form ref="form" :model="form" label-width="120px" :rules='rules'>
      <el-form-item label="品牌名称" prop='name'>
        <el-input v-model="form.name" placeholder='请填写品牌名称'></el-input>
      </el-form-item>
      <el-form-item label="品牌首字母" prop='firstLetter'>
        <el-input v-model="form.firstLetter" placeholder='请填写品牌首字母'></el-input>
      </el-form-item>
      <el-form-item label="品牌LOGO" prop='imgLogo'>
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :before-upload="beforeAvatarUploadLogo">
          <img v-if="form.imgLogo" :src="form.imgLogo" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        form: {
          name: '',
          firstLetter: '',
          imgLogo: ''
        },
        rules: {
          name: [{ required: true, message: '请填写品牌名称', trigger: 'blur' }],
          firstLetter: [{ required: true, message: '请填写品牌首字母', trigger: 'blur' }],
          imgLogo: [{ required: true, message: '请上传品牌LOGO', trigger: 'blur' }]
        },
      }
    },
    created () {
      if (this.$route.query.id) {
        this.$axios({
          type: 'get',
          url: '/bhs-management-admin/goodsBrand/' + this.$route.query.id,
          data: {},
          fuc: (res) => {
            for (let val in this.form) {
              if (res.data[val] == 0 || res.data[val]) {
                this.form[val] = res.data[val] + ''
              }
            }
            this.form.id = this.$route.query.id
          }
        })
      }
    },
    methods: {
      onSubmit () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let _form = JSON.parse(JSON.stringify(this.form))
            
            this.$axios({
              type: _form.id ? 'put' : 'post',
              url: '/bhs-management-admin/goodsBrand',
              data: _form,
              fuc: (res) => {
                this.$deleteOneTag('/goods/goodsBrandsList')
              }
            })
          }
        })
      },
      beforeAvatarUploadLogo (file) {
        let formData = new FormData()
        formData.append('file', file)
        formData.append('folder', "brand")
        this.$axios({
          type: 'post',
          url: '/bhs-fileserver/file/uploadSingle',
          data: formData,
          fuc: (res) => {
            if (res.code == 1) {
              this.form.imgLogo = res.data
            }
          }
        }, 1)
        return false
      }
    }
  }
</script>
<style scoped="true">
  .goodsBrandsDetail{
    margin: 10px 20px 0;
    overflow: hidden;
  }
  .goodsBrandsDetail>.el-form{
    width: 400px;
    margin: 20px;
  }
</style>
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