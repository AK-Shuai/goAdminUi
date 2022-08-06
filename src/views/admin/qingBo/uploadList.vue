<template>
  <div class="uploadBox">
    <!-- 上传文件按钮 -->
    <div class="buttonBox">
      <el-upload
        action
        accept=".xlsx,.xls"
        :show-file-list="false"
        :on-change="handleChange"
        :auto-upload="false"
      >
        <el-button slot="trigger" type="primary">选取Excel文件</el-button>
        <el-button type="success" :disabled="disabled" @click="submit">提交到服务器</el-button>
      </el-upload>
    </div>

    <!-- 解析出来的数据 -->
    <div v-show="show" class="tableBox">
      <h3>
        <i class="el-icon-info">请您检查无误后，再点击“提交到服务器”按钮</i>
      </h3>
      <el-table :data="tempData" border style="width: 100%" :height="height">
        <el-table-column prop="Date" label="日期" />
        <el-table-column prop="ServiceTime" label="服务时间" />
        <el-table-column prop="ServiceContent" label="服务内容" />
        <el-table-column prop="ServiceQuality" label="服务性质" />
        <el-table-column prop="Money" label="金额" />
        <el-table-column prop="Address" label="地址" />
        <el-table-column prop="Remark" label="备注" />
        <el-table-column prop="CompanyType" label="是否公司" />
        <el-table-column prop="CompanyNameType" label="公司名" />
        <el-table-column prop="Name" label="联系人姓名" />
        <el-table-column prop="Telephone" label="联系人电话" />
      </el-table>
    </div>
  </div>
</template>

<script>
import xlsx from 'xlsx'
import { Loading } from 'element-ui'
import { uploadExcel } from '@/api/admin/qingBo'

export default {
  name: 'UploadList',
  data() {
    return {
      height: document.documentElement.clientHeight - 130,
      tempData: [],
      show: false,
      disabled: false,
      character: {
        Date: {
          text: '日期',
          type: 'string'
        },
        ServiceTime: {
          text: '服务时间',
          type: 'string'
        },
        ServiceContent: {
          text: '服务内容',
          type: 'string'
        },
        ServiceQuality: {
          text: '服务性质',
          type: 'string'
        },
        Money: {
          text: '金额',
          type: 'int'
        },
        Address: {
          text: '地址',
          type: 'string'
        },
        Remark: {
          text: '备注',
          type: 'string'
        },
        CompanyType: {
          text: '是否公司',
          type: 'string'
        },
        CompanyNameType: {
          text: '公司名',
          type: 'string'
        },
        Name: {
          text: '联系人姓名',
          type: 'string'
        },
        Telephone: {
          text: '联系人电话',
          type: 'string'
        }
      }
    }
  },
  methods: {
    // 采集excel数据
    async handleChange(file) {
      const originData = file.raw
      if (!originData) return
      this.show = false
      const loadingInstance = Loading.service({
        text: '努力加载中!!!',
        background: 'rgba(0, 0, 0, 0.8)'
      })
      const binaryData = await this.readFile(originData)
      const workbook = xlsx.read(binaryData, { type: 'binary' })
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const data = xlsx.utils.sheet_to_json(worksheet)
      this.tempData = this.handleData(data)
      await this.delay(300)
      this.show = true
      loadingInstance.close()
    },
    // 把读取出来的数据转换为服务器需要的格式
    handleData(data) {
      const arr = []
      const char = this.character
      data.forEach(item => {
        const obj = {}
        for (const key in char) {
          if (Object.hasOwnProperty.call(char, key)) {
            const el = char[key]
            let val = item[el.text] || ''
            const type = el.type
            type === 'string' ? (val = String(val)) : null
            type === 'number' ? (val = Number(val)) : null
            obj[key] = val
          }
        }
        arr.push(obj)
      })
      return arr
    },
    // 提交数据给服务器
    async submit() {
      if (this.tempData.length <= 0) {
        this.$message({
          message: '请先选择Excel文件',
          type: 'warning',
          showClose: true
        })
        return
      }
      this.disabled = true
      const loadingInstance = Loading.service({
        text: '努力加载中!!!',
        background: 'rgba(0, 0, 0, 0.8)'
      })
      await this.delay(300)
      // 发送API请求
      uploadExcel({ datas: this.tempData }).then(() => {
        this.$message({
          message: 'Excel文件已上传完毕',
          type: 'success',
          showClose: true
        })
        this.show = false
        this.disabled = false
        loadingInstance.close()
      })
    },
    readFile(file) {
      return new Promise(resolve => {
        const reader = new FileReader()
        reader.readAsBinaryString(file)
        reader.onload = e => {
          resolve(e.target.result)
        }
      })
    },
    delay(interval = 0) {
      return new Promise(resolve => {
        const timer = setTimeout(_ => {
          clearTimeout(timer)
          resolve()
        }, interval)
      })
    }
  }
}
</script>

<style scoped>
.buttonBox {
  padding: 15px;
  display: flex;
}
.el-button {
  margin-right: 20px !important;
}
.tableBox {
  padding: 0 15px;
}
h3 {
  font-size: 18px;
  color: #f56c6c;
  padding-bottom: 15px;
}
</style>
