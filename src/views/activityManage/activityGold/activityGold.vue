<template>
  <div class="onlineBusinessDetail">
    <code>金贝详情</code>
    <el-form ref="formInline" :model="formInline" :inline="true" label-width="150px">
      <el-form-item label="总发放金贝数:">
        <span>{{formInline.total_num}}</span>
      </el-form-item>
      <el-form-item label="总发放人数:">
        <span>{{formInline.person_num}}</span>
      </el-form-item>
      <el-form-item label="总剩余发放金贝数:">
        <span>{{formInline.surplus_num}}</span>
      </el-form-item>
      <el-form-item label="昨日发放金贝数:">
        <span>{{formInline.yesterday_currency_sum}}</span>
      </el-form-item>
      <el-form-item label="今日发放金贝数:">
        <span>{{formInline.today_currency_sum}}</span>
      </el-form-item>
    </el-form>
    
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="开始时间:">
        <span>{{$formatTime(form.act_start)}}</span>
      </el-form-item>
      <el-form-item label="截止时间:">
        <span>{{$formatTime(form.act_end)}}</span>
      </el-form-item>
      <el-form-item label="起始金贝数:">
        <span>{{form.start_currency}}</span>
      </el-form-item>
      <el-form-item label="">
        <el-button @click='addDialog = true'>追加金贝</el-button>
        <el-button @click='getAddListDialogTable'>追加历史</el-button>
      </el-form-item>
      
      <el-form-item label="总发放金贝:">
        <span>{{form.total_currency}}</span>
      </el-form-item>
      <el-form-item label="比例:">
        <p v-for='item in form.proportion'>{{item.num1}}-{{item.num2}} {{item.num3}}%</p>
      </el-form-item>
      <el-form-item label="">
        <el-button @click='getEditDialogData'>编辑</el-button>
      </el-form-item>
    </el-form>
  
  <!--  添加金贝弹框-->
    <el-dialog
      title="请输入追加金贝数量"
      :visible.sync="addDialog"
      width="30%"
      @close="handleClose">
      <el-input v-model='addDialogInput' placeholder='请输入金贝数量'></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addDialogTrue">确 定</el-button>
      </span>
    </el-dialog>
    
  <!--  添加历史弹框-->
    <el-dialog
      title="金贝追加历史"
      :visible.sync="addListDialog"
      width="50%">
      <el-table :data='addListDialogTable' style="width: 100%" stripe>
        <el-table-column
          prop="create_at"
          label="追加时间"
          width="160">
          <template slot-scope='scope'>
            <span>{{$formatTime(scope.row.create_at)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="追加人"
          width="140">
        </el-table-column>
        <el-table-column
          prop="num"
          label="追加数量"
          width="140">
        </el-table-column>
        <el-table-column
          prop="total_num"
          label="总发放金贝数"
          width="140">
        </el-table-column>
      </el-table>
    </el-dialog>
  
  <!--  编辑弹框-->
    <el-dialog
      title="编辑比例"
      :visible.sync="editDialog"
      width="50%">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="截止时间:">
          <el-date-picker
            v-model="editDialogData.act_end"
            type="datetime" :picker-options="pickerOptions1" value-format='timestamp'
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <code>区间概率</code>
        <el-form-item v-for='(item, index) in editDialogData.proportion' :key='index'>
          <el-input v-model='item.num1' style='width: 60px;'></el-input>
          -
          <el-input v-model='item.num2' style='width: 60px;'></el-input>
          
          <el-input v-model='item.num3' style='width: 60px;'></el-input>%
          <el-button style='margin-left: 10px;' v-if='index == editDialogData.proportion.length - 1' @click='addProportion'>+</el-button>
          <el-button style='margin-left: 10px;' v-else @click='deleteProportion(index)'>-</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editDialogTrue">完成 保存</el-button>
      </span>
    </el-dialog>
  </div>
  
</template>

<script>
  export default {
    data () {
      return {
        addDialog: false,
        addDialogInput: '',
        editDialog: false,
        editDialogData: {
          act_end: 0,
          proportion: []
        },
        addListDialog: false,
        addListDialogTable: [],
        formInline: {
          total_num: '',
          person_num: '',
          surplus_num: '',
          yesterday_currency_sum: '',
          today_currency_sum: ''
        },
        form: {
          act_start: 0,
          act_end: 0,
          start_currency: '',
          total_currency: '',
          proportion: []
        },
        act_id: '',
        pickerOptions1: {
          disabledDate: (time) => {
            return time.getTime() < this.form.act_start * 1000
          }
        }
      }
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        new Promise((resolve, reject) => {
          this.$axios({
            type: 'post',
            url: '/active/activeInfo',
            data: {},
            fuc: (res) => {
  //            this.categoryList = res.data
              console.log(res)
              if (res.code == 200) {
                if (res.data) {
                  this.form = res.data
                  this.act_id = res.data.act_id
                  resolve(res.data)
                } else {
                  reject()
                }
              }
            }
          })
        }).then((data) => {
          this.$axios({
            type: 'post',
            url: '/active/goldDetail',
            data: {act_id: data.act_id},
            fuc: (res) => {
              this.formInline = res.data
            }
          })
        }).catch(() => {
          this.form.act_start = 0
          this.form.act_end = new Date().getTime() / 1000
          this.form.start_currency = 10
          this.form.proportion = [
            {num1: 10, num2: 20, num3: 30},
            {num1: 20, num2: 30, num3: 70},
          ]
          this.$axios({
            type: 'post',
            url: '/active/addActiveGold',
            data: this.form ,
            fuc: (res) => {
  //            this.categoryList = res.data
              console.log(res)
              if (res.code == 200) {
                this.init()
              }
            }
          })
        })
      },
      handleClose () {
        console.log('add')
        this.addDialogInput = ''
      },
      addDialogTrue () {
        this.$axios({
          type: 'post',
          url: '/active/appendCurrency',
          data: {act_id: this.act_id, currency_num: this.addDialogInput},
          fuc: (res) => {
            if (res.code == 200) {
              this.addDialog = false
              this.$message.success('操作成功')
              this.init()
            }
          }
        })
      },
      editDialogTrue () {
        this.$axios({
          type: 'post',
          url: '/active/updateActiveInfo',
          data: {act_id: this.act_id, act_end: this.editDialogData.act_end / 1000, proportion: this.editDialogData.proportion},
          fuc: (res) => {
            if (res.code == 200) {
              this.editDialog = false
              this.$message.success('操作成功')
              this.init()
            }
          }
        })
      },
      getAddListDialogTable () {
        this.$axios({
          type: 'post',
          url: '/active/logList',
          data: {act_id: this.act_id, paging: 1},
          fuc: (res) => {
            if (res.code == 200) {
              this.addListDialog = true
              this.addListDialogTable = res.data
            }
          }
        })
      },
      getEditDialogData () {
        this.editDialogData.act_end = this.form.act_end * 1000
        this.editDialogData.proportion = JSON.parse(JSON.stringify(this.form.proportion))
        this.editDialog = true
      },
      addProportion () {
        this.editDialogData.proportion.push({
          num1: '',
          num2: '',
          num3: ''
        })
      },
      deleteProportion (index) {
        this.editDialogData.proportion.splice(index, 1)
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
/*    width: 400px;*/
    margin: 20px;
  }
</style>