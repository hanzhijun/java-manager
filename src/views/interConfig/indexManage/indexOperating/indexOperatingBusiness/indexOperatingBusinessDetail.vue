<template>
  <div class="indexSlideshowDetail">
    <el-form ref="form" :model="form" label-width="120px" :rules='rules'>
      <el-form-item label='商家账号' prop='business_offline_account'>
        <el-input placeholder='请输入商家账号' v-model='form.business_offline_account'></el-input>
      </el-form-item>
      <el-form-item label='选择分类' prop='goods_activity_category_id'>
        <el-select v-model='form.goods_activity_category_id' placeholder="请选择">
          <el-option
            v-for='item in businesscategories'
            :label="item.name"
            :value="item.goods_activity_category_id + ''"
            :key="item.goods_activity_category_id"
            v-if='item.offline_type_od == 2'>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='是否显示' prop='status'>
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
      <el-form-item label='标签' prop='label'>
        <el-input v-model="form.label" placeholder='填写标签' :maxlength='10'></el-input>
      </el-form-item>
      <el-form-item label='顺序'>
        <el-input v-model="form.sort" placeholder='填写数字，不填默认99' :maxlength='10'></el-input>
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
          business_offline_account: '',
          goods_activity_category_id: '',
          label: '',
          sort: '',
          status: ''
        },
        businesscategories: [],
        rules: {
          business_offline_account: [{ required: true, message: '请输入', trigger: 'blur' }],
          goods_activity_category_id: [{ required: true, message: '请输入', trigger: 'blur' }],
          label: [{ required: true, message: '请输入', trigger: 'blur' }],
          status: [{ required: true, message: '请输入', trigger: 'blur' }]
        }
      }
    },
    created () {
      this.$axios({
        type: 'post',
        url: '/goods/activitycategorygetlist',
        data: {parent_id: this.$route.query.goods_activity_category_id, type: 4, is_fixed_od: 0},
        fuc: (res) => {
          this.businesscategories = res.data
        }
      })
      if (this.$route.query.goods_activity_business_id) {
        this.$axios({
          type: 'post',
          url: '/goods/activitybusinessgetdetailed',
          data: {goods_activity_business_id: this.$route.query.goods_activity_business_id},
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
              this.form.goods_activity_business_id = res.data.goods_activity_business_id
            }
          }
        })
      }
    },
    methods: {
      submit () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$axios({
              type: 'post',
              url: this.$route.query.goods_activity_business_id ? '/goods/activitybusinessedit' : '/goods/activitybusinessadd',
              data: this.form,
              fuc: (res) => {
                if (res.code == 200) {
                  this.$message.success('操作成功')
                  this.$deleteOneTag('/interConfig/indexManage/indexOperatingBusinessList',  {goods_activity_category_id: this.$route.query.goods_activity_category_id})
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