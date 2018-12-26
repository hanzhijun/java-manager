<template>
  <div class="goodsBrandDetail">
    <el-form ref="form" :model="form" label-width="120px" :rules='rules'>
      <el-form-item label='模板名称:' prop='freight_name'>
        <el-input v-model="form.freight_name" placeholder='请输入商品编码' :maxlength='20'></el-input>
      </el-form-item>
      <el-form-item label='是否包邮:'>
        <el-radio v-model="form.type" :label="1">自定义运费</el-radio>
        <el-radio v-model="form.type" :label="-1">包邮</el-radio>
      </el-form-item>
      <el-form-item label='计件方式:' v-if='form.type == 1'>
        <el-radio v-model="type" :label="1">按件数</el-radio>
      </el-form-item>
      <el-form-item label='默认运费:' class='inputDiv' v-if='form.type == 1'>
        <el-input v-model="form.default_num" placeholder='' :maxlength='20'></el-input><span>件内</span><el-input v-model="form.default_freight" placeholder='' :maxlength='20'></el-input><span>元，每增加</span><el-input v-model="form.increase_num" placeholder='' :maxlength='20'></el-input><span>件，增加</span><el-input v-model="form.increase_freight" placeholder='' :maxlength='20'></el-input><span>元</span>
      </el-form-item>
      <el-form-item v-if='form.type == 1'>
        <el-button @click='addLimit_area'>添加独立运费地区</el-button>
      </el-form-item>
      <el-form-item label='独立运费区域:' v-if='form.limit_area.length > 0'>
        <el-table
        :data="form.limit_area" border
        style="width: 100%">
          <el-table-column
            prop="province_id"
            label="运送到"
            min-width="120" align='center'>
            <template slot-scope='scope'>
              <el-select v-model="scope.row.province_id" @change='provinceChange(scope)' placeholder="请选择">
                <el-option
                  v-for="item in area_json"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="default_num"
            label="首件数（件）"
            min-width="120" align='center'>
            <template slot-scope='scope'>
              <el-input class="edit-input" size="small" v-model="scope.row.default_num"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="default_freight"
            label="首费（元）"
            min-width="120" align='center'>
            <template slot-scope='scope'>
              <el-input class="edit-input" size="small" v-model="scope.row.default_freight"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="increase_num"
            label="续件数（件）"
            min-width="120" align='center'>
            <template slot-scope='scope'>
              <el-input class="edit-input" size="small" v-model="scope.row.increase_num"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="increase_freight"
            label="续费（元）"
            min-width="120" align='center'>
            <template slot-scope='scope'>
              <el-input class="edit-input" size="small" v-model="scope.row.increase_freight"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="id"
            label="操作"
            min-width="120" align='center'>
            <template slot-scope='scope'>
              <el-button @click='deleteList_area(scope)'>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type='primary' @click='submit'>提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import area from '@/area.json'
  export default {
    data () {
      return {
        form: {
          freight_name: '',
          type: -1,
          default_num: '',
          default_freight: '',
          increase_num: '',
          increase_freight: '',
          limit_area: []
        },
        area_json: [],
        type: 1,
        rules: {
          freight_name: [{ required: true, message: '请填写模板名称', trigger: 'blur' }]
        }
      }
    },
    created () {
      this.area_json = area.area_json
      if (this.$route.query.fid) {
        this.$axios({
          type: 'post',
          url: '/goods/freight/details',
          data: {fid: this.$route.query.fid, business_id: this.$route.query.business_id},
          fuc: (res) => {
            if (res.code == 200) {
              this.form = res.data
              this.form.default_freight = parseInt(this.form.default_freight) / 100
              this.form.increase_freight = parseInt(this.form.increase_freight) / 100
              for (let val of this.form.limit_area) {
                val.default_freight = parseInt(val.default_freight) / 100
                val.increase_freight = parseInt(val.increase_freight) / 100
                val.province_id = val.province_id + ''
              }
              console.log(2, this.form)
//              this.$deleteOneTag('/goods/goodsBrandsList')
            }
          }
        })
      }
    },
    methods: {
      addLimit_area () {
        this.form.limit_area.push({
          province_id: '',
          default_num: '',
          default_freight: '',
          increase_num: '',
          increase_freight: ''
        })
      },
      deleteList_area (scope) {
        this.form.limit_area.splice(scope.$index, 1)
      },
      provinceChange (scope) {
        console.log(scope)
        let num = 0
        for (let val of this.form.limit_area) {
          if (val.province_id == scope.row.province_id) {
            num++
          }
        }
        if (num > 1) {
          this.form.limit_area[scope.$index].province_id = ''
          this.$message.warning('当前省份已重叠，请重新选择')
        }
      },
      submit () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            if (this.form.type == 1) {
              if (this.form.default_num != '' && this.form.default_freight != '' && this.form.increase_num != '' &&this.form.increase_freight != '') {
                
              } else {
                this.$message.warning('请完善默认运费')
                return false
              }
              if (this.form.limit_area.length > 0) {
                for (let val of this.form.limit_area) {
                  for (let valObj in val) {
                    if (val[valObj] == '') {
                      this.$message.warning('请完善独立运费区域')
                      return false
                    }
                  }
                }
              }
            }
            this.$axios({
              type: 'post',
              url: this.$route.query.fid ? '/goods/freight/edit' : '/goods/freight/insert',
              data: {business_id: this.$route.query.business_id, ...this.form},
              fuc: (res) => {
                if (res.code == 200) {
                  this.$message.success('操作成功')
                  this.$deleteOneTag('/business/onlineBusinessBrandsList', {business_id: this.$route.query.business_id})
                }
              }
            })
          }
        })
      }
    }
  }
</script>
<style scoped="true">
  .goodsBrandDetail{
    margin: 10px 20px 0;
    overflow: hidden;
  }
  .goodsBrandDetail>.el-form .el-input{
    max-width: 400px;
  }
  .goodsBrandDetail>.el-form .inputDiv .el-input{
    max-width: 50px;
  }
</style>
