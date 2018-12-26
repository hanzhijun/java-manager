<template>
  <div class="goodsClassifyList">
    <el-button type='primary' @click='addClassify' style="margin: 10px;">添加助力购活动</el-button>
    
    <el-table
    :data="tableData"
    style="width: 100%">
      <el-table-column
        label="助力购列表">
        <el-table-column
          prop="name"
          label="活动名称"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="allGoldCount"
          label="活动总金贝数"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="nowGoldCount"
          label="剩余金贝数"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="number"
          label="未领取金贝数"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="status"
          label="生效状态"
          min-width="120" align='center'>
          <template slot-scope="scope">
            <span v-if="scope.row.status == -1">未开启</span>
            <span v-if="scope.row.status == 1">已开启</span>
            <span v-if="scope.row.status == 0">过期</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="note"
          label="备注"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="id"
          label=""
          width="200" align='center'>
          <template slot-scope='scope'>
            <el-dropdown>
              <el-button type="primary">
                操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  
                  <el-button @click='editSecondClassify(scope.row.id)'>活动规则管理</el-button>
<!--                  活动规则管理-->
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button @click='editSecondClassify(scope.row.id)'>活动金贝管理</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button @click='goGoodsList(scope.row.id)'>商品管理</el-button></el-dropdown-item>
                <el-dropdown-item>
                  <el-button @click='editNote(scope.row)'>编辑备注</el-button>
                </el-dropdown-item>
                <el-dropdown-item v-if="scope.row.status == -1">
                  <el-button @click='switchChange(scope.row.id, scope.row.status)'>开启</el-button>
                </el-dropdown-item>
                <el-dropdown-item v-if="scope.row.status == 1">
                  <el-button @click='switchChange(scope.row.id, scope.row.status)'>关闭</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-pagination
    layout="prev, pager, next"
    :total="total" :page-size="20" @current-change="handleCurrentChange"
      :current-page.sync="start">
  </el-pagination>
    <el-dialog title="修改备注" :visible.sync="changeNoteDialog">
      <el-input v-model="changeNote.note" type="textarea" placeholder="备注"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogTrue">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'goodsClassifyList',
    data () {
      return {
        tableData: [],
        formInline: {
          name: ''
        },
        start: 1,
        total: 0,
        changeNote: {
          aid: '',
          note: ''
        },
        changeNoteDialog: false,
        showFormBool: true, // 是否显示过滤框
      }
    },
    created () {
      this.getTableData()
    },
    mounted () {},
    methods: {
      editNote (row) {
        this.changeNote.aid = row.id
        this.changeNote.note = row.note
        this.changeNoteDialog = true
      },
      addDialogTrue () {
        this.$axios({
          type: 'post',
          url: '/bhs-management-admin/active/helpbuy/updateActivityNote',
          data: this.changeNote,
          fuc: (res) => {
            if (res.code == 1) {
              this.$message.success('操作成功')
              this.changeNoteDialog = false
              this.getTableData()
            }
          }
        })
      },
      getTableData () {
        this.$axios({
          type: 'get',
          url: '/bhs-management-admin/active/helpbuy/helpList',
          data: {pageNumber: this.start, pageSize: 20},
          fuc: (res) => {
            if (res.code == 1) {
              this.tableData = res.data.data
              this.total = parseInt(res.data.count)
            }
          }
        })
      },
      handleCurrentChange (val) {
        this.start = val 
        this.getTableData()
      },
      editSecondClassify (id) {
        this.$router.push({path: '/activeCenter/helpBuyDetail', query: {id}})
      },
      addClassify () {
        this.$router.push({path: '/activeCenter/helpBuyDetail'})
      },
      goGoodsList (id) {
        this.$router.push({path: '/activeCenter/helpBuyGoodsList', query: {id}})
      },
      switchChange (id, status) {
        this.$axios({
            type: 'put',
            url: status == 1 ? '/bhs-management-admin/active/helpbuy/closeHelpbuy?aid=' + id : "/bhs-management-admin/active/helpbuy/openHelpbuy?aid=" + id,
            data: {},
            fuc: (res) => {
              if (res.code == 1) {
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
  .goodsClassifyList{
    margin: 10px 20px 0;
    overflow: hidden;
  }
  .searchForm{
    margin: 10px 0;
  }
  .searchForm>p{
    width: 100%;
    background-color: #f5f7fa;
    padding: 10px;
    color: #909399;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
  }
  .searchForm>p>i{
    margin-left: 20px;
  }
</style>