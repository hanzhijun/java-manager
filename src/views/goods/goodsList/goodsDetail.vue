<template>
  <div class="goodsDetail">
    <el-form ref="form" :model="form" label-width="120px" :rules='rules'>
      <el-form-item label='商品分类' prop='type'>
        <el-select v-model='form.type' placeholder="请选择">
          <el-option
            label="A类"
            value="1">
          </el-option>
          <el-option
            label="B类"
            value="-1">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='商品类目' prop='class_category_id'>
        <el-cascader
          expand-trigger="hover"
          :options="categoryArr"
          v-model="form.class_category_id"
          @change="handleChange">
        </el-cascader>
      </el-form-item>
      <el-form-item>
        <span>基本信息</span>
      </el-form-item>
      <el-form-item label='商品编码' prop='goods_no'>
        <el-input v-model="form.goods_no" placeholder='请输入商品编码'></el-input>
      </el-form-item>
      <el-form-item label='商品名称' prop='goods_name'>
        <el-input v-model="form.goods_name" placeholder='请输入商品名称'></el-input>
      </el-form-item>
      <el-form-item label='商品品牌'>
        <el-select v-model='form.brand_id' clearable placeholder="请选择">
          <el-option
            v-for='item in brandArr'
            :label="item.brand_name"
            :value="item.bid"
            :key="item.bid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='产品描述'>
        <el-input type='textarea' v-model="form.goods_desc" placeholder='请输入产品描述'></el-input>
      </el-form-item>
      <el-form-item label='统一填充' class='allFormClass'>
        <el-input v-model="ulForm.cost_price" placeholder='供应价'></el-input>
        <el-input v-model="ulForm.sale_price" placeholder='供应价'></el-input>
        <el-input v-model="ulForm.nums" placeholder='供应价'></el-input>
        <el-button @click='giveUlForm'>确认</el-button>
      </el-form-item>
      <el-form-item label='商品规格' class='ulFormItem' required>
        <ul class="specUl">
          <li v-for='list in form.spec_info'>
            <span>{{list.attrs.first}}</span>
            <ul>
              <li>
                <span>{{list.attrs.second}}</span>
                <ul class="tableForm">
                  <li>
                    <el-form-item label='商品进价' required>
                      <el-input v-model="list.cost_price" placeholder='请输入商品进价'></el-input>
                    </el-form-item>
                  </li>
                  <li>
                    <el-form-item label='商品售价' required>
                      <el-input v-model="list.sale_price" placeholder='请输入商品售价'></el-input>
                    </el-form-item>
                  </li>
                  <li>
                    <el-form-item label='商品库存' required>
                      <el-input v-model="list.nums" placeholder='请输入商品库存'></el-input>
                    </el-form-item>
                  </li>
                  <li>
                    <el-form-item label='商品货号' required>
                      <el-input v-model="list.art_no" placeholder='请输入商品货号'></el-input>
                    </el-form-item>
                  </li>
                  <li>
                    <el-form-item label='运费模板' required>
                      <el-select v-model='list.freight_id' placeholder="请选择" disabled>
                        <el-option
                          v-for='item in freightArr'
                          :label="item.freight_name"
                          :value="item.fid" :key="item.fid">
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
      <el-form-item v-if='form.type == 1'>
        <span>A类商品属性</span>
      </el-form-item>
      <el-form-item label='消耗银贝' v-if='form.type == 1'>
        <el-input v-model="form.silver_price" placeholder='请输入消耗银贝数'></el-input><el-button @click='giveSilver_price'>确认更改</el-button>
      </el-form-item>
      <el-form-item label='' class='ulFormItem' required v-if='form.type == 1 && form.spec_info.length > 0'>
        <ul class="specUl">
          <li v-for='list in form.spec_info'>
            <span>{{list.attrs.first}}</span>
            <ul>
              <li>
                <span>{{list.attrs.second}}</span>
                <ul class="tableForm">
                  <li>
                    <el-form-item label='消耗银贝数' required>
                      <el-input v-model="list.silver_price" placeholder='请输入消耗银贝数'></el-input>
                    </el-form-item>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </el-form-item>

<!--      B类商品-->
      <el-form-item v-if='form.type == -1'>
        <span>B类商品属性</span>
      </el-form-item>
      <el-form-item label='统一填充' class='allFormClass' v-if='form.type == -1'>
        <el-input v-model="allForm.supply_price" placeholder='供应价'></el-input>
        <el-input v-model="allForm.base_return" placeholder='基础反贝数'></el-input>
        <el-input v-model="allForm.activity_direct_return" placeholder='活动直接反贝数'></el-input>
        <el-input v-model="allForm.activity_indirect_return" placeholder='活动间接反贝数'></el-input>
        <el-input v-model="allForm.join_nums" placeholder='参与人数'></el-input>
        <el-input v-model="allForm.spread_gold_return" placeholder='推广金倍数'></el-input>
        <el-input v-model="allForm.silver_return_ratio" placeholder='反银贝系数'></el-input>
        <el-button @click='giveFormItem'>确认</el-button>
      </el-form-item>
      <el-form-item v-if='form.type == -1'>
        <el-table :data='form.spec_info' border>
          <el-table-column
            prop="supply_price"
            label="规格"
            min-width="120" align='center'>
            <template slot-scope='scope'>
              <span>{{scope.row.first_attr_value}},{{scope.row.second_attr_value}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="supply_price"
            label="供应价"
            min-width="120" align='center'>
            <template slot-scope="scope">
              <el-input class="edit-input" size="small" v-model="scope.row.supply_price"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="base_return"
            label="基础反贝数"
            min-width="120" align='center'>
            <template slot-scope="scope">
              <el-input class="edit-input" size="small" v-model="scope.row.base_return"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="activity_direct_return"
            label="活动直接反贝数"
            min-width="120" align='center'>
            <template slot-scope="scope">
              <el-input class="edit-input" size="small" v-model="scope.row.activity_direct_return"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="activity_indirect_return"
            label="活动间接反贝数"
            min-width="120" align='center'>
            <template slot-scope="scope">
              <el-input class="edit-input" size="small" v-model="scope.row.activity_indirect_return"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="join_nums"
            label="参与人数"
            min-width="120" align='center'>
            <template slot-scope="scope">
              <el-input class="edit-input" size="small" v-model="scope.row.join_nums"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="spread_gold_return"
            label="推广金贝数"
            min-width="120" align='center'>
            <template slot-scope="scope">
              <el-input class="edit-input" size="small" v-model="scope.row.spread_gold_return"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="silver_return_ratio"
            label="反银贝系数"
            min-width="120" align='center'>
            <template slot-scope="scope">
              <el-input class="edit-input" size="small" v-model="scope.row.silver_return_ratio"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

<!--      高级属性-->
      <el-form-item>
        <span>高级属性</span>
      </el-form-item>
      <el-form-item label='虚拟销售量' prop='fake_sale_nums'>
        <el-input v-model="form.fake_sale_nums" placeholder='请输入虚拟销售量'></el-input>
      </el-form-item>
      <el-form-item label='地域限制'>
        <el-select v-model="form.area_limit" multiple placeholder="请选择">
          <el-option
            v-for="item in area_json"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if='form.type == -1'>
        <span>是否支持分享购买</span>
        <el-radio v-model="form.is_activity" :label="2">支持</el-radio>
        <el-radio v-model="form.is_activity" :label="0">不支持</el-radio>
        <el-radio v-model="form.is_activity" :label="1">仅支持分享购买</el-radio>
      </el-form-item>
      <el-form-item label='异常原因' v-if='form.status == 0'>
        <span>{{form.reject_reason}}</span>
      </el-form-item>
      <el-form-item>

<!--        <el-button v-if='form.status == -1' @click='submit(1)'>完成，保存商品</el-button>-->

<!--        满足产品临时需求，后续启用上面代码-->
        <el-button @click='submit(1)'>完成，保存商品</el-button>
<!--        -->

        <el-button v-if='form.status == -1' @click='dialogVisibleInput = true'>驳回</el-button>
        <el-button v-if='form.status == 1' @click='submit(-2)'>下架</el-button>
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
          supply_price: '',
          base_return: '',
          activity_direct_return: '',
          activity_indirect_return: '',
          join_nums: '',
          spread_gold_return: '',
          silver_return_ratio: ''
        },
        ulForm: {
          cost_price: '',
          sale_price: '',
          nums: ''
        },
        form: {
          class_category_id: [],
          goods_no: '',
          goods_name: '',
          brand_id: '',
          freight_id: '',
          spec_info: [],
          first: '',
          second: '',
          goods_desc: '',
          imgs_url: [],
          details_imgs_url: '',
          list_url: '',
          type: '',
          silver_price: '',
          fake_sale_nums: '',
          area_limit: [],
          is_activity: 0
        },
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
          class_category_id: [{ required: true, message: '请选择类目', trigger: 'change' }],
          goods_no: [
            { required: true, message: '请输入商品编码', trigger: 'blur' },
            { pattern: /^[^\u4e00-\u9fa5]{0,30}$/, message: '商品编码由1-30位非中文字符组成' }],
          goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
          type: [{ required: true, message: '请选择商品分类', trigger: 'blur' }],
          freight_id: [{ required: true, message: '请选择运费模板', trigger: 'blur' }],
          fake_sale_nums: [{ required: true, message: '请输入虚拟销售量', trigger: 'blur' }],
        }
      }
    },
    created () {
      this.area_json = area.area_json
      this.$axios({
        type: 'post',
        url: '/goods/category/getbusinesscategoryinfo',
        data: {gid: this.$route.query.gid},
        fuc: (res) => {
          this.categoryArr = res.data
        }
      })
      this.$axios({
        type: 'post',
        url: '/goods/brand/getinfo',
        data: {},
        fuc: (res) => {
          this.brandArr = res.data.data
        }
      })
      this.$axios({
        type: 'post',
        url: '/goods/freight/getlists',
        data: {gettype: 'all'},
        fuc: (res) => {
          this.freightArr = res.data
        }
      })
      if (this.$route.query.gid) {
        this.$axios({
          type: 'post',
          url: '/goods/goods/detailsinfo',
          data: {gid: this.$route.query.gid},
          fuc: (res) => {
            let _form = res.data
            let arr = []
            let firstContent = []
            let secondContent = []
            for (let val of _form.spec_info) {
              let obj = {
                "attrs": {"first" : val.first_attr_value,"second" : val.second_attr_value},
                ...val
              }
              obj.cost_price = parseInt(val.cost_price) / 100
              obj.supply_price = parseInt(val.supply_price) / 100
              obj.sale_price = parseInt(val.sale_price) / 100
              arr.push(obj)
              if (firstContent.indexOf(val.first_attr_value) == -1) {
                firstContent.push(val.first_attr_value)
              }
              if (secondContent.indexOf(val.second_attr_value) == -1) {
                secondContent.push(val.second_attr_value)
              }
            }
            this.firstInput = {type: _form.first_attr, content: firstContent.join(',')}
            this.secondInput = {type: _form.second_attr, content: secondContent.join(',')}

            let imgsArr = []
            for (let val of _form.imgs_url) {
              imgsArr.push({url: val})
            }
            this.form = res.data
            if (this.form.brand_id == 0) {
              this.form.brand_id = ''
            }
            this.form.spec_info = arr
            this.form.type = this.form.type + ''
            this.form.area_limit = this.form.area_limit ? JSON.parse(this.form.area_limit) : []
            this.form.imgs_url = imgsArr
            let class_category_idArr = []
            class_category_idArr.push(_form.first_class_category_id)
            class_category_idArr.push(_form.second_class_category_id)
//            this.form.class_category_id = JSON.parse(JSON.stringify(class_category_idArr))
            this.$set(this.form, 'class_category_id', class_category_idArr)
            console.log(this.form)
          }
        })
      }
    },
    methods: {
      refuse () {
        if (this.reject_reason == '') {
          this.$message.warning('请务必填写驳回理由')
          return false
        }
        for (let val of this.form.spec_info) {
          for (let valKey in val) {
            if ((valKey == 'cost_price' || valKey == 'sale_price' || valKey == 'nums' || valKey == 'art_no') && val[valKey] == '') {
              this.$message.warning('规则每项都为必填')
              return false
            }
          }
          val.fake_sale_nums = this.form.fake_sale_nums
        }
        let _form = JSON.parse(JSON.stringify(this.form))
        _form.second_class_category_id = _form.class_category_id[1]
        let arr = []
        for (let val of this.form.imgs_url) {
          arr.push(val.url)
        }
        _form.imgs = arr
        _form.status = 0
        _form.attr_is_change = this.attr_is_change
        _form.admin_spec_info = _form.spec_info
        if (_form.status == 0) {
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
            for (let val of this.form.spec_info) {
              val[index] = this.allForm[index]
            }
          }
        }
      },
      giveUlForm () {
        for (let index in this.ulForm) {
          if (this.ulForm[index] !== '') {
            for (let val of this.form.spec_info) {
              val[index] = this.ulForm[index]
            }
          }
        }
      },
      giveSilver_price () {
        for (let val of this.form.spec_info) {
          val.silver_price = this.form.silver_price
        }
      },
      beforeAvatarUpload (file) {
        let _this = this
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e){
          _this.form.imgs_url.push({url: this.result})  // 这个就是base64编码了
          if (_this.form.imgs_url.length >= 9) {
//            console.log(document.getElementsByClassName('el-upload el-upload--picture-card'))
            document.getElementsByClassName('el-upload el-upload--picture-card')[0].style.display = 'none'
          }
        }
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
        let _this = this
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e){
          _this.form.details_imgs_url = this.result // 这个就是base64编码了
        }
        return false
      },
      beforeAvatarUploadList_url (file) {
        let _this = this
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e){
          _this.form.list_url = this.result // 这个就是base64编码了
        }
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
        let arr = []
        this.form.first = this.firstInput.type
        this.form.second = this.secondInput.type
        let firstarray = this.firstInput.content.split(',')
        let secondarray = this.secondInput.content.split(',')
        this.attr_is_change = 1
        for (let val of firstarray) {
          for (let val2 of secondarray) {
            arr.push({
              "attrs": {"first" : val,"second" : val2},
              "cost_price": "",
              "sale_price": "",
              "freight_id" : this.form.freight_id,
              "nums": ""
            })
          }
        }
        this.form.spec_info = arr
      },
      submit (status) {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            if (this.form.first == '' || this.form.second == '' || this.form.spec_info.length < 1 || this.form.imgs_url.length < 1 || this.form.details_imgs_url == '' || this.form.list_url == '') {
              this.$message.warning('请填写必填信息')
              return false
            } else {
              for (let val of this.form.spec_info) {
                console.log(val)
                for (let valKey in val) {
                  if ((valKey == 'cost_price' || valKey == 'sale_price' || valKey == 'nums' || valKey == 'art_no') && val[valKey] == '') {
                    this.$message.warning('规则每项都为必填')
                    return false
                  }
                }
                console.log(val)
                val.fake_sale_nums = this.form.fake_sale_nums
              }
              let _form = JSON.parse(JSON.stringify(this.form))
              _form.second_class_category_id = _form.class_category_id[1]
              let arr = []
              for (let val of this.form.imgs_url) {
                arr.push(val.url)
              }
              _form.imgs_url = arr
              console.log(_form)
              if (status != '') {
                _form.status = status
              }
              _form.attr_is_change = this.attr_is_change
              _form.admin_spec_info = _form.spec_info
              if (status == -1) {
                _form.reject_reason = this.reject_reason
              }
              this.$axios({
                type: 'post',
                url: '/goods/goods/admin_edit',
                data: _form,
                fuc: (res) => {
                  console.log('res', res)
                  this.dialogVisibleInput = false
                  if (res.code == 200) {
                    this.$message.success('操作成功')
                    this.$deleteOneTag('/goods/goodsList')
                  }
                }
              })
            }
          }
        })
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
