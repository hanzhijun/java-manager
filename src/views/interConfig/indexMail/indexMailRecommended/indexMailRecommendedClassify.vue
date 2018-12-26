<template>
  <div class="indexRecommendedClassify">
    <el-form ref="form" :model="form" label-width="120px" :rules='rules'>
      <el-form-item label='分类名称' prop='name'>
        <el-input placeholder='请输入分类名称' v-model='form.name'></el-input>
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
          name: ''
        },
        rules: {
          name: [{ required: true, message: '请输入', trigger: 'blur' }]
        }
      }
    },
    created () {
      this.$axios({
        type: 'post',
        url: '/goods/activitycategorygetdetailed',
        data: {goods_activity_category_id: this.$route.query.goods_activity_category_id, type: 4},
        fuc: (res) => {
          this.form.name = res.data.name
        }
      })
    },
    methods: {
      submit () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$axios({
              type: 'post',
              url: '/goods/activitycategoryedit',
              data: {goods_activity_category_id: this.$route.query.goods_activity_category_id, type: 4, parent_id: 2, ...this.form},
              fuc: (res) => {
                if (res.code == 200) {
                  this.$message.success('操作成功')
                  this.$deleteOneTag('/interConfig/indexMail/indexMailRecommendedClassifyList')
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
  .indexRecommendedClassify{
    margin: 10px 20px 0;
    overflow: hidden;
  }
  .indexRecommendedClassify>.el-form .el-input{
    max-width: 400px;
  }
  .indexRecommendedClassify>.el-form .el-textarea{
    max-width: 400px;
  }
</style>