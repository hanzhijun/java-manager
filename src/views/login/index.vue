<template>
  <div class="login-container">
    <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
      <div class="title-container">
        <h3 class="title">{{$t('login.title')}}</h3>
<!--        <lang-select class="set-language"></lang-select>-->
      </div>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="username" />
      </el-form-item>

      <el-form-item prop="pwd">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input name="password" :type="passwordType" @keyup.enter.native="handleLogin" v-model="loginForm.pwd" autoComplete="on" placeholder="password" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>

      <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading" @click.native.prevent="handleLogin">{{$t('login.logIn')}}</el-button>

<!--
      <div class="tips">
        <span>{{$t('login.username')}} : admin</span>
        <span>{{$t('login.password')}} : {{$t('login.any')}}</span>
      </div>
      <div class="tips">
        <span style="margin-right:18px;">{{$t('login.username')}} : editor</span>
        <span>{{$t('login.password')}} : {{$t('login.any')}}</span>
      </div>

      <el-button class="thirdparty-button" type="primary" @click="showDialog=true">{{$t('login.thirdparty')}}</el-button>
-->
    </el-form>

    <el-dialog :title="$t('login.thirdparty')" :visible.sync="showDialog" append-to-body>
      {{$t('login.thirdpartyTips')}}
      <br/>
      <br/>
      <br/>
      <social-sign />
    </el-dialog>

  </div>
</template>

<script>
//import { isvalidUsername } from '@/utils/validate'
import Cookies from 'js-cookie'
import LangSelect from '@/components/LangSelect'
import SocialSign from './socialsignin'

export default {
  components: { LangSelect, SocialSign },
  name: 'login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 4) {
        callback(new Error('The password can not be less than 4 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        pwd: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur' }],
        pwd: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      loading: false,
      showDialog: false
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          let encyptData = this.$encrypt(this.loginForm)
          this.$axios({
            type: 'post',
            url: '/ucenter/inout/login',
            data: encyptData.resultData,
            fuc: (res) => {
              console.log('res', res)
              if (res.code == 1) {
                 // 解密session
                Cookies.set('BHS_session', this.$decrypt({key: encyptData.beforeKey, session: res.data.session}))
                Cookies.set('BHS_sid', res.data.sid)
                Cookies.set('BHS_uid', res.data.uid)
                this.$axios({
                  type: 'post',
                  url: '/bhs-management-admin/login',
                  data: {
                    "clientId": Cookies.get('X-Client-Id'),
                    "sid": res.data.sid,
                    "uid": res.data.uid,
                    device: 16
                  },
                  fuc: (res) => {
                    if (res.code == 1) {
                      this.$axios({
                        type: 'get',
                        url: '/bhs-management-admin/permission/platformRoleTreeModel/getMyRoleTreeModel',
                        data: {},
                        fuc: (res) => {
                          if (res.code == 1) {
                            this.loading = false
                            Cookies.set('token', res.data.uid)
                            Cookies.set('BHS_token', res.data.uid)
                            this.$store.commit('SET_TOKEN', res.data.uid)
                            this.$router.push({ path: '/' })
                          } else {
                            this.loading = false
                          }
                        }
                      })
                    } else {
                      this.loading = false
                    }
                  }
                })
              } else {
                this.loading = false
              }
//              if (res.code === 200) {
//                Cookies.set('Admin-Token', res.token)
//                Cookies.set('token', res.token)
//                Cookies.set('BHS_userName', res.data.username)
//                Cookies.set('BHS_uid', res.data.uid)
//                this.$store.commit('SET_TOKEN', res.token)
//                console.log(1)
//                this.loading = false
//                this.$router.push({ path: '/' })
//              } else {
//                this.loading = false
//              }
            }
          })

//          this.$store.dispatch('LoginByUsername', this.loginForm).then(() => {
//            this.loading = false
//            this.$router.push({ path: '/' })
//          }).catch(() => {
//            this.loading = false
//          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    afterQRScan() {
      // const hash = window.location.hash.slice(1)
      // const hashObj = getQueryObject(hash)
      // const originUrl = window.location.origin
      // history.replaceState({}, '', originUrl)
      // const codeMap = {
      //   wechat: 'code',
      //   tencent: 'code'
      // }
      // const codeName = hashObj[codeMap[this.auth_type]]
      // if (!codeName) {
      //   alert('第三方登录失败')
      // } else {
      //   this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
      //     this.$router.push({ path: '/' })
      //   })
      // }
    }
  },
  created() {
//    console.log("6.5,13,15,8,15,1.3,8,8,6.5,4.8,16.5,2.2,1.7,99.5,7.8,1.5,15,11,24")
//    console.log("13,15,8,15,1.3,8,8,4.8,16.5,2.2,1.7,99.5,7.8,1.5,15,11,24")
//    console.log(6.5+13+15+8+15+1.3+8+8+6.5+4.8+16.5+2.2+1.7+99.5+7.8+1.5+15+11+24)
    this.$i18n.locale = 'zh'
    this.$store.dispatch('setLanguage', 'zh')
    // window.addEventListener('hashchange', this.afterQRScan)
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      font-weight: 400;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
}
</style>
