<template>
  <div class="indexRecommendedList">
    <div style="margin: 10px 0;">
      <el-button plain @click='addIndexRecommendedGoods'>添加商品</el-button>
      <el-button @click='downExcell'>下载模板</el-button>
      <el-button type="primary" @click="importDialogVisible = true">批量添加商品</el-button>
    </div>
    <el-table
    :data="tableData"
    style="width: 100%">
      <el-table-column
        label="推荐商品列表">
        <el-table-column
          prop="goods_activity_id"
          label="编号"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="create_at"
          label="创建时间"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span>{{$formatTime(scope.row.create_at)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="business_name"
          label="所属商家"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="area_name"
          label="所属区域"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="num"
          label="总库存"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="sort"
          label="排序"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="activity_goods_status"
          label="商品状态"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-if='scope.row.goods_status == -1'>冻结</span>
            <span v-else-if='scope.row.goods_status == 0'>审核中</span>
            <span v-else-if='scope.row.goods_status == 1'>上架</span>
            <span v-else-if='scope.row.goods_status == -2'>审核失败</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="显示状态"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-if='scope.row.activity_goods_status == 1'>显示</span>
            <span v-else>不显示</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="240" align='center'>
          <template slot-scope='scope'>
            <el-button @click="editGoods(scope.row.goods_activity_id)">编辑</el-button>
            <el-button @click='deleteGoods(scope.row.goods_activity_id)'>删除</el-button>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-pagination
    layout="prev, pager, next"
    :total="total" :page-size="20" @current-change="handleCurrentChange"
      :current-page.sync="start">
  </el-pagination>

    <el-dialog title="批量导入" :visible.sync="importDialogVisible" :show-close='false'>
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
  </div>
</template>

<script>
  export default {
    name: 'indexRecommendedList',
    data () {
      return {
        tableData: [],
        start: 1,
        total: 0,
        importDialogVisible: false,
        formInline: {
          server_search_status: 'all'
        },
        showFormBool: true, // 是否显示过滤框
      }
    },
    created () {
      this.getTableData()
    },
    mounted () {},
    methods: {
      getTableData () {
        this.$axios({
          type: 'post',
          url: '/goods/activitygoodsgetlist',
          data: {page: this.start, goods_activity_category_id: 2, filter_category_id: this.$route.query.goods_activity_category_id, ...this.formInline},
          fuc: (res) => {
            this.tableData = res.data.data
            this.total = res.data.total
          }
        })
      },
      changeStatus () {

      },
      addIndexRecommendedGoods () {
        this.$router.push({path: '/interConfig/indexMail/indexMailRecommendedDetail', query: {goods_activity_category_id: this.$route.query.goods_activity_category_id}})
      },
      handleCurrentChange (val) {
        this.start = val
        this.getTableData()
      },
      editGoods (goods_activity_id) {
        this.$router.push({path: '/interConfig/indexMail/indexMailRecommendedDetail', query: {goods_activity_id, goods_activity_category_id: this.$route.query.goods_activity_category_id}})
      },
      downExcell () {
        this.$downloadExcell({url: '/resource/activity_goods_load.xlsx'})
      },
      beforeAvatarUpload (file) {
        let formData = new FormData()
        formData.append('activity_goods_excel', file)
        formData.append('goods_activity_category_id', this.$route.query.goods_activity_category_id)
        this.$axios({
          type: 'post',
          url: '/goods/activitygoodsload',
          data: formData,
          fuc: (res) => {
            console.log(res)
            if (res.code == 200) {
              this.importDialogVisible = false
              this.getTableData()
            }
          }
        }, 1)
        return false
      },
      deleteGoods (goods_activity_id) {
        this.$axios({
          type: 'post',
          url: '/goods/activitygoodsdelete',
          data: {goods_activity_id},
          fuc: (res) => {
            if (res.code == 200) {
              this.$message.success('操作成功')
              this.getTableData()
            }
          }
        })
      }
    }
  }
</script>
<style scoped="true">
  .indexRecommendedList{
    margin: 10px 20px 0;
    overflow: hidden;
  }
</style>
