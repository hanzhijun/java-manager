
import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import Element from 'element-ui'
import { Message, MessageBox } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import Cookies from 'js-cookie'
import axios from 'axios'
import App from './App'
import router from './router'
import store from './store'

import JSEncrypt from 'jsencrypt'
let CryptoJS = require('crypto-js')
import Guid from 'guid'

import i18n from './lang' // Internationalization
import './icons' // icon
import './errorLog'// error log
import './permission' // permission control
// import './mock' // simulation data

import * as filters from './filters' // global filters

Vue.use(Element, {
  size: 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

Vue.prototype.$qiyang = function () {
  axios.get('http://192.168.10.116/dsb/public/area.js', { params: {}, withCredentials: false, headers: { 'Content-Type': 'application/json', 'Accept': '*/*' }})
  .then(function(response) {
//        Cookies.set('token', response.data.token)
//        Cookies.set('token', 'will')
      })
}

// 格式化人民币
Vue.prototype.$formatMoney = function (s) {
  if (/[^0-9\.]/.test(s)) return "invalid value";
  s = s.replace(/^(\d*)$/, "$1.");
  s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
  s = s.replace(".", ",");
  var re = /(\d)(\d{3},)/;
  while (re.test(s))
      s = s.replace(re, "$1,$2");
  s = s.replace(/,(\d\d)$/, ".$1");
  return s.replace(/^\./, "0.") + '元'

}

// 格式化时间
Vue.prototype.$formatTime = function (time) {
  if (time) {
    return (new Date(parseInt(time) * 1000).getFullYear()) + "-" + (new Date(parseInt(time) * 1000).getMonth() + 1) + "-" + (new Date(parseInt(time) * 1000).getDate()) + " " + (new Date(parseInt(time) * 1000).getHours()) + ":" + (new Date(parseInt(time) * 1000).getMinutes()) + ":" + (new Date(parseInt(time) * 1000).getSeconds())
  } else {
    return '-'
  }
}

// 关闭当前标签页
Vue.prototype.$deleteOneTag = function(route, query) {
  for (const val of this.$store.state.tagsView.visitedViews) {
    if (val.name === this.$route.name) {
      this.$store.dispatch('delVisitedViews', val).then((views) => {
        if (val.path === this.$route.path || val.name === this.$route.name) {
          if (query) {
            this.$router.push({path: route, query: query})
          } else {
            this.$router.push({path: route})
          }
        }
      })
    }
  }
}

// 导出Excell
Vue.prototype.$downloadExcell = function (obj) {
  let str = ''
  for (let key in obj) {
    if (key != 'url') {
      if (obj[key] instanceof Array && obj[key].length > 0) {
        str += '&'
        str += key + '='
        if (obj[key][0] instanceof Date) {
          str += obj[key][0].getTime() + ',' + obj[key][1].getTime()
        } else {
          str += obj[key][0] + ',' + obj[key][1]
        }

      } else if (obj[key] != '') {
        str += '&'
        str += key + '='+ obj[key]
      }
    }
  }
  window.open(process.env.BASE_API + obj.url + '?' + 'source=admin&token=' + Cookies.get('token') + str)
}
Vue.prototype.$encrypt = (msg) => {
  function rndRandom (size) {
        let rnd = {}
        rnd.size = size
        rnd.list = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
        rnd.val = '' // key
        for (var i = 0; i < rnd.size; ++i) {
          var tmp = parseInt((rnd.list.length) * Math.random())
//          if (i === 7) {
//            if (tmp % 2 === 0) {
//              rnd.val += '_'
//            } else {
//              rnd.val += rnd.list[tmp] + '_'
//              rnd.list.splice(tmp, 1)
//              i++
//            }
//          } else {
            rnd.val += rnd.list[tmp]
            rnd.list.splice(tmp, 1)
//          }
        }
        return rnd.val
      }
      let beforeKey = rndRandom(16)
//      state.key = beforeKey
//        rnd.val = Base64.encode(rnd.val)
//      let data = {
//        account: msg.username,
//        password: msg.pwd,
//        app: 1000,
//        device: 16,
//        nonce: rndRandom(8),
//        timespan: new Date().getTime()
//      }
      let data = "account=" + msg.username + "&password=" + msg.pwd + "&app=" + 1000 + "&device=" + 16 + "&nonce=" + rndRandom(8) + "&timespan=" + new Date().getTime()
      let resultData = {}
      // aes加密
      resultData.encryptData = (function () {
        let key = CryptoJS.enc.Utf8.parse(beforeKey)
        let iv = CryptoJS.enc.Utf8.parse('16-Bytes--String')
        var encrypted = CryptoJS.AES.encrypt(data, key,
          {
            iv: iv,
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
          })
        return encrypted.toString() // 返回的是base64格式的密文
      })()
  // RSA加密
      let encrypt = new JSEncrypt()
      var publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCIDan2Y6LFs0Sq5Tv9ZDvIbpZ8PE82ian+7Dv5T0fnYftd1csfMzt3ytemb7NCj7/F2NXmAj7jw1OPV/UEFo7ZcLAv347CuyyhBGWrowJqfQmhKYc/Or+3dA5yZGFTjLMXjhriqgy/TVyvOb+bMUoM/WNORTsYOVZjZ+MqaGWlRwIDAQAB'  // 从服务端接收到的公钥，缓存到本地
      encrypt.setPublicKey(publicKey)
//      resultData.encryptKey = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encrypt.encrypt(beforeKey))) // RSAkey
      resultData.encryptKey = encrypt.encrypt(beforeKey) // RSAkey
//      state.jiamiData = resultData
      return {resultData, beforeKey}
}
Vue.prototype.$decrypt = (msg) => {
  let key = CryptoJS.enc.Utf8.parse(msg.key)
  let iv = CryptoJS.enc.Utf8.parse('16-Bytes--String')
  var decrypted = CryptoJS.AES.decrypt(msg.session, key,
    {
      iv: iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })
  return decrypted.toString(CryptoJS.enc.Utf8)
  
}

// 限制整数
Vue.prototype.$inputKeyUp = (e) => { // 输入框限制
//	console.log(window.arguments)
//  var event = window.event || arguments.callee.caller.arguments[0]
  let target = window.event ? (event.srcElement || event.target) : e.target
  
//  let target = event.srcElement || event.target
  if (target.value.length === 1) {
    target.value = target.value.replace(/[^1-9]/g, '')
  } else {
    target.value = target.value.replace(/\D/g, '')
  }
  return target.value
}

Vue.prototype.$axios = function(params, type) {
  let appCode = 1000
  let projectCode = 10002
  
  
//  请求头算法
//    X-Client-Id算法
  let ClientId = ''
  if (Cookies.get('X-Client-Id')) {
    ClientId = Cookies.get('X-Client-Id')
  } else {
    ClientId = Guid.create().value
    Cookies.set('X-Client-Id', ClientId)
  }
  
//  浏览器算法
  let client = ''
  let clientVersion = ''
  var explorer = window.navigator.userAgent.toLowerCase()
      // ie
  if (explorer.indexOf('msie') >= 0) {
    let ver = explorer.match(/msie ([\d.]+)/)[1]
    client = 'IE'
    clientVersion = ver
  } else if (explorer.indexOf('trident') >= 0) {
    let ver = explorer.match(/trident\/([\d.]+)/)[1]
    client = 'trident'
    clientVersion = ver
  } else if (explorer.indexOf('firefox') >= 0) { // firefox
    let ver = explorer.match(/firefox\/([\d.]+)/)[1]
    client = 'Firefox'
    clientVersion = ver
  } else if (explorer.indexOf('chrome') >= 0) { // Chrome
    let ver = explorer.match(/chrome\/([\d.]+)/)[1]
    client = 'Chrome'
    clientVersion = ver
  } else if (explorer.indexOf('opera') >= 0) { // Opera
    let ver = explorer.match(/opera.([\d.]+)/)[1]
    client = 'Opera'
    clientVersion = ver
  } else if (explorer.indexOf('safari') >= 0) { // Safari
    let ver = explorer.match(/version\/([\d.]+)/)[1]
    client = 'Safari'
    clientVersion = ver
  }
  
  function rndRandom (size) {
    let rnd = {}
    rnd.size = size
    rnd.list = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    rnd.val = '' // key
    for (var i = 0; i < rnd.size; ++i) {
      var tmp = parseInt((rnd.list.length) * Math.random())
//      if (i === 7) {
//        if (tmp % 2 === 0) {
//          rnd.val += '_'
//        } else {
//          rnd.val += rnd.list[tmp] + '_'
//          rnd.list.splice(tmp, 1)
//          i++
//        }
//      } else {
        rnd.val += rnd.list[tmp]
        rnd.list.splice(tmp, 1)
//      }
    }
    return rnd.val
  }
  let timespan = ''+(Date.parse(new Date()))// 时间戳
  let nonce = rndRandom(8) // uuid随机数
  
 // BReplay hmacDataBefore: nonce=随机8位字符串&timespan=时间戳&sig=签名
  let hmacDataBefore = timespan + '&' + nonce + '&' + ClientId + '&' + appCode
  var hmacData = CryptoJS.HmacSHA1(hmacDataBefore, appCode + ClientId + nonce)
  let BReplay = "nonce=" + nonce + "&timespan=" + timespan +'&sig='+hmacData
  
  
 // B-Author app=应用CODE&sid=登陆后生成&nonce=随机字符串8位&timespan=时间戳& device=设备类型(与平台对应)& uid=用户唯一ID& sig=签名
  let BAuthor = ''
  if (Cookies.get('BHS_session') && params.url != '/ucenter/inout/login' && params.url != '/bhs-management-admin/login') {
    let hmacAuthorDataBefore = "app=" + appCode + "&sid=" + Cookies.get('BHS_sid') + "&nonce=" + nonce + "&timespan=" + timespan + "&device=" + 16 + "&uid=" + Cookies.get('BHS_uid')
    var hmacAuthorData = CryptoJS.HmacSHA1(hmacAuthorDataBefore, Cookies.get('BHS_session'))
    BAuthor = hmacAuthorDataBefore + '&sig='+hmacAuthorData
    
  }
  const baseUrl = params.url == '/ucenter/inout/login' ? process.env.LOGIN_API : (params.url == '/bhs-fileserver/file/uploadSingle' ? process.env.UPLOAD_API : process.env.BASE_API)
//  if (type == 1) {
//    params.data.append('source', 'admin')
//    params.data.append('token', Cookies.get('token') ? Cookies.get('token') : '')
//  } else {
//    params.data.source = 'admin'
//    params.data.token = Cookies.get('token') ? Cookies.get('token') : ''
//  }
  if (this.$store.state.app.showLoadingNums < 1) {
    this.$store.state.app.showLoading = this.$loading({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
  }
  this.$store.state.app.showLoadingNums++ // 开启请求数据

  if (params.url == '/business/offlinecreatepayqrcode' || '/business/offlinecreatetableqrcode') {
//    axios.defaults.timeout = 10000; //导出暂不定响应时间
  } else {
    axios.defaults.timeout = 10000; //响应时间
  }

  //返回状态判断(添加响应拦截器)
//  axios.interceptors.response.use((res) =>{
//    //对响应数据做些事
//    console.log('res', res)
////    if(!res.data.success){
////    // _.toast(res.data.msg);
////      return Promise.reject(res);
////    }
//    return res;
//  }, (error) => {
//    console.log("网络异常", 'fail')
////    _.toast("网络异常", 'fail');
//    return Promise.reject(error);
//  });
  if (params.type === 'get') {
    axios.get(baseUrl + params.url, { params: params.data, withCredentials: false, headers: { 'Content-Type': type == 1 ? 'multipart/form-data' : 'application/json', 'Accept': '*/*',
          'B-User-Agent': appCode + "/1.0;" + client + "/" + clientVersion + ";web/h5;cn;" + projectCode,
          'X-Client-Id': ClientId,
          'B-Replay': BReplay,
          'B-Author': BAuthor }})
      .then((response) => {
//        Cookies.set('token', response.data.token)
//        Cookies.set('token', 'will')
        if (response.data.code == 416) {
          Message({
            showClose: true,
            message: response.data.msg,
            type: 'error'
          })
          params.fuc(response.data)
        } else if (response.data.code == 1010) {
          Cookies.remove('Admin-Token')
          Cookies.remove('token')
          location.reload()
        } else if (response.data.code != 1) {
          // params.fuc(response.data)
          Message({
            showClose: true,
            message: response.data.msg,
            type: 'error'
          })
          //          params.nowThis.$Modal.warning({
          //            content: response.data.msg,
          //            title: '警告',
          //            onOk: () => {
          //              params.nowThis.$store.commit('logout', this);
          //              params.nowThis.$store.commit('clearOpenedSubmenu');
          //              params.nowThis.$router.push({
          //                  name: 'login'
          //              })
          //            }
          //          })
        } else {
          params.fuc(response.data)
        }

//        结束loading
        this.$store.state.app.showLoadingNums-- // 开启请求数据
        if (this.$store.state.app.showLoadingNums < 1) {
          this.$store.state.app.showLoading.close()
        }
      })
      .catch((error) => {
        let mes = '加载超时 请检查网络！'
        if (error.response && error.response.status) {
          mes = '服务器错误，请联系管理员！'
        }
//        结束loading
        this.$store.state.app.showLoadingNums-- // 开启请求数据
        if (this.$store.state.app.showLoadingNums < 1) {
          this.$store.state.app.showLoading.close()
        }
        params.fuc(error)
        Message({
          showClose: true,
          message: mes,
          type: 'error'
        })
      })
  } else if (params.type === 'delete') {
    axios.delete(baseUrl + params.url, { params: params.data, withCredentials: false, headers: { 'Content-Type': type == 1 ? 'multipart/form-data' : 'application/json', 'Accept': '*/*',
          'B-User-Agent': appCode + "/1.0;" + client + "/" + clientVersion + ";web/h5;cn;" + projectCode,
          'X-Client-Id': ClientId,
          'B-Replay': BReplay,
          'B-Author': BAuthor }})
      .then((response) => {
//        Cookies.set('token', response.data.token)
//        Cookies.set('token', 'will')
        if (response.data.code == 416) {
          Message({
            showClose: true,
            message: response.data.msg,
            type: 'error'
          })
          params.fuc(response.data)
        } else if (response.data.code == 1010) {
          Cookies.remove('Admin-Token')
          Cookies.remove('token')
          location.reload()
        } else if (response.data.code != 1) {
          // params.fuc(response.data)
          Message({
            showClose: true,
            message: response.data.msg,
            type: 'error'
          })
          //          params.nowThis.$Modal.warning({
          //            content: response.data.msg,
          //            title: '警告',
          //            onOk: () => {
          //              params.nowThis.$store.commit('logout', this);
          //              params.nowThis.$store.commit('clearOpenedSubmenu');
          //              params.nowThis.$router.push({
          //                  name: 'login'
          //              })
          //            }
          //          })
        } else {
          params.fuc(response.data)
        }

//        结束loading
        this.$store.state.app.showLoadingNums-- // 开启请求数据
        if (this.$store.state.app.showLoadingNums < 1) {
          this.$store.state.app.showLoading.close()
        }
      })
      .catch((error) => {
        let mes = '加载超时 请检查网络！'
        if (error.response && error.response.status) {
          mes = '服务器错误，请联系管理员！'
        }
//        结束loading
        this.$store.state.app.showLoadingNums-- // 开启请求数据
        if (this.$store.state.app.showLoadingNums < 1) {
          this.$store.state.app.showLoading.close()
        }
        params.fuc(error)
        Message({
          showClose: true,
          message: mes,
          type: 'error'
        })
      })
  } else if (params.type === 'post') {
    axios.post(
      baseUrl + params.url,
      type == 1 ? params.data : JSON.stringify(params.data),
      {
        withCredentials: false,
        headers: {
          'Content-Type': type == 1 ? 'multipart/form-data' : 'application/json',
          'B-User-Agent': appCode + "/1.0;" + client + "/" + clientVersion + ";web/h5;cn;" + projectCode,
          'X-Client-Id': ClientId,
          'B-Replay': BReplay,
          'B-Author': BAuthor
        }
      })
      .then((response) => {
//        Cookies.set('token', response.data.token)
//                Cookies.set('token', 'will')
        if (response.data.code == 416) {
          Message({
            showClose: true,
            message: response.data.msg,
            type: 'error'
          })
          params.fuc(response.data)
        } else if (response.data.code == 1010) {
          Cookies.remove('Admin-Token')
          Cookies.remove('token')
          location.reload()
        } else if (response.data.code != 1) {
          Message({
            showClose: true,
            message: response.data.msg,
            type: 'error'
          })
        } else {
          params.fuc(response.data)
        }

//        结束loading
        this.$store.state.app.showLoadingNums-- // 开启请求数据
        if (this.$store.state.app.showLoadingNums < 1) {
          this.$store.state.app.showLoading.close()
        }
      })
      .catch((error) => {
        let mes = '加载超时 请检查网络！'
        if (error.response && error.response.status) {
          mes = '服务器错误，请联系管理员！'
        }
//        结束loading
        this.$store.state.app.showLoadingNums-- // 开启请求数据
        if (this.$store.state.app.showLoadingNums < 1) {
          this.$store.state.app.showLoading.close()
        }
        params.fuc(error)
        Message({
          showClose: true,
          message: mes,
          type: 'error'
        })
      })
  } else if (params.type === 'put') {
    axios.put(
      baseUrl + params.url,
      type == 1 ? params.data : JSON.stringify(params.data),
      {
        withCredentials: false,
        headers: {
          'Content-Type': type == 1 ? 'multipart/form-data' : 'application/json',
          'B-User-Agent': appCode + "/1.0;" + client + "/" + clientVersion + ";web/h5;cn;" + projectCode,
          'X-Client-Id': ClientId,
          'B-Replay': BReplay,
          'B-Author': BAuthor
        }
      })
      .then((response) => {
//        Cookies.set('token', response.data.token)
//                Cookies.set('token', 'will')
        if (response.data.code == 416) {
          Message({
            showClose: true,
            message: response.data.msg,
            type: 'error'
          })
          params.fuc(response.data)
        } else if (response.data.code == 1010) {
          Cookies.remove('Admin-Token')
          Cookies.remove('token')
          location.reload()
        } else if (response.data.code != 1) {
          Message({
            showClose: true,
            message: response.data.msg,
            type: 'error'
          })
        } else {
          params.fuc(response.data)
        }

//        结束loading
        this.$store.state.app.showLoadingNums-- // 开启请求数据
        if (this.$store.state.app.showLoadingNums < 1) {
          this.$store.state.app.showLoading.close()
        }
      })
      .catch((error) => {
        let mes = '加载超时 请检查网络！'
        if (error.response && error.response.status) {
          mes = '服务器错误，请联系管理员！'
        }
//        结束loading
        this.$store.state.app.showLoadingNums-- // 开启请求数据
        if (this.$store.state.app.showLoadingNums < 1) {
          this.$store.state.app.showLoading.close()
        }
        params.fuc(error)
        Message({
          showClose: true,
          message: mes,
          type: 'error'
        })
      })
  }
}


new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App }
})
