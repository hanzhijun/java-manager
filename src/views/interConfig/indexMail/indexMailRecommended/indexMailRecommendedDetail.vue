<template>
  <div class="indexSlideshowDetail">
    <el-form ref="form" :model="form" label-width="120px" :rules='rules'>
      <el-form-item label='商品编码' prop='goods_no'>
        <el-input placeholder='请输入商品编码' v-model='form.goods_no' :disabled="editBool"></el-input>
        <el-button @click='goods_noSure' :disabled='editBool'>确认</el-button>
      </el-form-item>
      <el-form-item label='选择分类' prop='goods_activity_category_id' v-if='businessSureBool && categoryBool'>
        <el-select v-model='form.goods_activity_category_id' placeholder="请选择">
          <el-option
            v-for='item in businesscategories'
            :label="item.name"
            :value="item.goods_activity_category_id"
            :key="item.goods_activity_category_id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='是否显示' prop='status' v-if='businessSureBool'>
        <el-select v-model='form.status' placeholder="请选择" clearable>
          <el-option
            label="显示"
            value="1">
          </el-option>
          <el-option
            label="不显示"
            value="-1">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='顺序' v-if='businessSureBool'>
        <el-input v-model="form.sort" placeholder='填写数字，不填默认99' :maxlength='10'></el-input>
      </el-form-item>
      <el-form-item label='支付方式' prop='payment' v-if='businessSureBool'>
        <el-select v-model='form.payment' placeholder="不选则默认本来的支付方式" clearable>
          <el-option
            label="金贝+现金"
            value="1">
          </el-option>
          <el-option
            label="金贝+铜贝"
            value="2">
          </el-option>
          <el-option
            label="银贝"
            value="3">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='商品规格' class='ulFormItem' required v-if='form.payment == 1 || form.payment == 3'>
        <ul class="specUl">
          <li v-for='list in form.spec_info'>
            <span>{{list.attrs.first}}</span>
            <ul>
              <li>
                <span>{{list.attrs.second}}</span>
                <ul class="tableForm">
                  <li>
                    <el-form-item label='商品活动售价' required>
                      <el-input v-model="list.price" placeholder='请输入商品进价' :maxlength='20'></el-input>
                    </el-form-item>
                  </li>
                  <li>
                    <el-form-item label='商品活动库存' required>
                      <el-input v-model="list.num" placeholder='请输入商品库存' :maxlength='20'></el-input>
                    </el-form-item>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </el-form-item>
      <el-form-item label='商品规格' class='ulFormItem' required v-if='form.payment == 2'>
        <ul class="specUl">
          <li v-for='list in form.spec_info'>
            <span>{{list.attrs.first}}</span>
            <ul>
              <li>
                <span>{{list.attrs.second}}</span>
                <ul class="tableForm">
                  <li>
                    <el-form-item label='商品活动金贝' required>
                      <el-input v-model="list.gold_price" placeholder='请输入商品进价' :maxlength='20'></el-input>
                    </el-form-item>
                  </li>
                  <li>
                    <el-form-item label='商品活动铜贝' required>
                      <el-input v-model="list.copper_price" placeholder='请输入商品进价' :maxlength='20'></el-input>
                    </el-form-item>
                  </li>
                  <li>
                    <el-form-item label='商品活动库存' required>
                      <el-input v-model="list.num" placeholder='请输入商品库存' :maxlength='20'></el-input>
                    </el-form-item>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </el-form-item>
      <el-form-item>
        <el-button @click='submit'>保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        form: {
          payment: '',
          status: '',
          sort: '',
          goods_no: '',
          goods_activity_category_id: '',
          spec_info: []
        },
        businessSureBool: false,
        editBool: false,
        categoryBool: true,
        businesscategories: [],
        rules: {
          payment: [{ required: true, message: '请选择', trigger: 'blur' }],
          status: [{ required: true, message: '请选择', trigger: 'blur' }],
          sort: [{ required: true, message: '请输入', trigger: 'blur' }],
          goods_no: [{ required: true, message: '请输入', trigger: 'blur' }],
          goods_activity_category_id: [{ required: true, message: '请选择', trigger: 'blur' }]
        }
      }
    },
    created () {
      this.$axios({
        type: 'post',
        url: '/goods/activitycategorygetlist',
        data: {parent_id: this.$route.query.goods_activity_category_id, type: 4, offline_type_od: 1},
        fuc: (res) => {
          this.businesscategories = res.data
          if (res.data.length == 0) {
            this.form.goods_activity_category_id = this.$route.query.goods_activity_category_id
            this.categoryBool = false
          } else {
            this.categoryBool = true
          }
        }
      })
      if (this.$route.query.goods_activity_id) {
        this.editBool = true
        this.$axios({
          type: 'post',
          url: '/goods/activitygoodsgetdetailed',
          data: {goods_activity_id: this.$route.query.goods_activity_id},
          fuc: (res) => {
            console.log(1, res)
            for (let val in res.data) {
              if (val != 'spec_info') {
                this.form[val] = res.data[val] + ''
              } else {
                let arr = []
                for (let val of res.data.spec_info) {
                  let obj = {
                    "attrs": {"first" : val.first_attr_value,"second" : val.second_attr_value},
                    ...val
                  }
                  obj.cost_price = parseInt(val.cost_price) / 100
                  obj.sale_price = parseInt(val.sale_price) / 100
                  if (res.data.payment == 1) {
                    obj.price = parseFloat(val.price) / 100
                  }
                  arr.push(obj)
                }
                this.form.spec_info = arr
              }
            }
            this.businessSureBool = true
            this.form.goods_activity_id = this.$route.query.goods_activity_id
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
        this.form.spec_info = []
        this.$axios({
          type: 'post',
          url: '/goods/activitygoodsgetspec',
          data: {goods_no: this.form.goods_no},
          fuc: (res) => {
            this.form.payment = res.data.payment + ''
            for (let val of res.data.spec_info) {
              this.form.spec_info.push({
                spec_id: val.spec_id,
                attrs: {first: val.first_attr_value, second: val.second_attr_value},
                price: '',
                num: '',
                gold_price: '',
                copper_price: ''
              })
            }
            this.businessSureBool = true
          }
        })
      },
      submit () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            for (let val of this.form.spec_info) {
              for (let key in val) {
                if (this.form.payment == 2) {
                  if ((key == 'gold_price' || key == 'copper_price') && val[key] == '') {
                    this.$message.warning('规则每项必填，请认真填写')
                    return
                  }  
                } else {
                  if (key == 'price' && val[key] == '') {
                    this.$message.warning('规则每项必填，请认真填写')
                    return
                  }
                }
              }
            }
            this.$axios({
              type: 'post',
              url: this.$route.query.goods_activity_id ? '/goods/activitygoodsedit' : '/goods/activitygoodsadd',
              data: this.form,
              fuc: (res) => {
                if (res.code == 200) {
                  this.$message.success('操作成功')
                  this.$deleteOneTag('/interConfig/indexMail/indexMailRecommendedList',  {goods_activity_category_id: this.$route.query.goods_activity_category_id})
                }
              }
            })
          }
        })
      }
    }
  }
</script>

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
<style scoped="true">
  .indexSlideshowDetail{
    margin: 10px 20px 0;
    overflow: hidden;
  }
  
  .ulFormItem ul{
    display: inline-block;
    list-style: none;
    padding: 0;
  }
  .ulFormItem>div>ul>li{
    margin: 6px 0;
    display: block;
    overflow: hidden
  }
  .specUl{
    width: 100%;
    overflow: hidden;
    background-color: #f5f7fa;
  }
  .specUl>li>span{
    display: inline-block;
    float: left;
    width: 80px;
    text-align: center;
  }
  .specUl>li>ul{
    width: calc(100% - 80px);
    float: left;
  }
  .tableForm>li{
    width: 220px;
    display: inline-block;
  }
  .indexSlideshowDetail>.el-form .el-input{
    max-width: 400px;
  }
  .indexSlideshowDetail>.el-form .el-textarea{
    max-width: 400px;
  }
</style>