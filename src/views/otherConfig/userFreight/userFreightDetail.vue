<template>
  <div class="goodsBrandsDetail">
    <el-form ref="form" :model="form" label-width="120px" :rules='rules'>
      <el-form-item label="名称" prop='name'>
        <el-input v-model="form.name" placeholder='请填写品牌名称'></el-input>
      </el-form-item>
      
      <el-form-item label="分类设置" prop='goodsCategoryList'>
        <div v-for='item in categoryArr' :key="item.id">
          <div>
            <el-checkbox :indeterminate="item.isIndeterminateCategory" v-model="item.checkAllCategory" @change="handleCheckAllChangeCategory(item)">{{item.name}}</el-checkbox>
          </div>
          <div style="margin-left: 15px">
            <el-checkbox-group v-model="item.value" @change="handleCheckedCitiesChangeCategory(item)">
              <el-checkbox v-for="val in item.children" :label="val.id" :key="val.id">{{val.name}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </el-form-item>
      
      <el-form-item label="地区设置" prop='provinceList'>
        <el-checkbox-group v-model="form.provinceList" @change="handleCheckedCitiesChangeProvince">
          <el-checkbox v-for="item in area_json" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
        </el-checkbox-group>
        <el-checkbox :indeterminate="isIndeterminateProvince" v-model="checkAllProvince" @change="handleCheckAllChangeProvince">全选</el-checkbox>
      </el-form-item>
      <el-form-item label="计费规则">
        <el-radio v-model="form.type" :label="1">
          <div v-for="(item, index) in form.freightLimitPriceList" :key="index">
            不满<el-input v-model="item.end" placeholder='请填写'></el-input>元，运费
            <el-input v-model="item.price" placeholder='请填写'></el-input>元
          </div>
        </el-radio>
        <el-radio v-model="form.type" :label="2">
          固定运费<el-input v-model="form.fixedPrice.cash" placeholder='请填写'></el-input>元
        </el-radio>
        
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import area from '@/area.json'
  export default {
    data () {
      return {
        isIndeterminateProvince: true,
        checkAllProvince: false,
        area_json: [],
        cityOptions: [],
        
        categoryList: [],
        categoryArr: [],
        
        form: {
          type: 1,
          fixedPrice: {
            cash: '',
            copper: '',
            gold: '',
            silver: ''
          },
          freightLimitPriceList: [{
            start: 0,
            end: '',
            price: ''
          }],
          name: '',
          goodsCategoryList: [],
          provinceList: []
        },
        rules: {
          name: [{ required: true, message: '请填写名称', trigger: 'blur' }],
          goodsCategoryList: [{ required: true, message: '请选择商品分类', trigger: 'blur' }],
          provinceList: [{ required: true, message: '请选择地区', trigger: 'blur' }]
        },
      }
    },
    created () {
      this.area_json = area.area_json
      for (let val of this.area_json) {
        this.cityOptions.push(val.id)
      }
      
      this.$axios({
          type: 'post',
          url: '/bhs-management-admin/category/treeList',
          data: {onoffFlag: 1},
          fuc: (res) => {
            this.categoryList = res.data
            
            // 实验
            for (let i of this.categoryList) {
              this.categoryArr.push({name: i.name, id: i.id, children: i.childrenList, value: [], isIndeterminateCategory: true, checkAllCategory: false})
            }
            
            if (this.$route.query.id) {
              this.$axios({
                type: 'get',
                url: '/bhs-management-admin/userFreight/' + this.$route.query.id,
                data: {},
                fuc: (res2) => {
                  for (let val in this.form) {
                    if (val == 'freightLimitPriceList') {
                      this.form[val] = res2.data[val]
                      for (let value of this.form[val]) {
                        if (value.start) {
                          value.start = value.start / 100
                        }
                        if (value.end) {
                          value.end = value.end / 100
                        }
                        if (value.price) {
                          value.price = value.price / 100
                        }
                      }
                    } else if (val == "fixedPrice") {
                      this.form[val].cash = res2.data[val].cash ? res2.data[val].cash / 100 : ''
                    } else {
                      this.form[val] = res2.data[val]
                    }
                  }
                  for (let val of this.categoryArr) {
                    for (let val2 of this.form.goodsCategoryList) {
                      if (val.id == val2.firstGoodsCategory) {
                        val.value.push(val2.secondGoodsCategory)
                      }
                    }
                  }
                  this.form.id = this.$route.query.id
                }
              })
            }
            
          }
        })
      
    },
    mounted () {
//      if (this.form.goodsCategoryList.length > 0) {
//        for (let val of this.categoryArr) {
//          for (let val2 of this.form.goodsCategoryList) {
//            if (val.id == val2.firstGoodsCategory) {
//              val.value.push(val2.secondGoodsCategory)
//            }
//          }
//        }
//      }
    },
    methods: {
      handleCheckAllChangeProvince (val) {
        this.form.province = val ? this.cityOptions : []
        this.isIndeterminateProvince = false
      },
      handleCheckedCitiesChangeProvince(value) {
        let checkedCount = value.length
        this.checkAllProvince = checkedCount === this.area_json.length
        this.isIndeterminateProvince = checkedCount > 0 && checkedCount < this.area_json.length
      },
      
      handleCheckAllChangeCategory (item) {
        for (let val of this.categoryArr) {
          if (val.id == item.id) {
            val.isIndeterminateCategory = false
            if (item.value.length < item.children.length) {
              val.value = []
              for (let key of val.children) {
                val.value.push(key.id)
              }
            } else {
              val.value = []
            }
          }
        }
      },
      handleCheckedCitiesChangeCategory(item) {
        let checkedCount = item.value.length
        item.checkAllCategory = checkedCount === item.children.length
        item.isIndeterminateCategory = checkedCount > 0 && checkedCount < item.children.length
      },
      
      
      onSubmit () {
        this.form.goodsCategoryList = []
        for (let val of this.categoryArr) {
          for (let value of val.value) {
            this.form.goodsCategoryList.push({firstGoodsCategory: val.id, secondGoodsCategory: value})
          }
        }
        
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let _form = JSON.parse(JSON.stringify(this.form))
            for (let val of _form.freightLimitPriceList) {
              val.start = val.start * 100
              val.end = val.end * 100
              val.price = val.price * 100
            }
            _form.fixedPrice.cash = _form.fixedPrice.cash * 100
            this.$axios({
              type: _form.id ? 'put' : 'post',
              url: '/bhs-management-admin/userFreight',
              data: _form,
              fuc: (res) => {
                this.$deleteOneTag('/otherConfig/userFreightList')
              }
            })
          }
        })
      },
      beforeAvatarUploadLogo (file) {
        let formData = new FormData()
        formData.append('file', file)
        this.$axios({
          type: 'post',
          url: '/bhs-fileserver/file/uploadSingle',
          data: formData,
          fuc: (res) => {
            if (res.code == 1) {
              this.form.imgLogo = res.data
            }
          }
        }, 1)
        return false
      }
    }
  }
</script>
<style scoped="true">
  .goodsBrandsDetail{
    margin: 10px 20px 0;
    overflow: hidden;
  }
  .goodsBrandsDetail>.el-form{
    width: 400px;
    margin: 20px;
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