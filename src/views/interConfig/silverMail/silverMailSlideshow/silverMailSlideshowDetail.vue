<template>
  <div class="indexSlideshowDetail">
    <el-form ref="form" :model="form" label-width="120px" :rules='rules'>
      <el-form-item label='图片' required>
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :before-upload="beforeAvatarUploadLogo">
          <img v-if="form.image" :src="form.image" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label='是否显示' prop='status'>
        <el-select v-model='form.status' placeholder="请选择">
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
      <el-form-item label='显示区域' prop='goods_activity_category_id'>
        <el-select v-model='form.goods_activity_category_id' placeholder="请选择" clearable>
          <el-option
          v-for='item in businesscategories'
          :label="item.name"
          :value="item.goods_activity_category_id + ''"
          :key="item.goods_activity_category_id">
        </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='跳转方式' prop='type'>
        <el-select v-model='form.type' placeholder="请选择">
          <el-option
            label="web"
            value="1">
          </el-option>
          <el-option
            label="商品"
            value="2">
          </el-option>
          <el-option
            label="区域"
            value="3">
          </el-option>
          <el-option
            label="图文内容"
            value="5">
          </el-option>
          <el-option
            label="不跳转"
            value="4">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='url' prop='url' v-if='form.type == 1'>
        <el-input v-model="form.url" placeholder='请输入url' :maxlength='40'></el-input>
      </el-form-item>
      <el-form-item label='商品id' prop='goods_id' v-if='form.type == 2'>
        <el-input v-model="form.goods_id" placeholder='请输入商品id' :maxlength='40'></el-input>
      </el-form-item>
      <el-form-item label='跳转区域' prop='type' v-if='form.type == 3'>
        <el-select v-model='form.type' placeholder="请选择">
          
        </el-select>
      </el-form-item>
      <el-form-item label='图文内容' required v-if='form.type == 5'>
        <vue-editor id="editor" :customModules="customModulesForEditor" :editorOptions="editorSettings"
          useCustomImageHandler :editorToolbar="customToolbar"
          @imageAdded="handleImageAdded" v-model="form.image_text">
<!--        <vue-editor id="editor" :customModules="customModulesForEditor" :editorOptions="editorSettings" v-model="form.image_text">-->
        </vue-editor>
      </el-form-item>
      <el-form-item label='顺序'>
        <el-input v-model="form.sort" placeholder='填写数字' :maxlength='40'></el-input>
      </el-form-item>
      <el-form-item label='备注'>
        <el-input type='textarea' v-model="form.remark" placeholder='请输入备注' :maxlength='40'></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click='submit'>保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { VueEditor } from 'vue2-editor'
  import { ImageDrop } from 'quill-image-drop-module'
  import ImageResize from 'quill-image-resize-module'
  
  export default {
    components: {
      VueEditor
    },
    data () {
      return {
        form: {
          goods_activity_category_id: '',
          image: '',
          status: '',
          type: '',
          url: '',
          goods_id: '',
          image_text: '',
          remark: '',
          sort: ''
        },
        businesscategories: [],
        rules: {
          goods_activity_category_id: [{ required: true, message: '请选择', trigger: 'blur' }],
          status: [{ required: true, message: '请选择', trigger: 'blur' }],
          type: [{ required: true, message: '请选择', trigger: 'blur' }],
          url: [{ required: true, message: '请填写', trigger: 'blur' }],
          goods_id: [{ required: true, message: '请填写', trigger: 'blur' }],
          image_text: [{ required: true, message: '请填写', trigger: 'blur' }],
        },
        customToolbar: [
          ['bold', 'italic', 'underline'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'color': []}, { 'background': [] }],
          ['image', 'code-block']
        ],
        customModulesForEditor: [
          { alias: 'imageDrop', module: ImageDrop },
          { alias: 'imageResize', module: ImageResize }
        ],
        editorSettings: {
          modules: {
            imageDrop: true,
            imageResize: {}
          }
        }
      }
    },
    created () {
      this.$axios({
        type: 'post',
        url: '/goods/activitycategorygetlist',
        data: {parent_id: 4, type: 1},
        fuc: (res) => {
          this.businesscategories = res.data
        }
      })
//      this.$qiyang()
      if (this.$route.query.goods_activity_carousel_id) {
        this.$axios({
          type: 'post',
          url: '/goods/activitycarouselgetdetailed',
          data: {goods_activity_carousel_id: this.$route.query.goods_activity_carousel_id},
          fuc: (res) => {
            console.log('res', res)
            if (res.code == 200) {
              for (let val in this.form) {
                if (val == 'image') {
                  this.form.image = res.data.image_path + res.data.image
                } else if (res.data[val]) {
                  this.form[val] = res.data[val] + ''
                }
                this.form.goods_activity_carousel_id = res.data.goods_activity_carousel_id
                this.form.image_path = res.data.image_path
              }
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
            console.log(_form.image.indexOf(_form.image_path), _form.image.split(_form.image_path))
            if (_form.image.indexOf(_form.image_path) > -1) {
              _form.image = _form.image.split(_form.image_path)[1]
            }
            this.$axios({
              type: 'post',
              url: this.$route.query.goods_activity_carousel_id ? '/goods/activitycarouseledit' : '/goods/activitycarouseladd',
              data: {..._form},
              fuc: (res) => {
                console.log('res', res)
                if (res.code == 200) {
                  this.$message.success('操作成功')
                  this.$deleteOneTag('/interConfig/silverMail/silverMailSlideshowList')
                }
              }
            })
          }
        })
      },
      handleImageAdded (file, Editor, cursorLocation, resetUploader) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e){ 
//          _this.form.license = this.result // 这个就是base64编码了
          Editor.insertEmbed(cursorLocation, 'image', this.result);
          resetUploader();
        }
        
//        var formData = new FormData();
//        formData.append('image', file)
// 
//        axios({
//          url: 'https://fakeapi.yoursite.com/images',
//          method: 'POST',
//          data: formData
//        })
//        .then((result) => {
//          let url = result.data.url // Get url from response
//          Editor.insertEmbed(cursorLocation, 'image', url);
//          resetUploader();
//        })
//        .catch((err) => {
//          console.log(err);
//        })
      },
      beforeAvatarUploadLogo (file) {
        let _this = this
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e){ 
          _this.form.image = this.result // 这个就是base64编码了
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