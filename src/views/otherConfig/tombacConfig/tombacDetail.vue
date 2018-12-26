<template>
  <div class="tombacDetail">
    <el-form ref="form" :model="form" label-width="200px" :rules='rules'>
      <el-form-item>
        <h3>点餐赠送</h3>
      </el-form-item>
      <el-form-item label="" prop='sent'>
        <p>消费<el-input v-model="form.sent" placeholder='请输入商家名称' :maxlength='20' :disabled='editBool'></el-input>元 积累1铜贝</p>
        <p>上线每日最多赠送500铜贝</p>
      </el-form-item>
      <el-form-item>
        <h3>下载登录</h3>
      </el-form-item>
      <el-form-item label="下载登录送铜贝" prop='first_login'>
        送<el-input v-model="form.first_login" placeholder='请输入商家名称' :maxlength='20' :disabled='editBool'></el-input>铜贝
      </el-form-item>
      <el-form-item>
        <h3>每日签到</h3>
      </el-form-item>
      <el-form-item label="首次签到送铜贝" prop='first_sign'>
        送<el-input v-model="form.first_sign" placeholder='请输入铜贝' :maxlength='20' :disabled='editBool'></el-input>铜贝
      </el-form-item>
      <el-form-item label="每天签到送铜贝" prop='days_sign'>
        送<el-input v-model="form.days_sign" placeholder='请输入铜贝' :maxlength='20' :disabled='editBool'></el-input>铜贝
      </el-form-item>
      <el-form-item label="7日累计签到送铜贝" prop='seven_sign'>
        送<el-input v-model="form.seven_sign" placeholder='请输入铜贝' :maxlength='20' :disabled='editBool'></el-input>铜贝
      </el-form-item>
      <el-form-item label="15日累计签到送铜贝" prop='fifteen_sign'>
        送<el-input v-model="form.fifteen_sign" placeholder='请输入铜贝' :maxlength='20' :disabled='editBool'></el-input>铜贝
      </el-form-item>
      <el-form-item label="28日累计签到送铜贝" prop='twenty_eight_sign'>
        送<el-input v-model="form.twenty_eight_sign" placeholder='请输入铜贝' :maxlength='20' :disabled='editBool'></el-input>铜贝
      </el-form-item>
      <el-form-item label="签到规则说明">
        <pre>每日签到可领取对应的签到奖励，首次签到赠送20铜贝，之后每日签到获赠10铜贝，当月累计签到7天、15天、30天、可获得系统额外奖励。
签到天数按自然月来计算，每个月第一天签到次数会从零开始累计
当连续签到中断后，则回到初始签到状态重新累计连续签到天数；
每天凌晨可进行当日签到;</pre>
      </el-form-item>
      <el-form-item label="铜贝规则说明">
        <pre>铜贝是用户参与线上活动、互动交流等行为给予的奖励。

怎么获取铜贝
• 线下点餐赠送
• 下载软件并登陆赠送
• 每日签到奖励

铜贝的使用规则
• 铜贝使用过程中不找零、不予单独使用、不兑现、不开发票，不可转移至其他账户，只能和金贝搭配使用。
• 使用铜贝进行商品兑换，兑换申请一经提交, 一律不能取消(除礼品缺货等特殊情况)。
• 如因贝划算商家缺货等原因导致的退货退款，则抵扣的铜贝将返还到会员账户，如因会员个人原因导致的退货退款，则不返还抵扣铜贝。
• 铜贝兑换礼品涉及运费由用户自行承担。
• 贝划算保留最终解释权。</pre>
      </el-form-item>
      <el-form-item>
        <el-button @click='editBool = false' v-if='editBool'>编辑</el-button>
        <el-button @click='saveTombac' v-if='!editBool'>保存</el-button>
        <el-button @click='cancleEdit' v-if='!editBool'>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        form: {
          sent: 0,
          first_login: 0,
          first_sign: 0,
          days_sign: 0,
          seven_sign: 0,
          fifteen_sign: 0,
          twenty_eight_sign: 0
        },
        rules: {
          sent: [{ required: true, message: '请输入铜贝', trigger: 'blur' }],
          first_login: [{ required: true, message: '请输入铜贝', trigger: 'blur' }],
          first_sign: [{ required: true, message: '请输入铜贝', trigger: 'blur' }],
          days_sign: [{ required: true, message: '请输入铜贝', trigger: 'blur' }],
          seven_sign: [{ required: true, message: '请输入铜贝', trigger: 'blur' }],
          fifteen_sign: [{ required: true, message: '请输入铜贝', trigger: 'blur' }],
          twenty_eight_sign: [{ required: true, message: '请输入铜贝', trigger: 'blur' }]
        },
        editBool: true
      }
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        this.$axios({
          type: 'post',
          url: '/currency/copperRuleList',
          data: {},
          fuc: (res) => {
            console.log(res)
            if (res.data.length < 1) {
              let arr = []
              for (let val in this.form) {
                arr.push({name: val, value: this.form[val]})
              }
              this.$axios({
                type: 'post',
                url: '/currency/copperRuleCreate',
                data: {copper_rule: JSON.stringify(arr)},
                fuc: (result) => {
                  console.log('result', result)
                }
              })
            } else {
              for (let val of res.data) {
                this.form[val.name] = val.value
              }
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
              url: '/currency/copperRuleUpdate',
              data: {copper_rule: JSON.stringify(arr)},
              fuc: (result) => {
                console.log('result', result)
                if (result.code == 200) {
                  this.$message.success('编辑成功')
                  this.editBool = true
                }
              }
            })
          }
        })
      },
      cancleEdit () {
        this.init()
        this.editBool = true
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
