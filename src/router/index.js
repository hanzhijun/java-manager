import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/** note: submenu only apppear when children.length>=1
*   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
**/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [

  // 自带
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index'),
      name: 'dashboard',
      meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
    }]
  },
//  {
//    path: '/documentation',
//    component: Layout,
//    redirect: '/documentation/index',
//    children: [{
//      path: 'index',
//      component: _import('documentation/index'),
//      name: 'documentation',
//      meta: { title: 'documentation', icon: 'documentation', noCache: true }
//    }]
//  },
//  {
//    path: '/guide',
//    component: Layout,
//    redirect: '/guide/index',
//    children: [{
//      path: 'index',
//      component: _import('guide/index'),
//      name: 'guide',
//      meta: { title: 'guide', icon: 'guide', noCache: true }
//    }]
//  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  // 权限管理
//  {
//    path: '/jurisdiction',
//    component: Layout,
//    redirect: 'noredirect',
//    name: 'jurisdiction',
//    meta: {
//      title: 'jurisdiction',
//      icon: 'lock'
//    },
//    children: [
//      //      管理组
//      { path: 'adminGroupList', component: _import('jurisdiction/adminGroupList/adminGroupList'), name: 'adminGroupList', meta: { title: 'adminGroupList', noCache: true }},
//      { path: 'adminGroupDetail', component: _import('jurisdiction/adminGroupList/adminGroupDetail'), name: 'adminGroupDetail', meta: { title: 'adminGroupDetail' }, hidden: true },
//      { path: 'adminAccessDetail', component: _import('jurisdiction/adminGroupList/adminAccessDetail'), name: 'adminAccessDetail', meta: { title: 'adminAccessDetail' }, hidden: true },
//
//      //      管理员
//      { path: 'adminList', component: _import('jurisdiction/adminList/adminList'), name: 'adminList', meta: { title: 'adminList', noCache: true }},
//      { path: 'adminDetail', component: _import('jurisdiction/adminList/adminDetail'), name: 'adminDetail', meta: { title: 'adminDetail' }, hidden: true },
//
//      //      规则
//      { path: 'adminRulesList', component: _import('jurisdiction/adminRulesList/adminRulesList'), name: 'adminRulesList', meta: { title: 'adminRulesList', noCache: true }},
//      { path: 'adminRulesDetail', component: _import('jurisdiction/adminRulesList/adminRulesDetail'), name: 'adminRulesDetail', meta: { title: 'adminRulesDetail' }, hidden: true }
//    ]
//  },

  // 订单
  {
    path: '/orderList',
    component: Layout,
    redirect: 'noredirect',
    name: 'orderList',
    meta: {
      title: 'orderList',
      icon: 'excel'
    },
    children: [
      //      线上订单
      { path: 'onlineOrderList', component: _import('orderList/onlineOrderList/onlineOrderList'), name: 'onlineOrderList', meta: { title: 'onlineOrderList', noCache: true }},
      { path: 'onlineOrderDetail', component: _import('orderList/onlineOrderList/onlineOrderDetail'), name: 'onlineOrderDetail', meta: { title: 'onlineOrderDetail' }, hidden: true },

      //      线下订单
//      { path: 'unlineOrderList', component: _import('orderList/unlineOrderList/unlineOrderList'), name: 'unlineOrderList', meta: { title: 'unlineOrderList', noCache: true }},
//      { path: 'unlineOrderDetail', component: _import('orderList/unlineOrderList/unlineOrderDetail'), name: 'unlineOrderDetail', meta: { title: 'unlineOrderDetail' }, hidden: true },
//
//      //      服务订单
//      { path: 'packagesOrderList', component: _import('orderList/packagesOrderList/packagesOrderList'), name: 'packagesOrderList', meta: { title: 'packagesOrderList', noCache: true }},
//      { path: 'packagesOrderDetail', component: _import('orderList/packagesOrderList/packagesOrderDetail'), name: 'packagesOrderDetail', meta: { title: 'packagesOrderDetail' }, hidden: true },
//
//      //      代金券订单
//      { path: 'vouchersOrderList', component: _import('orderList/vouchersOrder/vouchersOrderList'), name: 'vouchersOrderList', meta: { title: 'vouchersOrderList', noCache: true }},
//      { path: 'vouchersOrderDetail', component: _import('orderList/vouchersOrder/vouchersOrderDetail'), name: 'vouchersOrderDetail', meta: { title: 'vouchersOrderDetail' }, hidden: true }
    ]
  },

  // 财务中心
//  {
//    path: '/financial',
//    component: Layout,
//    redirect: 'noredirect',
//    name: 'financial',
//    meta: {
//      title: 'financial',
//      icon: 'money'
//    },
//    children: [
//      //      结算列表-线上正常
//      { path: 'onlineFinancialListNormal', component: _import('financial/onlineFinancialListNormal/onlineFinancialListNormal'), name: 'onlineFinancialListNormal', meta: { title: 'onlineFinancialListNormal', noCache: true }},
//      { path: 'onlineFinancialListNormalDetail', component: _import('financial/onlineFinancialListNormal/onlineFinancialListNormalDetail'), name: 'onlineFinancialListNormalDetail', meta: { title: 'onlineFinancialListNormalDetail' }, hidden: true },
//
//      //      结算列表-线上异常
//      { path: 'onlineFinancialListError', component: _import('financial/onlineFinancialListError/onlineFinancialListError'), name: 'onlineFinancialListError', meta: { title: 'onlineFinancialListError', noCache: true }},
//
//      { path: 'onlineFinancialListErrorDetail', component: _import('financial/onlineFinancialListError/onlineFinancialListErrorDetail'), name: 'onlineFinancialListErrorDetail', meta: { title: 'onlineFinancialListErrorDetail' }, hidden: true },
//
//      //      结算列表-线下
//      { path: 'unlineFinancialList', component: _import('financial/unlineFinancialList/unlineFinancialList'), name: 'unlineFinancialList', meta: { title: 'unlineFinancialList', noCache: true }},
//      { path: 'unlineFinancialDetail', component: _import('financial/unlineFinancialList/unlineFinancialDetail'), name: 'unlineFinancialDetail', meta: { title: 'unlineFinancialDetail' }, hidden: true },
//
//      //      结算列表-服务正常
//      { path: 'financialPackagesList', component: _import('financial/financialPackages/financialPackagesList'), name: 'financialPackagesList', meta: { title: 'financialPackagesList', noCache: true }},
//      { path: 'financialPackagesDetail', component: _import('financial/financialPackages/financialPackagesDetail'), name: 'financialPackagesDetail', meta: { title: 'financialPackagesDetail' }, hidden: true },
//
//      //      结算列表-服务异常
//      { path: 'financialPackagesErrorList', component: _import('financial/financialPackagesError/financialPackagesErrorList'), name: 'financialPackagesErrorList', meta: { title: 'financialPackagesErrorList', noCache: true }},
//      { path: 'financialPackagesErrorDetail', component: _import('financial/financialPackagesError/financialPackagesErrorDetail'), name: 'financialPackagesErrorDetail', meta: { title: 'financialPackagesErrorDetail' }, hidden: true },
//
//      //      结算列表-代金券正常
//      { path: 'financialVouchersNormalList', component: _import('financial/financialVouchersNormal/financialVouchersNormalList'), name: 'financialVouchersNormalList', meta: { title: 'financialVouchersNormalList', noCache: true }},
//      { path: 'financialVouchersNormalDetail', component: _import('financial/financialVouchersNormal/financialVouchersNormalDetail'), name: 'financialVouchersNormalDetail', meta: { title: 'financialVouchersNormalDetail' }, hidden: true },
//
//      //      结算列表-代金券异常
//      { path: 'financialVouchersErrorList', component: _import('financial/financialVouchersError/financialVouchersErrorList'), name: 'financialVouchersErrorList', meta: { title: 'financialVouchersErrorList', noCache: true }},
//      { path: 'financialVouchersErrorDetail', component: _import('financial/financialVouchersError/financialVouchersErrorDetail'), name: 'financialVouchersErrorDetail', meta: { title: 'financialVouchersErrorDetail' }, hidden: true }
//    ]
//  },

  // 商品管理
  {
    path: '/goods',
    component: Layout,
    redirect: 'noredirect',
    name: 'goods',
    meta: {
      title: 'goods',
      icon: 'shoppingCard'
    },
    children: [
      //      商品列表
//      { path: 'goodsList', component: _import('goods/goodsList/goodsList'), name: 'goodsList', meta: { title: 'goodsList', noCache: true }},
//      { path: 'goodsDetail', component: _import('goods/goodsList/goodsDetail'), name: 'goodsDetail', meta: { title: 'goodsDetail' }, hidden: true },

      //      商品类目
      { path: 'goodsClassifyList', component: _import('goods/goodsClassify/goodsClassifyList'), name: 'goodsClassifyList', meta: { title: 'goodsClassifyList', noCache: true }},
      { path: 'goodsClassifySecondList', component: _import('goods/goodsClassify/goodsClassifySecondList'), name: 'goodsClassifySecondList', meta: { title: 'goodsClassifySecondList', noCache: true }, hidden: true },
      { path: 'goodsClassifyDetail', component: _import('goods/goodsClassify/goodsClassifyDetail'), name: 'goodsClassifyDetail', meta: { title: 'goodsClassifyDetail' }, hidden: true },

      //      商品品牌
      { path: 'goodsBrandsList', component: _import('goods/goodsBrands/goodsBrandsList'), name: 'goodsBrandsList', meta: { title: 'goodsBrandsList', noCache: true }},
      { path: 'goodsBrandsDetail', component: _import('goods/goodsBrands/goodsBrandsDetail'), name: 'goodsBrandsDetail', meta: { title: 'goodsBrandsDetail' }, hidden: true },

      //      商品服务
//      { path: 'goodsPackagesList', component: _import('goods/goodsPackages/goodsPackagesList'), name: 'goodsPackagesList', meta: { title: 'goodsPackagesList', noCache: true }},
//      { path: 'goodsPackagesDetail', component: _import('goods/goodsPackages/goodsPackagesDetail'), name: 'goodsPackagesDetail', meta: { title: 'goodsPackagesDetail' }, hidden: true },
//
//      //      商品代金券
//      { path: 'goodsVouchersList', component: _import('goods/goodsVouchers/goodsVouchersList'), name: 'goodsVouchersList', meta: { title: 'goodsVouchersList', noCache: true }},
//      { path: 'goodsVouchersDetail', component: _import('goods/goodsVouchers/goodsVouchersDetail'), name: 'goodsVouchersDetail', meta: { title: 'goodsVouchersDetail' }, hidden: true }
    ]
  },

  // 商家管理
  {
    path: '/business',
    component: Layout,
    redirect: 'noredirect',
    name: 'business',
    meta: {
      title: 'business',
      icon: 'peoples'
    },
    children: [
      //      商家账号列表
      { path: 'businessAccount', component: _import('business/businessList/businessAccount'), name: 'businessAccount', meta: { title: 'businessAccount', noCache: true }},
      //      商家列表
      { path: 'onlineBusinessList', component: _import('business/businessList/onlineBusinessList'), name: 'onlineBusinessList', meta: { title: 'onlineBusinessList', noCache: true }},
      { path: 'onlineBusinessDetail', component: _import('business/businessList/onlineBusinessDetail'), name: 'onlineBusinessDetail', meta: { title: 'onlineBusinessDetail' }, hidden: true },
//      { path: 'unlineBusinessList', component: _import('business/businessList/unlineBusinessList'), name: 'unlineBusinessList', meta: { title: 'unlineBusinessList', noCache: true }},
//      { path: 'unlineBusinessDetail', component: _import('business/businessList/unlineBusinessDetail'), name: 'unlineBusinessDetail', meta: { title: 'unlineBusinessDetail' }, hidden: true },

      // 方便首次添加商品，后面删除
      { path: 'onlineBusinessGoodsList', component: _import('business/businessList/onlineBusinessGoods/onlineBusinessGoodsList'), name: 'onlineBusinessGoodsList', meta: { title: 'onlineBusinessGoodsList', noCache: true }, hidden: true },
      { path: 'onlineBusinessGoodsDetail', component: _import('business/businessList/onlineBusinessGoods/onlineBusinessGoodsDetail'), name: 'onlineBusinessGoodsDetail', meta: { title: 'onlineBusinessGoodsDetail' }, hidden: true },
      { path: 'onlineBusinessBrandsList', component: _import('business/businessList/onlineBusinessGoods/onlineBusinessBrandsList'), name: 'onlineBusinessBrandsList', meta: { title: 'onlineBusinessBrandsList', noCache: true }, hidden: true },
      { path: 'onlineBusinessBrandsDetail', component: _import('business/businessList/onlineBusinessGoods/onlineBusinessBrandsDetail'), name: 'onlineBusinessBrandsDetail', meta: { title: 'onlineBusinessBrandsDetail' }, hidden: true },

      // 方便添加套餐，后面删除
      { path: 'unlineBusinessPackagesList', component: _import('business/businessList/unlineBusinessPackages/unlineBusinessPackagesList'), name: 'unlineBusinessPackagesList', meta: { title: 'unlineBusinessPackagesList', noCache: true }, hidden: true },
      { path: 'unlineBusinessPackagesDetail', component: _import('business/businessList/unlineBusinessPackages/unlineBusinessPackagesDetail'), name: 'unlineBusinessPackagesDetail', meta: { title: 'unlineBusinessPackagesDetail' }, hidden: true },

      //  代金券
      { path: 'unlineBusinessVouchersList', component: _import('business/businessList/unlineBusinessVouchers/unlineBusinessVouchersList'), name: 'unlineBusinessVouchersList', meta: { title: 'unlineBusinessVouchersList', noCache: true }, hidden: true },
      { path: 'unlineBusinessVouchersDetail', component: _import('business/businessList/unlineBusinessVouchers/unlineBusinessVouchersDetail'), name: 'unlineBusinessVouchersDetail', meta: { title: 'unlineBusinessVouchersDetail' }, hidden: true },

      //      商家类目
      { path: 'unlineBusinessClassifyList', component: _import('business/businessClassifyList/unlineBusinessClassifyList'), name: 'unlineBusinessClassifyList', meta: { title: 'unlineBusinessClassifyList', noCache: true }},
      { path: 'unBusinessClassifySecondList', component: _import('business/businessClassifyList/unBusinessClassifySecondList'), name: 'unBusinessClassifySecondList', meta: { title: 'unBusinessClassifySecondList', noCache: true }, hidden: true },
      { path: 'unBusinessClassifyDetail', component: _import('business/businessClassifyList/unBusinessClassifyDetail'), name: 'unBusinessClassifyDetail', meta: { title: 'unBusinessClassifyDetail' }, hidden: true }
    ]
  },

  // 用户列表
//  {
//    path: '/cUser',
//    component: Layout,
//    redirect: '/cUser/cUserList',
//    name: 'cUser',
//    meta: {
//      title: 'cUser',
//      icon: 'people'
//    },
//    children: [
//      //      用户列表
//      { path: 'cUserList', component: _import('cUser/cUserList'), name: 'cUserList', meta: { title: 'cUserList', noCache: true, icon: 'people' }},
//      { path: 'cUserDetail', component: _import('cUser/cUserDetail'), name: 'cUserDetail', meta: { title: 'cUserDetail', noCache: true, icon: 'people' }, hidden: true }
//    ]
//  },

  // 推荐配置
//  {
//    path: '/recommendConfig',
//    component: Layout,
//    redirect: 'noredirect',
//    name: 'recommendConfig',
//    meta: {
//      title: 'recommendConfig',
//      icon: 'chart'
//    },
//    children: [
//      //      推荐配置
//      { path: 'recommendConfigList', component: _import('recommendConfig/recommendConfigList'), name: 'recommendConfigList', meta: { title: 'recommendConfigList', noCache: true }}
//    ], hidden: true
//  },

  // 线下餐饮
//  {
//    path: '/offlineCatering',
//    component: Layout,
//    redirect: 'noredirect',
//    name: 'offlineCatering',
//    meta: {
//      title: 'offlineCatering',
//      icon: 'chart'
//    },
//    children: [
//      //      线下餐饮-商家详情
//      { path: 'offlineCaterBusiness', component: _import('offlineCatering/offlineCaterBusiness/offlineCaterBusinessList'), name: 'offlineCaterBusiness', meta: { title: 'offlineCaterBusiness', noCache: true }},
//
//      //      线下餐饮-订单管理
//      { path: 'offlineCaterOrderList', component: _import('offlineCatering/offlineCaterOrder/offlineCaterOrderList'), name: 'offlineCaterOrderList', meta: { title: 'offlineCaterOrderList', noCache: true }, hidden: true},
//      { path: 'offlineCaterOrderDetail', component: _import('offlineCatering/offlineCaterOrder/offlineCaterOrderDetail'), name: 'offlineCaterOrderDetail', meta: { title: 'offlineCaterOrderDetail', noCache: true }, hidden: true},
//
//      //      线下餐饮-菜品管理
//      { path: 'offlineCaterDishesList', component: _import('offlineCatering/offlineCaterDishes/offlineCaterDishesList'), name: 'offlineCaterDishesList', meta: { title: 'offlineCaterDishesList', noCache: true }, hidden: true},
//      { path: 'offlineCaterDishesDetail', component: _import('offlineCatering/offlineCaterDishes/offlineCaterDishesDetail'), name: 'offlineCaterDishesDetail', meta: { title: 'offlineCaterDishesDetail', noCache: true }, hidden: true},
//
//      //      线下餐饮-分类管理
//      { path: 'offlineCaterClassify', component: _import('offlineCatering/offlineCaterClassify/offlineCaterClassifyList'), name: 'offlineCaterClassify', meta: { title: 'offlineCaterClassify', noCache: true }, hidden: true},
//
//      //      线下餐饮-规格配置
//      { path: 'offlineCaterConfig', component: _import('offlineCatering/offlineCaterConfig/offlineCaterConfigList'), name: 'offlineCaterConfig', meta: { title: 'offlineCaterConfig', noCache: true }}
//    ]
//  },

  // 网站配置
//  {
//    path: '/interConfig',
//    component: Layout,
////    redirect: '/interConfig/indexManage/indexSlideshowList',
//    name: 'interConfig',
//    meta: {
//      title: 'interConfig',
//      icon: 'chart'
//    },
//    children: [
//      //      首页管理
//      {
//        path: '/interConfig/indexManage',
//        component: _import('interConfig/index'),
//        name: 'indexManage',
//        meta: { title: 'indexManage'},
//        children: [
//          //      首页管理-轮播图
//          { path: 'indexSlideshowList', component: _import('interConfig/indexManage/indexSlideshow/indexSlideshowList'), name: 'indexSlideshowList', meta: { title: 'indexSlideshowList' }},
//          { path: 'indexSlideshowDetail', component: _import('interConfig/indexManage/indexSlideshow/indexSlideshowDetail'), name: 'indexSlideshowDetail', meta: { title: 'indexSlideshowDetail' }, hidden: true},
//
//          //      首页管理-图标分类
//          { path: 'indexIconClassifyList', component: _import('interConfig/indexManage/indexIconClassify/indexIconClassifyList'), name: 'indexIconClassifyList', meta: { title: 'indexIconClassifyList' }},
//          { path: 'indexIconClassifyDetail', component: _import('interConfig/indexManage/indexIconClassify/indexIconClassifyDetail'), name: 'indexIconClassifyDetail', meta: { title: 'indexIconClassifyDetail' }, hidden: true},
//
//          //      首页管理-固定运营位配置
//          { path: 'indexOperatingList', component: _import('interConfig/indexManage/indexOperating/indexOperatingList'), name: 'indexOperatingList', meta: { title: 'indexOperatingList' }},
//          { path: 'indexOperatingDetail', component: _import('interConfig/indexManage/indexOperating/indexOperatingDetail'), name: 'indexOperatingDetail', meta: { title: 'indexOperatingDetail' }, hidden: true},
//
//          { path: 'indexOperatingGoodsList', component: _import('interConfig/indexManage/indexOperating/indexOperatingGoods/indexOperatingGoodsList'), name: 'indexOperatingGoodsList', meta: { title: 'indexOperatingGoodsList' }, hidden: true},
//          { path: 'indexOperatingGoodsDetail', component: _import('interConfig/indexManage/indexOperating/indexOperatingGoods/indexOperatingGoodsDetail'), name: 'indexOperatingGoodsDetail', meta: { title: 'indexOperatingGoodsDetail' }, hidden: true},
//
//          { path: 'indexOperatingArticList', component: _import('interConfig/indexManage/indexOperating/indexOperatingArtic/indexOperatingArticList'), name: 'indexOperatingArticList', meta: { title: 'indexOperatingArticList' }, hidden: true},
//          { path: 'indexOperatingArticDetail', component: _import('interConfig/indexManage/indexOperating/indexOperatingArtic/indexOperatingArticDetail'), name: 'indexOperatingArticDetail', meta: { title: 'indexOperatingArticDetail' }, hidden: true},
//
//          { path: 'indexOperatingBusinessList', component: _import('interConfig/indexManage/indexOperating/indexOperatingBusiness/indexOperatingBusinessList'), name: 'indexOperatingBusinessList', meta: { title: 'indexOperatingBusinessList' }, hidden: true},
//          { path: 'indexOperatingBusinessDetail', component: _import('interConfig/indexManage/indexOperating/indexOperatingBusiness/indexOperatingBusinessDetail'), name: 'indexOperatingBusinessDetail', meta: { title: 'indexOperatingBusinessDetail' }, hidden: true},
//
//          { path: 'indexOperatingPackagesList', component: _import('interConfig/indexManage/indexOperating/indexOperatingPackages/indexOperatingPackagesList'), name: 'indexOperatingPackagesList', meta: { title: 'indexOperatingPackagesList' }, hidden: true},
//          { path: 'indexOperatingPackagesDetail', component: _import('interConfig/indexManage/indexOperating/indexOperatingPackages/indexOperatingPackagesDetail'), name: 'indexOperatingPackagesDetail', meta: { title: 'indexOperatingPackagesDetail' }, hidden: true},
//
//          //      首页管理-固定分类配置
//          { path: 'indexFixClassifyList', component: _import('interConfig/indexManage/indexFixClassify/indexFixClassifyList'), name: 'indexFixClassifyList', meta: { title: 'indexFixClassifyList' }},
//          { path: 'indexFixClassifyDetail', component: _import('interConfig/indexManage/indexFixClassify/indexFixClassifyDetail'), name: 'indexFixClassifyDetail', meta: { title: 'indexFixClassifyDetail' }, hidden: true},
//          { path: 'indexBusinessList', component: _import('interConfig/indexManage/indexFixClassify/indexBusinessList'), name: 'indexBusinessList', meta: { title: 'indexBusinessList' }, hidden: true},
//          { path: 'indexBusinessDetail', component: _import('interConfig/indexManage/indexFixClassify/indexBusinessDetail'), name: 'indexBusinessDetail', meta: { title: 'indexBusinessDetail' }, hidden: true},
//
//          { path: 'indexGoodsList', component: _import('interConfig/indexManage/indexFixClassify/indexGoodsList'), name: 'indexGoodsList', meta: { title: 'indexGoodsList' }, hidden: true},
//          { path: 'indexGoodsDetail', component: _import('interConfig/indexManage/indexFixClassify/indexGoodsDetail'), name: 'indexGoodsDetail', meta: { title: 'indexGoodsDetail' }, hidden: true},
//          { path: 'indexPackagesList', component: _import('interConfig/indexManage/indexFixClassify/indexPackagesList'), name: 'indexPackagesList', meta: { title: 'indexPackagesList' }, hidden: true},
//          { path: 'indexPackagesDetail', component: _import('interConfig/indexManage/indexFixClassify/indexPackagesDetail'), name: 'indexPackagesDetail', meta: { title: 'indexPackagesDetail' }, hidden: true}
//        ]
//      },
//
//      //      商城迭代
//      {
//        path: '/interConfig/indexMail',
//        component: _import('interConfig/index'),
//        name: 'indexMail',
//        meta: { title: 'indexMail'},
//        children: [
//          //      商城迭代-轮播图
//          { path: 'indexMailSlideshowList', component: _import('interConfig/indexMail/indexMailSlideshow/indexMailSlideshowList'), name: 'indexMailSlideshowList', meta: { title: 'indexMailSlideshowList' }},
//          { path: 'indexMailSlideshowDetail', component: _import('interConfig/indexMail/indexMailSlideshow/indexMailSlideshowDetail'), name: 'indexMailSlideshowDetail', meta: { title: 'indexMailSlideshowDetail' }, hidden: true},
//
//          //      首页管理-图标分类
//          { path: 'indexMailIconClassifyList', component: _import('interConfig/indexMail/indexMailIconClassify/indexMailIconClassifyList'), name: 'indexMailIconClassifyList', meta: { title: 'indexMailIconClassifyList' }},
//          { path: 'indexMailIconClassifyDetail', component: _import('interConfig/indexMail/indexMailIconClassify/indexMailIconClassifyDetail'), name: 'indexMailIconClassifyDetail', meta: { title: 'indexMailIconClassifyDetail' }, hidden: true},
//
//          //      首页管理-固定运营位配置
//          { path: 'indexMailOperatingList', component: _import('interConfig/indexMail/indexMailOperating/indexMailOperatingList'), name: 'indexMailOperatingList', meta: { title: 'indexMailOperatingList' }},
//          { path: 'indexMailOperatingDetail', component: _import('interConfig/indexMail/indexMailOperating/indexMailOperatingDetail'), name: 'indexMailOperatingDetail', meta: { title: 'indexMailOperatingDetail' }, hidden: true},
//          { path: 'indexMailOperatingGoodsList', component: _import('interConfig/indexMail/indexMailOperating/indexMailOperatingGoods/indexMailOperatingGoodsList'), name: 'indexMailOperatingGoodsList', meta: { title: 'indexMailOperatingGoodsList' }, hidden: true},
//          { path: 'indexMailOperatingGoodsDetail', component: _import('interConfig/indexMail/indexMailOperating/indexMailOperatingGoods/indexMailOperatingGoodsDetail'), name: 'indexMailOperatingGoodsDetail', meta: { title: 'indexMailOperatingGoodsDetail' }, hidden: true},
//
//          //      首页管理-推荐商品
//          { path: 'indexMailRecommendedList', component: _import('interConfig/indexMail/indexMailRecommended/indexMailRecommendedList'), name: 'indexMailRecommendedList', meta: { title: 'indexMailRecommendedList' }, hidden: true },
//          { path: 'indexMailRecommendedDetail', component: _import('interConfig/indexMail/indexMailRecommended/indexMailRecommendedDetail'), name: 'indexMailRecommendedDetail', meta: { title: 'indexMailRecommendedDetail' }, hidden: true},
//          { path: 'indexMailRecommendedClassify', component: _import('interConfig/indexMail/indexMailRecommended/indexMailRecommendedClassify'), name: 'indexMailRecommendedClassify', meta: { title: 'indexMailRecommendedClassify' }, hidden: true},
//          { path: 'indexMailRecommendedClassifyList', component: _import('interConfig/indexMail/indexMailRecommended/indexMailRecommendedClassifyList'), name: 'indexMailRecommendedClassifyList', meta: { title: 'indexMailRecommendedClassifyList'}}
//        ]
//      },
//
//      //      金贝商城迭代
//      {
//        path: '/interConfig/goldMail',
//        component: _import('interConfig/index'),
//        name: 'goldMail',
//        meta: { title: 'goldMail'},
//        children: [
//          //      金贝商城迭代-轮播图
//          { path: 'goldMailSlideshowList', component: _import('interConfig/goldMail/goldMailSlideshow/goldMailSlideshowList'), name: 'goldMailSlideshowList', meta: { title: 'goldMailSlideshowList' }},
//          { path: 'goldMailSlideshowDetail', component: _import('interConfig/goldMail/goldMailSlideshow/goldMailSlideshowDetail'), name: 'goldMailSlideshowDetail', meta: { title: 'goldMailSlideshowDetail' }, hidden: true},
//
//          //      金贝商城迭代-顶端分类配置
//          { path: 'goldMailTopClassifyList', component: _import('interConfig/goldMail/goldMailTopClassify/goldMailTopClassifyList'), name: 'goldMailTopClassifyList', meta: { title: 'goldMailTopClassifyList' }},
//          { path: 'goldMailTopClassifyDetail', component: _import('interConfig/goldMail/goldMailTopClassify/goldMailTopClassifyDetail'), name: 'goldMailTopClassifyDetail', meta: { title: 'goldMailTopClassifyDetail' }, hidden: true},
//
//          //      金贝商城迭代-固定运营位配置
//          { path: 'goldMailOperatingList', component: _import('interConfig/goldMail/goldMailOperating/goldMailOperatingList'), name: 'goldMailOperatingList', meta: { title: 'goldMailOperatingList' }},
//          { path: 'goldMailOperatingDetail', component: _import('interConfig/goldMail/goldMailOperating/goldMailOperatingDetail'), name: 'goldMailOperatingDetail', meta: { title: 'goldMailOperatingDetail' }, hidden: true},
//          { path: 'goldMailOperatingGoodsList', component: _import('interConfig/goldMail/goldMailOperating/goldMailOperatingGoods/goldMailOperatingGoodsList'), name: 'goldMailOperatingGoodsList', meta: { title: 'goldMailOperatingGoodsList' }, hidden: true},
//          { path: 'goldMailOperatingGoodsDetail', component: _import('interConfig/goldMail/goldMailOperating/goldMailOperatingGoods/goldMailOperatingGoodsDetail'), name: 'goldMailOperatingGoodsDetail', meta: { title: 'goldMailOperatingGoodsDetail' }, hidden: true},
//
//          //      金贝商城迭代-推荐运营位配置
//          { path: 'goldMailRecommendedOperatingList', component: _import('interConfig/goldMail/goldMailRecommendedOperating/goldMailRecommendedOperatingList'), name: 'goldMailRecommendedOperatingList', meta: { title: 'goldMailRecommendedOperatingList' }},
//          { path: 'goldMailRecommendedOperatingDetail', component: _import('interConfig/goldMail/goldMailRecommendedOperating/goldMailRecommendedOperatingDetail'), name: 'goldMailRecommendedOperatingDetail', meta: { title: 'goldMailRecommendedOperatingDetail' }, hidden: true},
//          { path: 'goldMailRecommendedOperatingGoodsList', component: _import('interConfig/goldMail/goldMailRecommendedOperating/goldMailRecommendedOperatingGoods/goldMailRecommendedOperatingGoodsList'), name: 'goldMailRecommendedOperatingGoodsList', meta: { title: 'goldMailRecommendedOperatingGoodsList' }, hidden: true},
//          { path: 'goldMailRecommendedOperatingGoodsDetail', component: _import('interConfig/goldMail/goldMailRecommendedOperating/goldMailRecommendedOperatingGoods/goldMailRecommendedOperatingGoodsDetail'), name: 'goldMailRecommendedOperatingGoodsDetail', meta: { title: 'goldMailRecommendedOperatingGoodsDetail' }, hidden: true},
//
//          //      金贝商城迭代-推荐商品
//          { path: 'goldMailRecommendedGoodsList', component: _import('interConfig/goldMail/goldMailRecommendedGoods/goldMailRecommendedGoodsList'), name: 'goldMailRecommendedGoodsList', meta: { title: 'goldMailRecommendedGoodsList' }},
//          { path: 'goldMailRecommendedGoodsDetail', component: _import('interConfig/goldMail/goldMailRecommendedGoods/goldMailRecommendedGoodsDetail'), name: 'goldMailRecommendedGoodsDetail', meta: { title: 'goldMailRecommendedGoodsDetail' }, hidden: true},
//        ]
//      },
//
//      //      银贝商城迭代
//      {
//        path: '/interConfig/silverMail',
//        component: _import('interConfig/index'),
//        name: 'silverMail',
//        meta: { title: 'silverMail'},
//        children: [
//
//          //      银贝商城迭代-顶端分类配置
//          { path: 'silverMailTopClassifyList', component: _import('interConfig/silverMail/silverMailTopClassify/silverMailTopClassifyList'), name: 'silverMailTopClassifyList', meta: { title: 'silverMailTopClassifyList' }},
//          { path: 'silverMailTopClassifyDetail', component: _import('interConfig/silverMail/silverMailTopClassify/silverMailTopClassifyDetail'), name: 'silverMailTopClassifyDetail', meta: { title: 'silverMailTopClassifyDetail' }, hidden: true},
//
//          //      银贝商城迭代-轮播图
//          { path: 'silverMailSlideshowList', component: _import('interConfig/silverMail/silverMailSlideshow/silverMailSlideshowList'), name: 'silverMailSlideshowList', meta: { title: 'silverMailSlideshowList' }},
//          { path: 'silverMailSlideshowDetail', component: _import('interConfig/silverMail/silverMailSlideshow/silverMailSlideshowDetail'), name: 'silverMailSlideshowDetail', meta: { title: 'silverMailSlideshowDetail' }, hidden: true},
//
//          //      银贝商城迭代-固定运营位配置
//          { path: 'silverMailOperatingList', component: _import('interConfig/silverMail/silverMailOperating/silverMailOperatingList'), name: 'silverMailOperatingList', meta: { title: 'silverMailOperatingList' }},
//          { path: 'silverMailOperatingDetail', component: _import('interConfig/silverMail/silverMailOperating/silverMailOperatingDetail'), name: 'silverMailOperatingDetail', meta: { title: 'silverMailOperatingDetail' }, hidden: true},
//          { path: 'silverMailOperatingGoodsList', component: _import('interConfig/silverMail/silverMailOperating/silverMailOperatingGoods/silverMailOperatingGoodsList'), name: 'silverMailOperatingGoodsList', meta: { title: 'silverMailOperatingGoodsList' }, hidden: true},
//          { path: 'silverMailOperatingGoodsDetail', component: _import('interConfig/silverMail/silverMailOperating/silverMailOperatingGoods/silverMailOperatingGoodsDetail'), name: 'silverMailOperatingGoodsDetail', meta: { title: 'silverMailOperatingGoodsDetail' }, hidden: true},
//
//          //      银贝商城迭代-推荐商品
//          { path: 'silverMailRecommendedGoodsList', component: _import('interConfig/silverMail/silverMailRecommendedGoods/silverMailRecommendedGoodsList'), name: 'silverMailRecommendedGoodsList', meta: { title: 'silverMailRecommendedGoodsList' }},
//          { path: 'silverMailRecommendedGoodsDetail', component: _import('interConfig/silverMail/silverMailRecommendedGoods/silverMailRecommendedGoodsDetail'), name: 'silverMailRecommendedGoodsDetail', meta: { title: 'silverMailRecommendedGoodsDetail' }, hidden: true},
//        ]
//      }
//    ]
//  },

  // 活动商品配置
//  {
//    path: '/activityManage',
//    component: Layout,
////    redirect: '/interConfig/indexManage/indexSlideshowList',
//    name: 'activityManage',
//    meta: {
//      title: 'activityManage',
//      icon: 'chart'
//    },
//    children: [
//      //      虚拟商品管理
//      {
//        path: '/activityManage/virtualGoods',
//        component: _import('activityManage/index'),
//        name: 'virtualGoods',
//        meta: { title: 'virtualGoods'},
//        children: [
//          //      虚拟商品
////          { path: 'virtualGoodsList', component: _import('activityManage/virtualGoods/virtualGoodsList/virtualGoodsList'), name: 'virtualGoodsList', meta: { title: 'virtualGoodsList' }},
////          { path: 'virtualGoodsDetail', component: _import('activityManage/virtualGoods/virtualGoodsList/virtualGoodsDetail'), name: 'virtualGoodsDetail', meta: { title: 'virtualGoodsDetail' }, hidden: true},
//
//          //      虚拟商品订单
//          { path: 'virtualGoodsOrderList', component: _import('activityManage/virtualGoods/virtualGoodsOrder/virtualGoodsOrderList'), name: 'virtualGoodsOrderList', meta: { title: 'virtualGoodsOrderList' }}
//        ]
//      },
//
//      //      活动商品
//      { path: 'activityGoodsList', component: _import('activityManage/activityGoods/activityGoodsList'), name: 'activityGoodsList', meta: { title: 'activityGoodsList' }},
//      { path: 'activityGoodsDetail', component: _import('activityManage/activityGoods/activityGoodsDetail'), name: 'activityGoodsDetail', meta: { title: 'activityGoodsDetail' }, hidden: true},
//
//      //      中秋活动商品
//      { path: 'minActivityGoodsList', component: _import('activityManage/minActivityGoods/minActivityGoodsList'), name: 'minActivityGoodsList', meta: { title: 'minActivityGoodsList' }},
//      { path: 'minActivityGoodsDetail', component: _import('activityManage/minActivityGoods/minActivityGoodsDetail'), name: 'minActivityGoodsDetail', meta: { title: 'minActivityGoodsDetail' }, hidden: true},
//
//      //      活动金贝
//      { path: 'activityGold', component: _import('activityManage/activityGold/activityGold'), name: 'activityGold', meta: { title: 'activityGold' }},
//
//      //      活动分享统计
//      { path: 'activityCount', component: _import('activityManage/activityCount/activityCount'), name: 'activityCount', meta: { title: 'activityCount' }}
//    ]
//  },

  // 首页运营位配置
//  {
//    path: '/indexConfig',
//    component: Layout,
////    redirect: '/interConfig/indexManage/indexSlideshowList',
//    name: 'indexConfig',
//    meta: {
//      title: 'indexConfig',
//      icon: 'chart'
//    },
//    children: [
//      //      首页运营位配置
//      { path: 'indexConfigList', component: _import('indexConfig/indexOperatingConfig/indexConfigList'), name: 'indexConfigList', meta: { title: 'indexConfigList' }},
//      { path: 'indexConfigDetail', component: _import('indexConfig/indexOperatingConfig/indexConfigDetail'), name: 'indexConfigDetail', meta: { title: 'indexConfigDetail' }, hidden: true},
//
//      //      运营页面
//      { path: 'operatingPagesList', component: _import('indexConfig/operatingPages/operatingPagesList'), name: 'operatingPagesList', meta: { title: 'operatingPagesList' }},
//      { path: 'operatingConfigDetail', component: _import('indexConfig/operatingPages/operatingConfigDetail'), name: 'operatingConfigDetail', meta: { title: 'operatingConfigDetail' }, hidden: true},
//      { path: 'operatingConfigList', component: _import('indexConfig/operatingPages/operatingConfigList'), name: 'operatingConfigList', meta: { title: 'operatingConfigList' }, hidden: true},
//
//      //      pgc页面
//      { path: 'pgcPagesList', component: _import('indexConfig/pgcPages/pgcPagesList'), name: 'pgcPagesList', meta: { title: 'pgcPagesList' }},
//      { path: 'pgcPagesDetail', component: _import('indexConfig/pgcPages/pgcPagesDetail'), name: 'pgcPagesDetail', meta: { title: 'pgcPagesDetail' }, hidden: true},
//
//      //      附近
//      { path: 'nearbyList', component: _import('indexConfig/nearby/nearbyList'), name: 'nearbyList', meta: { title: 'nearbyList' }},
//      { path: 'nearbyDetail', component: _import('indexConfig/nearby/nearbyDetail'), name: 'nearbyDetail', meta: { title: 'nearbyDetail' }, hidden: true},
//
//      // {
//      //   path: '/indexConfig/indexOperatingConfig',
//      //   component: _import('indexConfig/index'),
//      //   name: 'indexOperatingConfig',
//      //   meta: {title: 'indexOperatingConfig'},
//      //   children: [
//      //   ]
//      // },
//    ]
//  },

  // 新版首页运营位配置
  {
    path: '/indexConfigJava',
    component: Layout,
//    redirect: '/interConfig/indexManage/indexSlideshowList',
    name: 'indexConfigJava',
    meta: {
      title: 'indexConfigJava',
      icon: 'chart'
    },
    children: [
      //      首页运营位配置
      { path: 'indexConfigJavaList', component: _import('indexConfigJava/indexConfigJavaList'), name: 'indexConfigJavaList', meta: { title: 'indexConfigJavaList' }},
      { path: 'indexConfigJavaDetail', component: _import('indexConfigJava/indexConfigJavaDetail'), name: 'indexConfigJavaDetail', meta: { title: 'indexConfigJavaDetail' }, hidden: true},
      //      首页运营位配置
      { path: 'frontClassList', component: _import('indexConfigJava/frontClassList'), name: 'frontClassList', meta: { title: 'frontClassList' }},
      { path: 'frontClassDetail', component: _import('indexConfigJava/frontClassDetail'), name: 'frontClassDetail', meta: { title: 'frontClassDetail' }, hidden: true},
      { path: 'frontClassSecList', component: _import('indexConfigJava/frontClassSecList'), name: 'frontClassSecList', meta: { title: 'frontClassSecList' }, hidden: true},
      { path: 'frontClassConfig', component: _import('indexConfigJava/frontClassConfig'), name: 'frontClassConfig', meta: { title: 'frontClassConfig' }, hidden: true},
      ]
  },

  // 活动中心
  {
    path: '/activeCenter',
    component: Layout,
//    redirect: '/interConfig/indexManage/indexSlideshowList',
    name: 'activeCenter',
    meta: {
      title: 'activeCenter',
      icon: 'chart'
    },
    children: [
      //      首页运营位配置
      { path: 'helpBuyList', component: _import('activeCenter/helpBuy/helpBuyList'), name: 'helpBuyList', meta: { title: 'helpBuyList' }},
      { path: 'helpBuyDetail', component: _import('activeCenter/helpBuy/helpBuyDetail'), name: 'helpBuyDetail', meta: { title: 'helpBuyDetail' }, hidden: true},
      //      商品
      { path: 'helpBuyGoodsList', component: _import('activeCenter/helpBuy/helpBuyGoodsList'), name: 'helpBuyGoodsList', meta: { title: 'helpBuyGoodsList' }, hidden: true},
      { path: 'helpBuyGoodsDetail', component: _import('activeCenter/helpBuy/helpBuyGoodsDetail'), name: 'helpBuyGoodsDetail', meta: { title: 'helpBuyGoodsDetail' }, hidden: true},
      //      首页运营位配置
//      { path: 'frontClassList', component: _import('indexConfigJava/frontClassList'), name: 'frontClassList', meta: { title: 'frontClassList' }},
//      { path: 'frontClassDetail', component: _import('indexConfigJava/frontClassDetail'), name: 'frontClassDetail', meta: { title: 'frontClassDetail' }, hidden: true},
//      { path: 'frontClassSecList', component: _import('indexConfigJava/frontClassSecList'), name: 'frontClassSecList', meta: { title: 'frontClassSecList' }, hidden: true},
//      { path: 'frontClassConfig', component: _import('indexConfigJava/frontClassConfig'), name: 'frontClassConfig', meta: { title: 'frontClassConfig' }, hidden: true},
      ]
  },
  // 商家联盟
//  {
//    path: '/allianceManage',
//    component: Layout,
//    redirect: 'noredirect',
//    name: 'allianceManage',
//    meta: {
//      title: 'allianceManage',
//      icon: 'chart'
//    },
//    children: [
//      //      商家联盟列表
//      { path: 'allianceList', component: _import('allianceManage/allianceList/businessAllianceList'), name: 'businessAllianceList', meta: { title: 'businessAllianceList', noCache: true }},
//      { path: 'packageGoodsList', component: _import('allianceManage/allianceList/packageGoodsList'), name: 'packageGoodsList', meta: { title: 'packageGoodsList', noCache: true }, hidden: true },
//      { path: 'packageGoodsDetail', component: _import('allianceManage/allianceList/packageGoodsDetail'), name: 'packageGoodsDetail', meta: { title: 'packageGoodsDetail', noCache: true }, hidden: true },
//
//      //      商家联盟配置
//      { path: 'allianceConfig', component: _import('allianceManage/allianceConfig/allianceConfig'), name: 'allianceConfig', meta: { title: 'allianceConfig', noCache: true }}
//    ]
//  },

  // 其它配置
  {
    path: '/otherConfig',
    component: Layout,
    redirect: 'noredirect',
    name: 'otherConfig',
    meta: {
      title: 'otherConfig',
      icon: 'chart'
    },
    children: [
      //      铜贝规则设置
//      { path: 'tombacDetail', component: _import('otherConfig/tombacConfig/tombacDetail'), name: 'tombacDetail', meta: { title: 'tombacDetail', noCache: true }},
//
//      //      分享购买设置
//      { path: 'shareBuyDetail', component: _import('otherConfig/shareBuy/shareBuyDetail'), name: 'shareBuyDetail', meta: { title: 'shareBuyDetail', noCache: true }},
//
//      //     分账时间设置
//      { path: 'transferDetail', component: _import('otherConfig/transferConfig/transferDetail'), name: 'transferDetail', meta: { title: 'transferDetail', noCache: true }},
//
//      //      推荐收入列表
//      { path: 'referralEarningList', component: _import('otherConfig/referralEarning/referralEarningList'), name: 'referralEarningList', meta: { title: 'referralEarningList', noCache: true }, hidden: true},

      //      用户邮费设置
      { path: 'userFreightList', component: _import('otherConfig/userFreight/userFreightList'), name: 'userFreightList', meta: { title: 'userFreightList', noCache: true }},
      { path: 'userFreightDetail', component: _import('otherConfig/userFreight/userFreightDetail'), name: 'userFreightDetail', meta: { title: 'userFreightDetail', noCache: true }, hidden: true}
    ]
  },

  // 自带

  //  {
  //    path: '/permission',
  //    component: Layout,
  //    redirect: '/permission/index',
  //    alwaysShow: true, // will always show the root menu
  //    meta: {
  //      title: 'permission',
  //      icon: 'lock',
  //      roles: ['admin', 'editor'] // you can set roles in root nav
  //    },
  //    children: [{
  //      path: 'page',
  //      component: _import('permission/page'),
  //      name: 'pagePermission',
  //      meta: {
  //        title: 'pagePermission',
  //        roles: ['admin'] // or you can only set roles in sub nav
  //      }
  //    }, {
  //      path: 'directive',
  //      component: _import('permission/directive'),
  //      name: 'directivePermission',
  //      meta: {
  //        title: 'directivePermission'
  //        // if do not set roles, means: this page does not require permission
  //      }
  //    }]
  //  },
  //
  //  {
  //    path: '/icon',
  //    component: Layout,
  //    children: [{
  //      path: 'index',
  //      component: _import('svg-icons/index'),
  //      name: 'icons',
  //      meta: { title: 'icons', icon: 'icon', noCache: true }
  //    }]
  //  },
  //
  //  {
  //    path: '/components',
  //    component: Layout,
  //    redirect: 'noredirect',
  //    name: 'component-demo',
  //    meta: {
  //      title: 'components',
  //      icon: 'component'
  //    },
  //    children: [
  //      { path: 'tinymce', component: _import('components-demo/tinymce'), name: 'tinymce-demo', meta: { title: 'tinymce' }},
  //      { path: 'markdown', component: _import('components-demo/markdown'), name: 'markdown-demo', meta: { title: 'markdown' }},
  //      { path: 'json-editor', component: _import('components-demo/jsonEditor'), name: 'jsonEditor-demo', meta: { title: 'jsonEditor' }},
  //      { path: 'dnd-list', component: _import('components-demo/dndList'), name: 'dndList-demo', meta: { title: 'dndList' }},
  //      { path: 'splitpane', component: _import('components-demo/splitpane'), name: 'splitpane-demo', meta: { title: 'splitPane' }},
  //      { path: 'avatar-upload', component: _import('components-demo/avatarUpload'), name: 'avatarUpload-demo', meta: { title: 'avatarUpload' }},
  //      { path: 'dropzone', component: _import('components-demo/dropzone'), name: 'dropzone-demo', meta: { title: 'dropzone' }},
  //      { path: 'sticky', component: _import('components-demo/sticky'), name: 'sticky-demo', meta: { title: 'sticky' }},
  //      { path: 'count-to', component: _import('components-demo/countTo'), name: 'countTo-demo', meta: { title: 'countTo' }},
  //      { path: 'mixin', component: _import('components-demo/mixin'), name: 'componentMixin-demo', meta: { title: 'componentMixin' }},
  //      { path: 'back-to-top', component: _import('components-demo/backToTop'), name: 'backToTop-demo', meta: { title: 'backToTop' }},
  //      { path: 'drag-dialog', component: _import('components-demo/dragDialog'), name: 'dragDialog-demo', meta: { title: 'dragDialog' }},
  //      { path: 'drag-kanban', component: _import('components-demo/dragKanban'), name: 'dragKanban-demo', meta: { title: 'dragKanban' }}
  //    ]
  //  },
  //
  //  {
  //    path: '/charts',
  //    component: Layout,
  //    redirect: 'noredirect',
  //    name: 'charts',
  //    meta: {
  //      title: 'charts',
  //      icon: 'chart'
  //    },
  //    children: [
  //      { path: 'keyboard', component: _import('charts/keyboard'), name: 'keyboardChart', meta: { title: 'keyboardChart', noCache: true }},
  //      { path: 'line', component: _import('charts/line'), name: 'lineChart', meta: { title: 'lineChart', noCache: true }},
  //      { path: 'mixchart', component: _import('charts/mixChart'), name: 'mixChart', meta: { title: 'mixChart', noCache: true }}
  //    ]
  //  },
  //
  //  {
  //    path: '/example',
  //    component: Layout,
  //    redirect: '/example/table/complex-table',
  //    name: 'example',
  //    meta: {
  //      title: 'example',
  //      icon: 'example'
  //    },
  //    children: [
  //      {
  //        path: '/example/table',
  //        component: _import('example/table/index'),
  //        redirect: '/example/table/complex-table',
  //        name: 'Table',
  //        meta: {
  //          title: 'Table',
  //          icon: 'table'
  //        },
  //        children: [
  //          { path: 'dynamic-table', component: _import('example/table/dynamicTable/index'), name: 'dynamicTable', meta: { title: 'dynamicTable' }},
  //          { path: 'drag-table', component: _import('example/table/dragTable'), name: 'dragTable', meta: { title: 'dragTable' }},
  //          { path: 'inline-edit-table', component: _import('example/table/inlineEditTable'), name: 'inlineEditTable', meta: { title: 'inlineEditTable' }},
  //          { path: 'tree-table', component: _import('example/table/treeTable/treeTable'), name: 'treeTableDemo', meta: { title: 'treeTable' }},
  //          { path: 'custom-tree-table', component: _import('example/table/treeTable/customTreeTable'), name: 'customTreeTableDemo', meta: { title: 'customTreeTable' }},
  //          { path: 'complex-table', component: _import('example/table/complexTable'), name: 'complexTable', meta: { title: 'complexTable' }}
  //        ]
  //      },
  //      { path: 'tab/index', icon: 'tab', component: _import('example/tab/index'), name: 'tab', meta: { title: 'tab' }}
  //    ]
  //  },
  //
  //  {
  //    path: '/form',
  //    component: Layout,
  //    redirect: 'noredirect',
  //    name: 'form',
  //    meta: {
  //      title: 'form',
  //      icon: 'form'
  //    },
  //    children: [
  //      { path: 'create-form', component: _import('form/create'), name: 'createForm', meta: { title: 'createForm', icon: 'table' }},
  //      { path: 'edit-form', component: _import('form/edit'), name: 'editForm', meta: { title: 'editForm', icon: 'table' }}
  //    ]
  //  },
  //
  //  {
  //    path: '/error',
  //    component: Layout,
  //    redirect: 'noredirect',
  //    name: 'errorPages',
  //    meta: {
  //      title: 'errorPages',
  //      icon: '404'
  //    },
  //    children: [
  //      { path: '401', component: _import('errorPage/401'), name: 'page401', meta: { title: 'page401', noCache: true }},
  //      { path: '404', component: _import('errorPage/404'), name: 'page404', meta: { title: 'page404', noCache: true }}
  //    ]
  //  },
  //
  //  {
  //    path: '/error-log',
  //    component: Layout,
  //    redirect: 'noredirect',
  //    children: [{ path: 'log', component: _import('errorLog/index'), name: 'errorLog', meta: { title: 'errorLog', icon: 'bug' }}]
  //  },
  //
  //  {
  //    path: '/excel',
  //    component: Layout,
  //    redirect: '/excel/export-excel',
  //    name: 'excel',
  //    meta: {
  //      title: 'excel',
  //      icon: 'excel'
  //    },
  //    children: [
  //      { path: 'export-excel', component: _import('excel/exportExcel'), name: 'exportExcel', meta: { title: 'exportExcel' }},
  //      { path: 'export-selected-excel', component: _import('excel/selectExcel'), name: 'selectExcel', meta: { title: 'selectExcel' }},
  //      { path: 'upload-excel', component: _import('excel/uploadExcel'), name: 'uploadExcel', meta: { title: 'uploadExcel' }}
  //    ]
  //  },
  //
  //  {
  //    path: '/zip',
  //    component: Layout,
  //    redirect: '/zip/download',
  //    alwaysShow: true,
  //    meta: { title: 'zip', icon: 'zip' },
  //    children: [{ path: 'download', component: _import('zip/index'), name: 'exportZip', meta: { title: 'exportZip' }}]
  //  },
  //
  //  {
  //    path: '/theme',
  //    component: Layout,
  //    redirect: 'noredirect',
  //    children: [{ path: 'index', component: _import('theme/index'), name: 'theme', meta: { title: 'theme', icon: 'theme' }}]
  //  },
  //
  //  {
  //    path: '/clipboard',
  //    component: Layout,
  //    redirect: 'noredirect',
  //    children: [{ path: 'index', component: _import('clipboard/index'), name: 'clipboardDemo', meta: { title: 'clipboardDemo', icon: 'clipboard' }}]
  //  },
  //
  //  {
  //    path: '/i18n',
  //    component: Layout,
  //    children: [{ path: 'index', component: _import('i18n-demo/index'), name: 'i18n', meta: { title: 'i18n', icon: 'international' }}]
  //  },

  { path: '*', redirect: '/404', hidden: true }
]
