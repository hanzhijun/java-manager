<template>
  <div class="goodsPackagesDetail">

    <el-form ref="form" :model="form" label-width="150px" :rules='rules'>
      <code>基本信息</code>
      <el-form-item label='代金券名称' prop='name'>
        <el-input v-model="form.name" placeholder='请输入代金券名称' :maxlength='50'></el-input>
      </el-form-item>
      <el-form-item label='代金券标签'>
        <el-input v-model="form.couponLabel" placeholder='请输入代金券标签' :maxlength='30'></el-input>
      </el-form-item>
      <el-form-item label='结算方式' prop='tradeSettlement'>
        <el-radio v-model="form.tradeSettlement" :label="1">价格结算</el-radio>
        <el-radio v-model="form.tradeSettlement" :label="2">比例结算</el-radio>
      </el-form-item>
      <el-form-item label='代金券结算价' prop='price' v-if='form.tradeSettlement == 1'>
        <el-input v-model="form.price" placeholder='请输入代金券结算价' :maxlength='20'></el-input>
      </el-form-item>
      <el-form-item label='代金券结算比例' v-else-if='form.tradeSettlement == 2'>
        <el-input v-model="form.ratio" placeholder='请输入代金券结算比例' :maxlength='20' @keyup.native="form.ratio = $inputKeyUp($event)" @afterpaste.native="form.ratio = $inputKeyUp($event)"></el-input>
      </el-form-item>
      <el-form-item label='代金券售价' prop='salesPrice'>
        <el-input v-model="form.salesPrice" placeholder='请输入代金券售价'></el-input>
      </el-form-item>
      <el-form-item label='可用时间'>
        <el-input type='textarea' v-model="form.useDay" placeholder='不填则默认周一至周日'></el-input>
      </el-form-item>
      <el-form-item label='购买截至时间' prop='buyEndTime'>
        <el-date-picker
          v-model="form.buyEndTime"
          type="date" :picker-options="pickerOptions0" @change='expire_timeChange'
          placeholder="选择日期" value-format="timestamp">
        </el-date-picker>
      </el-form-item>
      <el-form-item label='使用截至时间' prop='useEndTime'>
        <el-date-picker
          v-model="form.useEndTime"
          type="date" :picker-options="pickerOptions1"
          placeholder="选择日期" value-format="timestamp">
        </el-date-picker>
      </el-form-item>
      <el-form-item label='库存' prop='stock'>
        <el-input v-model="form.stock" placeholder='请输入服务库存'></el-input>
      </el-form-item>
      <el-form-item label='温馨提示' prop='description'>
<!--        <el-input type='textarea' v-model="form.description" :maxlength='500' placeholder='请输入温馨提示'></el-input>-->

        <div ref="editor" style="text-align:left;max-width: 400px;"></div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">保存并上架</el-button>
        <el-button v-if='status == 1' type="primary" @click="dialogVisibleInput = true">下架</el-button>
      </el-form-item>
    </el-form>
    
    <el-dialog
      title="提示"
      :visible.sync="dialogVisibleInput"
      width="30%">
      <el-input type='textarea' v-model='reject_reason' placeholder='请务必填写驳回不通过的理由'></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleInput = false">取 消</el-button>
        <el-button type="primary" @click="refuse">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import E from 'wangeditor'
  export default {
    data () {
      return {
        status: '',
        reject_reason: '',
        dialogVisibleInput: false,
        editor: '',
        form: {
          name: '',
          couponLabel: '',
          tradeSettlement: '',
          price: '',
          ratio: '',
          salesPrice: '',
          useDay: '',
          buyEndTime: '',
          useEndTime: '',
          stock: '',
          description: ''
        },
        rules: {
          name: [{ required: true, message: '请输入代金券名称', trigger: 'blur' }],
          tradeSettlement: [{ required: true, message: '请选择结算方式', trigger: 'blur' }],
          price: [{ required: true, message: '请输入结算价', trigger: 'blur' }],
          ratio: [{ required: true, message: '请输入结算比例', trigger: 'blur' }],
          salesPrice: [{ required: true, message: '请输入售价', trigger: 'blur' }],
          buyEndTime: [{ required: true, message: '请选择日期', trigger: 'blur' }],
          useEndTime: [{ required: true, message: '请选择日期', trigger: 'blur' }],
          stock: [{ required: true, message: '请输入库存', trigger: 'blur' }],
          description: [{ required: true, message: '请输入温馨提示', trigger: 'blur' }]
        },
        pickerOptions0: {
          disabledDate(time) {
            return time < Date.now() - 3600 * 1000 * 24;
          }
        },
        pickerOptions1: {
          disabledDate: (time) => {
            if (this.form.buyEndTime) {
              return time < this.form.buyEndTime
            }
            return time < Date.now() - 3600 * 1000 * 24
          }
        }
      }
    },
    mounted () {
      let editor = this.editor = new E(this.$refs.editor)
      editor.customConfig.onchange = (html) => {
        this.form.description = html
      }
      editor.customConfig.zIndex = 10
      editor.customConfig.menus = [
        'fontSize',
        'bold',
        'italic',
        '|',
        'foreColor',  // 文字颜色
        'backColor',  // 背景颜色
        'undo'
      ]
      editor.create()
    },
    created () {
      if (this.$route.query.id) {
        this.$axios({
          type: 'get',
          url: '/bhs-management-admin/specialGoods/' + this.$route.query.id,
          data: {bizType: 1},
          fuc: (res) => {
            for (let k in this.form) {
              this.form[k] = res.data[k]
            }
            this.form.id = res.data.id
            this.status = res.data.status
            this.form.businessName = res.data.businessName
            console.log(this.form)
            this.editor.txt.html(this.form.description)
          }
        })
      }
    },
    methods: {
      expire_timeChange () {
        this.form.useEndTime = ""
      },
      refuse () {
        if (this.reject_reason == '') {
          this.$message.warning('请务必填写驳回理由')
          return false
        }
        this.$axios({
          type: 'put',
          url: '/bhs-management-admin/specialGoods/upDown',
          data: {bizType: 1, remarks: this.reject_reason, ...this.form},
          fuc: (res) => {
            if (res.code == 1) {
              this.$message.success('操作成功')
              this.$deleteOneTag('/business/unlineBusinessVouchersList', {business_id: this.$route.query.business_id})
            }
          }
        })
      },
      submit () {
        console.log(this.form)
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let _form = JSON.parse(JSON.stringify(this.form))
            this.$axios({
              type: this.$route.query.id ? 'put' : 'post',
              url: '/bhs-management-admin/specialGoods',
              data: {bizType: 1, businessId: this.$route.query.business_id, ..._form},
              fuc: (res) => {
                console.log('res', res)
                if (res.code == 1) {
                  this.$message.success('操作成功')
                  this.$deleteOneTag('/business/unlineBusinessVouchersList', {business_id: this.$route.query.business_id})
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
  .goodsPackagesDetail{
    margin: 10px 20px 0;
    overflow: hidden;
  }
  .goodsPackagesDetail>.el-form .el-input{
    max-width: 400px;
  }
  .goodsPackagesDetail>.el-form .el-textarea{
    max-width: 400px;
  }
</style>
