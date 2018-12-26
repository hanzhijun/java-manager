<template>
  <div class="goodsPackagesDetail">

    <el-form ref="form" :model="form" label-width="150px" :rules='rules'>
      <code>基本信息</code>
      <el-form-item label='服务名称' prop='name'>
        <el-input v-model="form.name" placeholder='请输入服务名称' :maxlength='50'></el-input>
      </el-form-item>
      <el-form-item label='服务标签'>
        <el-input v-model="form.serviceLabel" placeholder='请输入服务标签' :maxlength='30'></el-input>
      </el-form-item>
      <el-form-item label='结算方式' prop='settlementType'>
        <el-radio v-model="form.settlementType" :label="1">价格结算</el-radio>
        <el-radio v-model="form.settlementType" :label="2">比例结算</el-radio>
      </el-form-item>
      <el-form-item label='服务结算价' prop='price' v-if='form.settlementType === 1'>
        <el-input v-model="form.price" placeholder='请输入服务结算价' :maxlength='20'></el-input>
      </el-form-item>
      <el-form-item label='服务结算比例' v-else-if='form.settlementType === 2'>
        <el-input v-model="form.ratio" placeholder='请输入服务结算比例' :maxlength='20' @keyup.native="form.ratio = $inputKeyUp($event)" @afterpaste.native="form.ratio = $inputKeyUp($event)"></el-input>
      </el-form-item>
      <el-form-item label='售卖方式' prop='salesType'>
        <el-radio v-model="form.salesType" :label="1">现金</el-radio>
        <el-radio v-model="form.salesType" :label="2">金贝+铜贝</el-radio>
      </el-form-item>
      <el-form-item label='服务售价' required v-if='form.salesType === 1'>
        <el-input v-model="form.salesPrice.cash" placeholder='请输入服务售价'></el-input>
      </el-form-item>
      <el-form-item label='服务售价' required v-if='form.salesType === 2'>
        <el-input style="max-width: 360px;" v-model="form.salesPrice.gold" placeholder='请输入金贝'></el-input>金贝
      </el-form-item>
      <el-form-item label='' v-if='form.salesType === 2'>
        <el-input style="max-width: 360px;" v-model="form.salesPrice.copper" placeholder='请输入铜贝'></el-input>铜贝
      </el-form-item>
      <el-form-item label='购买截至时间' prop='buyEndTime'>
        <el-date-picker
          v-model="form.buyEndTime"
          type="date" :picker-options="pickerOptions0" @change='buyEndTimeChange'
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
      <el-form-item label='服务详情' prop='description'>
<!--        <el-input type='textarea' v-model="form.description" :maxlength='500' placeholder='请输入温馨提示'></el-input>-->

        <div ref="editor" style="text-align:left;max-width: 400px;"></div>
      </el-form-item>

      <code>服务相册</code>
      <el-form-item>
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :before-upload="beforeAvatarUploadLogo">
          <img v-if="form.img" :src="form.img" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <span>此处为服务列表和详情页展示轮播图（800*800）</span>
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
          serviceLabel: '',
          settlementType: '',
          salesType: '',
          price: '',
          ratio: '',
          salesPrice: {cash: '', gold: '', copper: ''},
          buyEndTime: '',
          useEndTime: '',
          stock: '',
          img: '',
          description: ''
        },
        rules: {
          name: [{ required: true, message: '请输入服务名称', trigger: 'blur' }],
          settlementType: [{ required: true, message: '请选择结算方式', trigger: 'blur' }],
          salesType: [{ required: true, message: '请选择售卖方式', trigger: 'blur' }],
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
              if (k === 'salesPrice') {
                this.form[k] = JSON.parse(res.data[k])
              } else {
                this.form[k] = res.data[k]
              }
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
      buyEndTimeChange () {
        this.form.useEndTime = ""
      },
      beforeAvatarUploadLogo (file) {
        let formData = new FormData()
        formData.append('file', file)
        formData.append('folder', "goods/pack")
        this.$axios({
          type: 'post',
          url: '/bhs-fileserver/file/uploadSingle',
          data: formData,
          fuc: (res) => {
            if (res.code == 1) {
              this.form.img = res.data
            }
          }
        }, 1)
        return false
      },
      refuse () {
        if (this.reject_reason == '') {
          this.$message.warning('请务必填写驳回理由')
          return false
        }
        let _form = JSON.parse(JSON.stringify(this.form))
        _form.salesPrice = JSON.stringify(_form.salesPrice)
        this.$axios({
          type: 'put',
          url: '/bhs-management-admin/specialGoods/upDown',
          data: {bizType: 1, remarks: this.reject_reason, ..._form},
          fuc: (res) => {
            if (res.code == 1) {
              this.$message.success('操作成功')
                  this.$deleteOneTag('/business/unlineBusinessPackagesList', {business_id: this.$route.query.business_id})
            }
          }
        })
      },
      submit () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let _form = JSON.parse(JSON.stringify(this.form))
            _form.salesPrice = JSON.stringify(_form.salesPrice)
            this.$axios({
              type: this.$route.query.id ? 'put' : 'post',
              url: '/bhs-management-admin/specialGoods',
              data: {bizType: 1, businessId: this.$route.query.business_id, ..._form},
              fuc: (res) => {
                console.log('res', res)
                if (res.code == 1) {
                  this.$message.success('操作成功')
                  this.$deleteOneTag('/business/unlineBusinessPackagesList', {business_id: this.$route.query.business_id})
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
