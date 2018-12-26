<template>
  <div class="unlineBusinessDetail">
    <el-form ref="form" :model="form" label-width="130px" :rules='rules'>
      <el-form-item>
        <h3 v-if='type == 2'>B类商家操作</h3>
        <h3 v-else>A类商家操作</h3>
      </el-form-item>
      <el-form-item>
        <span>认证信息</span>
      </el-form-item>
      <el-form-item label="营业执照" prop='license'>
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload">
          <img v-if="form.license" :src="form.license" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="商家名称" prop='name'>
        <el-input v-model="form.name" placeholder='请输入商家名称'></el-input>
      </el-form-item>
      <el-form-item label="联系人" prop='operator'>
        <el-input v-model="form.operator" placeholder='请输入联系人'></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop='mobile'>
        <el-input v-model="form.mobile" placeholder='请输入联系电话' :disabled='phoneBool'></el-input>
      </el-form-item>
      <el-form-item label="固定电话" prop='tel'>
        <el-input v-model="form.tel" placeholder='请输入固定电话'></el-input>
      </el-form-item>
      <el-form-item label="短信通知电话" prop='sms_mobile'>
        <el-input v-model="form.sms_mobile" placeholder='短信通知电话'></el-input>
      </el-form-item>
      <el-form-item label="开户银行账户" prop='bank_account'>
        <el-input v-model="form.bank_account" placeholder='请输入开户银行账户'></el-input>
      </el-form-item>
      <el-form-item label="开户银行名称" prop='bank_name'>
        <el-input v-model="form.bank_name" placeholder='请输入开户银行名称'></el-input>
      </el-form-item>
      <el-form-item label="开户银行网点" prop='bank_network'>
        <el-input v-model="form.bank_network" placeholder='请输入开户银行网点'></el-input>
      </el-form-item>
      <el-form-item label="支付宝账号" prop='ali_account'>
        <el-input v-model="form.ali_account" placeholder='请输入支付宝账号'></el-input>
      </el-form-item>
      <el-form-item label="支付宝姓名" prop='ali_username'>
        <el-input v-model="form.ali_username" placeholder='请输入支付宝姓名'></el-input>
      </el-form-item>
      <el-form-item label="是否支持预约" v-if='type == 1'>
        <el-switch
          v-model="form.is_retention == 1"
          active-text="支持"
          @change='changeIs_retention'
          inactive-text="不支持">
        </el-switch>
      </el-form-item>
      <el-form-item label="预约保留时间" v-if='form.is_retention == 1'>
        <el-input v-model="form.retention_at" placeholder='请输入支付宝账号'></el-input>
      </el-form-item>
      <el-form-item>
        <span v-if='type == 1'>线下A类商家</span>
        <span v-else>线下B类商家</span>
      </el-form-item>
      <el-form-item label="是否可以创建服务" v-if='type == 1'>
        <el-switch
          v-model="form.insert_package_status == 1"
          active-text="可以"
          @change='changeInsert_package_status'
          inactive-text="不可以">
        </el-switch>
      </el-form-item>
      <el-form-item label="一级类目" prop='first_category_id' v-if='type == 1'>
        <el-select v-model="form.first_category_id" @change="first_category_idChange" placeholder="请选择">
          <el-option
            v-for="item in first_category_idList"
            :key="item.business_category_id"
            :label="item.name"
            :value="item.business_category_id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级类目" prop='second_category_id' v-if='type == 1'>
        <el-select v-model="form.second_category_id" placeholder="请选择">
          <el-option
            v-for="item in second_category_idList"
            :key="item.business_category_id"
            :label="item.name"
            :value="item.business_category_id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="logo" prop='logo' v-if='type == 1'>
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :before-upload="beforeAvatarUploadLogo">
          <img v-if="form.logo" :src="form.logo" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="商家描述" prop='desc_info' v-if='type == 1'>
        <el-input type='textarea' v-model="form.desc_info" placeholder='请输入内容'></el-input>
      </el-form-item>
      <el-form-item label="商家头图" prop='img_master' v-if='type == 1'>
        <el-upload
          action="http://upload-z2.qiniu.com"
          list-type="picture-card" :file-list="form.img_master" :before-upload="beforeAvatarUploadImg_master" multiple
          :on-preview="handlePictureCardPreview" :limit="5"
          :on-exceed="handleExceed"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImages" alt="形象图片">
        </el-dialog>
      </el-form-item>
      <el-form-item label="宣传图片" prop='img_publicity' v-if='type == 1'>
        <el-upload
          action="http://upload-z2.qiniu.com"
          list-type="picture-card" :file-list="form.img_publicity" :before-upload="beforeAvatarUploadImg_publicity" multiple
          :on-preview="handlePictureCardPreview" :limit="5"
          :on-exceed="handleExceed"
          :on-remove="handleRemoveImg_publicity">
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="详细位置" prop='county'>
        <el-select v-model="form.province" @change='firstChange' placeholder="请选择">
          <el-option
            v-for="item in area_json"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="form.city" @change='secondChange' placeholder="请选择">
          <el-option
            v-for="item in area_json2"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="form.county"  placeholder="请选择">
          <el-option
            v-for="item in area_json3"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <input style='margin-top: 10px;' name="suggestId" id="suggestId" class="el-input__inner" placeholder='请输入详细地址' v-model='form.address'/>
        <div id="searchResultPanel" style="border:1px solid #C0C0C0;width:150px;height:auto;display: none;"></div>
      </el-form-item>

      <el-form-item>
        <div id="l-map"></div>
      </el-form-item>


      <el-form-item label="营业时间" prop='time_do'>
        <el-input v-model="form.time_do" placeholder='请输入内容'></el-input>
      </el-form-item>
      <el-form-item label="人均消费" prop='expense_avg'>
        <el-input v-model="form.expense_avg" placeholder='请输入内容'></el-input>
      </el-form-item>
      <el-form-item label="商家环境" prop='img_master' v-if='type == 2'>
        <el-upload
          action="http://upload-z2.qiniu.com"
          list-type="picture-card" :file-list="form.img_master" :before-upload="beforeAvatarUploadImg_master" multiple
          :on-preview="handlePictureCardPreview" :limit="5"
          :on-exceed="handleExceed"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImages" alt="形象图片">
        </el-dialog>
      </el-form-item>
      <el-form-item label="费率设置" prop='rating_ratio' v-if='type == 1'>
        <el-input v-model="form.rating_ratio" placeholder='请输入内容'></el-input>
      </el-form-item>
      <el-form-item label="反银贝比例" prop='back_silver_ratio' v-if='type == 1'>
        <el-input v-model="form.back_silver_ratio" placeholder='请输入内容'></el-input>
      </el-form-item>
      <el-form-item label="推荐人id" v-if='type == 1'>
        <el-input v-model="form.recommend_user_id" placeholder='请输入内容'></el-input>
      </el-form-item>
      <el-form-item label="反推荐人比例" v-if='type == 1'>
        <el-input v-model="form.recommend_back_ratio" placeholder='请输入内容'></el-input>
      </el-form-item>
      <el-form-item label="" v-if='type == 2'>
        <span>餐桌配置</span>
      </el-form-item>
      <el-form-item label="" v-if='type == 2'>
        <el-row>
          <el-col :span='4'>
            <el-input v-model="table_edit.table_num" placeholder='餐桌数量'></el-input>
          </el-col>
          <el-col :span='4'>
            <el-input v-model="table_edit.population" placeholder='每个餐桌可坐人数'></el-input>
          </el-col>
          <el-col :span='4'>
            <el-button @click='addTable_edit'>添加</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label='可坐人数' v-if='type == 2'>
        <el-table :data="table_setting" border style='width: 50%;'>
          <el-table-column
            prop="table_num"
            label="餐桌数量"
            min-width="120" align='center'>
            <template slot-scope="scope">
              <template v-if="scope.row.editable">
                <el-input class="edit-input" size="small" v-model="scope.row.table_num"></el-input>
              </template>
              <span v-else>{{ scope.row.table_num }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="population"
            label="每个餐桌可坐人数"
            min-width="120" align='center'>
            <template slot-scope="scope">
              <template v-if="scope.row.editable">
                <el-input class="edit-input" size="small" v-model="scope.row.population"></el-input>
              </template>
              <span v-else>{{ scope.row.population }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="order_id"
            label="操作"
            min-width="180" align='center'>
            <template slot-scope="scope">
              <el-button v-if="scope.row.editable" type="success" @click="confirmEdit(scope)" size="small" icon="el-icon-circle-check-outline">保存</el-button>
              <el-button v-else type="primary" plain @click='scope.row.editable=!scope.row.editable'>编辑</el-button>
              <el-button v-if="scope.row.editable"  class='cancel-btn' size="small" icon="el-icon-refresh" type="warning" @click="cancelEdit(scope.row)">取消</el-button>
              <el-button v-else type="primary" plain @click='deleteSetting(scope)'>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item v-if='type == 2'>
        <el-button @click='addTableSure'>生成编号</el-button>
      </el-form-item>
      <el-form-item label='餐桌编号' v-if='type == 2'>
        <el-table border :data='table_info' style='width: 50%;'>
          <el-table-column
            prop="no"
            label="餐桌编号"
            min-width="120" align='center'>
            <template slot-scope="scope">
              <template v-if="scope.row.editable">
                <el-input class="edit-input" size="small" v-model="scope.row.no"></el-input>
              </template>
              <span v-else>{{ scope.row.no }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="population"
            label="可坐人数"
            min-width="120" align='center'>
          </el-table-column>
          <el-table-column
            prop="order_id"
            label="操作"
            min-width="180" align='center'>
            <template slot-scope="scope">
              <el-button v-if="scope.row.editable" type="success" @click="confirmEdit2(scope.row)" size="small" icon="el-icon-circle-check-outline">保存</el-button>
              <el-button v-else type="primary" plain @click='scope.row.editable=!scope.row.editable'>编辑</el-button>
              <el-button v-if="scope.row.editable"  class='cancel-btn' size="small" icon="el-icon-refresh" type="warning" @click="cancelEdit2(scope.row)">取消</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button type="danger" @click="resetBusinessPwd" v-if='form.business_offline_id'>重置密码</el-button>

      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import area from '@/area.json'
  export default {
    components: {

    },
    data() {
      return {
        baiduMap: {},
        baiduAc: {},
        baiduAddress: '',
        local: {},
        form: {
          address: '',
          license: '',
          name: '',
          operator: '',
          mobile: '',
          tel: '',
          bank_account: '',
          bank_name: '',
          bank_network: '',
          ali_account: '',
          ali_username: '',
          first_category_id: '',
          second_category_id: '',
          desc_info: '',
          img_master: [],
          img_publicity: [],
          time_do: '',
          expense_avg: '',
          rating_ratio: '',
          province: '',
          city: '',
          county: '',
          is_retention: -1,
          insert_package_status: 1,
          back_silver_ratio: '',
          recommend_user_id: '',
          recommend_back_ratio: '',
          sms_mobile: '',
          logo: '',
        },
        longitude_latitude: {
          lng: 0,
          lat: 0
        },
        map: {},
        marker: false,
        type: '',
        table_edit: {editable: false, table_num: '', population: ''},
        table_info: [], // 餐桌详情
        table_setting: [], // 餐桌设置
        dialogImages: '',
        dialogVisible: false,
        first_category_idList: [], // 一级类目列表
        second_category_idList: [], // 二级类目列表
        area_json: [], // 地址
        area_json2: [], // 地址
        area_json3: [], // 地址
        phoneBool: false,
        rules: {
          license: [{ required: true, message: '请上传营业执照', trigger: 'blur' }],
          name: [{ required: true, message: '请输入商家名称', trigger: 'blur' }],
          operator: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
          mobile: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
          tel: [{ required: true, message: '请输入固定电话', trigger: 'blur' }],
//          bank_account: [{ required: true, message: '请输入银行账号', trigger: 'blur' }],
//          bank_name: [{ required: true, message: '请输入银行名称', trigger: 'blur' }],
//          bank_network: [{ required: true, message: '请输入银行网点', trigger: 'blur' }],
//          ali_account: [{ required: true, message: '请输入支付宝账号', trigger: 'blur' }],
//          ali_username: [{ required: true, message: '请输入支付宝姓名', trigger: 'blur' }],
          sms_mobile: [{ required: true, message: '请输入短信通知电话', trigger: 'blur' }],
          first_category_id: [{ required: true, message: '请选择类目', trigger: 'blur' }],
          second_category_id: [{ required: true, message: '请选择类目', trigger: 'blur' }],
          desc_info: [{ required: true, message: '请输入描述', trigger: 'blur' }],
          img_master: [{ required: true, message: '请输入描述', trigger: 'blur' }],
          img_publicity: [{ required: true, message: '请输入描述', trigger: 'blur' }],
          time_do: [{ required: true, message: '请输入描述', trigger: 'blur' }],
          expense_avg: [{ required: true, message: '请输入描述', trigger: 'blur' }],
          rating_ratio: [{ required: true, message: '请输入描述', trigger: 'blur' }],
          back_silver_ratio: [{ required: true, message: '请输入描述', trigger: 'blur' }],
          county: [{ required: true, message: '请输入描述', trigger: 'blur' }],
          logo: [{ required: true, message: '请上传logo', trigger: 'change' }]
        }
      }
    },
    mounted: function() {
      this.initBaiDuMap()
    },
    created(){
      this.area_json = area.area_json
      this.type = this.$route.query.type
      if (this.$route.query.business_offline_id) {
        this.phoneBool = true
        this.$axios({
          type: 'post',
          url: '/business/offlinegetdetailed',
          data: {business_offline_id: this.$route.query.business_offline_id},
          fuc: (res) => {
            this.first_category_idChange(res.data.first_category_id)
//            this.form = JSON.parse(JSON.stringify(res.data))
            for (let val in res.data) {
              if (val != 'img_master' && val != 'license' && val !='img_publicity' && res.data[val] == 0 || res.data[val]) {
                this.form[val] = res.data[val]
              }
            }
            if (this.type == 1) {
              this.form.logo = res.data.logo_path + res.data.logo
              let arr1 = []
              for (let val of res.data.img_publicity) {
                arr1.push({url: res.data.img_publicity_path + val})
              }
              this.form.img_publicity = arr1
            } else {
              let table_infoArr = JSON.parse(res.data.table_info)
              for (let val of table_infoArr) {
                val.editable = false
                val.originalNo = table_infoArr.no
              }

              let table_settingArr = JSON.parse(res.data.table_setting)
              for (let val of table_settingArr) {
                val.editable = false
                val.originalTable_num = table_infoArr.table_num
                val.originalPopulation = table_infoArr.population
              }
              this.table_info = table_infoArr
              this.table_setting = table_settingArr
            }
            this.longitude_latitude.lng = parseFloat(res.data.longitude_latitude.split(',')[0])
            this.longitude_latitude.lat = parseFloat(res.data.longitude_latitude.split(',')[1])
            this.form.license = res.data.license_path + res.data.license
            this.form.province = this.form.province + ''
            this.firstChange(res.data.province)
            this.form.city = res.data.city + ''
            this.secondChange(res.data.city)
            this.form.county = res.data.county + ''
            let arr = []
            console.log(5, res.data)
            for (let val of res.data.img_master) {
              arr.push({url: res.data.img_master_path + val})
            }
            this.form.img_master = arr
            console.log(this.form, this.longitude_latitude)
            this.form.business_offline_id = this.$route.query.business_offline_id
            this.$nextTick(() => {
//              this.baiduMap.centerAndZoom(this.longitude_latitude, 18)
//              this.baiduMap.addOverlay(new BMap.Marker(this.longitude_latitude))
              if(!this.marker){

//            this.baiduMap.clearOverlays()
                this.marker = new BMap.Marker(this.longitude_latitude);
                this.baiduMap.addOverlay(this.marker);
                this.marker.enableDragging();
              }
              else{
                this.marker.setPosition(point)
              }
              this.dragCallback()
            })
          }
        })
      }
      this.$axios({
        type: 'post',
        url: '/business/categorygettree',
        data: {},
        fuc: (res) => {
          this.first_category_idList = res.data
        }
      })
    },
    methods: {
      initBaiDuMap() {
        this.baiduMap = new BMap.Map('l-map')
        this.baiduMap.centerAndZoom('成都', 12)
        this.baiduMap.enableScrollWheelZoom(true)

//        this.baiduMap.addEventListener("click",(e) => {
//          alert(e.point.lng + "," + e.point.lat);
//        });
//        var menu = new BMap.ContextMenu();
//        var txtMenuItem = [
//          {
//            text:'取点',
//            callback:(e) => {
//              console.log(e)
//              this.baiduMap.clearOverlays()
//              this.baiduMap.addOverlay(new BMap.Marker(e))
////              marker.enableDragging(); //标注可拖拽
////               //marker.disableDragging();           // 不可拖拽
////
////               // 开启事件监听
////              marker.addEventListener("dragend", function (e) {
////
////                 var x = e.point.lng; //经度
////                 var y = e.point.lat; //纬度
////                 alert("拖到的地点的经纬度：" + x + "，" + y);
////
////             });
//            }
//          }
//        ]
//        for(var i=0; i < txtMenuItem.length; i++){
//          menu.addItem(new BMap.MenuItem(txtMenuItem[i].text,txtMenuItem[i].callback,100));
//        }
//        this.baiduMap.addContextMenu(menu)


//        var marker=false;
        this.baiduMap.addEventListener("rightclick", (e) => {
          var lng=e.point.lng;
          var lat=e.point.lat;
          var point = new BMap.Point(lng, lat);
          this.longitude_latitude.lat = lat
          this.longitude_latitude.lng = lng
          console.log(this.longitude_latitude)
          if(!this.marker){

//            this.baiduMap.clearOverlays()
            this.marker = new BMap.Marker(point);
            this.baiduMap.addOverlay(this.marker);
            this.marker.enableDragging();
          }
          else{
            this.marker.setPosition(point)
          }
          this.dragCallback()
        });
        this.baiduAc = new BMap.Autocomplete({ input: 'suggestId', location: this.baiduMap })
        this.baiduAc.addEventListener('onhighlight', function(e) {
          console.log(654321)
          console.log('times')
          var str = ''
          var _value = e.fromitem.value
          var value = ''
          if (e.fromitem.index > -1) {
            value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business
          }
          str = 'FromItem<br />index = ' + e.fromitem.index + '<br />value = ' + value

          value = ''
          if (e.toitem.index > -1) {
            _value = e.toitem.value
            value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business
          }
          str += '<br />ToItem<br />index = ' + e.toitem.index + '<br />value = ' + value
          document.getElementById('searchResultPanel').innerHTML = str
        })
        const _this = this
        this.baiduAc.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
          var _value = e.item.value
          // 获取选择地址
          _this.baiduAddress = _value.business
          _this.form.address = _value.province +  _value.city +  _value.district +  _value.street +  _value.business
          document.getElementById("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + _value.business
          console.log(123456)
          _this.setPlace()
        })
      },
      setPlace() {
//        this.baiduMap.clearOverlays()   //清除地图上所有覆盖物
        const _this = this
        _this.local = new BMap.LocalSearch(this.baiduMap, { //智能搜索
          onSearchComplete: function() {
            var pp = _this.local.getResults().getPoi(0).point    //获取第一个智能搜索的结果
            _this.longitude_latitude.lat = pp.lat
            _this.longitude_latitude.lng = pp.lng
            _this.baiduMap.centerAndZoom(pp, 18)

            if(!_this.marker){

//              _this.baiduMap.clearOverlays()
              _this.marker = new BMap.Marker(pp);
              _this.baiduMap.addOverlay(_this.marker);
              _this.marker.enableDragging();
            }
            else{
              _this.marker.setPosition(pp)
            }
            _this.dragCallback()
//            _this.baiduMap.addOverlay(new BMap.Marker(pp))    //添加标注
            _this.updateSelect()
          }
        })
        _this.local.search(_this.baiduAddress)
      },
      updateSelect() {
        const _this = this
        console.log(1, this.longitude_latitude.lng, this.longitude_latitude.lat && this.longitude_latitude.lng)
        if (this.longitude_latitude.lat && this.longitude_latitude.lng) {
          console.log(1, this.longitude_latitude)
          var point = new BMap.Point(this.longitude_latitude.lng, this.longitude_latitude.lat)
          console.log('point', point)
          var geoc = new BMap.Geocoder()
          geoc.getLocation(point, function(rs) {
            var addComp = rs.addressComponents
             console.log(addComp, addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber)
            _this.area_json.forEach(function(one) {
              if (one.name === addComp.province) {
                _this.firstChange(one.id)
                _this.form.province = one.id
              }
            })
            _this.area_json2.forEach(function(two) {
              if(two.name === addComp.city) {
                _this.secondChange(two.id)
                _this.form.city = two.id
              }
            })
            _this.area_json3.forEach(function(three) {
              if(three.name === addComp.district) {
                _this.form.county = three.id
              }
            })
          })
        }
      },

      infohtmlset (pois) {
        console.log('infohtmlset', pois, pois.clearOverlays)
        this.longitude_latitude = pois.point
//        debugger
        console.log(pois.originInstance)
//        this.clearResults()
//        debugger
      },
      dragCallback () {
        this.marker.addEventListener("dragend", (e) => {
          var x = e.point.lng; //经度
          var y = e.point.lat; //纬度
          this.longitude_latitude.lat = y
          this.longitude_latitude.lng = x
       })
      },
      onSubmit () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let _form = JSON.parse(JSON.stringify(this.form))
            if (this.type == 1 && _form.logo.indexOf(_form.logo_path) > -1) {
              _form.logo = _form.logo.split(_form.logo_path)[1]
            }
            if (_form.license.indexOf(_form.license_path) > -1) {
              _form.license = _form.license.split(_form.license_path)[1]
            }
            let arr = []
            for (let val of _form.img_master) {
              if (val.url.indexOf(this.form.img_master_path) > -1) {
                arr.push(val.url.split(this.form.img_master_path)[1])
              } else {
                arr.push(val.url)
              }
            }
            _form.img_master = arr
            let arr1 = []
            for (let val of _form.img_publicity) {
              if (val.url.indexOf(this.form.img_publicity_path) > -1) {
                arr1.push(val.url.split(this.form.img_publicity_path)[1])
              } else {
                arr1.push(val.url)
              }
            }
            console.log(this.longitude_latitude.lng)
            _form.longitude_latitude = `${this.longitude_latitude.lng},${this.longitude_latitude.lat}`
            _form.img_publicity = arr1
            _form.type = this.type
            if (_form.type == 2) {
              let _table_info = JSON.parse(JSON.stringify(this.table_info))
              for (let val of _table_info) {
                delete val.editable
                delete val.originalNo
              }
              let _table_setting = JSON.parse(JSON.stringify(this.table_setting))
              for (let val of _table_setting) {
                delete val.editable
                delete val.originalTable_num
                delete val.originalPopulation
              }
              _form.table_info = JSON.stringify(_table_info)
              _form.table_setting = JSON.stringify(_table_setting)
            }

            console.log(_form)
            this.$axios({
              type: 'post',
              url: this.$route.query.business_offline_id ? '/business/offlineedit' : '/business/offlineadd',
              data: _form,
              fuc: (res) => {
                this.$deleteOneTag('/business/unlineBusinessList')
              }
            })
          }
        })
//        this.$deleteOneTag('/business/onlineBusinessList')
      },
      handleExceed(files, fileList) {
        console.log('exceed', files, fileList)
        this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeAvatarUpload (file) {
        let _this = this
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e){
          _this.form.license = this.result // 这个就是base64编码了
        }
        return false
      },
      beforeAvatarUploadLogo (file) {
        let _this = this
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e){
          _this.form.logo = this.result // 这个就是base64编码了
        }
        return false
      },
      beforeAvatarUploadImg_master (file) {
        let _this = this
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e){
          _this.form.img_master.push({url: this.result})  // 这个就是base64编码了
          if (_this.form.img_master.length >= 5) {
            document.getElementsByClassName('el-upload el-upload--picture-card')[0].style.display = 'none'
          }
        }
        return false
      },
      resetBusinessPwd () {
        this.$axios({
          type: 'post',
          url: '/business/offlinesetpassword',
          data: {
            business_offline_id: this.form.business_offline_id,
            password: '123456'
          },
          fuc: (res) => {
            if (res.code == 200) {
              this.$message.success('重置密码成功')
            }
          }
        })
      },
      beforeAvatarUploadImg_publicity (file) {
        let _this = this
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e){
          _this.form.img_publicity.push({url: this.result})  // 这个就是base64编码了
          if (_this.form.img_publicity.length >= 5) {
            document.getElementsByClassName('el-upload el-upload--picture-card')[1].style.display = 'none'
          }
        }
        return false
      },
      handlePictureCardPreview(file) {
        this.dialogImages = file.url;
        this.dialogVisible = true;
      },
      handleRemove(file, fileList) {
        for (let val in this.form.img_master) {
          if (this.form.img_master[val].uid === file.uid) {
            this.form.img_master.splice(val, 1)
          }
        }
        console.log(this.form.img_master)
        if (this.form.img_master.length < 5) {
          document.getElementsByClassName('el-upload el-upload--picture-card')[0].style.display = 'inline-block'
        }
      },
      handleRemoveImg_publicity(file, fileList) {
//        console.log(file)
        for (let val in this.form.img_publicity) {
          if (this.form.img_publicity[val].uid === file.uid) {
            this.form.img_publicity.splice(val, 1)
          }
        }
        if (this.form.img_publicity.length < 5) {
          document.getElementsByClassName('el-upload el-upload--picture-card')[1].style.display = 'inline-block'
        }
      },
      first_category_idChange (id) {
        for (let val of this.first_category_idList) {
//          debugger
          if (val.business_category_id === id) {
            this.second_category_idList = val.child
            this.form.second_category_id = ''
          }
        }
      },
      firstChange (id) {
        for (let val of this.area_json) {
          if (val.id == id) {
            this.area_json2 = val.child
            this.form.city = ''
            this.form.county = ''
          }
        }
      },
      secondChange (id) {
        for (let val of this.area_json2) {
          if (val.id == id) {
            this.area_json3 = val.child
            this.form.county = ''
          }
        }
      },
      changeIs_retention () {
        this.form.is_retention = this.form.is_retention == 1 ? -1 : 1
      },
      changeInsert_package_status () {
        this.form.insert_package_status = this.form.insert_package_status == 1 ? 0 : 1
      },
      addTable_edit () {
        for (let val of this.table_setting) {
          if (this.table_edit.population == val.population) {
            this.$message.error('添加失败，每个餐桌人数不可重复')
            return
          }
        }
        let _form = JSON.parse(JSON.stringify(this.table_edit))
        this.table_setting.push({originalTable_num: _form.table_num, originalPopulation: _form.population, ..._form})
        this.table_edit.table_num = ''
        this.table_edit.population = ''
        this.$message.success('添加成功')
      },
      addTableSure () {
        let num = 1
        this.table_info = []
        for (let val of this.table_setting) {
          for (let n = 0; n < parseInt(val.table_num); n++) {
            this.table_info.push({editable: false, originalNo: num, no: num++, population: val.population})
          }
        }
        console.log(this.table_info)
      },
      cancelEdit(row) {
        console.log(row)
        row.table_num = row.originalTable_num
        row.population = row.originalPopulation
        row.editable = false
        this.$message({
          message: '取消编辑',
          type: 'warning'
        })
      },
      confirmEdit(scope) {
        let row = scope.row
        row.editable = false
        for (let index in this.table_setting) {
          if (index != scope.$index && row.population == this.table_setting[index].originalPopulation) {
            row.table_num = row.originalTable_num
            row.population = row.originalPopulation
            this.$message.error('修改失败，每个餐桌人数不可重复')
            return
          }
        }
        row.originalTable_num = row.table_num
        row.originalPopulation = row.population
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      },
      cancelEdit2(row) {
        row.no = row.originalNo
        row.editable = false
        this.$message({
          message: '取消编辑',
          type: 'warning'
        })
      },
      confirmEdit2(scope) {
        let row = scope.row
        row.editable = false
        for (let index in this.table_info) {
          if (index != scope.$index && row.no == this.table_info[index].originalNo) {
            row.no = row.originalNo
            this.$message.error('修改失败，每个餐桌编号不可重复')
            return
          }
        }
        row.originalNo = row.no
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      },
      deleteSetting (scope) {
        this.table_setting.splice(scope.$index, 1)
      }
    }
  }
</script>
<style scoped="true">
  .unlineBusinessDetail{
    margin: 10px 20px 0;
    overflow: hidden;
  }
  .unlineBusinessDetail>.el-form{
/*    width: 100%;*/
    margin: 20px;
  }
  .unlineBusinessDetail>.el-form .el-input{
    max-width: 400px;
  }
  .map {
    width: 100%;
/*    height: 300px;*/
    overflow: hidden;
  }
</style>
<style>
  #l-map{height:300px;width:100%;}
  #r-result{width:100%;}
  .map>div:first-child{
    width: 100%;
    height: 300px !important;
  }
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
