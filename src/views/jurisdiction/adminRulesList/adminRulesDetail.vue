<template>
  <div class="adminRulesDetail">
    <el-form ref="form" :model="form" label-width="80px" :rules='rules'>
      <el-form-item label="模块名称" prop='module'>
        <el-input v-model="form.module"></el-input>
      </el-form-item>
      <el-form-item label="规则路径" prop='name'>
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="中文名称" prop='title'>
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="规则状态">
        <el-switch v-model="form.status"></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        form: {
          module: '',
          name: '',
          title: '',
          status: true,
        },
        rules: {
          module: [{ required: true, message: '请填写模块名称', trigger: 'blur' }],
          name: [{ required: true, message: '请填写规则路径', trigger: 'blur' }],
          title: [{ required: true, message: '请填写中文名称', trigger: 'blur' }],
        },
      }
    },
    methods: {
      isActive(route) {
        return route.path === this.$route.path || route.name === this.$route.name
      },
      onSubmit () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let _form = JSON.parse(JSON.stringify(this.form))
            _form.status = _form.status ? 1 : 0
            this.$axios({
              type: 'post',
              url: '/Auth/addrules',
              data: _form,
              fuc: (res) => {
                this.$deleteOneTag('/jurisdiction/adminRulesList')
              }
            })
          }
        })
      }
    }
  }
</script>
<style scoped="true">
  .adminRulesDetail{
    margin: 10px 20px 0;
    overflow: hidden;
  }
  .adminRulesDetail>.el-form{
    width: 400px;
    margin: 20px;
  }
</style>