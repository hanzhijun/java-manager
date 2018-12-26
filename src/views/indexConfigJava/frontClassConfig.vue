<template>
  <div class="goodsBrandsDetail">
        <div v-for='item in categoryArr' :key="item.id">
          <div>
            <el-checkbox :indeterminate="item.isIndeterminateCategory" v-model="item.checkAllCategory" @change="handleCheckAllChangeCategory(item)">{{item.name}}</el-checkbox>
          </div>
          <div style="margin-left: 15px">
            <el-checkbox-group v-model="item.value" @change="handleCheckedCitiesChangeCategory(item)">
              <el-checkbox v-for="val in item.children" :label="val.id" :key="val.id">{{val.name}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
    <el-button style="margin: 10px" @click="onSubmit">保存</el-button>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        categoryList: [],
        categoryArr: [],
        relationCategory: [],
        pid: ''
      }
    },
    created () {
      this.$axios({
        type: 'post',
        url: '/bhs-management-admin/category/treeList',
        data: {onoffFlag: 1},
        fuc: (res) => {
          if (res.code != 1) return
          this.categoryList = res.data

          // 实验
          for (let i of this.categoryList) {
            this.categoryArr.push({name: i.name, id: i.id, children: i.childrenList, value: [], isIndeterminateCategory: true, checkAllCategory: false})
          }
          console.log(1, this.categoryArr)
          this.$axios({
            type: 'get',
            url: '/bhs-management-admin/showpageCategory/' + this.$route.query.id,
            data: {},
            fuc: (res) => {
              if (res.code != 1) return 
              this.pid = res.data.pid
              if (res.data.relationCategory && res.data.relationCategory.split(',') instanceof Array) {
                this.relationCategory = res.data.relationCategory.split(',')
                console.log(11, this.relationCategory)
                for (let val of this.categoryArr) {
                  console.log(1, val)
                  for (let val2 of val.children) {
                    console.log(2, val2)
                    for (let val3 of this.relationCategory) {
                      console.log(3, val3)
                      if (val2.id == val3) {
                        val.value.push(val3)
                      }
                    }
                  }
//                  for (let val2 of this.relationCategory) {
//                    if (val.id == val2.firstCategory) {
//                      val.value.push(val2.secondCategory)
//                    }
//                  }
                }
                console.log(2, this.relationCategory)
              }
//                console.log(3, this.relationCategory, JSON.parse(res.data.relationCategory))
              
            }
          })
          
        }
      })
    },
    methods: {
      handleCheckAllChangeCategory (item) {
        for (let val of this.categoryArr) {
          if (val.id == item.id) {
            val.isIndeterminateCategory = false
            if (item.value.length < item.children.length) {
              val.value = []
              for (let key of val.children) {
                val.value.push(key.id)
              }
            } else {
              val.value = []
            }
          }
        }
      },
      handleCheckedCitiesChangeCategory(item) {
        let checkedCount = item.value.length
        item.checkAllCategory = checkedCount === item.children.length
        item.isIndeterminateCategory = checkedCount > 0 && checkedCount < item.children.length
      },
      onSubmit () {
        console.log(this.categoryArr)
        this.relationCategory = []
        for (let val of this.categoryArr) {
          for (let value of val.value) {
            this.relationCategory.push(value)
          }
        }
//        this.relationCategory.join(',')
        this.$axios({
          type: 'put',
          url: '/bhs-management-admin/showpageCategory',
          data: {id: this.$route.query.id, relationCategory: this.relationCategory.join(',')},
          fuc: (res) => {
            if (res.code == 1) {
              this.$message.success("操作成功")
              this.$router.push({path: '/indexConfigJava/frontClassSecList', query: {pid: this.pid}})
            }
          }
        })
      }
    }
  }
</script>
    
<style scoped="true">
  .goodsBrandsDetail{
    margin: 10px 20px 0;
    overflow: hidden;
  }
  .goodsBrandsDetail>.el-form{
    width: 400px;
    margin: 20px;
  }
</style>