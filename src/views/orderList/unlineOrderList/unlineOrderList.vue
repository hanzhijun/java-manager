<template>
  <div class="unlineOrderList">
    <el-button @click="changeStatus('')" :type="statusConfirm === '' ? 'primary' : ''">全部订单</el-button>
    <el-button v-for="item in ginfo_except_statusArr" @click="changeStatus(item.value)" :type="statusConfirm === item.value ? 'primary' : ''" :key="item.value">{{item.label}}</el-button>

    <div class="searchForm">
      <p @click='showFormBool = !showFormBool'>筛选查询<i v-if='showFormBool' class="el-icon-arrow-down"></i><i v-else class="el-icon-arrow-up"></i></p>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" v-if='showFormBool'>
        <el-form-item label="输入搜索">
          <el-input v-model="formInline.key_a" placeholder="订单编号/商家名称"></el-input>
        </el-form-item>
        <el-form-item label="提交时间">
          <el-date-picker
            v-model="formInline.key_time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
    :data="tableData"
    style="width: 100%" :span-method="arraySpanMethod">
      <el-table-column
        label="待发货订单列表">
        <el-table-column
          prop="parentId"
          label="母订单编号"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="id"
          label="子订单编号"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="订单生成时间"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="buyerId"
          label="购买人id"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="goodsName"
          label="商品名称"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="goodsSpec"
          label="商品规格"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="goodsNo"
          label="货号"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="businessName"
          label="商家名称"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="quantity"
          label="商品数量"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="payPrice"
          label="支付方式"
          min-width="240" align='center'>
          <template slot-scope='scope'>
            <span v-for="(value, key) in JSON.parse(scope.row.payPrice)" :key="key"><span v-if="key == 'cash'">现金支付：{{value / 100}},</span><span v-else-if="key == 'gold'">金贝支付：{{value}},</span><span v-else-if="key == 'silver'">银贝支付：{{value}},</span></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="goodsPrice"
          label="订单金额"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-for="(value, key) in JSON.parse(scope.row.goodsPrice)" :key="key"><span v-if="key == 'cash'">现金支付：{{value / 100}},</span><span v-else-if="key == 'gold'">金贝支付：{{value}},</span><span v-else-if="key == 'silver'">银贝支付：{{value}},</span></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="订单状态"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-for="item in ginfo_except_statusArrAll" v-if='scope.row.status == item.value'>{{item.label}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          label="操作"
          min-width="120" align='center'>
          <template slot-scope="scope">
            <el-button @click="detail(scope.row)" type="primary" plain>查看</el-button>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-pagination
    layout="prev, pager, next"
    :total="total" :page-size="20" @current-change="handleCurrentChange"
      :current-page.sync="start">
  </el-pagination>

  </div>
</template>

<script>
  export default {
    name: 'adminGroupDetail',
    data () {
      return {
        tableData: [],
        formInline: {
          key_a: '',
          key_time: []
        },
        ginfo_except_statusArr: [
          {value: 0, label: '未确认'},
          {value: 1, label: '已确认'}
        ],
        ginfo_except_statusArrAll: [
          {value: 0, label: '待付款'},
          {value: 1, label: '已关闭'},
          {value: 2, label: '待发货(已支付)'},
          {value: 3, label: '已发货'},
          {value: 4, label: '已完成'},
          {value: 5, label: '申请退款'},
          {value: 6, label: '拒绝退款'},
          {value: 7, label: '等待退款'},
          {value: 8, label: '退款完成'}
        ],
        start: 1,
        total: 0,
        statusConfirm: '',
        showFormBool: true, // 是否显示过滤框
      }
    },
    created () {
      this.getTableData()
    },
    mounted () {},
    methods: {
      changeStatus (type) {
        this.statusConfirm = type
        this.start = 1
        this.getTableData()
      },
      getTableData () {
        this.$axios({
          type: 'post',
          url: '/bhs-management-admin/order/listWithParentId',
          data: {status: 2, statusConfirm: this.statusConfirm, pageNumber: this.start, pageSize: 20, ...this.formInline},
          fuc: (res) => {
            if (res.code != 1) {
              return
            }
            let _tableData = JSON.parse(JSON.stringify(res.data.data))
            let arr = []
            for (let val of _tableData) { // 订单
              let num = val.orderInfoResultVoList.length
              for (let val2 of val.orderInfoResultVoList) {
                arr.push({num, buyerId: val.buyerId, createTime: val.createTime, businessName: val.businessName, ...val2})
                num = 0
              }
//              
//              // 取总商品数量
//              
            }
            this.tableData = arr
//            this.tableData = res.data.data
            this.total = parseInt(res.data.count)
          }
        })
      },
      handleCurrentChange (val) {
        this.start = val
        this.getTableData()
      },
      detail (row) {
        this.$router.push({path: '/orderList/unlineOrderDetail',query: {parentId: row.parentId}})
      },
      onSubmit () {
        this.start = 1
        this.getTableData()
      },
      arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
        console.log(1, row)
        if (columnIndex == 0 || columnIndex == 2 || columnIndex == 3 || columnIndex == 7 || columnIndex == 12) {
          return {
            rowspan: row.num,
            colspan: 1
          }
        } else {
          return {
            rowspan: 1,
            colspan: 1
          }
        }
      }
    }
  }
</script>
<style scoped="true">
  .unlineOrderList{
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
