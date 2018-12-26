<template>
  <div class="indexSlideshowDetail">
    <el-form ref="form" :model="form" label-width="120px" :rules='rules'>
      <el-form-item label='商品编码' prop='goods_no'>
        <el-input placeholder='请输入商品编码' v-model='form.goods_no' :disabled="editBool"></el-input>
        <el-button @click='goods_noSure' :disabled='editBool'>确认</el-button>
      </el-form-item>
      <el-form-item label='是否显示' prop='is_show' v-if='businessSureBool'>
        <el-select v-model='form.is_show' placeholder="请选择" clearable>
          <el-option
            label="显示"
            value="1">
          </el-option>
          <el-option
            label="不显示"
            value="0">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='所属栏目' prop='category_type' v-if='businessSureBool'>
        <el-select v-model='form.category_type' placeholder="请选择" clearable>
          <el-option
            v-for='item in brandArr'
            :label="item.label"
            :value="item.value"
            :key="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='支付方式' prop='' v-if='businessSureBool'>
        <span>金贝+现金</span>
      </el-form-item>
      <el-form-item>
        <el-button @click='submit' v-if='businessSureBool'>保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        form: {
          is_show: '',
          category_type: '',
          goods_no: ''
        },
        brandArr: [{
          value: '0', label: '首页'
        },{
          value: '1', label: '美妆'
        },{
          value: '2', label: '食品'
        },{
          value: '3', label: '酒类'
        },{
          value: '4', label: '家居'
        }],
        businessSureBool: false,
        editBool: false,
        rules: {
          is_show: [{ required: true, message: '请选择', trigger: 'blur' }],
          category_type: [{ required: true, message: '请选择', trigger: 'blur' }],
          goods_no: [{ required: true, message: '请输入', trigger: 'blur' }]
        }
      }
    },
    created () {
      if (this.$route.query.active_goods_id) {
        this.editBool = true
        this.$axios({
          type: 'post',
          url: '/active/getdetailedgoods',
          data: {active_goods_id: this.$route.query.active_goods_id},
          fuc: (res) => {
            for (let val in this.form) {
              if (val != 'spec_info') {
                this.form[val] = res.data[val] + ''
              } else {
                
              }
            }
            this.businessSureBool = true
            this.form.active_goods_id = this.$route.query.active_goods_id
            console.log(this.form)
          }
        })
      }
    },
    methods: {
      goods_noSure () {
        if (this.form.goods_no == '') {
          this.$message.warning('请先输入商品编码')
          return
        }
        this.$axios({
          type: 'post',
          url: '/active/checkgoodsno',
          data: {goods_no: this.form.goods_no},
          fuc: (res) => {
            this.businessSureBool = true
          }
        })
      },
      submit () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$axios({
              type: 'post',
              url: this.$route.query.active_goods_id ? '/active/editgoods' : '/active/addgoods',
              data: this.form,
              fuc: (res) => {
                if (res.code == 200) {
                  this.$message.success('操作成功')
                  this.$deleteOneTag('/activityManage/activityGoodsList')
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
  .indexSlideshowDetail{
    margin: 10px 20px 0;
    overflow: hidden;
  }
  .indexSlideshowDetail>.el-form .el-input{
    max-width: 400px;
  }
  .indexSlideshowDetail>.el-form .el-textarea{
    max-width: 400px;
  }
</style>