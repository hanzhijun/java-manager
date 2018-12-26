<template>
  <div class="indexIconClassifyDetail">
    <el-form ref="form" :model="form" label-width="120px" :rules='rules'>
      <el-form-item label='选择模板' prop='template_id'>
        <el-select v-model='form.template_id' placeholder="请选择">
          <el-option
            label="模版一"
            :value="1">
          </el-option>
          <el-option
            label="模版二"
            :value="2">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='名称' prop='name'>
        <el-input v-model="form.name" placeholder='请输入url' :maxlength='40'></el-input>
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
  export default {
    data () {
      return {
        form: {
          template_id: '1',
          name: '',
          remark: ''
        },
        rules: {
          template_id: [{ required: true, message: '请选择', trigger: 'blur' }],
          name: [{ required: true, message: '请输入', trigger: 'blur' }],
          goods_id: [{ required: true, message: '请填写', trigger: 'blur' }]
        }
      }
    },
    created () {
//      this.$qiyang()
      if (this.$route.query.goods_activity_category_id) {
        this.$axios({
          type: 'post',
          url: '/goods/activitycategorygetdetailed',
          data: {goods_activity_category_id: this.$route.query.goods_activity_category_id},
          fuc: (res) => {
            if (res.code == 200) {
              for (let val in this.form) {
                if (val == 'img') {
                  this.form.img = res.data.img_path + res.data.img
                } else if (res.data[val]) {
                  this.form[val] = res.data[val]
                }
              }
              this.form.goods_activity_category_id = res.data.goods_activity_category_id
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
            let _form = JSON.parse(JSON.stringify(this.form))
            this.$axios({
              type: 'post',
              url: this.$route.query.goods_activity_category_id ? '/goods/activitycategoryedit' : '/goods/activitycategoryadd',
              data: {parent_id: 4, type: 1, ..._form},
              fuc: (res) => {
                console.log('res', res)
                if (res.code == 200) {
                  this.$message.success('操作成功')
                  this.$deleteOneTag('/interConfig/silverMail/silverMailTopClassifyList')
                }
              }
            })
          }
        })
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