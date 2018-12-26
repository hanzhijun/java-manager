<template>
  <div class="indexOperatingArticDetail">
    <el-form ref="form" :model="form" label-width="120px" :rules='rules'>
      <el-form-item label='标题' prop='title'>
        <el-input placeholder='请输入标题' v-model='form.title'></el-input>
      </el-form-item>
      <el-form-item label='副标题' prop='title_sub'>
        <el-input placeholder='请输入副标题' v-model='form.title_sub'></el-input>
      </el-form-item>
      <el-form-item label='url' prop='url'>
        <el-input placeholder='请输入url' v-model='form.url'></el-input>
      </el-form-item>
      <el-form-item label='显示状态' prop='status'>
        <el-select v-model='form.status' placeholder="请选择" clearable>
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
      <el-form-item label='封面图片' prop='img'>
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :before-upload="beforeAvatarUploadLogo">
          <img v-if="form.img" :src="form.img" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
<!--
      <el-form-item label='顺序'>
        <el-input v-model="form.sort" placeholder='填写数字，不填默认99' :maxlength='10'></el-input>
      </el-form-item>
-->
      <el-form-item>
        <el-button @click='submit'>保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        form: {
          title: '',
          title_sub: '',
          url: '',
          img: '',
//          sort: '',
          status: ''
        },
        rules: {
          title: [{ required: true, message: '请输入', trigger: 'blur' }],
          title_sub: [{ required: true, message: '请输入', trigger: 'blur' }],
          url: [{ required: true, message: '请输入', trigger: 'blur' }],
          img: [{ required: true, message: '请上传', trigger: 'blur' }],
          status: [{ required: true, message: '请选择', trigger: 'blur' }]
        }
      }
    },
    created () {
      if (this.$route.query.goods_activity_article_id) {
        this.$axios({
          type: 'post',
          url: '/goods/activityarticlegetdetailed',
          data: {goods_activity_article_id: this.$route.query.goods_activity_article_id},
          fuc: (res) => {
            if (res.code == 200) {
              for (let val in this.form) {
                if (val == 'img') {
                  this.form[val] = res.data[val + '_path'] + res.data[val]
                } else if (val == 'category_info') {
                  this.form[val] = res.data[val]
                } else if (res.data[val]) {
                  this.form[val] = res.data[val] + ''
                }
              }
              this.form.goods_activity_article_id = res.data.goods_activity_article_id
              this.form.img_path = res.data.img_path
            }
          }
        })
      }
      this.form.goods_activity_category_id = this.$route.query.goods_activity_category_id
    },
    methods: {
      submit () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let _form = JSON.parse(JSON.stringify(this.form))
            if (_form.img.indexOf(_form.img_path) > -1) {
              _form.img = _form.img.split(_form.img_path)[1]
            }
            this.$axios({
              type: 'post',
              url: this.$route.query.goods_activity_article_id ? '/goods/activityarticleedit' : '/goods/activityarticleadd',
              data: _form,
              fuc: (res) => {
                if (res.code == 200) {
                  this.$message.success('操作成功')
                  this.$deleteOneTag('/interConfig/indexManage/indexOperatingArticList', {goods_activity_category_id: _form.goods_activity_category_id})
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
  .indexOperatingArticDetail{
    margin: 10px 20px 0;
    overflow: hidden;
  }
  .indexOperatingArticDetail>.el-form .el-input{
    max-width: 400px;
  }
  .indexOperatingArticDetail>.el-form .el-textarea{
    max-width: 400px;
  }
</style>