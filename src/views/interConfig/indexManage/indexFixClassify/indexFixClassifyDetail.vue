<template>
  <div class="indexIconClassifyDetail">
    <el-form ref="form" :model="form" label-width="120px" :rules='rules'>
      <el-form-item label='选择分类' prop='offline_type_od'>
        <el-select v-model='form.offline_type_od' placeholder="请选择">
          <el-option
            label="商品"
            :value="1">
          </el-option>
          <el-option
            label="商家"
            :value="2">
          </el-option>
          <el-option
            label="服务"
            :value="3">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='名称' prop='name'>
        <el-input v-model="form.name" placeholder='请输入url' :maxlength='40'></el-input>
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
          name: '',
          offline_type_od: ''
        },
        rules: {
          offline_type_od: [{ required: true, message: '请选择', trigger: 'blur' }],
          name: [{ required: true, message: '请输入', trigger: 'blur' }]
        }
      }
    },
    created () {
//      this.$qiyang()
      if (this.$route.query.goods_activity_category_id) {
        this.$axios({
          type: 'post',
          url: '/goods/activitycategorygetdetailed',
          data: {goods_activity_category_id: this.$route.query.goods_activity_category_id, type: this.$route.query.type},
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
              data: {parent_id: 1, type: 4, ..._form},
              fuc: (res) => {
                console.log('res', res)
                if (res.code == 200) {
                  this.$message.success('操作成功')
                  this.$deleteOneTag('/interConfig/indexManage/indexFixClassifyList')
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
