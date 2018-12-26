<template>
  <div class="indexSlideshowDetail">
    <el-form ref="form" :model="form" label-width="120px" :rules='rules'>
      <el-form-item label='商品编码' required>
        <el-input placeholder='请输入商品编码' v-model='form.goods_desc'></el-input>
        <el-button>确认</el-button>
      </el-form-item>
      <el-form-item label='选择分类'>
        <el-select v-model='form.type' placeholder="请选择">
          <el-option
            label="专区模板"
            value="1">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='支付方式'>
        <el-select v-model='form.type' placeholder="不选则默认本来的支付方式" clearable>
          <el-option
            label="专区模板"
            value="1">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='顺序'>
        <el-input v-model="form.goods_desc" placeholder='填写数字，不填默认99' :maxlength='10'></el-input>
      </el-form-item>
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
          details_imgs_url: '',
          goods_desc: '',
          type: ''
        },
        rules: {
          
        }
      }
    },
    methods: {
      submit () {
        
      },
      beforeAvatarUploadLogo (file) {
        let _this = this
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e){ 
          _this.form.details_imgs_url = this.result // 这个就是base64编码了
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
  .indexSlideshowDetail{
    margin: 10px 20px 0;
    overflow: hidden;
  }
  .indexSlideshowDetail>.el-form .el-input{
    max-width: 400px;
  }
  .indexSlideshowDetail>.el-form .el-textarea{
    max-width: 400px;
  }
</style>