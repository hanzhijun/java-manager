<template>
  <div class="goodsPackagesDetail">

    <el-form ref="form" :model="form" label-width="150px" :rules='rules'>
      <code>基本信息</code>
      <el-form-item label='代金券名称' prop='package_name'>
        <el-input v-model="form.package_name" placeholder='请输入代金券名称' :maxlength='50'></el-input>
      </el-form-item>
      <el-form-item label='代金券标签'>
        <el-input v-model="form.package_tag" placeholder='请输入代金券标签' :maxlength='30'></el-input>
      </el-form-item>
      <el-form-item label='结算方式' prop='transfer_type'>
        <el-radio v-model="form.transfer_type" :label="0">价格结算</el-radio>
        <el-radio v-model="form.transfer_type" :label="1">比例结算</el-radio>
      </el-form-item>
      <el-form-item label='代金券结算价' prop='transfer_cash' v-if='form.transfer_type === 0'>
        <el-input v-model="form.transfer_cash" placeholder='请输入代金券结算价' :maxlength='20'></el-input>
      </el-form-item>
      <el-form-item label='代金券结算比例' v-else-if='form.transfer_type === 1'>
        <el-input v-model="form.transfer_ratio" placeholder='请输入代金券结算比例' :maxlength='20' @keyup.native="form.transfer_ratio = $inputKeyUp($event)" @afterpaste.native="form.transfer_ratio = $inputKeyUp($event)"></el-input>
      </el-form-item>
      <el-form-item label='代金券售价' prop='price'>
        <el-input v-model="form.price" placeholder='请输入代金券售价'></el-input>
      </el-form-item>
      <el-form-item label='可用时间'>
        <el-input type='textarea' v-model="form.enable_time" placeholder='不填则默认周一至周五'></el-input>
      </el-form-item>
      <el-form-item label='购买截至时间' prop='expire_time'>
        <el-date-picker
          v-model="form.expire_time"
          type="date" :picker-options="pickerOptions0" @change='expire_timeChange'
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label='使用截至时间' prop='use_time'>
        <el-date-picker
          v-model="form.use_time"
          type="date" :picker-options="pickerOptions1"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label='库存' prop='num'>
        <el-input v-model="form.num" placeholder='请输入服务库存'></el-input>
      </el-form-item>
      <el-form-item label='温馨提示' prop='package_desc'>
<!--        <el-input type='textarea' v-model="form.package_desc" :maxlength='500' placeholder='请输入温馨提示'></el-input>-->
<!--        <vue-wangeditor id="editor" v-model="package_desc" :menus="wangeditorMenu" @change='editorChange' :isRealtime='true'></vue-wangeditor>-->

      <div ref="editor" style="text-align:left;max-width: 400px;"></div>
      </el-form-item>
      <el-form-item>
        <el-button v-if='status === 0' type="primary" @click="submit(1)">保存,审核通过</el-button>
        <el-button v-if='status === 0' type="primary" @click="">驳回</el-button>
        <el-button v-if='status === 1' type="primary" @click="submit(1)">保存,修改成功</el-button>
        <el-button v-if='status === 1' type="primary" @click="offLine">下架</el-button>
        <el-button v-if='status === -2' type="primary" @click="submit(1)">保存并上架</el-button>
        <el-button v-if='status === -1' type="primary" @click="submit(1)">保存并上架</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
//  import vueWangeditor from 'vue-wangeditor'
  import E from 'wangeditor'
  export default {
    components: {
//      vueWangeditor
    },
    data () {
      return {
        editor: '',
        wangeditorMenu: [
          'bold',	// 粗体
          'fontsize',	// 字号
          'italic',	// 斜体
          '|',
          'undo',	// 撤销
        ], //编辑器菜单
        status: '', // 代金券状态
        form: {
          package_name: '',
          package_tag: '',
          transfer_type: '',
          transfer_cash: '',
          transfer_ratio: '',
          price: '',
          enable_time: '',
          expire_time: '',
          use_time: '',
          num: '',
          package_desc: ''
        },
        rules: {
          package_name: [{ required: true, message: '请输入代金券名称', trigger: 'blur' }],
          transfer_type: [{ required: true, message: '请选择结算方式', trigger: 'blur' }],
          transfer_cash: [{ required: true, message: '请输入结算价', trigger: 'blur' }],
          transfer_ratio: [{ required: true, message: '请输入结算比例', trigger: 'blur' }],
          price: [{ required: true, message: '请输入售价', trigger: 'blur' }],
          expire_time: [{ required: true, message: '请选择日期', trigger: 'blur' }],
          use_time: [{ required: true, message: '请选择日期', trigger: 'blur' }],
          num: [{ required: true, message: '请输入库存', trigger: 'blur' }],
          package_desc: [{ required: true, message: '请输入温馨提示', trigger: 'blur' }]
        },
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 3600 * 1000 * 24;
          }
        },
        pickerOptions1: {
          disabledDate: (time) => {
            if (this.form.expire_time) {
              return time.getTime() < this.form.expire_time.getTime()
            }
            return time.getTime() < Date.now() - 3600 * 1000 * 24
          }
        }
      }
    },
    mounted () {
      let editor = this.editor = new E(this.$refs.editor)
      editor.customConfig.onchange = (html) => {
        this.form.package_desc = html
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
      if (this.$route.query.package_id) {
        this.$axios({
          type: 'post',
          url: '/package/packagedetail',
          data: {package_id: this.$route.query.package_id},
          fuc: (res) => {
            for (let k in this.form) {
              if (k === 'price' || k === 'transfer_cash') {
                this.form[k] = res.data[k] / 100
              } else if (k !== 'expire_time' && k !== 'use_time') {
                this.form[k] = res.data[k]
              } else {
                this.form[k] = new Date(res.data[k] * 1000)
              }
            }
            this.form.package_id = res.data.package_id
            this.status = res.data.status
            console.log(this.form)
            this.editor.txt.html(this.form.package_desc)
          }
        })
      }
    },
    methods: {
      offLine () {
        this.$axios({
          type: 'post',
          url: '/package/offpackage',
          data: {package_id: this.form.package_id},
          fuc: (res) => {
            if (res.code == 200) {
              this.$message.success('操作成功')
              this.$deleteOneTag('/goods/goodsVouchersList')
            }
          }
        })
      },
      expire_timeChange () {
        this.form.use_time = ""
      },
      submit () {
        console.log(this.form)
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let _form = JSON.parse(JSON.stringify(this.form))
            _form.expire_time = new Date(_form.expire_time).getTime() / 1000
            _form.use_time = new Date(_form.use_time).getTime() / 1000
            this.$axios({
              type: 'post',
              url: this.$route.query.package_id ? '/package/packageedit' : '/package/packageinsert',
              data: {package_type: 2, status: 1, ..._form},
              fuc: (res) => {
                console.log('res', res)
                if (res.code == 200) {
                  this.$message.success('操作成功')
                  this.$deleteOneTag('/goods/goodsVouchersList')
                }
              }
            })
          }
        })
      },
//      editorChange () {
//        console.log(this.package_desc)
//      }
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
