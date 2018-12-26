<template>
  <div class="indexSlideshowDetail">
    <el-form ref="form" :model="form" label-width="120px" :rules='rules'>
      <el-form-item label='商品编码' prop='goodsCode'>
        <el-input placeholder='请输入商品编码' v-model='form.goodsCode' :disabled="editBool"></el-input>
        <el-button @click='codeSure' :disabled='editBool'>确认</el-button>
      </el-form-item>
      <el-form-item label='统一填充' class='allFormClass' v-if="businessSureBool">
        <el-input v-model.number="ulForm.paySuccessCount" placeholder='直接反贝数'></el-input>
        <el-input v-model.number="ulForm.allSuccessCount" placeholder='间接反贝数'></el-input>
        <el-input v-model="ulForm.userJoinNumber" placeholder='参与人数'></el-input>
        <el-input v-model="ulForm.goldJoinAllCount" placeholder='推广金贝数'></el-input>
        <el-button @click='giveUlForm'>确认</el-button>
      </el-form-item>
      <el-form-item label='商品规格' class='ulFormItem' required v-if="businessSureBool">
        <ul class="specUl">
          <li v-for='list in form.skuConfigurationVoList'>
            <span>{{list.skuSpec.split(',')[0]}}</span>
            <ul>
              <li>
                <span>{{list.skuSpec.split(',')[1]}}</span>
                <ul class="tableForm">
                  <li>
                    <el-form-item label='直接反贝数' required>
                      <el-input v-model.number="list.paySuccessCount" placeholder='请输入直接反贝数'></el-input>
                    </el-form-item>
                  </li>
                  <li>
                    <el-form-item label='间接反贝数' required>
                      <el-input v-model.number="list.allSuccessCount" placeholder='请输入间接反贝数'></el-input>
                    </el-form-item>
                  </li>
                  <li>
                    <el-form-item label='参与人数' required>
                      <el-input v-model="list.userJoinNumber" placeholder='请输入参与人数'></el-input>
                    </el-form-item>
                  </li>
                  <li>
                    <el-form-item label='推广金贝数' required>
                      <el-input v-model="list.goldJoinAllCount" placeholder='请输入推广金贝数'></el-input>
                    </el-form-item>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </el-form-item>
      
      <el-form-item label='分享图片'>
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :before-upload="beforeAvatarUploadLogo">
          <img v-if="form.shareImages" :src="form.shareImages" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label='是否限购'>
        <el-radio v-model="radio" label="1">不限购</el-radio>
        <el-radio v-model="radio" label="2">限购</el-radio>
        <el-input v-model="form.maxBuyNumber" placeholder='请输入限购数量' :maxlength="3" @keyup.native="form.maxBuyNumber = $inputKeyUp($event)" @afterpaste.native="form.maxBuyNumber = $inputKeyUp($event)"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="save">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  
  export default {
    data () {
      return {
        radio: '1',
        form: {
          goodsCode: '',
          goodsId: '',
          shareImages: '',
          maxBuyNumber: '',
          skuConfigurationVoList: []
        },
        ulForm: {
          skuSpec: '',
          allSuccessCount: '',
          goldJoinAllCount: '',
          paySuccessCount: '',
          userJoinNumber: '',
          skuId: ''
        },
        editBool: false,
        businessSureBool: false,
        rules: {
          goodsCode: [{ required: true, message: '请输入', trigger: 'blur' }],
        }
        
      }
    },
    created () {
      this.form.hid = this.$route.query.id
      if (this.$route.query.goodsId) {
        this.$axios({
          type: 'get',
          url: '/bhs-management-admin/helpbuy/goods/getHelpbuyGoodsInfo',
          data: {hgId: this.$route.query.goodsId},
          fuc: (res) => {
            if (res.code == 1) {
              for (let val in this.form) {
                if (val == "skuConfigurationVoList") {
                  for (let value of res.data[val]) {
                    value.skuSpec = JSON.parse(value.skuSnapshot).skuSpec
                  }
                  this.form[val] = res.data[val]
                  continue
                }
                this.form[val] = res.data[val]
              }
              if (this.form.maxBuyNumber) {
                this.radio = '2'
              }
              this.form.id = this.$route.query.goodsId
//              this.form.hid = this.$route.query.hid
              this.businessSureBool = true
              this.editBool = true
            }
          }
        })
      }
    },
    methods: {
      codeSure () {
        if (this.form.goodsCode == '') {
          this.$message.warning('请先输入商品编码')
          return
        }
//        this.form.spec_info = []
        this.$axios({
          type: 'post',
          url: '/bhs-management-admin/goodsInfo/getByIdOrCode',
          data: {code: this.form.goodsCode, id: ''},
          fuc: (res) => {
            this.form.goodsId = res.data.id
            for (let val of res.data.skuVoList) {
              this.form.skuConfigurationVoList.push({
                skuSpec: val.skuSpec,
                allSuccessCount: '',
                goldJoinAllCount: '',
                paySuccessCount: '',
                userJoinNumber: '',
                skuId: val.id
              })
            }
            this.businessSureBool = true
            this.editBool = true
          }
        })
      },
      giveUlForm () {
        for (let index in this.ulForm) {
          if (this.ulForm[index] !== '') {
            for (let val of this.form.skuConfigurationVoList) {
              val[index] = this.ulForm[index]
            }
          }
        }
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
              this.form.shareImages = res.data
            }
          }
        }, 1)
        return false
      },
      save () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            for (let val of this.form.skuConfigurationVoList) {
              for (let key in val) {
                if (val[key] === '') {
                  this.$message.warning('规则每项为必填')
                  return false
                }
              }
            }
            let _form = JSON.parse(JSON.stringify(this.form))
            if (this.radio == 1) {
              _form.maxBuyNumber = ''
            } else {
              
            }
            this.$axios({
              type: 'post',
              url: '/bhs-management-admin/helpbuy/goods/addOrUpdateGoodsAndSkuConfiguration',
              data: _form,
              fuc: (res) => {
                console.log('res', res)
                this.dialogVisibleInput = false
                if (res.code == 1) {
                  this.$message.success('操作成功')
                  this.$deleteOneTag('/activeCenter/helpBuyGoodsList', {id: this.$route.query.id})
                }
              }
            })
          }
        })
        console.log(this.form)
      },
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
  .indexSlideshowDetail>.el-form .allFormClass .el-input{
    max-width: 100px;
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
  .tableForm>li{
    width: 220px;
    display: inline-block;
  }
</style>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 178px;
    height: 178px;
    display: table-cell;
    vertical-align: middle;
    background-color: #fbfdff;
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
  .avatar{
    width: 178px;
    height: 178px;
  }
</style>