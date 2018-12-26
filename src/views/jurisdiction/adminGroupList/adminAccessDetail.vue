<template>
  <div class="adminAccessDetail">
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="当前分组" prop='module'>
        <el-select v-model="form.gid" placeholder="请选择" disabled>
          <el-option
            v-for="item in tableData"
            :key="item.id"
            :label="item.title"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-for='(value, key) in rulesObj' :key='key' :label='key'>
        <el-checkbox-group v-model="checkedCities" @change="checkChange">
          <el-checkbox v-for="item in value" :label="item.id" :key="item.id" :checked="item.select == 'ed'">{{item.title}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        form: {
          gid: '',
          access: '',
        },
        tableData: [],
        rulesObj: {},
        checkedCities: []
      }
    },
    created () {
      this.$axios({
        type: 'post',
        url: '/Auth/grouplist',
        data: {type: 2},
        fuc: (res) => {
          this.tableData = res.data.list
          this.form.gid = parseInt(this.$route.query.id)
        }
      })
      this.$axios({
        type: 'get',
        url: '/Auth/showaccess',
        data: {gid: this.$route.query.id},
        fuc: (res) => {
          this.rulesObj = res.data.access
        },
      })
    },
    methods: {
      isActive(route) {
        return route.path === this.$route.path || route.name === this.$route.name
      },
      checkChange (val) {
        console.log('newVal', val)
      },
      onSubmit () {
        let _form = JSON.parse(JSON.stringify(this.form))
        _form.access = this.checkedCities.join(',')
        this.$axios({
          type: 'get',
          url: '/Auth/setaccess',
          data: _form,
          fuc: (res) => {
            this.$deleteOneTag('/jurisdiction/adminGroupList')
          }
        })
      }
    }
  }
</script>
<style scoped="true">
  .adminAccessDetail{
    margin: 10px 20px 0;
    overflow: hidden;
  }
  .adminAccessDetail>.el-form{
    width: 400px;
    margin: 20px;
  }
</style>