<template>
  <div class="adminDetail">
    <el-form ref="form" :model="form" label-width="80px" :rules='rules'>
      <el-form-item label="所属分组" prop='gid'>
        <el-select v-model="form.gid" placeholder="请选择">
          <el-option
            v-for="item in tableData"
            :key="item.id"
            :label="item.title"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="账户名称" prop='username'>
        <el-input v-model="form.username" :disabled='Boolean(form.id)'></el-input>
      </el-form-item>
      <el-form-item label="账户密码" v-if='Boolean(form.id)'>
        <el-input v-model="form.pwd"></el-input>
      </el-form-item>
      <el-form-item label="账户密码" prop="pwd" v-else>
        <el-input v-model="form.pwd"></el-input>
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
          gid: '',
          username: '',
          pwd: ''
        },
        rules: {
          username: [{ required: true, message: '请填写名称', trigger: 'blur' },{validator: this.checkUsername, trigger: 'blur'}],
          gid: [{ required: true, message: '请选择', trigger: 'change' }],
          pwd: [{ required: true, message: '请填写密码', trigger: 'blur' }],
        },
        tableData: []
      }
    },
    created () {
      this.$axios({
        type: 'post',
        url: '/Auth/grouplist',
        data: {type: 2},
        fuc: (res) => {
          this.tableData = res.data.list
        }
      })
      if (this.$route.query.id) {
        this.$axios({
          type: 'post',
          url: '/Auth/admininfobyId',
          data: {id: this.$route.query.id},
          fuc: (res) => {
            this.form.gid = res.data.admin_info.id
            this.form.uid = res.data.admin_info.uid
            this.form.username = res.data.admin_info.username
            this.form.id = this.$route.query.id
          }
        })
      }
    },
    methods: {
      checkUsername (rule, value, callback) {
        if (this.$route.query.id) {
          callback()
        } else {
          this.$axios({
            type: 'post',
            url: '/Auth/checkuserexist',
            data: {username: this.form.username},
            fuc: (res) => {
              console.log(5, res)
              if (res.code == 200) {
                callback()
              } else {
                callback(new Error(res.info))
              }
            }
          })
        }
      },
      onSubmit () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$axios({
              type: 'post',
              url: this.form.id ? '/Auth/updateadmininfo' : '/Auth/addadmininfo',
              data: this.form,
              fuc: (res) => {
                this.$deleteOneTag('/jurisdiction/adminList')
              }
            })
          }
        })
      }
    }
  }
</script>
<style scoped="true">
  .adminDetail{
    margin: 10px 20px 0;
    overflow: hidden;
  }
  .adminDetail>.el-form{
    width: 400px;
    margin: 20px;
  }
</style>