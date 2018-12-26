<template>
  <div class="indexOperatingDetail">
    <el-form ref="form" :model="form" label-width="120px" :rules='rules'>
      <el-form-item label='封面图片' required>
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :before-upload="beforeAvatarUploadLogo">
          <img v-if="form.img_cover" :src="form.img_cover" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label='顶部图片' required>
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :before-upload="beforeAvatarUploadHeader">
          <img v-if="form.img_header" :src="form.img_header" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label='页面配置方式' prop='type'>
        <el-select v-model='form.type' placeholder="请选择">
          <el-option
            label="自由配置"
            value="1">
          </el-option>
          <el-option
            label="模板配置"
            value="2">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='界面名称' prop='name' v-if='form.type == 2'>
        <el-input v-model="form.name" placeholder='请输入界面名称' :maxlength='40'></el-input>
      </el-form-item>
      <el-form-item label='底板颜色' prop='footer_color' v-if='form.type == 2'>
        <el-input v-model="form.footer_color" placeholder='请输入界面名称' :maxlength='40'></el-input>
      </el-form-item>
      <el-form-item label='url' prop='url' v-if='form.type == 1'>
        <el-input v-model="form.url" placeholder='请输入url' :maxlength='40'></el-input>
      </el-form-item>
      <el-form-item label='分类数量' prop='category_num' v-if='form.type == 2'>
        <el-select v-model='form.category_num' placeholder="请选择" @change='category_numChange'>
          <el-option
            label="配置3个"
            value="3">
          </el-option>
          <el-option
            label="配置5个"
            value="5">
          </el-option>
          <el-option
            label="配置10个"
            value="10">
          </el-option>
          <el-option
            label="不配置"
            value="0">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if='form.type == 2'>
        <el-row>
          <el-col :span='10' v-for='(item, index) in form.category_info' :key='index'>
            <el-form-item :label="`第${index + 1}个名称`" required>
              <el-input v-model="item.category_name" placeholder='输入分类名称' :maxlength='40'></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label='备注'>
        <el-input type='textarea' v-model="form.remark" placeholder='备注' :maxlength='40'></el-input>
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
          img_cover: '',
          img_header: '',
          footer_color: '',
          type: '',
          name: '',
          url: '',
          template_id: '4',
          category_num: '',
          category_info: [],
          remark: ''
        },
        category_infoBefore: [],
        rules: {
          type: [{ required: true, message: '请选择', trigger: 'blur' }],
          footer_color: [{ required: true, message: '请选择', trigger: 'blur' }],
          name: [{ required: true, message: '请输入', trigger: 'blur' }],
          url: [{ required: true, message: '请输入', trigger: 'blur' }],
          template_id: [{ required: true, message: '请选择', trigger: 'blur' }],
          category_num: [{ required: true, message: '请选择', trigger: 'blur' }]
        }
      }
    },
    created () {
      if (this.$route.query.goods_activity_od_id) {
        this.$axios({
          type: 'post',
          url: '/goods/activityodgetdetailed',
          data: {goods_activity_od_id: this.$route.query.goods_activity_od_id},
          fuc: (res) => {
            if (res.code == 200) {
              for (let val in this.form) {
                if (val == 'img_cover' || val == 'img_header') {
                  this.form[val] = res.data[val + '_path'] + res.data[val]
                } else if (val == 'category_info') {
                  this.form[val] = res.data[val]
                } else if (res.data[val]) {
                  this.form[val] = res.data[val] + ''
                }
              }
              if (res.data.category_info && res.data.category_info && res.data.category_info.length > 0) {
                this.category_infoBefore = res.data.category_info
              }
              this.form.goods_activity_od_id = res.data.goods_activity_od_id
              this.form.goods_activity_category_id = res.data.goods_activity_category_id
              this.form.img_cover_path = res.data.img_cover_path
              this.form.img_header_path = res.data.img_header_path
              console.log(this.form)
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
            if (_form.img_cover.indexOf(_form.img_cover_path) > -1) {
              _form.img_cover = _form.img_cover.split(_form.img_cover_path)[1]
            }
            if (_form.img_header.indexOf(_form.img_header_path) > -1) {
              _form.img_header = _form.img_header.split(_form.img_header_path)[1]
            }
            this.$axios({
              type: 'post',
              url: this.$route.query.goods_activity_od_id ? '/goods/activityodedit' : '/goods/activityodadd',
              data: _form,
              fuc: (res) => {
                if (res.code == 200) {
                  this.$message.success('操作成功')
                  this.$deleteOneTag('/interConfig/goldMail/goldMailRecommendedOperatingList')
                }
              }
            })
          }
        })
        
      },
      category_numChange (num) {
        console.log('num', num)
        this.form.category_info = []
        if (num == this.category_infoBefore.length) {
          this.form.category_info = this.category_infoBefore
          return
        }
        for (let i = 0; i < num; i++) {
          this.form.category_info.push({category_name: '', category_type: '1', goods_activity_category_id: 0})
        }
      },
      beforeAvatarUploadLogo (file) {
        let _this = this
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e){ 
          _this.form.img_cover = this.result // 这个就是base64编码了
        }
        return false
      },
      beforeAvatarUploadHeader (file) {
        let _this = this
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e){ 
          _this.form.img_header = this.result // 这个就是base64编码了
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
  .indexOperatingDetail{
    margin: 10px 20px 0;
    overflow: hidden;
  }
  .indexOperatingDetail>.el-form .el-input{
    max-width: 400px;
  }
  .indexOperatingDetail>.el-form .el-textarea{
    max-width: 400px;
  }
</style>