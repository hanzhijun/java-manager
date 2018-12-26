<template>
  <div class="goodsDetail">
    <el-form ref="form" :model="form" label-width="120px" :rules='rules'>
      <el-form-item label='商品分类' prop='payTemplateId'>
        <el-select v-model='form.payTemplateId' placeholder="请选择">
          <el-option
            label="A类"
            :value="1">
          </el-option>
          <el-option
            label="B类"
            :value="2">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='商品类目' prop='categoryId'>
        <el-cascader
          expand-trigger="hover"
          :options="categoryArr"
          v-model="form.categoryId"
          @change="handleChange" :props="{label: 'name', value: 'id', children: 'childrenList'}">
        </el-cascader>
      </el-form-item>
      <el-form-item>
        <span>基本信息</span>
      </el-form-item>
      <el-form-item label='商品编号' prop='code'>
        <el-input v-model="form.code" placeholder='请输入商品编号'></el-input>
      </el-form-item>
      <el-form-item label='商品名称' prop='goodsName'>
        <el-input v-model="form.goodsName" placeholder='请输入商品名称'></el-input>
      </el-form-item>
      <el-form-item label='商品品牌'>
        <el-select v-model='form.brandId' clearable placeholder="请选择" @change="brandChange">
          <el-option
            v-for='item in brandArr'
            :label="item.name"
            :value="item.id"
            :key="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='产品描述'>
        <el-input type='textarea' v-model="form.goodsDesc" placeholder='请输入产品描述'></el-input>
      </el-form-item>
      <el-form-item label='商品税率'>
        <el-input v-model.number="form.taxrate" placeholder='请输入商品税率'></el-input>
      </el-form-item>
      <el-form-item label='运费模板'>
        <el-select v-model='form.transportTemplate' placeholder="请选择" @change='transportTemplateChange'>
          <el-option
            v-for='item in freightArr'
            :label="item.name"
            :value="item.id" :key="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='' v-if='!form.goods_activity_id'>
        <span>一级属性</span>
      </el-form-item>
      <el-form-item label='属性类型' required v-if='!form.goods_activity_id'>
        <el-input v-model="firstInput.type" placeholder='例如：颜色'></el-input>
      </el-form-item>
      <el-form-item label='属性内容' required v-if='!form.goods_activity_id'>
        <el-input v-model="firstInput.content" placeholder='例如：白色,红色'></el-input>
      </el-form-item>
      <el-form-item label='' v-if='!form.goods_activity_id'>
        <span>二级属性</span>
      </el-form-item>
      <el-form-item label='属性类型' required v-if='!form.goods_activity_id'>
        <el-input v-model="secondInput.type" placeholder='例如：颜色'></el-input>
      </el-form-item>
      <el-form-item label='属性内容' required v-if='!form.goods_activity_id'>
        <el-input v-model="secondInput.content" placeholder='例如：白色,红色'></el-input>
      </el-form-item>
      <el-form-item v-if='!form.goods_activity_id'>
        <el-button @click='saveSpecinfo'>保存生成规格</el-button>
      </el-form-item>
      <el-form-item label='统一填充' class='allFormClass'>
        <el-input v-model.number="ulForm.costPrice" placeholder='进价'></el-input>
        <el-input v-model.number="ulForm.stock" placeholder='库存'></el-input>
        <el-input v-model="ulForm.goodsCode" placeholder='货号'></el-input>
        <el-button @click='giveUlForm'>确认</el-button>
      </el-form-item>
      <el-form-item label='商品规格' class='ulFormItem' required>
        <ul class="specUl">
          <li v-for='list in form.skuRecVoList'>
            <span>{{list.skuSpec.split(',')[0]}}</span>
            <ul>
              <li>
                <span>{{list.skuSpec.split(',')[1]}}</span>
                <ul class="tableForm">
                  <li>
                    <el-form-item label='商品进价' required>
                      <el-input v-model.number="list.costPrice" placeholder='请输入商品进价'></el-input>
                    </el-form-item>
                  </li>
                  <li>
                    <el-form-item label='商品库存' required>
                      <el-input v-model.number="list.stock" placeholder='请输入商品库存'></el-input>
                    </el-form-item>
                  </li>
                  <li>
                    <el-form-item label='商品货号' required>
                      <el-input v-model="list.goodsCode" placeholder='请输入商品货号'></el-input>
                    </el-form-item>
                  </li>
                  <li>
                    <el-form-item label='运费模板' required>
                      <el-select v-model='list.transportTemplate' placeholder="请选择">
                        <el-option
                          v-for='item in freightArr'
                          :label="item.name"
                          :value="item.id" :key="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </el-form-item>
      <el-form-item>
        <span>商品相册</span>
      </el-form-item>

      <el-form-item label='列表展示图' required>
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :before-upload="beforeAvatarUploadList_url">
          <img v-if="form.list_url" :src="form.list_url" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label='商品相册' required>
        <el-upload
          action="http://upload-z2.qiniu.com"
          list-type="picture-card" :file-list="form.imgs_url" :before-upload="beforeAvatarUpload" multiple
          :on-preview="handlePictureCardPreview" :limit="9"
          :on-exceed="handleExceed"
          :on-remove="handleRemoveImg_publicity">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImages" alt="形象图片">
        </el-dialog>
      </el-form-item>
      <el-form-item label='商品长图' required>
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :before-upload="beforeAvatarUploadLogo">
          <img v-if="form.details_imgs_url" :src="form.details_imgs_url" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

<!--      A类商品-->
      <el-form-item v-if='form.payTemplateId == 1'>
        <span>A类商品属性</span>
      </el-form-item>
      <el-form-item label='消耗银贝' v-if='form.payTemplateId == 1'>
        <el-input v-model="silver_price" placeholder='请输入消耗银贝数'></el-input><el-button @click='giveSilver_price'>确认更改</el-button>
      </el-form-item>
      <el-form-item label='' class='ulFormItem' required v-if='form.payTemplateId == 1 && form.skuSalesRecVoList && form.skuSalesRecVoList.length > 0'>
        <ul class="specUl">
          <li v-for='list in form.skuSalesRecVoList'>
            <span>{{list.skuSpec.split(',')[0]}}</span>
            <ul>
              <li>
                <span>{{list.skuSpec.split(',')[1]}}</span>
                <ul class="tableForm">
                  <li>
                    <el-form-item label='消耗银贝数' required>
                      <el-input v-model="list.expendSilver" placeholder='请输入消耗银贝数'></el-input>
                    </el-form-item>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </el-form-item>

<!--      B类商品-->
      <el-form-item v-if='form.payTemplateId == 2'>
        <span>B类商品属性</span>
      </el-form-item>
      <el-form-item label='统一填充' class='allFormClass' v-if='form.payTemplateId == 2'>
        <el-input v-model="allForm.sellPrice" placeholder='销售价'></el-input>
        <el-input v-model="allForm.baseBackGold" placeholder='基础反贝数'></el-input>
        <el-input v-model="allForm.directBackGold" placeholder='活动直接反贝数'></el-input>
        <el-input v-model="allForm.sidewaysBackGold" placeholder='活动间接反贝数'></el-input>
        <el-input v-model="allForm.userNum" placeholder='参与人数'></el-input>
        <el-input v-model="allForm.goldTotal" placeholder='推广金倍数'></el-input>
        <el-input v-model="allForm.backSilverRatio" placeholder='反银贝系数'></el-input>
        <el-button @click='giveFormItem'>确认</el-button>
      </el-form-item>
      <el-form-item v-if='form.payTemplateId == 2'>
        <el-table :data='form.skuSalesRecVoList' border>
          <el-table-column
            prop="sellPrice"
            label="规格"
            min-width="120" align='center'>
            <template slot-scope='scope'>
              <span>{{scope.row.skuSpec.split(',')[0]}},{{scope.row.skuSpec.split(',')[1]}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="sellPrice"
            label="销售价"
            min-width="120" align='center'>
            <template slot-scope="scope">
              <el-input class="edit-input" size="small" v-model="scope.row.sellPrice"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="baseBackGold"
            label="基础反贝数"
            min-width="120" align='center'>
            <template slot-scope="scope">
              <el-input class="edit-input" size="small" v-model="scope.row.baseBackGold"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="directBackGold"
            label="活动直接反贝数"
            min-width="120" align='center'>
            <template slot-scope="scope">
              <el-input class="edit-input" size="small" v-model="scope.row.directBackGold"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="sidewaysBackGold"
            label="活动间接反贝数"
            min-width="120" align='center'>
            <template slot-scope="scope">
              <el-input class="edit-input" size="small" v-model="scope.row.sidewaysBackGold"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="userNum"
            label="参与人数"
            min-width="120" align='center'>
            <template slot-scope="scope">
              <el-input class="edit-input" size="small" v-model="scope.row.userNum"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="goldTotal"
            label="推广金贝数"
            min-width="120" align='center'>
            <template slot-scope="scope">
              <el-input class="edit-input" size="small" v-model="scope.row.goldTotal"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="backSilverRatio"
            label="反银贝系数"
            min-width="120" align='center'>
            <template slot-scope="scope">
              <el-input class="edit-input" size="small" v-model="scope.row.backSilverRatio"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

<!--      高级属性-->
      <el-form-item>
        <span>高级属性</span>
      </el-form-item>
      <el-form-item label='虚拟销售量' prop='fakeSaleNums'>
        <el-input v-model.number="form.fakeSaleNums" placeholder='请输入虚拟销售量'></el-input>
      </el-form-item>
      <el-form-item label='地域限制'>
        <el-select v-model="form.areaRestriction" multiple placeholder="请选择">
          <el-option
            v-for="item in area_json"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <span>是否支持分享购买</span>
        <el-radio v-model="form.shareBuy" :label="1">支持</el-radio>
        <el-radio v-model="form.shareBuy" :label="2">不支持</el-radio>
        <el-radio v-model="form.shareBuy" :label="3">仅支持分享购买</el-radio>
      </el-form-item>
      <el-form-item>
        <el-button @click='submit(1)'>完成，保存商品</el-button>
        <el-button v-if='form.status == 1' @click='submit(-2)'>下架</el-button>
<!--        <el-button v-if='form.status == 2' @click='dialogVisibleInput = true'>驳回</el-button>-->
<!--        <el-button v-else @click="submit('')">完成，提交商品</el-button>-->
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
  import area from '@/area.json'
  export default {
    data () {
      return {
        dialogVisibleInput: false,
        allForm: {
          sellPrice: '',
          baseBackGold: '',
          directBackGold: '',
          sidewaysBackGold: '',
          userNum: '',
          goldTotal: '',
          backSilverRatio: ''
        },
        ulForm: {
          costPrice: '',
          stock: '',
          goodsCode: ''
        },
        form: {
          categoryId: [],
          code: '',
          goodsName: '',
          brandId: '',
          transportTemplate: '',
          skuRecVoList: [],
          skuSalesRecVoList: [],
          specInfoList: [],
          goodsDesc: '',
          imgs_url: [],
          details_imgs_url: '',
          taxrate: '',
          list_url: '',
          payTemplateId: '',
          fakeSaleNums: '',
          brandName: '',
          areaRestriction: [],
          imagesRecVoList: [],
          shareBuy: 1
        },
        silver_price: '',
        firstInput: {
          type: '',
          content: ''
        },
        reject_reason: '',
        secondInput: {
          type: '',
          content: ''
        },
        area_json: [],
        categoryArr: [],
        brandArr: [],
        attr_is_change: 0,
        freightArr: [],
        dialogVisible: false,
        dialogImages: '',
        rules: {
//          categoryId: [{ required: true, message: '请选择类目', trigger: 'change' }],
//          code: [{ required: true, message: '请输入商品编码', trigger: 'blur' },
//            { pattern: /^[^\u4e00-\u9fa5]{0,30}$/, message: '商品编码由1-30位非中文字符组成' }],
//          goodsName: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
//          payTemplateId: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
//          transportTemplate: [{ required: true, message: '请选择运费模板', trigger: 'blur' }],
//          fakeSaleNums: [{ required: true, message: '请输入虚拟销售量', trigger: 'blur' }],
        }
      }
    },
    created () {
      this.area_json = area.area_json
      this.$axios({
        type: 'post',
        url: '/bhs-management-admin/category/treeListByBusinessIdAndType?businessId=' + this.$route.query.business_id + '&type=' + 1,
        data: {},
        fuc: (res) => {
          let arr = []
          for (let val of res.data) {
            if (val.childrenList) {
              arr.push(val)
            } else {
              
            }
          }
          this.categoryArr = arr
        }
      })
      this.$axios({
        type: 'post',
        url: '/bhs-management-admin/goodsBrand/all',
        data: {},
        fuc: (res) => {
          this.brandArr = res.data
        }
      })
//      this.$axios({
//        type: 'post',
//        url: '/goods/freight/getlists',
//        data: {gettype: 'all', business_id: this.$route.query.business_id},
//        fuc: (res) => {
//          this.freightArr = res.data
          this.freightArr = [{id: 1, name: '默认邮费'}]
//        }
//      })
      if (this.$route.query.id) {
        this.$axios({
          type: 'get',
          url: '/bhs-management-admin/goodsInfo/' + this.$route.query.id,
          data: {},
          fuc: (res) => {
            if (res.code == 1) {
//              this.form = Object.assign(JSON.parse(JSON.stringify(this.form)), res.data)
              for (let val in this.form) {
                if (val == "imagesRecVoList") {
                  this.form[val] = res.data.imagesVoList
                } else if (val == "skuRecVoList") {
                  this.form[val] = res.data.skuVoList
                } else if (val == "skuSalesRecVoList") {
                  this.form[val] = res.data.skuSalesVoList
                } else if (res.data[val]) {
                  this.form[val] = res.data[val]
                }
              }
//              this.form = res.data
              let _form = JSON.parse(JSON.stringify(res.data))
              console.log(this.form, _form)
              for (let val of _form.imagesVoList) {
                console.log(val)
                if (val.viewType == 2) {
                  this.form.imgs_url.push({url: val.imgPath})
                } else if (val.viewType == 1) {
                  this.form.list_url = val.imgPath
                } else {
                  this.form.details_imgs_url = val.imgPath
                }
              }
              this.form.categoryId = [_form.categoryPid, _form.categoryId]
              this.form.id = this.$route.query.id
              this.firstInput.type = this.form.specInfoList[0].specGroupName
              this.firstInput.content = this.form.specInfoList[0].specGroupValues
              this.secondInput.type = this.form.specInfoList[1].specGroupName
              this.secondInput.content = this.form.specInfoList[1].specGroupValues
              
  //            this.form.areaRestriction = this.form.areaRestriction.split(',')
  //            let arr = []
  //            let firstContent = []
  //            let secondContent = []
  //            for (let val of _form.skuRecVoList) {
  //              let obj = {
  //                ...val
  //              }
  //              obj.costPrice = parseInt(val.costPrice) / 100
  //              arr.push(obj)
  //            }
  //            this.firstInput = {type: _form.specInfoList[0].specGroupName, content: _form.specInfoList[0].specGroupValues}
  //            this.secondInput = {type: _form.specInfoList[1].specGroupName, content: _form.specInfoList[1].specGroupName}
  //            if (this.form.brandId == 0) {
  //              this.form.brandId = ''
  //            }
  //            this.form.skuRecVoList = arr
  //            this.form.type = this.form.type + ''
              this.form.areaRestriction = this.form.areaRestriction ? this.form.areaRestriction.split(',') : []
  //            let categoryIdArr = []
  //            categoryIdArr.push(_form.first_categoryId)
  //            categoryIdArr.push(_form.second_categoryId)
  ////            this.form.categoryId = JSON.parse(JSON.stringify(categoryIdArr))
  //            this.$set(this.form, 'categoryId', categoryIdArr)
              console.log(this.form)
              }
          }
        })
      }
      this.form.businessId = this.$route.query.business_id
    },
    methods: {
      brandChange (id) {
        for (let val of this.brandArr) {
          if (val.id == id) {
            this.form.brandName = val.name
          }
        }
      },
      refuse () {
        if (this.reject_reason == '') {
          this.$message.warning('请务必填写驳回理由')
          return false
        }

        let _form = JSON.parse(JSON.stringify(this.form))
        _form.second_categoryId = _form.categoryId[1]
        let arr = []
        for (let val of this.form.imgs_url) {
          arr.push(val.url)
        }
        _form.imgs_url = arr
        _form.status = -2
        _form.attr_is_change = this.attr_is_change
        _form.admin_spec_info = _form.spec_info
        if (_form.status == 2) {
          _form.reject_reason = this.reject_reason
        }
        this.$axios({
          type: 'post',
          url: '/goods/goods/admin_edit',
          data: _form,
          fuc: (res) => {
            this.dialogVisibleInput = false
            if (res.code == 200) {
              this.$message.success('操作成功')
              this.$deleteOneTag('/goods/goodsList')
            }
          }
        })
      },
      giveFormItem () {
        for (let index in this.allForm) {
          if (this.allForm[index] !== '') {
            for (let val of this.form.skuSalesRecVoList) {
              val[index] = this.allForm[index]
            }
          }
        }
      },
      giveUlForm () {
        for (let index in this.ulForm) {
          if (this.ulForm[index] !== '') {
            for (let val of this.form.skuRecVoList) {
              val[index] = this.ulForm[index]
            }
          }
        }
      },
      giveSilver_price () {
        for (let val of this.form.skuSalesRecVoList) {
          val.expendSilver = this.silver_price
        }
      },
      beforeAvatarUpload (file) {
        let formData = new FormData()
        formData.append('file', file)
        formData.append('folder', "goods")
        this.$axios({
          type: 'post',
          url: '/bhs-fileserver/file/uploadSingle',
          data: formData,
          fuc: (res) => {
            if (res.code == 1) {
              this.form.imgs_url.push({url: res.data})
              if (_this.form.imgs_url.length >= 9) {
                document.getElementsByClassName('el-upload el-upload--picture-card')[0].style.display = 'none'
              }
            }
          }
        }, 1)
        return false
      },
      handlePictureCardPreview(file) {
        this.dialogImages = file.url;
        this.dialogVisible = true;
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 9 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      handleRemoveImg_publicity(file, fileList) {
//        console.log(file)
        for (let val in this.form.imgs_url) {
          if (this.form.imgs_url[val].uid === file.uid) {
            this.form.imgs_url.splice(val, 1)
          }
        }
        if (this.form.imgs_url.length < 9) {
          document.getElementsByClassName('el-upload el-upload--picture-card')[0].style.display = 'inline-block'
        }
      },
      beforeAvatarUploadLogo (file) {
        let formData = new FormData()
        formData.append('file', file)
        formData.append('folder', "goods")
        this.$axios({
          type: 'post',
          url: '/bhs-fileserver/file/uploadSingle',
          data: formData,
          fuc: (res) => {
            if (res.code == 1) {
              this.form.details_imgs_url = res.data
            }
          }
        }, 1)
        return false
      },
      beforeAvatarUploadList_url (file) {
        let formData = new FormData()
        formData.append('file', file)
        formData.append('folder', "goods")
        this.$axios({
          type: 'post',
          url: '/bhs-fileserver/file/uploadSingle',
          data: formData,
          fuc: (res) => {
            if (res.code == 1) {
              this.form.list_url = res.data
            }
          }
        }, 1)
        return false
      },
      handleChange (val) {
        console.log(val)
      },
      saveSpecinfo () {
        if (this.firstInput.type == '' ||this.firstInput.content == '' ||this.secondInput.type == '' ||this.secondInput.content == '') {
          this.$message.warning('一级属性和二级属性为必填')
          return
        }
        this.form.specInfoList.push({specGroupName: this.firstInput.type, specGroupValues: this.firstInput.content.replace(/，/g, ',')})
        this.form.specInfoList.push({specGroupName: this.secondInput.type, specGroupValues: this.secondInput.content.replace(/，/g, ',')})
        let firstarray = this.firstInput.content.replace(/，/g, ',').split(',')
        let secondarray = this.secondInput.content.replace(/，/g, ',').split(',')
//        this.attr_is_change = 1
        let arr = []
        let arrSale = []
        for (let val of firstarray) {
          for (let val2 of secondarray) {
            arr.push({
              "businessId": this.$route.query.business_id,
              "skuSpec": val + ',' + val2,
              "costPrice": "",
              "fakeSaleNums": "",
              "realSaleNums": "",
              "sellPrice": "",
              "goodsCode": "",
              "transportTemplate" : this.form.transportTemplate,
              "stock": ""
            })
            arrSale.push({
              "skuSpec": val + ',' + val2,
              "backSilverRatio": "", // 反银贝系数
              "baseBackGold": "", //基础反金贝
              "directBackGold": "", // 直接返金贝
              "expendSilver": "", //商品消耗银贝
              "goldTotal" : '', // 推广金贝总数
              "postageGold": 0, // 邮费是否可以使用金贝 0 不可以 1 可以
              "sellPrice" : '', // 商品销售价格
              "sidewaysBackGold" : '', // 间接接返金贝
              "userNum" : '' // 参与人数
            })
          }
        }
        this.form.skuRecVoList = arr
        this.form.skuSalesRecVoList = arrSale
      },
      submit (status) {
        console.log(this.form)
        
        // 区域id, 类目id， 虚拟销售量int, 图片
        
        this.$refs['form'].validate((valid) => {
          console.log(valid, this.form.skuRecVoList.length < 1 || this.form.skuSalesRecVoList.length < 1 || this.form.details_imgs_url == '' || this.form.list_url == '')
          if (valid) {
            if (this.form.skuRecVoList.length < 1 || this.form.skuSalesRecVoList.length < 1 || this.form.details_imgs_url == '' || this.form.list_url == '') {
              this.$message.warning('必填项都为必填')
              return false
            } else {
//              for (let val of this.form.spec_info) {
//                for (let valKey in val) {
//                  if ((valKey == 'cost_price' || valKey == 'sale_price' || valKey == 'nums' || valKey == 'art_no') && val[valKey] == '') {
//                    this.$message.warning('规则每项都为必填')
//                    return false
//                  }
//                }
////                val.fakeSaleNums = this.form.fakeSaleNums
//              }
              console.log(1)
              let _form = JSON.parse(JSON.stringify(this.form))
//              _form.second_categoryId = _form.categoryId[1]
              for (let val of _form.imgs_url) {
                _form.imagesRecVoList.push({viewType: 2, imgPath: val.url})
              }
              
              _form.imagesRecVoList.push({viewType: 1, imgPath: _form.list_url})
              _form.imagesRecVoList.push({viewType: 3, imgPath: _form.details_imgs_url})
//              console.log(_form)
              _form.areaRestriction = _form.areaRestriction.join(',')
              _form.categoryId = _form.categoryId[1]
              if (status != '') {
                _form.status = status
              }
//              _form.attr_is_change = this.attr_is_change
//              _form.admin_spec_info = _form.spec_info
              if (status == 2) {
//                _form.reject_reason = this.reject_reason
              }
              this.$axios({
                type: this.$route.query.id ? 'put' : 'post',
                url: '/bhs-management-admin/goodsInfo',
                data: _form,
                fuc: (res) => {
                  console.log('res', res)
                  this.dialogVisibleInput = false
                  if (res.code == 1) {
                    this.$message.success('操作成功')
                    this.$deleteOneTag('/business/onlineBusinessGoodsList', {businessId: this.$route.query.business_id})
                  }
                }
              })
            }
          }
        })
      },
      transportTemplateChange (id) {
        for (let val of this.form.skuRecVoList) {
          val.transportTemplate = id
        }
      }
    }
  }
</script>
<style scoped="true">
  .goodsDetail{
    margin: 10px 20px 0;
    overflow: hidden;
  }
  .tableForm>li{
    width: 220px;
    display: inline-block;
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
  .goodsDetail>.el-form .el-input{
    max-width: 400px;
  }
  .goodsDetail>.el-form .el-textarea{
    max-width: 400px;
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
  .goodsDetail>.el-form .allFormClass .el-input{
    max-width: 100px;
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
