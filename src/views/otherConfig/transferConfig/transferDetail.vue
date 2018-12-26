<template>
  <div class="tombacDetail">
    <el-form ref="form" :model="form" label-width="300px" :rules='rules'>
      <code>分账延时设置（分钟）</code>
      <el-form-item label="线上分账延迟分钟数" prop='online_time'>
        <el-input v-model="form.online_time" placeholder='请输入' :maxlength='20'></el-input>
      </el-form-item>
      <el-form-item label="线下支付分账延迟分钟数" prop='offline_time'>
        <el-input v-model="form.offline_time" placeholder='请输入' :maxlength='20'></el-input>
      </el-form-item>
      <el-form-item label="代金券及服务分账延迟分钟数" prop='package_time'>
        <el-input v-model="form.package_time" placeholder='请输入' :maxlength='20'></el-input>
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
          online_time: '',
          offline_time: '',
          package_time: ''
        },
        rules: {
          online_time: [{ required: true, message: '请输入', trigger: 'blur' }],
          offline_time: [{ required: true, message: '请输入', trigger: 'blur' }],
          package_time: [{ required: true, message: '请输入', trigger: 'blur' }]
        }
      }
    },
    created () {
      this.$axios({
        type: 'post',
        url: '/System/gettransfer',
        data: {},
        fuc: (res) => {
          for (let k in this.form) {
            for (let val of res.data) {
              if (val.name === k) {
                this.form[k] = val.value
              }
            }
          }
        }
      })
    },
    methods: {
      submit () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$axios({
              type: 'post',
              url: '/System/settransfer',
              data: this.form,
              fuc: (res) => {
                if (res.code == 200) {
                  this.$message.success('编辑成功')
                }
              }
            })
          }
        })
      }
    }
  }
</script>

<style scoped="true">
  .tombacDetail{
    margin: 10px 20px 0;
    overflow: hidden;
  }
  .tombacDetail form{
    margin: 20px;
  }
  .tombacDetail form .el-input{
    width: 200px;
  }
  .tombacDetail form pre{
    width: 100%;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
</style>