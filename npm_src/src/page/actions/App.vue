<template>
  <div class="actions">
    <NavMenu></NavMenu>
    <div style="margin-top: 15px;">

      <el-select v-model="type" placeholder="请选择" style="width: 200px">
        <el-option v-for="type in types" :label="type.label" :value="type.value" :key="type.value"></el-option>
      </el-select>

      <el-select v-model="actionType" placeholder="请选择" style="width: 200px">
        <el-option v-for="actionType in actionTypes" :label="actionType.label" :value="actionType.value" :key="actionType.value"></el-option>
      </el-select>

      <el-input placeholder="请输入内容" v-model="searchInput" v-if="type === 1 || type === 2" style="width: 480px;"></el-input>
      <el-date-picker v-model="searchTimeRange"
        type="datetimerange"
        :picker-options="pickerOptions"
        placeholder="选择时间范围"
        align="right" style="width: 550px;" v-else>
      </el-date-picker>

      <el-button icon="search" @click="search"></el-button>
      <el-button style="float: right;" @click="$export">导出</el-button>
    </div>
    <el-table :data="list" border style="margin-top: 10px;" :fit="true">
      <el-table-column label="用户">
        <template scope="scope">
          <span>{{ scope.row.name || '' }}<br>{{ (scope.row.username || '') | bracketFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column label="书名">
        <template scope="scope">
          <span>{{ scope.row.bookObj | format('title') }}<br>{{ scope.row.bookObj | format('sourceUuid') | bracketFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="detail" label="操作详情"></el-table-column>
      <el-table-column prop="ip" label="ip" width="200"></el-table-column>
      <el-table-column label="操作时间">
        <template scope="scope">
          <el-icon name="time"></el-icon>
          <span style="margin-left: 10px">{{ format(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @current-change="onPageChange" layout="prev, pager, next" :current-page="pageIndex" :page-count="pageCount">
    </el-pagination>
  </div>
</template>

<script type="text/javascript">
import NavMenu from '@/common/components/NavMenu'
import urlutil from '@/common/util'

var config = window.PAGE_CONFIG
var data = config.data

var parameters = JSON.parse(config.parameters)
var list = data.list

var pageIndex = data.pageIndex
var pageCount = data.pageCount
var searchTimeRange = []

var actionType = parseFloat(parameters.actionType || 0)

var type = 1
if (parameters.uuid) {
  type = 2
} else if (parameters.startTime) {
  type = 3
  searchTimeRange = [new Date(parseFloat(parameters.startTime)), new Date(parseFloat(parameters.endTime))]
}

export default {
  data () {
    return {
      list: list,
      pageIndex: pageIndex,
      pageCount: pageCount,
      type: type,
      searchInput: parameters.username || parameters.uuid || '',
      types: [{
        label: 'corp邮箱前缀',
        value: 1
      }, {
        label: 'UUID',
        value: 2
      }, {
        label: '时间',
        value: 3
      }],
      actionType: actionType,
      actionTypes: [{
        label: '不限',
        value: 0
      }, {
        label: '新建书籍',
        value: 10
      }, {
        label: '阅读审核通过',
        value: 32
      }, {
        label: '阅读审核拒绝',
        value: 33
      }, {
        label: '蜗牛审核通过',
        value: 34
      }, {
        label: '蜗牛审核拒绝',
        value: 35
      }, {
        label: '完成精编',
        value: 62
      }],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      searchTimeRange: searchTimeRange
    }
  },
  methods: {
    format (value) {
      return new Date(value).toLocaleString()
    },
    onPageChange (page) {
      var url = urlutil.url
      var query = url.getQuery(location.href)
      query.pageIndex = page
      location.href = url.genUrl({
        query
      })
    },
    search: function () {
      var actionType = this.actionType || ''
      var query = {
        'actionType': actionType
      }

      var searchInput = this.searchInput.trim()
      switch (this.type) {
        case 1:
          query.username = `${searchInput}`
          break
        case 2:
          query.uuid = `${searchInput}`
          break
        case 3:
          if (this.searchTimeRange && this.searchTimeRange[0]) {
            var startTime = +new Date(this.searchTimeRange[0])
            var endTime = +new Date(this.searchTimeRange[1])
            query.startTime = `${startTime}`
            query.endTime = `${endTime}`
          }
          break
      }
      var search = urlutil.url.genUrl({
        query
      })
      location.href = search
    },
    $export () {
      this.$confirm('确定要导出日志吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this._export().catch(err => {
          this.$message({
            showClose: true,
            message: err.message || '导出出错',
            type: 'error'
          })
          this.$loading().close()
        })
      }).catch(() => {})
    },
    _export: async function () {
      var token = await this.requestExport()
      this.$loading({
        text: '文件准备中……'
      })
      var downloadLink = await this.checkExportStatus(token)
      this.$loading().close()
      window.location.href = downloadLink
    },
    requestExport: async function () {
      var search = parameters
      var res = await this.$http.post(`/user/prepareActionsExportList.json`, search)
      return res.body.token
    },
    checkExportStatus: async function (token) {
      var res = await this.$http.get(`/user/checkActionsExportListStatus.json?token=${token}`)
      if (res.body.code !== 200) {
        throw new Error(res.body.message)
      }
      var status = res.body.status
      if (status.status === 1) {
        return status.downloadLink
      } else if (status.status === 0) {
        this.$loading().text = status.message
        await new Promise(resolve => {
          setTimeout(() => {
            resolve()
          }, 500)
        })
        return await this.checkExportStatus(token)
      } else {
        throw new Error(status.message)
      }
    }
  },
  filters: {
    format (obj, value) {
      return (obj && (obj[value] || '')) || ''
    },
    bracketFormat (value) {
      return (value && '(' + value + ')') || ''
    }
  },
  components: {
    NavMenu
  }
}
</script>

<style type="text/css">
.actions {
  width: 90%;
  margin: 0 auto;
}
</style>
