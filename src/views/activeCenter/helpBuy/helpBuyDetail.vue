<template>
  <div class="tombacDetail">
    <el-form ref="form" :model="form" label-width="200px" :rules='rules'>
      <el-form-item label="活动名称" prop='name' v-if="!id">
        <el-input v-model="form.name" placeholder='请输入活动名称' :maxlength='20'></el-input>
      </el-form-item>
      <el-form-item label="备注" prop='note' v-if="!id">
        <el-input type="textarea" v-model="form.note" placeholder='请输入备注' :maxlength='20'></el-input>
      </el-form-item>
      <el-form-item label="发起者最多发起次数" prop='maxCreateTimesByDay'>
        <el-input v-model="form.maxCreateTimesByDay" placeholder=' 每日用户可发起次数' :maxlength='20'></el-input>
      </el-form-item>
      <el-form-item label="参与者者最多参与次数" prop='maxJoinTimesByDay'>
        <el-input v-model="form.maxJoinTimesByDay" placeholder='每日用户最多参与次数' :maxlength='20'></el-input>
      </el-form-item>
      <el-form-item label="分钟数" prop='time'>
        <el-input v-model="form.time" placeholder=' 活动持续时间' :maxlength='20'></el-input>
      </el-form-item>
      <el-form-item label="活动发放金贝数" prop='goldCount' v-if="!id">
        <el-input v-model="form.goldCount" placeholder='活动金贝库' :maxlength='20'></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click='saveTombac'>保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        id: '',
        form: {
          time: "",
          name: "",
          note: "",
          maxCreateTimesByDay: "",
          maxJoinTimesByDay: "",
          goldCount: ""
        },
        rules: {
          time: [{ required: true, message: '请输入', trigger: 'blur' }],
          name: [{ required: true, message: '请输入', trigger: 'blur' }],
          note: [{ required: true, message: '请输入', trigger: 'blur' }],
          maxCreateTimesByDay: [{ required: true, message: '请输入', trigger: 'blur' }],
          maxJoinTimesByDay: [{ required: true, message: '请输入', trigger: 'blur' }],
          goldCount: [{ required: true, message: '请输入', trigger: 'blur' }]
        }
      }
    },
    created () {
      if (this.$route.query.id) {
        this.id = this.$route.query.id
        this.$axios({
          type: 'get',
          url: '/bhs-management-admin/active/helpbuy/getHelpBuyBaseInfo',
          data: {id: this.$route.query.id},
          fuc: (res) => {
            if (res.code == 1) {
              for (let val in this.form) {
                this.form[val] = res.data[val]
              }
              this.form.id = res.data.id
            }
          }
        })
      }
    },
    methods: {
      saveTombac () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$axios({
              type: 'post',
              url: this.id ? '/bhs-management-admin/active/helpbuy/updateHelpByBaseInfo' : '/bhs-management-admin/active/helpbuy/addHelpbuy',
              data: this.form,
              fuc: (result) => {
                if (result.code == 1) {
                  this.$message.success('操作成功')
                  this.$deleteOneTag('/activeCenter/helpBuyList')
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
  .tombacDetail form .el-textarea{
    width: 300px;
  }
  .tombacDetail form pre{
    width: 100%;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
</style>
