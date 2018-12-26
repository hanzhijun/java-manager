<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>

    <breadcrumb class="breadcrumb-container"></breadcrumb>

    <div class="right-menu">
      <error-log class="errLog-container right-menu-item"></error-log>

      <el-tooltip effect="dark" :content="$t('navbar.screenfull')" placement="bottom">
        <screenfull class="screenfull right-menu-item"></screenfull>
      </el-tooltip>

<!--      <lang-select class="international right-menu-item"></lang-select>-->

<!--
      <el-tooltip effect="dark" :content="$t('navbar.theme')" placement="bottom">
        <theme-picker class="theme-switch right-menu-item"></theme-picker>
      </el-tooltip>
-->

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'">
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
<!--
          <router-link to="/">
            <el-dropdown-item>
              {{$t('navbar.dashboard')}}
            </el-dropdown-item>
          </router-link>
          <a target='_blank' href="https://github.com/PanJiaChen/vue-element-admin/">
            <el-dropdown-item>
              {{$t('navbar.github')}}
            </el-dropdown-item>
          </a>
-->
          <el-dropdown-item>
            <span @click='changeStatus' style="display:block;">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">{{$t('navbar.logOut')}}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog
      title="设置密码"
      :visible.sync="changeStatusDialog"
      width="30%">
      <el-form :model="changePwdForm" ref='changePwdForm' :rules='rules' label-width="80px">
        <el-form-item label="旧密码" prop='oldpwd'>
          <el-input v-model="changePwdForm.oldpwd"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop='newpwd'>
          <el-input v-model="changePwdForm.newpwd"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop='newpwdRe'>
          <el-input v-model="changePwdForm.newpwdRe"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeStatusDialog = false">取 消</el-button>
        <el-button type="primary" @click="changeStatusDialogTrue">确 定</el-button>
      </span>
    </el-dialog>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
//import LangSelect from '@/components/LangSelect'
//import ThemePicker from '@/components/ThemePicker'
import Cookies from 'js-cookie'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull
//    LangSelect,
//    ThemePicker
  },
  data () {
    return {
      changeStatusDialog: false,
      rules: {
        oldpwd: [{required: true, message: '请输入旧密码', trigger: 'blur'}],
        newpwd: [{required: true, message: '请输入新密码', trigger: 'blur'}],
        newpwdRe: [
          {required: true, message: '请确认密码', trigger: 'blur'},
          {validator: this.checkPwd, trigger: 'blur'}
        ],
      },
      changePwdForm: {
        oldpwd: '',
        newpwd: '',
        newpwdRe: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    checkPwd (rule, value, callback) {
     if (value === this.changePwdForm.newpwd) {
        callback()
      } else {
        callback(new Error('两次输入的密码不一致'))
      }
    },
    changeStatusDialogTrue () {
      console.log('reset')
      this.$refs['changePwdForm'].validate((valid) => {
        if (valid) {
          this.$axios({
            type: 'post',
            url: '/System/resetPwd',
            data: {uid: Cookies.get('BHS_uid'), ...this.changePwdForm},
            fuc: (res) => {
              if (res.code == 200) {
                Cookies.remove('Admin-Token')
                Cookies.remove('token')
                location.reload()
              }
            }
          })
        }
      })
    },
    logout() {
      this.$axios({
        type: 'post',
        url: '/System/logout',
        data: {},
        fuc: (res) => {
//          this.$message.success('注销成功')
//          location.reload()
          Cookies.remove('Admin-Token')
          Cookies.remove('token')
//          this.$router.push("/login")
          location.reload()
        }
      })
//      this.$store.dispatch('LogOut').then(() => {
//        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
//      })
    },
    changeStatus () {
      this.changeStatusDialog = true
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .hideSidebar .navbar{
    padding-left: 36px;
  }
  .mobile .navbar{
    padding-left: 0px;
  }
  .navbar {
  height: 50px;
  line-height: 50px;
  position: fixed;
  top:0;
  left:0;
  right:0;
  z-index: 999;
  padding-left: 180px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container{
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus{
     outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international{
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
