<template>
  <div class="pgcPagesDetail">

    <el-form ref="form" :model="form" label-width="120px" :rules='rules'>
      <el-form-item label='标题' prop='title'>
        <el-input v-model="form.title" placeholder='请输入' :maxlength='50'></el-input>
      </el-form-item>
      <el-form-item label='副标题' prop='title_sub'>
        <el-input v-model="form.title_sub" placeholder='请输入' :maxlength='40'></el-input>
      </el-form-item>
      <el-form-item label='创建人id' prop='user_id'>
        <el-input v-model="form.user_id" placeholder='请输入' :maxlength='40'></el-input>
      </el-form-item>
      <el-form-item label='备注'>
        <el-input type='textarea' v-model="form.remark" placeholder='备注'></el-input>
      </el-form-item>
      <el-form-item label='顶部图片'>
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :before-upload="beforeAvatarUploadLogo">
          <img v-if="form.top_img" :src="form.top_img" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button @click='submit'>保存</el-button>
      </el-form-item>
    </el-form>
    <vue-editor id="editor" :customModules="customModulesForEditor" :editorOptions="editorSettings"
                useCustomImageHandler :editorToolbar="customToolbar"
                @imageAdded="handleImageAdded" v-model="form.body" style="width: 650px;">
      <!--        <vue-editor id="editor" :customModules="customModulesForEditor" :editorOptions="editorSettings" v-model="form.image_text">-->
    </vue-editor>

  </div>

</template>
<script>
  import { VueEditor } from 'vue2-editor'
  import { ImageDrop } from 'quill-image-drop-module'
  import ImageResize from 'quill-image-resize-module'

  export default {
    data () {
      return {
        form: {
          title: '',
          title_sub: '',
          user_id: '',
          remark: '',
          top_img: '',
          body: ''
        },
        rules: {
          title: [{ required: true, message: '请输入', trigger: 'blur' }],
          user_id: [{ required: true, message: '请输入', trigger: 'blur' }]
        },
        customToolbar: [
          ['bold', 'italic', 'underline'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'color': []}, { 'background': [] }],
          ['image', 'code-block', 'link']
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
    components: {
      VueEditor
    },
    created () {
      if (this.$route.query.id) {
        this.$axios({
            type: 'post',
            url: '/Operation/getpgcdetail',
            data: {id: this.$route.query.id},
            fuc: (res) => {
//              debugger
              if (res.code == 200) {
                for (let val in this.form) {
                  this.form[val] = res.data[val]
                }
                this.form.top_img = res.data.url_path + res.data.top_img_path + res.data.top_img
                this.form.top_img_path = res.data.top_img_path
              }
            }
        })
      }
    },
    mounted () {
    },
    methods: {
      beforeAvatarUploadLogo (file) {
        let _this = this
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e){
          _this.form.top_img = this.result // 这个就是base64编码了
        }
        return false
      },
      submit () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            if (this.$route.query.id) {
              if (this.form.top_img.indexOf(this.form.top_img_path) > -1) {
                this.form.top_img = this.form.top_img.split(this.form.top_img_path)[1]
              }
              this.form.id = this.$route.query.id
            }
            this.$axios({
                type: 'post',
                url: this.$route.query.id ? '/Operation/editpgc' : '/Operation/addpgc',
                data: this.form,
                fuc: (res) => {
                  if (res.code == 200) {
                    this.$message.success('操作成功')
                    this.$deleteOneTag('/indexConfig/pgcPagesList')
                  }
              }
            })
          }
        })
      },
      handleImageAdded (file, Editor, cursorLocation, resetUploader) {
        let _this = this
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
//          _this.form.license = this.result // 这个就是base64编码了
          _this.$axios({
            type: 'post',
            url: '/Operation/uploadpgc',
            data: {pgc_img: this.result},
            fuc: (res) => {
              if (res.code == 200) {
                Editor.insertEmbed(cursorLocation, 'image', res.data);
                resetUploader();
              }
            }
          })

        }
      }
    }
  }

</script>
<style scoped="true">
  .pgcPagesDetail{
    margin: 10px 20px 0;
    overflow: hidden;
  }
  .pgcPagesDetail>.el-form .el-input{
    max-width: 400px;
  }
  .pgcPagesDetail>.el-form .el-textarea{
    max-width: 400px;
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
