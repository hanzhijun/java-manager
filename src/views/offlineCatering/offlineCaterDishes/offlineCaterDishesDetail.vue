<template>
  <div class="onlineBusinessDetail">
    <el-form ref="form" :model="form" label-width="120px" :rules='rules' style="width: 80%">
      <el-form-item>
        <span>菜品资料</span>
      </el-form-item>
      <el-form-item label="菜品分类" prop='ordering_categoryid'>
        <el-select v-model='form.ordering_categoryid' placeholder='请选择菜品分类' @focus="checkCategory">
          <el-option v-for='item in categoryList' :label='item.cname' :key='item.ordering_category_id' :value='item.ordering_category_id'></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="菜品名称" prop='dishesname' style="width: 30%">
        <el-input v-model="form.dishesname" placeholder='请输入菜品名称' :maxlength='8'></el-input>
      </el-form-item>
      <el-form-item label="菜品编号" prop='num' style="width: 30%">
        <el-input v-model="form.num" placeholder='请输入菜品编号' :maxlength='5'></el-input>
      </el-form-item>
      <el-form-item style="width: 60%">
        <div v-for="specification in form.specifications"  style="margin-left: 5px;">
          <span v-if="specification.selected === 'true'" >
            <!--@focus="checkMoney($event)"-->
            <el-input v-model="specification.specifications_name" style="margin:0 5px 5px 0;width: 30%" readonly></el-input><el-input v-model="specification.gprice" :maxlength='6' style="width: 10%" ></el-input><el-button style="margin-left: 5px;width: 80px;" @click="changeSpecification(specification.ordering_specifications_id)">删除</el-button>
          </span>
        </div>
      </el-form-item>
      <el-form-item prop='operator'>
        <el-button type="primary" @click="modelDialog = true">点击编辑规格</el-button>
      </el-form-item>
      <el-form-item label="价格" prop='dishesprice' style="width: 30%" >
        <el-input v-model="form.dishesprice" placeholder='请输入价格' :maxlength='6' v-bind:disabled="isPriceReadOnly"></el-input>
      </el-form-item>
      <el-form-item label="上传图片" prop='dishespicture'>
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :before-upload="beforeUploadPic">
          <img v-if="form.dishespicture" :src="form.dishespicture" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="菜品介绍" prop='dishesdesc'>
        <textarea v-model="form.dishesdesc" :maxlength="50" cols="30" rows="5"/>
        <span v-show="contentShortLength" >{{contentShortLength}}/50</span>
      </el-form-item>

      <el-form-item label="加菜" v-if="form.adddishes.length > 0" style="width: 60%">
        <div v-for="(adddishe,index) in form.adddishes"  >
          <div style="margin-top: 2px;">
            <el-input v-model="adddishe.name" placeholder='请输入加菜名称' :maxlength='20' style="width: 30%;" readonly ></el-input> <el-input v-model="adddishe.price" placeholder='请输入菜品售价' :maxlength='4' style="width: 10%;" readonly></el-input><el-button style="margin-left: 5px;width: 80px;" @click="removeDishes(index)">删除</el-button>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="口味" v-if="form.flavors.length > 0">
        <div v-for="flavor in form.flavors" >
          <div style="margin-top: 2px;">
            <span v-for="flavorNameObj in form.flavorsMap[flavor.flavortype]">
              <el-input v-model="flavorNameObj.name" placeholder='请输入口味' :maxlength='20' style="width: 20%;margin-right: 5px;" v-if="flavorNameObj.name != ''" readonly></el-input>
            </span>
            <el-button  style="width: 80px;" @click="removeFlavorsType(flavor.flavortype)" v-if="form.flavorsMap[flavor.flavortype][0].name != ''">删除</el-button>
          </div>
        </div>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button  @click="cancelDishes">取消</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="编辑规格" :visible.sync="modelDialog" :show-close='false'>
      <el-form :model="modelForm" ref='modelForm' label-width="80px">
        <p style="background-color: #d2d2d2;">添加规格（可多选）</p>
        <span v-for="specification in form.specifications"  style="margin-left: 5px;">
            <el-button @click="changeSpecificationExe(specification.ordering_specifications_id)" :type="specification.selected == 'true' ? 'primary' : ''">{{specification.specifications_name}}</el-button>
        </span>
        <p style="background-color: #d2d2d2;">加菜（选填）</p>
        <el-input v-model="modelForm.tmpName" placeholder='请输入加菜名称' :maxlength='20' style="width: 40%;"></el-input> <el-input v-model="modelForm.tmpPrice" placeholder='请输入菜品售价' :maxlength='4' style="width: 40%;"></el-input><el-button type="primary" style="margin-left: 5px;width: 50px;" @click="addDishes">+</el-button>
        <div v-for="(adddishe,index) in form.adddishes" >
          <div style="margin-top: 2px;">
            <el-input v-model="adddishe.name" placeholder='请输入加菜名称' :maxlength='20' style="width: 40%;" readonly ></el-input> <el-input v-model="adddishe.price" placeholder='请输入菜品售价' :maxlength='4' style="width: 40%;" readonly></el-input><el-button type="primary" style="margin-left: 5px;width: 50px;" @click="removeDishes(index)">-</el-button>
          </div>
        </div>
        <p style="background-color: #d2d2d2;">口味（选填）</p>
        说明：若输入醋相关的口味类型，则不要输入和辣椒相关的，多口味请添加标签 (总共可自定义9个)<br/>
        <el-button type="primary" @click="addFlavors">添加</el-button><br/>
        <div v-for="(flavor, index) in form.flavors" >
          <div style="margin-top: 2px;">
            <el-input v-model="indexLetter[index]" placeholder='分类' :maxlength='20' style="width: 5%;"></el-input>
            <span v-for="flavorNameObj in form.flavorsMap[flavor.flavortype]" >
              <el-input v-model="flavorNameObj.name" placeholder='请输入口味' :maxlength='20' style="width: 20%;margin-right: 5px;"></el-input>
            </span>
            <el-button type="primary" style="margin-left: 5px;width: 50px;" @click="addFlavorsName(flavor.flavortype)">+</el-button>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modelDialog = false">取 消</el-button>
        <el-button type="primary" @click="checkDialogData">保 存</el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加分类" :visible.sync="categoryDialogVisible" :show-close='false'>
      <el-form :model="categoryForm" ref='categoryForm' label-width="80px" >
        <el-form-item label="分类名称" prop='categoryName'>
          <el-input v-model="categoryForm.categoryName" auto-complete="off" placeholder='请输入分类名称'></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="categoryDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="categoryAdd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    components: {
    },
    computed: {
      contentShortLength() {
        return this.form.dishesdesc.length
      }
    },
    data() {
      // const priceValidator = (rule, value, callback) => {
      //   if (!/^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/.test(value)) {
      //     callback(new Error('请输入正确金额'))
      //   } else {
      //     callback()
      //   }
      // }
      return {
        modelDialog: false,
        categoryDialogVisible: false,
        categoryList: [],
        modelForm: {
          tmpName: '',
          tmpPrice: ''
        },
        categoryForm: {
          categoryName: ''
        },
        isPriceReadOnly: false,
        indexLetter: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
        form: {
          source: '',
          token: '',
          businessid: '',
          ordering_categoryid: '',
          num: '',
          dishesname: '',
          dishespicture: '',
          dishesprice: '',
          dishesdesc: '',
          adddishes: [],
          specifications: [],
          flavors: [],
          flavorsMap: [],
          ordering_dishes_id: ''
        },
        rules: {
          ordering_categoryid: [{ required: true, message: '请选择菜品分类', trigger: 'blur' }],
          dishesname: [{ required: true, message: '请输入菜品名称', trigger: 'blur' }],
          // dishesprice: [
          //   { required: true, message: '请输入价格', trigger: 'blur' },
          //   { validator: priceValidator, trigger: 'change' }
          // ],
          dishespicture: [{ required: true, message: '请上传菜品图片', trigger: 'blur' }]
        }
      }
    },
    created() {
      const dishesId = this.$route.query.ordering_dishes_id
      const buessId = this.$route.query.business_offline_id
      this.querySpecificationsList()
      this.queryCategoryList(buessId)
      // 更新操作
      if (dishesId) {
        this.form.ordering_dishes_id = dishesId
        const _this = this
        // 查询数据
        this.getDishesById(dishesId, buessId, function(data) {
          if (!data) {
            this.$message.warning('未查询到菜品信息')
            return false
          }
          data.dishesprice = data.dishesprice / 100
          data.adddishes.forEach(function(initObj) {
            initObj.price = initObj.price / 100
          })
          data.specifications.forEach(function(initObj) {
            _this.form.specifications.forEach(function(specification) {
              if (initObj.specifications_id == specification.ordering_specifications_id) {
                specification.selected = 'true'
                specification.gprice = initObj.gprice / 100
//                specification.price = initObj.price / 100
                _this.isPriceReadOnly = true
              }
            })
          })
          delete data.specifications
          // 显示加菜
          const _flavorMap = []
          const _flavors = []
          data.flavors.forEach(function(initObj) {
            const flavorMapObj = _flavorMap[initObj.flavortype]
            if (flavorMapObj) {
              flavorMapObj.push({
                name: initObj.flavorname
              })
            } else {
              _flavors.push({
                flavortype: initObj.flavortype
              })
              _flavorMap[initObj.flavortype] = [{ name: initObj.flavorname }]
            }
          })
          data.flavorsMap = _flavorMap
          data.flavors = _flavors
          data.num = (data.num == 0 ? '' : data.num)
          data.dishesprice = (data.dishesprice == 0 ? '' : data.dishesprice)
//          debugger
          Object.assign(_this.form, data)
          // this.$set(this.form.flavorsMap, flavors, flavors)
        })
      }
      this.updatePriceStatus()
    },
    methods: {
      getDishesById(id, buessId, callback) {
        this.$axios({
          type: 'post',
          url: '/ordering/dishesedit',
          data: { dishes_id: id, businessid: buessId },
          fuc: (res) => {
            if (res.code == 200) {
              if (callback) {
                callback(res.data)
              }
            }
          }
        })
      },
      // isPriceReadOnly() {
      //   return false
      //   // if (this.form.specifications.length > 0) {
      //   //   return true
      //   // }
      // },
      querySpecificationsList() {
        this.$axios({
          type: 'post',
          url: '/ordering/specifications',
          data: {},
          fuc: (res) => {
            if (res.code == 200) {
              this.form.specifications = res.data
            }
          }
        })
      },
      queryCategoryList(bid) {
        this.$axios({
          type: 'post',
          url: '/ordering/dishescategory',
          data: { paging: 1, businessid: this.$route.query.business_offline_id },
          fuc: (res) => {
            this.categoryList = res.data
          }
        })
      },
      cancelDishes() {
        // 判断是否录入数据
        if (this.form.dishesname || this.form.dishesprice || this.form.dishespicture || this.form.adddishes.length > 0 || this.form.specifications.length > 0 || this.form.flavors.length > 0) {
          this.$confirm('菜品未添加成功，是否确认取消??', '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$router.push({ path: '/offlineCatering/offlineCaterDishesList', query: { business_offline_id: this.$route.query.business_offline_id }})
          }).catch(() => {
          })
        }
      },
      // checkMoney(e) {
      //
      //   if (e.value) {
      //
      //     if (!this.isMoney(e.value)) {
      //       this.$message.warning('请输入正确金额')
      //       return false
      //     }
      //   }
      // },
      removeFlavorsType(flavortype) {
        if (this.form.flavors.length == 1) {
          this.$confirm('是否删除该口味？', '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.removeFlavorsTypeExe(flavortype)
          }).catch(() => {
          })
        } else {
          this.removeFlavorsTypeExe(flavortype)
        }
      },
      removeFlavorsTypeExe(flavortype) {
        for (var j = 0; j < this.form.flavors.length; j++) {
          const flavorObj = this.form.flavors[j]
          if (flavorObj.flavortype === flavortype) {
            this.form.flavors.splice(j, 1)
          }
        }
        delete this.form.flavorsMap[flavortype]
      },
      checkDialogData() {
        // 检查规格
        let specSelected = true
        for (var i = 0; i < this.form.specifications.length; i++) {
          const obj = this.form.specifications[i]
          if (obj === undefined) {
            continue
          }
          if (obj.selected === 'true') {
            specSelected = false
            break
          }
        }
        if (specSelected) {
          this.$message.warning('请选择菜品规格')
          return false
        }
        this.modelDialog = false
      },
      checkCategory() {
        if (this.categoryList.length < 1) {
          this.categoryDialogVisible = true
        }
      },
      categoryAdd() {
        if (!this.categoryForm.categoryName) {
          this.$message.warning('请输入菜品分类')
          return false
        }
        this.$axios({
          type: 'post',
          url: '/ordering/addcategory',
          data: { cname: this.categoryForm.categoryName, businessid: this.$route.query.business_offline_id },
          fuc: (res) => {
            if (res.code == 200) {
              this.categoryDialogVisible = false
              this.$message.success('添加成功')
              this.queryCategoryList()
              return false
            }
          }
        })
      },
      addDishes() {
        if (this.form.adddishes.length > 5) {
          this.$message.warning('最多能添加6个加菜选项！')
          return false
        }
        if (!this.modelForm.tmpName) {
          this.$message.warning('请输入加菜名称')
          return false
        }
        if (!this.isMoney(this.modelForm.tmpPrice)) {
          this.$message.warning('请输入正确金额')
          return false
        }
        const dishesObj = {
          name: this.modelForm.tmpName,
          price: this.modelForm.tmpPrice
        }
        this.modelForm.tmpName = ''
        this.modelForm.tmpPrice = ''
        this.form.adddishes.push(dishesObj)
      },
      isMoney(s) {
        if (!/^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/.test(s)) {
          return false
        }
        return true
      },
      checkFlavorNum() {
        // 做9个数量验证
        var countList = []
        const _form = this.form
        this.form.flavors.forEach(function(flavor) {
          const tmpList = _form.flavorsMap[flavor.flavortype]
          countList = countList.concat(tmpList)
        })
        if (countList.length > 8) {
          return false
        }
        return true
      },
      addFlavors() {
        // 做9个数量验证
        if (!this.checkFlavorNum()) {
          this.$message.warning('最多可输入9个口味标签')
          return false
        }
        let fIndex = this.form.flavors.length
        if (fIndex > 0) {
          fIndex = this.form.flavors[this.form.flavors.length - 1].flavortype + 1
        }
        const newFlavor = {
          flavortype: fIndex
        }
        if (this.form.flavorsMap[newFlavor.flavortype]) {
          this.form.flavorsMap[newFlavor.flavortype].push({
            name: ''
          })
        } else {
          this.$set(this.form.flavorsMap, newFlavor.flavortype, [{
            name: ''
          }])
        }
        this.form.flavors.push(newFlavor)
      },
      addFlavorsName(flavortype) {
        // 做9个数量验证
        if (!this.checkFlavorNum()) {
          this.$message.warning('最多可输入9个口味标签')
          return false
        }
        this.form.flavorsMap[flavortype].push({ name: '' })
      },
      removeDishes(index) {
        if (this.form.adddishes.length === 1) {
          this.$confirm('是否删除该加菜项？', '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.removeDishesExe(index)
          }).catch(() => {
          })
        } else {
          this.removeDishesExe(index)
        }
      },
      removeDishesExe(index) {
//        debugger
        this.form.adddishes.splice(index, 1)
      },
      changeSpecification(id) {
        let num = 0
        for (var f = 0; f < this.form.specifications.length; f++) {
          const specification = this.form.specifications[f]
          if (specification.selected === 'true') {
            num += 1
          }
        }
        if (num === 1) {
          this.$confirm('是否删除该规格售价？', '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.changeSpecificationExe(id)
          }).catch(() => {
          })
        } else {
          this.changeSpecificationExe(id)
        }
      },
      changeSpecificationExe(id) {
        for (var i = 0; i < this.form.specifications.length; i++) {
          const obj = this.form.specifications[i]
          if (obj === undefined) {
            continue
          }
          if (obj.ordering_specifications_id === id) {
            if (obj.selected) {
              obj.selected = obj.selected === 'false' ? 'true' : 'false'
            } else {
              obj.selected = 'true'
            }
            this.$forceUpdate()
          }
        }
        // 处理价格文本状态
        this.updatePriceStatus()
      },
      checkSpecificationSelected() {
        let readOnly = false
        for (var f = 0; f < this.form.specifications.length; f++) {
          const specification = this.form.specifications[f]
          if (specification.selected === 'true') {
            readOnly = true
            break
          }
        }
        return readOnly
      },
      updatePriceStatus() {
        // let readOnly = false
        // for (var f = 0; f < this.form.specifications.length; f++) {
        //   const specification = this.form.specifications[f]
        //   if (specification.selected === 'true') {
        //     readOnly = true
        //     break
        //   }
        // }
        this.isPriceReadOnly = this.checkSpecificationSelected()
      },
      onSubmit() {
        const _this = this
        const _flavorMap = this.form.flavorsMap
        const readOnly = this.checkSpecificationSelected()
        // 判断金额
        if (!readOnly) {
//          debugger
          if (!this.form.dishesprice) {
            this.$message.warning('请输入正确价格')
            return
          }
//          debugger
          if (!this.isMoney(this.form.dishesprice)) {
            this.$message.warning('请输入正确价格')
            return
          }
        }
        this.$refs['form'].validate((valid) => {
          if (valid) {
            const _form = JSON.parse(JSON.stringify(this.form))
            _form.businessid = this.$route.query.business_offline_id
            // 金额转分
            _form.dishesprice = _form.dishesprice * 100
            _form.adddishes.forEach(function(dishes) {
              dishes.price = dishes.price
            })
            const _specifications = []
            _form.specifications.forEach(function(specification) {
              if (specification.selected === 'true') {
                if (!_this.isMoney(specification.gprice)) {
                  _this.$message.warning('请输入正确金额')
                  return
                }
                _specifications.push({
                  specifications_id: specification.ordering_specifications_id,
                  gprice: specification.gprice
                })
              }
            })
            const _flavors = []
            for (var f = 0; f < _form.flavors.length; f++) {
              const tmpFlavor = _form.flavors[f]
              _flavorMap[tmpFlavor.flavortype].forEach(function(flavorObj) {
                if (flavorObj.name) {
                  _flavors.push({
                    flavortype: _this.indexLetter[f],
                    flavorname: flavorObj.name
                  })
                }
              })
            }
            // 转JSON
            _form.adddishes = _form.adddishes
            _form.flavors = _flavors
            _form.specifications = _specifications
            this.$axios({
              type: 'post',
              url: _form.ordering_dishes_id ? '/ordering/disheseupdate' : '/ordering/adddishes',
              data: _form,
              fuc: (res) => {
                if (res.code == 200) {
                  this.$message.success('添加成功')
                  this.$router.push({ path: '/offlineCatering/offlineCaterDishesList', query: { business_offline_id: _form.businessid }})
                }
              }
            })
          }
        })
      },
      beforeUploadPic(file) {
        const _this = this
        var reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function(e) {
          _this.form.dishespicture = this.result // 这个就是base64编码了
        }
        return false
      }
    }
  }
</script>
<style scoped="true">
  .onlineBusinessDetail{
    margin: 10px 20px 0;
    overflow: hidden;
  }
  .onlineBusinessDetail>.el-form{
    width: 400px;
    margin: 20px;
  }
  .bm-view {
    width: 100%;
    height: 300px;
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
