<template>
  <div class="tombacDetail">
    <el-form ref="form" :model="form" label-width="220px" :rules='rules'>
      <el-form-item label="" prop='sent'>
      </el-form-item>
      <el-form-item label="联盟内商家收入比例系数：" prop='alliance_business_income'>
        <el-input placeholder='联盟内商家收入比例系数' v-model='form.alliance_business_income'></el-input>%
      </el-form-item>
      <el-form-item label="联盟内商家额外提成比例系数：" prop='alliance_business_extra_amortization'>
        <el-input placeholder='联盟内商家收入比例系数' v-model='form.alliance_business_extra_amortization'></el-input>%
      </el-form-item>
      <el-form-item label="平台每单提成比例系数：" prop='terrace_per_amortization	'>
        <el-input placeholder='联盟内商家收入比例系数' v-model='form.terrace_per_amortization'></el-input>%
      </el-form-item>
      <el-form-item label="反银贝比例系数：" prop='return_silver_factor'>
        <el-input placeholder='联盟内商家收入比例系数' v-model='form.return_silver_factor'></el-input>%
      </el-form-item>
      <el-form-item label="是否允许金贝支付：" prop='is_use_balance'>
        <el-select v-model='form.is_use_balance' placeholder='请选择'>
          <el-option label='是' value='1'></el-option>
          <el-option label='否' value='0'></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否允许余额支付：" prop='is_use_gold'>
        <el-select v-model='form.is_use_gold' placeholder='请选择'>
          <el-option label='是' value='1'></el-option>
          <el-option label='否' value='0'></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click='saveTombac'>保存</el-button>
      </el-form-item>
      <el-form-item label="">
        <pre>1.商家每单收入=用户纯现金支出* 联盟内商家收入比例系数 
2.商家额外每单分成总数=用户纯现金支出*联盟商家额外提成比例系数
3.平台每单提成=用户纯现金支出*平台每单提成比例系数
4.用户反银贝数=用户纯现金收入*（1-联盟内商家比例系数-联盟内商家额外提成系数-平台每单提成比例系数）*反银贝比例系数
5.所有系数均为整数，前三个系数相加必须小于100</pre>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        form: {
          alliance_business_income: '',
          alliance_business_extra_amortization: '',
          terrace_per_amortization: '',
          return_silver_factor: '',
          is_use_balance: '',
          is_use_gold: ''
        },
        rules: {
          alliance_business_income: [{ required: true, message: '请输入', trigger: 'blur' }],
          alliance_business_extra_amortization: [{ required: true, message: '请输入', trigger: 'blur' }],
          terrace_per_amortization: [{ required: true, message: '请输入', trigger: 'blur' }],
          return_silver_factor: [{ required: true, message: '请输入', trigger: 'blur' }],
          is_use_balance: [{ required: true, message: '请选择', trigger: 'blur' }],
          is_use_gold: [{ required: true, message: '请选择', trigger: 'blur' }]
        }
      }
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        this.$axios({
          type: 'post',
          url: '/System/returnBusinessAlliance',
          data: {},
          fuc: (res) => {
            for (let val of res.data) {
              this.form[val.name] = val.value
            }
          }
        })
      },
      saveTombac () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let arr = []
            for (let val in this.form) {
              arr.push({name: val, value: this.form[val]})
            }
            this.$axios({
              type: 'post',
              url: '/System/setBusinessAlliance',
              data: this.form,
              fuc: (result) => {
                if (result.code == 200) {
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
    width: 100px;
  }
  .tombacDetail form pre{
    width: 100%;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
</style>
