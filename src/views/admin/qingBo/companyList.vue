<template>
  <div>
    <template>
      <el-row>
        <el-button type="primary" icon="el-icon-edit" size="mini" style="float:right" @click="setCompanyName()">新增</el-button>
      </el-row>
      <el-table
        :data="tableData"
        border
        style="width: 60%"
      >
        <el-table-column
          prop="id"
          label="公司编号"
        />
        <el-table-column
          prop="CompanyName"
          label="公司名"
        />
      </el-table>
      <div class="paginationClass">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :page-size="queryParams.pageSize"
          :current-page.sync="queryParams.pageIndex"
          @current-change="handleCurrentChange"
        />
      </div>
      <el-dialog :visible.sync="getmessage">
        <el-form ref="from" :model="from" label-width="100px">
          <el-form-item label="公司名">
            <el-input v-model="from.CompanyName" placeholder="公司名" style="width:500px;" />
            <el-button type="primary" size="mini" style="float:right" @click="YsetCompanyName(from)">确认</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </template>
  </div>
</template>

<script>
import { qingBoCompanylist, addqingBoCompanyName } from '@/api/admin/qingBo'

export default {
  name: 'CompanyList',
  data() {
    return {
      tableData: [],
      from: {},
      getmessage: false,
      total: 0,
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        CompanyName: '',
        createdAtOrder: 'asc'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      // 获取任务列表
      qingBoCompanylist(this.queryParams).then(response => {
        this.tableData = response.data.list
        this.total = response.data.count
      })
    },
    setCompanyName() {
      // 打开新增
      this.getmessage = true
    },
    YsetCompanyName() {
      // 提交新增表单，关闭新增
      this.getmessage = false
      addqingBoCompanyName(this.from).then(response => {
        if (response.code === 500) {
          this.error(response.msg)
        }
      })
    },
    handleCurrentChange() {
      // 翻页刷新页面
      qingBoCompanylist(this.queryParams).then(response => {
        this.tableData = response.data.list
        this.total = response.data.count
      })
    },
    error(msg) {
      this.$message.error(msg)
    }
  }
}
</script>

<style scoped>

.paginationClass {
  position: fixed;
  bottom: 0;
  height: 40px;
  width: 100%;
  text-align: center;
}
</style>
