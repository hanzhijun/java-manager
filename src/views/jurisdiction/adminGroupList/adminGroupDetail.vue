<template>
  <div class="adminGroupDetail">
    <el-form ref="form" :model="form" label-width="120px" :rules='rules'>
      <el-form-item label="管理组中文名称" prop='title'>
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        form: {
          title: '',
          status: '1'
        },
        rules: {
          title: [{ required: true, message: '请填写名称', trigger: 'blur' }]
        }
      }
    },
    created () {
      if (this.$route.query.id) {
        this.$axios({
          type: 'get',
          url: '/Auth/returngroupbyid',
          data: {gid: this.$route.query.id},
          fuc: (res) => {
            this.form = res.data.group_info
          }
        })
      }
    },
    methods: {
      onSubmit () {
        if (this.form.id) {
          this.form.gid = this.form.id
        }
        this.$axios({
          type: 'post',
          url: this.form.id ? '/Auth/updategroupinfo' : '/Auth/addgroupinfo',
          data: this.form,
          fuc: (res) => {
            this.$deleteOneTag('/jurisdiction/adminGroupList')
//            this.getTableData()
          }
        })
//        this.$deleteOneTag('/jurisdiction/adminGroupList')
      }
    }
  }
</script>
<style scoped="true">
  .adminGroupDetail{
    margin: 10px 20px 0;
    overflow: hidden;
  }
  .adminGroupDetail>.el-form{
    width: 400px;
    margin: 20px;
  }
</style>