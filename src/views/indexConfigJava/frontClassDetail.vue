<template>
  <div class="goodsBrandsDetail">
    <el-form ref="form" :model="form" label-width="120px" :rules='rules'>
      <el-form-item label="分类名称" prop='name'>
        <el-input v-model="form.name" placeholder='请填写类目名称'></el-input>
      </el-form-item>
      <el-form-item label="上级分类" prop='pid' v-if='level == 2'>
        <span>{{form.first_name}}</span>
      </el-form-item>
      <el-form-item label="排序">
        <el-input v-model="form.sort" placeholder='不输入则默认99' :maxlength='2'></el-input>
      </el-form-item>
      <el-form-item prop='img'>
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :before-upload="beforeAvatarUploadLogo">
          <img v-if="form.img" :src="form.img" class="avatar">
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
          pid: '0',
          sort: '',
          img: ''
        },
        level: '',
        rules: {
          name: [{ required: true, message: '请填写类目名称', trigger: 'blur' }],
          pid: [{ required: true, message: '请选择', trigger: 'change' }],
          logo: [{ required: true, message: '请上传图片', trigger: 'blur' }]
        },
      }
    },
    created () {
      this.level = this.$route.query.level
      if (this.$route.query.pid) {
        this.form.pid = this.$route.query.pid
        this.form.first_name = this.$route.query.name
//        this.$axios({
//          type: 'post',
//          url: '/goods/brand/editinfo',
//          data: {bid: this.$route.query.bid},
//          fuc: (res) => {
//            this.form = res.data
//            this.form.logo = this.form.logo_path + this.form.logo
//          }
//        })
      }
      if (this.$route.query.id) {
        this.$axios({
          type: 'get',
          url: '/bhs-management-admin/showpageCategory/' + this.$route.query.id,
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
            _form.onoffFlag = 1
            _form.level = this.level
            this.$axios({
              type: _form.id ? 'put' : 'post',
              url: '/bhs-management-admin/showpageCategory',
              data: _form,
              fuc: (res) => {
                if (res.code == 1) {
                  this.$message.success('操作成功')
                  this.level == 1 ? this.$deleteOneTag('/indexConfigJava/frontClassList') : this.$deleteOneTag('/indexConfigJava/frontClassSecList', {pid: this.form.pid}) 
                }
                
              }
            })
          }
        })
      },
      beforeAvatarUploadLogo (file) {
        let formData = new FormData()
        formData.append('file', file)
        formData.append('folder', "face/category")
        this.$axios({
          type: 'post',
          url: '/bhs-fileserver/file/uploadSingle',
          data: formData,
          fuc: (res) => {
            if (res.code == 1) {
              this.form.img = res.data
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