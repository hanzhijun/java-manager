<template>
  <div class="tombacDetail">
    <el-button style='margin-bottom: 10px;' type="primary" @click="importDialogVisible = true">分享购买配置-批量上传商品</el-button>
    <el-button style='margin-bottom: 10px;' type="primary" @click="changeStatusDialog = true">分享购买配置-商品分类配置</el-button>
    <el-form ref="form" :model="form" label-width="200px" :rules='rules'>
      <el-form-item>
        <h3>每日用户可发起次数</h3>
      </el-form-item>
      <el-form-item label="发起者最多发起次数" prop='share_times'>
        <el-input v-model="form.share_times" placeholder='请输入' :maxlength='20' :disabled='editBool'></el-input>
      </el-form-item>
      <el-form-item>
        <h3>每日用户最多参与次数</h3>
      </el-form-item>
      <el-form-item label="参与者最多参与次数" prop='join_times'>
        <el-input v-model="form.join_times" placeholder='请输入' :maxlength='20' :disabled='editBool'></el-input>
      </el-form-item>
      <el-form-item>
        <h3>活动持续时间</h3>
      </el-form-item>
      <el-form-item label="分钟数" prop='end_time'>
        <el-input v-model="form.end_time" placeholder='请输入' :maxlength='20' :disabled='editBool'></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click='editBool = false' v-if='editBool'>编辑</el-button>
        <el-button @click='saveTombac' v-if='!editBool'>保存</el-button>
        <el-button @click='cancleEdit' v-if='!editBool'>取消</el-button>
      </el-form-item>
    </el-form>

    <el-dialog title="批量导入" :visible.sync="importDialogVisible" :show-close='false'>
      <el-select style='margin-bottom: 6px;' v-model='uploadFilter_category_id' placeholder="请选择">
        <el-option
          label="支持分享购买"
          :value="2">
        </el-option>
        <el-option
          label="不支持分享购买"
          :value="0">
        </el-option>
        <el-option
          label="仅支持分享购买"
          :value="1">
        </el-option>
      </el-select>
      <el-upload
        class="upload-demo"
        action="https://jsonplaceholder.typicode.com/posts/" :before-upload="beforeAvatarUpload">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传模板excel文件</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="importDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="changeStatusDialog" :visible.sync="changeStatusDialog" :show-close='false'>
      <el-tree
        :data="categoryArr"
        node-key="id"
        :expand-on-click-node="false">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span v-if='data.level == 2 && data.is_activity === 2' style='color: red;'>（支持）</span>
          <span v-else-if='data.level == 2 && data.is_activity === 0' style='color: red;'>（不支持）</span>
          <span v-else-if='data.level == 2 && data.is_activity === 1' style='color: red;'>（仅支持）</span>
          <span>
            <el-radio-group v-model="data.is_activity" v-if='data.editBool' @change='radioChange(data)'>
              <el-radio :label="2">支持</el-radio>
              <el-radio :label="0">不支持</el-radio>
              <el-radio :label="1">仅支持分享购买</el-radio>
            </el-radio-group>
            <el-button
              type="text"
              size="mini"
              @click="() => changeStatus(node, data)" v-else>
              修改
            </el-button>
          </span>
        </span>
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changeStatusSure">确定修改</el-button>
        <el-button @click="changeStatusDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        form: {
          share_times: '',
          join_times: '',
          end_time: ''
        },
        categoryArr: [],
        importDialogVisible: false,
        changeStatusDialog: false,
        uploadFilter_category_id: 0,
        rules: {
          share_times: [{ required: true, message: '请输入', trigger: 'blur' }],
          join_times: [{ required: true, message: '请输入', trigger: 'blur' }],
          end_time: [{ required: true, message: '请输入', trigger: 'blur' }]
        },
        editBool: true
      }
    },
    created () {
      this.$axios({
        type: 'post',
        url: '/goods/category/getinfo',
        data: {},
        fuc: (res) => {
          let arr = []
          for (let val of res.data) {
            let obj = {}
            obj.label = val.c_name
            obj.value = val.cid
            obj.level = val.level
            obj.editBool = false
            obj.is_activity = ''
            if (val.data && val.data.length > 0) {
              obj.children = []
              for (let val2 of val.data) {
                obj.children.push({
                  label: val2.s_c_name,
                  value: val2.s_cid,
                  level: val2.s_level,
                  is_activity: '',
                  editBool: false
                })
              }
            }
            arr.push(obj)
          }
          this.categoryArr = arr
        }
      })
      this.init()
    },
    methods: {
      init () {
        this.$axios({
          type: 'post',
          url: '/System/getsharetime',
          data: {},
          fuc: (res) => {
            console.log(res)
            if (res.data.length < 1) {
//              let arr = []
//              for (let val in this.form) {
//                arr.push({name: val, value: this.form[val]})
//              }
//              this.$axios({
//                type: 'post',
//                url: '/currency/copperRuleCreate',
//                data: {copper_rule: JSON.stringify(arr)},
//                fuc: (result) => {
//                  console.log('result', result)
//                }
//              })
            } else {
              for (let val of res.data) {
                this.form[val.name] = val.value
              }
            }
          }
        })
      },
      beforeAvatarUpload (file) {
//        let _this = this
        if (this.uploadFilter_category_id === '') {
          this.$message.warning('请先选择分类')
          return false
        }
        let formData = new FormData()
        formData.append('excel', file)
        formData.append('is_activity', this.uploadFilter_category_id)
        this.$axios({
          type: 'post',
          url: '/goods/changeshare',
          data: formData,
          fuc: (res) => {
            if (res.code == 200) {
              this.importDialogVisible = false
              this.uploadFilter_category_id = ''
            }
          }
        }, 1)
        return false
      },
      saveTombac () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$axios({
              type: 'post',
              url: '/System/setsharetime',
              data: this.form,
              fuc: (result) => {
                console.log('result', result)
                if (result.code == 200) {
                  this.$message.success('编辑成功')
                  this.changeStatusDialog = true
                }
              }
            })
          }
        })
      },
      cancleEdit () {
        this.init()
        this.editBool = true
      },
      changeStatus (node, data) {
        console.log(node, data)
//        if (data.level == 1) {
//          for (let val of data.children) {
//            val.editBool = true
//          }
//        }
        data.editBool = true
        console.log(this.categoryArr)
      },
      radioChange (data) {
        console.log(data)
        data.editBool = false
        if (data.level == 1) {
          for (let val of data.children) {
            val.is_activity = data.is_activity
          }
        }
      },
      changeStatusSure () {
        let obj = {}
        for (let val of this.categoryArr) {
          for (let val2 of val.children) {
            if (val2.is_activity !== '') {
              obj[val2.value] = val2.is_activity
            }
          }
        }
        this.$axios({
          type: 'post',
          url: '/goods/changesharecategory',
          data: {change_data: obj},
          fuc: (result) => {
            console.log('result', result)
            if (result.code == 200) {
              this.$message.success('编辑成功')
              this.changeStatusDialog = false
            }
          }
        })
      }
    }
  }
</script>
<style scoped="true">
  .tombacDetail{
    margin: 10px 20px 0;
    overflow: hidden;
  }
  .tombacDetail form{
    margin: 20px;
  }
  .tombacDetail form .el-input{
    width: 100px;
  }
  .tombacDetail form pre{
    width: 100%;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
</style>
