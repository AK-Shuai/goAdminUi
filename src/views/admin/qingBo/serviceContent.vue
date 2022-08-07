<template>
  <div>
    <template>
      <el-row>
        <el-button type="primary" icon="el-icon-edit" size="mini" style="float:right" @click="setServiceContent()">新增</el-button>
      </el-row>
      <el-table
        :data="tableData"
        border
        style="width: 60%"
      >
        <el-table-column
          prop="id"
          label="编号"
        />
        <el-table-column
          prop="ServiceContent"
          label="服务性质"
        />
        <el-table-column
          label="整改"
        >
          <template slot-scope="scope">
            <el-button type="text" @click="deleteServiceContent(scope.row)">删除</el-button>
          </template>
        </el-table-column>
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
          <el-form-item label="服务性质">
            <el-input v-model="from.ServiceContent" placeholder="服务性质" style="width:500px;" />
            <el-button type="primary" size="mini" style="float:right" @click="YsetServiceContent(from)">确认</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </template>
  </div>
</template>

<script>
import { qingBoServiceContent, addqingBoServiceContent, deleteServiceContent } from '@/api/admin/qingBo'

export default {
  name: 'ServiceContent',
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
      qingBoServiceContent(this.queryParams).then(response => {
        if (response.code === 200) {
          this.tableData = response.data.list
          this.total = response.data.count
          this.success(response.msg)
          return
        }

        if (response.code === 500) {
          this.error(response.msg)
          return
        }
      })
    },
    setServiceContent() {
      // 打开新增
      this.getmessage = true
    },
    YsetServiceContent() {
      // 提交新增表单，关闭新增
      this.getmessage = false
      addqingBoServiceContent(this.from).then(response => {
        if (response.code === 200) {
          this.success(response.msg)
          this.getList()
          return
        }
        if (response.code === 500) {
          this.error(response.msg)
          return
        }
      })
    },
    handleCurrentChange() {
      // 翻页刷新页面
      qingBoServiceContent(this.queryParams).then(response => {
        this.tableData = response.data.list
        this.total = response.data.count
      })
    },
    deleteServiceContent(row) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteServiceContent({ id: row.id }).then(response => {
          if (response.code === 200) {
            this.$message({ type: 'success', message: '删除成功!' })
            this.getList()
            return
          }
          if (response.code === 500) {
            this.error(response.msg)
            return
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    error(msg) {
      this.$message.error(msg)
    },
    success(msg) {
      this.$message({
        message: msg,
        type: 'success'
      })
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
