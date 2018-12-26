<template>
  <div class="onlineBusinessDetail">
    <el-form ref="form" :model="form" label-width="120px" :rules='rules' v-if="nextType == 1">
      <el-form-item>
        <span>认证信息</span>
      </el-form-item>
      <el-form-item label="营业执照" prop='licenseImage' required>
        <el-upload
          class="avatar-uploader"
          action="http://192.168.100.122:5110/bhs-fileserver/file/uploadSingle"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload">
          <img v-if="form.licenseImage" :src="form.licenseImage" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="商家名称" prop='name'>
        <el-input v-model="form.name" placeholder='请输入商家名称'></el-input>
      </el-form-item>
      <el-form-item label="联系人" prop='linkName'>
        <el-input v-model="form.linkName" placeholder='请输入联系人'></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop='linkMobile'>
        <el-input v-model="form.linkMobile" placeholder='请输入联系电话'></el-input>
      </el-form-item>
<!--
      <el-form-item label="固定电话" prop='tel'>
        <el-input v-model="form.tel" placeholder='请输入固定电话'></el-input>
      </el-form-item>
-->
      <el-form-item label="短信接收电话" prop='messageMobile'>
        <el-input v-model="form.messageMobile" placeholder='短信接收电话'></el-input>
      </el-form-item>
      <el-form-item label="开户银行账户" prop='bankNumber'>
        <el-input v-model="form.bankNumber" placeholder='请输入开户银行账户'></el-input>
      </el-form-item>
      <el-form-item label="开户银行名称" prop='bankName'>
        <el-input v-model="form.bankName" placeholder='请输入开户银行名称'></el-input>
      </el-form-item>
      <el-form-item label="开户银行网点" prop='bankPath'>
        <el-input v-model="form.bankPath" placeholder='请输入开户银行网点'></el-input>
      </el-form-item>
      <el-form-item label="支付宝账号" prop='alipayNumber'>
        <el-input v-model="form.alipayNumber" placeholder='请输入支付宝账号'></el-input>
      </el-form-item>
      <el-form-item label="微信账号" prop='wechatNumber'>
        <el-input v-model="form.wechatNumber" placeholder='请输入微信账号'></el-input>
      </el-form-item>
      <el-form-item label="商家账号" prop='registerMobile'>
        <el-input v-model="form.registerMobile" placeholder='请输入商家账号（手机号码）' :disabled="type == 1"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="netxBtn" v-if="type == 0">下一步</el-button>
        <el-button @click="netxBtnSave" v-if="type == 1">保存</el-button>
        <el-button @click="netxBtnNoSave" v-if="type == 1">编辑商家属性</el-button>
      </el-form-item>
    </el-form>
    
    <el-form ref="nextForm" :model="nextForm" label-width="120px" :rules='rules' v-else-if="nextType == 2">
      <el-form-item label="" prop=''>
        线上商家<el-switch
          v-model="nextForm.createOnline"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :active-value="1"
          :inactive-value="0" :disabled="type == 21 || type == 22 || type == 23">
        </el-switch>
        &nbsp;&nbsp;&nbsp;线下商家<el-switch
          v-model="nextForm.createOffline"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :active-value="1"
          :inactive-value="0" @change="unlineChange" :disabled="type == 21 || type == 22 || type == 23">
        </el-switch>
        &nbsp;&nbsp;&nbsp;点餐商家<el-switch
          v-model="nextForm.createMenus"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :active-value="1"
          :inactive-value="0" @change="menulineChange" :disabled="type == 21 || type == 22 || type == 23">
        </el-switch>
      </el-form-item>
      
<!--      //线上商家-->
      <el-form-item v-if="nextForm.createOnline == 1 && type != 23 && type != 22">
        <span>线上商家</span>
      </el-form-item>
      <el-form-item v-if="nextForm.createOnline == 1 && type != 23 && type != 22" label="对应类目" prop="onlineModuleRecVo.category" :rules="rules.category">
        <el-select multiple v-model='nextForm.onlineModuleRecVo.category' placeholder='请选择对应类目'>
          <el-option v-for='item in categoryList' :label='item.name' :key='item.id' :value='item.id'></el-option>
        </el-select>
      </el-form-item>
      
      <el-form-item label="退货收件人名称" v-if="nextForm.createOnline == 1 && type != 23 && type != 22" prop="onlineModuleRecVo.backUserName" :rules="rules.backUserName">
        <el-input v-model="nextForm.onlineModuleRecVo.backUserName" placeholder='请输入退货收件人'></el-input>
      </el-form-item>
      
      <el-form-item label="退货收件人电话" v-if="nextForm.createOnline == 1 && type != 23 && type != 22" prop="onlineModuleRecVo.backUserMobile" :rules="rules.backUserMobile">
        <el-input v-model="nextForm.onlineModuleRecVo.backUserMobile" placeholder='请输入退货收件人电话'></el-input>
      </el-form-item>
      
      <el-form-item label="退货邮寄地址" v-if="nextForm.createOnline == 1 && type != 23 && type != 22" prop="onlineModuleRecVo.backUserMobile" :rules="rules.backUserMobile">
        <el-input v-model="nextForm.onlineModuleRecVo.backAddress" placeholder='请输入退货邮寄地址'></el-input>
      </el-form-item>
      
      
<!--      //线下商家-->
      
      <el-form-item v-if="nextForm.createOffline == 1 && type != 23 && type != 21">
        <code>线下商家</code>
      </el-form-item>
      <el-form-item label="对应类目" v-if="nextForm.createOffline == 1 && type != 23 && type != 21" prop="offlineModuleRecVo.category" :rules="rules.category">
        <el-select multiple v-model='nextForm.offlineModuleRecVo.category' placeholder='请选择对应类目'>
          <el-option v-for='item in categoryListUnline' :label='item.name' :key='item.id' :value='item.id'></el-option>
        </el-select>
      </el-form-item>
      
      <el-form-item label="logo" v-if="nextForm.createOffline == 1 && type != 23 && type != 21" prop='offlineModuleRecVo.logo' :rules="rules.logo">
        <el-upload
          class="avatar-uploader"
          action="http://192.168.100.122:5110/bhs-fileserver/file/uploadSingle"
          :show-file-list="false"
          :before-upload="beforeAvatarUploadLogo">
          <img v-if="nextForm.offlineModuleRecVo.logo" :src="nextForm.offlineModuleRecVo.logo" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <span>此处为商家列表展示图（400*400）</span>
      </el-form-item>
      
      <el-form-item label="商家展示图" prop='offlineModuleRecVo.images' :rules="rules.images" v-if='nextForm.createOffline == 1 && type != 23 && type != 21'>
        <el-upload
          action="http://upload-z2.qiniu.com"
          list-type="picture-card" :file-list="nextForm.offlineModuleRecVo.images" :before-upload="beforeAvatarUploadimages" multiple
          :on-preview="handlePictureCardPreview" :limit="9"
          :on-exceed="handleExceed"
          :on-remove="handleRemoveimages">
          <i class="el-icon-plus"></i>
        </el-upload>
        <span>此处为商家详情页展示轮播图（750*300）</span>
      </el-form-item>
      
      
      <el-form-item v-if='nextForm.createOffline == 1 && type != 23 && type != 21' label="详细位置" prop='offlineModuleRecVo.county' :rules="rules.county">
        <el-select v-model="nextForm.offlineModuleRecVo.province" @change='firstChange' placeholder="请选择">
          <el-option
            v-for="item in area_json"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="nextForm.offlineModuleRecVo.city" @change='secondChange' placeholder="请选择">
          <el-option
            v-for="item in area_json2"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="nextForm.offlineModuleRecVo.county"  placeholder="请选择">
          <el-option
            v-for="item in area_json3"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <input style='margin-top: 10px;' name="suggestId" id="suggestId" class="el-input__inner" placeholder='请输入详细地址' v-model='nextForm.offlineModuleRecVo.address'/>
        <div id="searchResultPanel" style="border:1px solid #C0C0C0;width:150px;height:auto;display: none;"></div>
      </el-form-item>

      <el-form-item v-if='nextForm.createOffline == 1 && type != 23 && type != 21'>
        <div id="l-map"></div>
      </el-form-item>
      
      <el-form-item label="营业时间" v-if="nextForm.createOffline == 1 && type != 23 && type != 21" prop="offlineModuleRecVo.businessHours" :rules="rules.businessHours">
        <el-input v-model="nextForm.offlineModuleRecVo.businessHours" placeholder='请输入营业时间'></el-input>
      </el-form-item>
      
      <el-form-item label="人均消费" v-if="nextForm.createOffline == 1 && type != 23 && type != 21" prop="offlineModuleRecVo.avgPrice" :rules="rules.avgPrice">
        <el-input v-model.number="nextForm.offlineModuleRecVo.avgPrice" placeholder='请输入人均消费'></el-input>
      </el-form-item>
      
      <el-form-item label="费率设置" v-if="nextForm.createOffline == 1 && type != 23 && type != 21" prop="offlineModuleRecVo.commission" :rules="rules.commission">
        <el-input v-model="nextForm.offlineModuleRecVo.commission" placeholder='请输入费率设置'></el-input>
      </el-form-item>
      
      <el-form-item label="反银贝比列" v-if="nextForm.createOffline == 1 && type != 23 && type != 21" prop="offlineModuleRecVo.returnSilverRatio" :rules="rules.returnSilverRatio">
        <el-input v-model="nextForm.offlineModuleRecVo.returnSilverRatio" placeholder='请输入反银贝比列'></el-input>
      </el-form-item>
      
      
<!--      点餐商家-->
      
      
      <el-form-item v-if="nextForm.createMenus == 1 && type != 22 && type != 21">
        <code>点餐商家</code>
      </el-form-item>
      <el-form-item v-if='nextForm.createMenus == 1 && type != 22 && type != 21' label="详细位置" prop='menusModuleRecVo.county' :rules="rules.county">
        <el-select v-model="nextForm.menusModuleRecVo.province" @change='firstChangeMenu' placeholder="请选择">
          <el-option
            v-for="item in area_json"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="nextForm.menusModuleRecVo.city" @change='secondChangeMenu' placeholder="请选择">
          <el-option
            v-for="item in area_json2Menu"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="nextForm.menusModuleRecVo.county"  placeholder="请选择">
          <el-option
            v-for="item in area_json3Menu"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <input style='margin-top: 10px;' name="suggestIdMenu" id="suggestIdMenu" class="el-input__inner" placeholder='请输入详细地址' v-model='nextForm.menusModuleRecVo.address'/>
        <div id="searchResultPanelMenu" style="border:1px solid #C0C0C0;width:150px;height:auto;display: none;"></div>
      </el-form-item>

      <el-form-item v-if='nextForm.createMenus == 1 && type != 22 && type != 21'>
        <div id="l-mapMenu"></div>
      </el-form-item>
      
      <el-form-item label="营业时间" v-if="nextForm.createMenus == 1 && type != 22 && type != 21" prop="menusModuleRecVo.businessHours" :rules="rules.businessHours">
        <el-input v-model="nextForm.menusModuleRecVo.businessHours" placeholder='请输入营业时间'></el-input>
      </el-form-item>
      
      <el-form-item label="人均消费" v-if="nextForm.createMenus == 1 && type != 22 && type != 21" prop="menusModuleRecVo.avgPrice" :rules="rules.avgPrice">
        <el-input v-model.number="nextForm.menusModuleRecVo.avgPrice" placeholder='请输入人均消费'></el-input>
      </el-form-item>
      
<!--      餐桌配置-->
      <el-form-item label="餐桌配置" v-if='nextForm.createMenus == 1 && type != 22 && type != 21'>
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
      <el-form-item label='可坐人数' v-if='nextForm.createMenus == 1 && type != 22 && type != 21'>
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
      <el-form-item v-if='nextForm.createMenus == 1 && type != 22 && type != 21'>
        <el-button @click='addTableSure'>生成编号</el-button>
      </el-form-item>
      <el-form-item label='餐桌编号' v-if='nextForm.createMenus == 1 && type != 22 && type != 21'>
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
<!--        <el-button type="danger" @click="resetBusinessPwd" v-if='businessId'>重置密码</el-button>-->
      </el-form-item>
      
    </el-form>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImages" alt="形象图片">
    </el-dialog>
  </div>
</template>
<script>
  import area from '@/area.json'
  export default {
    data () {
      return {
        businessId: '',
        area_json: [], // 地址
        area_json2: [], // 地址
        area_json3: [], // 地址
        map: {},
        marker: false,
        baiduMap: {},
        baiduAc: {},
        baiduAddress: '',
        local: {},
        
//        点餐
        table_edit: {editable: false, table_num: '', population: ''},
        table_info: [], // 餐桌详情
        table_setting: [], // 餐桌设置
        
        area_json2Menu: [], // 地址
        area_json3Menu: [], // 地址
        mapMenu: {},
        markerMenu: false,
        baiduMapMenu: {},
        baiduAcMenu: {},
        baiduAddressMenu: '',
        localMenu: {},
        
        dialogVisible: false,
        dialogImages: '',
        
//        center: {lng: 0, lat: 0},
//        zoom: 3,
        nextType: 1,  // 1第一步，2第二步
        type: 0,  // 1第一步编辑，2第二步编辑
        categoryList: [], // 所有分类
        categoryListUnline: [], // 线下所有分类
        form: {
          licenseImage: '',
          name: '',
          linkName: '',
          linkMobile: '',
//          tel: '',
          bankNumber: '',
          bankPath: '',
          bankName: '',
          alipayNumber: '',
          wechatNumber: '',
          registerMobile: '',
          messageMobile: ''
        },
        nextForm: {
          businessId: '510114818921857024',
          createOnline: 0,
          createOffline: 0,
          createMenus: 0,
          onlineModuleRecVo: {
            backAddress: '',
            backUserMobile: '',
            backUserName: '',
            category: []
          },
          offlineModuleRecVo: {
            category: [],
            images: [],
            province: '',
            city: '',
            county: '',
            address: '',
            latitude: '',
            longitude: '',
            avgPrice: '',
            businessHours: '',
            commission: '',
            returnSilverRatio: '',
            logo: ''
          },
          menusModuleRecVo: {
            province: '',
            city: '',
            county: '',
            address: '',
            latitude: '',
            longitude: '',
            avgPrice: '',
            businessHours: '',
            tableConfig: {
              table_info: '',
              table_setting: ''
            }
          }
        },
        rules: {
//          licenseImage: [{ required: true, message: '请上传营业执照', trigger: 'blur' }],
          name: [{ required: true, message: '请输入商家名称', trigger: 'blur' }],
          registerMobile: [{ required: true, message: '请输入商家账号（手机号码）', trigger: 'blur' }],
          receiv_addr: [{ required: true, message: '请输入收货人名称', trigger: 'blur' }],
          linkName: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
          linkMobile: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
          messageMobile: [{ required: true, message: '请输入短信通知电话', trigger: 'blur' }],
//          tel: [{ required: true, message: '请输入固定电话', trigger: 'blur' }],
//          bankName: [{ required: true, message: '请输入银行账号', trigger: 'blur' }],
//          bankName: [{ required: true, message: '请输入银行名称', trigger: 'blur' }],
//          bankName: [{ required: true, message: '请输入银行网点', trigger: 'blur' }],
          alipayNumber: [{ required: true, message: '请输入支付宝账号', trigger: 'blur' }],
//          wechatNumber: [{ required: true, message: '请输入支付宝姓名', trigger: 'blur' }],
          category: [{ required: true, message: '请选择对应类目', trigger: 'change' }],
          backAddress: [{ required: true, message: '请输入', trigger: 'blur' }],
          backUserMobile: [{ required: true, message: '请输入', trigger: 'blur' }],
          backUserName: [{ required: true, message: '请输入', trigger: 'blur' }],
          logo: [{ required: true, message: '请上传logo', trigger: 'blur' }],
          images: [{ required: true, message: '请上传展示图', trigger: 'blur' }],
          province: [{ required: true, message: '请选择', trigger: 'change' }],
          city: [{ required: true, message: '请选择', trigger: 'change' }],
          county: [{ required: true, message: '请选择', trigger: 'change' }],
          address: [{ required: true, message: '请输入', trigger: 'blur' }],
          avgPrice: [{ required: true, message: '请输入', trigger: 'blur' }],
          businessHours: [{ required: true, message: '请输入', trigger: 'blur' }],
          commission: [{ required: true, message: '请输入', trigger: 'blur' }],
          returnSilverRatio: [{ required: true, message: '请输入', trigger: 'blur' }],
        }
      }
    },
    created () {
      this.type = this.$route.query.type ? this.$route.query.type : 0
      this.area_json = area.area_json
      this.$axios({
        type: 'post',
        url: '/bhs-management-admin/category/treeList',
        data: {onoffFlag: 1},
        fuc: (res) => {
          this.categoryList = res.data
        }
      })
      this.$axios({
        type: 'post',
        url: '/bhs-management-admin/category/treeList',
        data: {onoffFlag: 2},
        fuc: (res) => {
          this.categoryListUnline = res.data
        }
      })
      
      if (this.$route.query.business_id && this.$route.query.type == 1) {
        this.businessId = this.$route.query.business_id
//        console.log(this.form)
        this.$axios({
          type: 'get',
          url: '/bhs-management-admin/business/' + this.$route.query.business_id,
          data: {},
          fuc: (res) => {
            if (res.code != 1) {
              return
            }
            for (let val in this.form) {
//              debugger
              this.form[val] = res.data[val]
            }
            for (let val in this.nextForm) {
              if (res.data.moduleCreateResultVo[val] === null) continue
              this.nextForm[val] = res.data.moduleCreateResultVo[val]
              if (val === "onlineModuleRecVo") {
                this.nextForm.onlineModuleRecVo.category = this.nextForm.onlineModuleRecVo.category.split(',')
              } else if (val === "offlineModuleRecVo") {
                let arr = []
                for (let val of this.nextForm.offlineModuleRecVo.images.split(',')) {
                  arr.push({url: val})
                }
                this.nextForm.offlineModuleRecVo.images = arr
                this.nextForm.offlineModuleRecVo.category = this.nextForm.offlineModuleRecVo.category.split(',')
                
                this.unlineChange()
              }
            }
            console.log(this.nextForm)
//            this.form.logo = res.data.logo_path + res.data.logo
//            this.form.licenseImage = res.data.licenseImage_path + res.data.licenseImage
//            this.form.category = this.form.category.slice(1, this.form.category.length - 1).split(',')
//            let arr = []
//            for (let val of this.form.category) {
//              arr.push(parseInt(val))
//            }
//            this.form.category = arr
//            console.log(1, this.form)
            this.form.id = this.$route.query.business_id
          }
        })
      } else if (this.$route.query.business_id && this.$route.query.type == 21) {
        this.nextType = 2
        this.businessId = this.$route.query.business_id
        this.nextForm.businessId = this.$route.query.business_id
        this.nextForm.createOnline = 1
        this.$axios({
          type: 'get',
          url: '/bhs-management-admin/businessModule/online/byBusinessId/' + this.$route.query.business_id,
          data: {},
          fuc: (res) => {
            if (res.code == 1) {
              for (let val in this.nextForm.onlineModuleRecVo) {
                this.nextForm.onlineModuleRecVo[val] = res.data[val]
              }
            }
            this.nextForm.onlineModuleRecVo.category = this.nextForm.onlineModuleRecVo.category.split(',')
//            this.form.logo = res.data.logo_path + res.data.logo
//            this.form.licenseImage = res.data.licenseImage_path + res.data.licenseImage
//            this.form.category = this.form.category.slice(1, this.form.category.length - 1).split(',')
//            let arr = []
//            for (let val of this.form.category) {
//              arr.push(parseInt(val))
//            }
//            this.form.category = arr
//            console.log(1, this.form)
//            this.form.business_id = this.$route.query.business_id
          }
        })
      }
    },
    mounted () {
//      console.log('ready')
//      window.addEventListener('message', function(event) {
//        // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
//        var loc = event.data;
//        if (loc && loc.module == 'locationPicker') {//防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
//          console.log('location', loc);
//        }
//      }, false);
//      this.initBaiDuMap()
    },
    methods: {
      netxBtn () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$axios({
              type: this.$route.query.business_id ? 'put' : 'post',
              url: '/bhs-management-admin/business',
              data: this.form,
              fuc: (res) => {
                if (res.code == 1) {
                  if (res.data) {
                    this.nextForm.businessId = res.data
                  } else {
                    this.nextForm.businessId = this.$route.query.business_id
                  }
                  
                  this.$message.success('操作成功')
                  this.nextType = 2
                }
//                this.$deleteOneTag('/business/onlineBusinessList')
              }
            })
          }
        })
      },
      netxBtnSave () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$axios({
              type: this.$route.query.business_id ? 'put' : 'post',
              url: '/bhs-management-admin/business',
              data: this.form,
              fuc: (res) => {
                if (res.code == 1) {
                  this.$message.success('操作成功')
                  this.$deleteOneTag('/business/businessAccount')
                }
              }
            })
          }
        })
      },
      netxBtnNoSave () {
        this.nextType = 2
      },
      onSubmit () {
        this.$refs['nextForm'].validate((valid) => {
          if (valid) {
            let _nextForm = JSON.parse(JSON.stringify(this.nextForm))
            
//            if (_nextForm.createOnline) {
            _nextForm.onlineModuleRecVo.category = _nextForm.onlineModuleRecVo.category.join(',')
//            }
            
            if (_nextForm.createOffline) {
              _nextForm.offlineModuleRecVo.category = _nextForm.offlineModuleRecVo.category.join(',')
              let arr = []
              for (let val of _nextForm.offlineModuleRecVo.images) {
                arr.push(val.url)
              }
              _nextForm.offlineModuleRecVo.images = arr.join(',')
            } else {
              console.log(_nextForm)
              _nextForm.offlineModuleRecVo.category = ''
              _nextForm.offlineModuleRecVo.images = ''
            }
            
//            点餐
            if (_nextForm.createMenus) {
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
              _nextForm.menusModuleRecVo.tableConfig.table_info = _table_info
              _nextForm.menusModuleRecVo.tableConfig.table_setting = _table_setting
              _nextForm.menusModuleRecVo.tableConfig = JSON.stringify(_nextForm.menusModuleRecVo.tableConfig)
            } else {
              _nextForm.menusModuleRecVo.tableConfig = JSON.stringify(_nextForm.menusModuleRecVo.tableConfig)
            }
            this.$axios({
              type: 'post',
              url: '/bhs-management-admin/businessModule',
              data: _nextForm,
              fuc: (res) => {
                if (res.code == 1) {
                  this.$message.success('操作成功')
                  this.$deleteOneTag(this.type == 0 || this.type == 1 ? '/business/businessAccount' : (this.type == 21 ? "/business/onlineBusinessList" : (this.type == 22 ? "/business/unlineBusinessList" : "/business/businessAccount")))
                }
                
              }
            })
          }
        })
//        this.$deleteOneTag('/business/onlineBusinessList')
      },
      beforeAvatarUpload (file) {
//        let _this = this
//        var reader = new FileReader();
//        reader.readAsDataURL(file);
//        reader.onload = function(e){ 
//          _this.form.licenseImage = this.result // 这个就是base64编码了
//        }
        let formData = new FormData()
        formData.append('file', file)
        formData.append('folder', "business/info")
        this.$axios({
          type: 'post',
          url: '/bhs-fileserver/file/uploadSingle',
          data: formData,
          fuc: (res) => {
            console.log(res)
            if (res.code == 1) {
              this.form.licenseImage = res.data
            }
          }
        }, 1)
        return false
      },
      resetBusinessPwd () {
        this.$axios({
          type: 'post',
          url: '/business/setpassword',
          data: {
            business_id: this.form.business_id,
            password: '123456'
          },
          fuc: (res) => {
            if (res.code == 200) {
              this.$message.success('重置密码成功')
            }
          }
        })
      },
      beforeAvatarUploadLogo (file) {
        let formData = new FormData()
        formData.append('file', file)
        formData.append('folder', "business/offline")
        this.$axios({
          type: 'post',
          url: '/bhs-fileserver/file/uploadSingle',
          data: formData,
          fuc: (res) => {
            console.log(res)
            if (res.code == 1) {
              this.nextForm.offlineModuleRecVo.logo = res.data
            }
          }
        }, 1)
        return false
      },
      beforeAvatarUploadimages (file) {
        let formData = new FormData()
        formData.append('file', file)
        formData.append('folder', "business/offline")
        this.$axios({
          type: 'post',
          url: '/bhs-fileserver/file/uploadSingle',
          data: formData,
          fuc: (res) => {
            console.log(res)
            if (res.code == 1) {
              this.nextForm.offlineModuleRecVo.images.push({url: res.data}) 
              console.log(this.nextForm.offlineModuleRecVo.images)
              if (this.nextForm.offlineModuleRecVo.images.length >= 9) {
                document.getElementsByClassName('el-upload el-upload--picture-card')[0].style.display = 'none'
              }
            }
          }
        }, 1)
        return false
      },
      handleRemoveimages(file, fileList) {
//        console.log(file)
        for (let val in this.nextForm.offlineModuleRecVo.images) {
          if (this.nextForm.offlineModuleRecVo.images[val].uid === file.uid) {
            this.nextForm.offlineModuleRecVo.images.splice(val, 1)
          }
        }
        console.log(this.nextForm.offlineModuleRecVo.images)
        if (this.nextForm.offlineModuleRecVo.images.length < 9) {
          document.getElementsByClassName('el-upload el-upload--picture-card')[0].style.display = 'inline-block'
        }
      },
      handlePictureCardPreview(file) {
        this.dialogImages = file.url;
        this.dialogVisible = true;
      },
      handleExceed(files, fileList) {
        console.log('exceed', files, fileList)
        this.$message.warning(`当前限制选择 9 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      firstChange (id) {
        for (let val of this.area_json) {
          if (val.id == id) {
            this.area_json2 = val.child
            this.nextForm.offlineModuleRecVo.city = ''
            this.nextForm.offlineModuleRecVo.county = ''
          }
        }
      },
      secondChange (id) {
        for (let val of this.area_json2) {
          if (val.id == id) {
            this.area_json3 = val.child
            this.nextForm.offlineModuleRecVo.county = ''
          }
        }
      },
      
      unlineChange (val) {
        if (val) {
          this.$nextTick(() => {
            this.initBaiDuMap()
          })
          
        }
      },
      
      menulineChange (val) {
        if (val) {
          this.$nextTick(() => {
            this.initBaiDuMapMenu()
          })
          
        }
      },
      
      initBaiDuMap() {
        this.baiduMap = new BMap.Map('l-map')
        this.baiduMap.centerAndZoom('成都', 12)
        this.baiduMap.enableScrollWheelZoom(true)
        this.baiduMap.addEventListener("rightclick", (e) => {
          var lng=e.point.lng;
          var lat=e.point.lat;
          var point = new BMap.Point(lng, lat);
          this.nextForm.offlineModuleRecVo.latitude = lat
          this.nextForm.offlineModuleRecVo.longitude = lng
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
          _this.nextForm.offlineModuleRecVo.address = _value.province +  _value.city +  _value.district +  _value.street +  _value.business
          document.getElementById("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + _value.business
          _this.setPlace()
        })
      },
      setPlace() {
//        this.baiduMap.clearOverlays()   //清除地图上所有覆盖物
        const _this = this
        _this.local = new BMap.LocalSearch(this.baiduMap, { //智能搜索
          onSearchComplete: function() {
            var pp = _this.local.getResults().getPoi(0).point    //获取第一个智能搜索的结果
            _this.nextForm.offlineModuleRecVo.latitude = pp.lat
            _this.nextForm.offlineModuleRecVo.longitude = pp.lng
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
        if (this.nextForm.offlineModuleRecVo.latitude && this.nextForm.offlineModuleRecVo.longitude) {
          var point = new BMap.Point(this.nextForm.offlineModuleRecVo.longitude, this.nextForm.offlineModuleRecVo.latitude)
          var geoc = new BMap.Geocoder()
          geoc.getLocation(point, function(rs) {
            var addComp = rs.addressComponents
             console.log(addComp, addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber)
            _this.area_json.forEach(function(one) {
              if (one.name === addComp.province) {
                _this.firstChange(one.id)
                _this.nextForm.offlineModuleRecVo.province = one.id
              }
            })
            _this.area_json2.forEach(function(two) {
              if(two.name === addComp.city) {
                _this.secondChange(two.id)
                _this.nextForm.offlineModuleRecVo.city = two.id
              }
            })
            _this.area_json3.forEach(function(three) {
              if(three.name === addComp.district) {
                _this.nextForm.offlineModuleRecVo.county = three.id
              }
            })
          })
        }
      },
      infohtmlset (pois) {
//        console.log('infohtmlset', pois, pois.clearOverlays)
//        this.longitude_latitude = pois.point
        this.nextForm.offlineModuleRecVo.latitude = pois.point.lat
        this.nextForm.offlineModuleRecVo.longitude = pois.point.lng
//        debugger
//        console.log(pois.originInstance)
//        this.clearResults()
//        debugger
      },
      dragCallback () {
        this.marker.addEventListener("dragend", (e) => {
          var x = e.point.lng; //经度
          var y = e.point.lat; //纬度
          this.nextForm.offlineModuleRecVo.latitude = y
          this.nextForm.offlineModuleRecVo.longitude = x
       })
      },
      
//      点餐
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
      },
      
      firstChangeMenu (id) {
        console.log(id)
        for (let val of this.area_json) {
          if (val.id == id) {
            this.area_json2Menu = val.child
            this.nextForm.menusModuleRecVo.city = ''
            this.nextForm.menusModuleRecVo.county = ''
          }
        }
      },
      secondChangeMenu (id) {
        for (let val of this.area_json2Menu) {
          if (val.id == id) {
            this.area_json3Menu = val.child
            this.nextForm.menusModuleRecVo.county = ''
          }
        }
      },
      
      initBaiDuMapMenu() {
        this.baiduMapMenu = new BMap.Map('l-mapMenu')
        this.baiduMapMenu.centerAndZoom('成都', 12)
        this.baiduMapMenu.enableScrollWheelZoom(true)
        this.baiduMapMenu.addEventListener("rightclick", (e) => {
          var lng=e.point.lng;
          var lat=e.point.lat;
          var point = new BMap.Point(lng, lat);
          this.nextForm.menusModuleRecVo.latitude = lat
          this.nextForm.menusModuleRecVo.longitude = lng
          if(!this.markerMenu){

//            this.baiduMapMenu.clearOverlays()
            this.markerMenu = new BMap.Marker(point);
            this.baiduMapMenu.addOverlay(this.markerMenu);
            this.markerMenu.enableDragging();
          }
          else{
            this.markerMenu.setPosition(point)
          }
          this.dragCallbackMenu()
        });
        this.baiduAcMenu = new BMap.Autocomplete({ input: 'suggestIdMenu', location: this.baiduMapMenu })
        this.baiduAcMenu.addEventListener('onhighlight', function(e) {
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
          document.getElementById('searchResultPanelMenu').innerHTML = str
        })
        const _this = this
        this.baiduAcMenu.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
          var _value = e.item.value
          // 获取选择地址
          _this.baiduAddressMenu = _value.business
          _this.nextForm.menusModuleRecVo.address = _value.province +  _value.city +  _value.district +  _value.street +  _value.business
          document.getElementById("searchResultPanelMenu").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + _value.business
          _this.setPlaceMenu()
        })
      },
      setPlaceMenu() {
//        this.baiduMapMenu.clearOverlays()   //清除地图上所有覆盖物
        const _this = this
        _this.localMenu = new BMap.LocalSearch(this.baiduMapMenu, { //智能搜索
          onSearchComplete: function() {
            var pp = _this.localMenu.getResults().getPoi(0).point    //获取第一个智能搜索的结果
            _this.nextForm.menusModuleRecVo.latitude = pp.lat
            _this.nextForm.menusModuleRecVo.longitude = pp.lng
            _this.baiduMapMenu.centerAndZoom(pp, 18)

            if(!_this.markerMenu){

//              _this.baiduMapMenu.clearOverlays()
              _this.markerMenu = new BMap.Marker(pp);
              _this.baiduMapMenu.addOverlay(_this.markerMenu);
              _this.markerMenu.enableDragging();
            }
            else{
              _this.markerMenu.setPosition(pp)
            }
            _this.dragCallbackMenu()
//            _this.baiduMapMenu.addOverlay(new BMap.Marker(pp))    //添加标注
            _this.updateSelectMenu()
          }
        })
        _this.localMenu.search(_this.baiduAddressMenu)
      },
      updateSelectMenu() {
        const _this = this
        if (this.nextForm.menusModuleRecVo.latitude && this.nextForm.menusModuleRecVo.longitude) {
          var point = new BMap.Point(this.nextForm.menusModuleRecVo.longitude, this.nextForm.menusModuleRecVo.latitude)
          var geoc = new BMap.Geocoder()
          geoc.getLocation(point, function(rs) {
            var addComp = rs.addressComponents
             console.log(addComp, addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber)
            _this.area_json.forEach(function(one) {
              if (one.name === addComp.province) {
                _this.firstChangeMenu(one.id)
                _this.nextForm.menusModuleRecVo.province = one.id
              }
            })
            _this.area_json2Menu.forEach(function(two) {
              if(two.name === addComp.city) {
                _this.secondChangeMenu(two.id)
                _this.nextForm.menusModuleRecVo.city = two.id
              }
            })
            _this.area_json3Menu.forEach(function(three) {
              if(three.name === addComp.district) {
                _this.nextForm.menusModuleRecVo.county = three.id
              }
            })
          })
        }
      },
      infohtmlsetMenu (pois) {
//        console.log('infohtmlset', pois, pois.clearOverlays)
//        this.longitude_latitude = pois.point
        this.nextForm.menusModuleRecVo.latitude = pois.point.lat
        this.nextForm.menusModuleRecVo.longitude = pois.point.lng
//        debugger
//        console.log(pois.originInstance)
//        this.clearResults()
//        debugger
      },
      dragCallbackMenu () {
        this.markerMenu.addEventListener("dragend", (e) => {
          var x = e.point.lng; //经度
          var y = e.point.lat; //纬度
          this.nextForm.menusModuleRecVo.latitude = y
          this.nextForm.menusModuleRecVo.longitude = x
       })
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
/*    width: 100%;*/
    margin: 20px;
  }
  .onlineBusinessDetail>.el-form .el-input{
    max-width: 400px;
  }
  .map {
    width: 100%;
    overflow: hidden;
  }
</style>
<style>
  #l-map{height:300px;width:100%;}
  #l-mapMenu{height:300px;width:100%;}
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