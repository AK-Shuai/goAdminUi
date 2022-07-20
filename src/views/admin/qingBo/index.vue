<template>
  <div>
    <template>
      <el-row>
        <el-date-picker
          v-model="queryParams.startDate"
          type="date"
          placeholder="起始时间"
          value-format="yyyyMMdd"
        />
        <el-date-picker
          v-model="queryParams.endDate"
          align="right"
          type="date"
          placeholder="结束时间"
          :picker-options="pickerOptions"
          value-format="yyyyMMdd"
        />
        <el-select v-model="queryParams.CompanyNameType" placeholder="请选择公司名" clearable filterable>
          <el-option v-for="(item,index) in input" :key="index" :label="item.CompanyName" :value="item.id" />
        </el-select>
        <el-select v-model="queryParams.CompanyType" placeholder="请选择服务场景">
          <el-option v-for="(item,index) in quality_name_list" :key="index" :label="item.label" :value="item.value" />
        </el-select>
        <el-button type="primary" size="mini" @click="isEmpty">清空</el-button>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="getList()" />
        <el-button type="primary" icon="el-icon-edit" size="mini" style="float:right" @click="setPeopleList()">新增个人</el-button>
        <el-button type="primary" icon="el-icon-edit" size="mini" style="float:right" @click="setCompanyList()">新增公司</el-button>
      </el-row>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="Date"
          label="日期"
        />
        <el-table-column
          prop="Address"
          label="地址"
        />
        <el-table-column
          prop="ServiceTime"
          label="服务时间"
        />
        <el-table-column
          prop="ServiceContent"
          label="服务内容"
        >
          <template slot-scope="scope">
            <p v-if="scope.row.ServiceContent==0">
              未配置
            </p>
            <p v-else-if="scope.row.ServiceContent==1">
              除虫
            </p>
            <p v-else-if="scope.row.ServiceContent==2">
              除鼠
            </p>
          </template>
        </el-table-column>
        <el-table-column
          prop="ServiceQuality"
          label="服务性质"
        >
          <template slot-scope="scope">
            <p v-if="scope.row.ServiceQuality==0">
              未配置
            </p>
            <p v-else-if="scope.row.ServiceQuality==1">
              首次
            </p>
            <p v-else-if="scope.row.ServiceQuality==2">
              售后
            </p>
          </template>
        </el-table-column>
        <el-table-column
          prop="Money"
          label="金额"
        />
        <el-table-column
          prop="Name"
          label="联系人姓名"
        />
        <el-table-column
          prop="Telephone"
          label="联系人电话"
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
    </template>
    <el-dialog :visible.sync="getPeopleMessage">
      <el-form ref="from" :model="from" :rules="rules" label-width="100px">
        <el-form-item label="日期">
          <el-date-picker v-model="from.Date" type="date" placeholder="选择日期" value-format="yyyyMMdd" />
        </el-form-item>
        <el-form-item label="服务时间">
          <el-time-select
            v-model="from.ServiceTime"
            :picker-options="{ start: '00:00', step: '00:15', end: '23:30' }"
            placeholder="选择时间"
          />
        </el-form-item>
        <el-form-item label="服务内容">
          <el-select v-model="from.ServiceContent" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="服务性质">
          <el-select v-model="from.ServiceQuality" placeholder="请选择">
            <el-option v-for="item in service_content" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="金额">
          <el-input v-model="from.Money" placeholder="金额" />
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="from.Address" placeholder="地址" />
        </el-form-item>
        <el-form-item label="联系人姓名">
          <el-input v-model="from.Name" placeholder="联系人姓名" />
        </el-form-item>
        <el-form-item label="联系人电话" prop="Telephone">
          <el-input v-model="from.Telephone" placeholder="联系人电话" />
        </el-form-item>
        <el-button type="primary" size="mini" style="float:right" @click="YsetPeopleList(from)">确认</el-button>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="getCompanyMessage">
      <el-form ref="from" :model="fromCompany" label-width="100px">
        <el-form-item label="日期">
          <el-date-picker v-model="fromCompany.Dates" type="dates" placeholder="选择一个或多个日期" value-format="yyyyMMdd" />
        </el-form-item>
        <el-form-item label="公司名">
          <el-select v-model="fromCompany.CompanyNameType" placeholder="请选择公司名" clearable filterable>
            <el-option v-for="(item,index) in input" :key="index" :label="item.CompanyName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="服务时间">
          <el-time-select
            v-model="fromCompany.ServiceTime"
            clearable
            filterable
            :picker-options="{ start: '00:00', step: '00:15', end: '23:30' }"
            placeholder="选择时间"
          />
        </el-form-item>
        <el-form-item label="服务内容">
          <el-select v-model="fromCompany.ServiceContent" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="服务性质">
          <el-select v-model="fromCompany.ServiceQuality" placeholder="请选择">
            <el-option v-for="item in service_content" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="金额">
          <el-input v-model="fromCompany.Money" placeholder="金额" />
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="fromCompany.Address" placeholder="地址" />
        </el-form-item>
        <el-form-item label="联系人姓名">
          <el-input v-model="fromCompany.Name" placeholder="联系人姓名" />
        </el-form-item>
        <el-form-item label="联系人电话">
          <el-input v-model="fromCompany.Telephone" placeholder="联系人电话" />
        </el-form-item>
        <el-button type="primary" size="mini" style="float:right" @click="YsetCompanyList(fromCompany)">确认</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { qingBoPlanlist, addqingBoPlanlist, qingBoCompanylist, addqingBoPlanInsertlist } from '@/api/admin/qingBo'

export default {
  name: 'QingBoList',
  data() {
    return {
      tableData: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      input: [],
      total: 0,
      from: {},
      fromCompany: {},
      getPeopleMessage: false,
      getCompanyMessage: false,
      quality_name_list: [
        {
          value: 1,
          label: '公司'
        }, {
          value: 2,
          label: '个人'
        }
      ],
      options: [
        {
          value: 1,
          label: '除虫'
        }, {
          value: 2,
          label: '除鼠'
        }
      ],
      service_content: [
        {
          value: 1,
          label: '首次'
        }, {
          value: 2,
          label: '售后'
        }
      ],
      // 列表查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        CompanyNameType: '',
        startDate: '',
        endDate: '',
        CompanyType: '',
        createdAtOrder: 'desc'
      },
      // 查询全部公司名参数
      queryParamsAll: {
        isAll: true
      },
      // 个人表单验证
      rules: {
        Telephone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '长度需要11位', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      // 获取全部公司列表
      qingBoCompanylist(this.queryParamsAll).then(response => {
        this.input = response.data.list
      })
      // 获取任务列表
      qingBoPlanlist(this.addDateRange(this.queryParams)).then(response => {
        this.tableData = response.data.list
        this.total = response.data.count
      })
    },
    isEmpty() {
      // 清空选择栏
      this.queryParams.CompanyNameType = ''
      this.queryParams.CompanyType = ''
      this.queryParams.startDate = ''
      this.queryParams.endDate = ''
    },
    setPeopleList() {
      // 打开个人新增
      this.getPeopleMessage = true
    },
    setCompanyList() {
      // 打开公司新增
      this.getCompanyMessage = true
    },
    YsetPeopleList() {
      // 提交个人表单
      this.from.Money = parseInt(this.from.Money)
      this.from.CompanyType = 1
      this.getPeopleMessage = false
      addqingBoPlanlist(this.from)
      this.from = {}
    },
    YsetCompanyList() {
      // 提交公司表单
      this.fromCompany.Money = parseInt(this.from.Money)
      this.fromCompany.CompanyType = 2
      this.getCompanyMessage = false
      addqingBoPlanInsertlist(this.fromCompany)
      this.fromCompany = {}
    },
    getCompanyNameList() {
      // 获取全部公司type
      qingBoCompanylist({}).then(response => {
        this.input = response.data.list
      })
    },
    handleCurrentChange() {
      // 翻页操作
      qingBoPlanlist(this.addDateRange(this.queryParams)).then(response => {
        this.tableData = response.data.list
        this.total = response.data.count
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
