<template>
  <div @keyup.enter="$search">
    <el-form :inline="true" class="bl-top">
      <template>
          <el-form-item>
            <el-date-picker
              v-model="search.timeRange"
              type="datetimerange"
              placeholder="选择时间范围">
            </el-date-picker>
          </el-form-item>
        </template>
      <template v-if="searchType === 1">
        <el-form-item>
          <el-input v-model="search.title" placeholder="请输入书名或UUID"></el-input>
        </el-form-item>
      </template>
      <template v-if="searchType === 2">
        <el-form-item>
          <el-input v-model="search.author" placeholder="请输入作者"></el-input>
        </el-form-item>
      </template>
      <template v-if="searchType === 3">
        <el-form-item>
          <el-input v-model="search.editor" placeholder="请输入制书人"></el-input>
        </el-form-item>
      </template>
      <template v-if="searchType === 4">
        <el-form-item>
          <el-select v-model="search.status" placeholder="请选择书籍状态">
            <el-option v-for="item in getSelectList('bookStatus2')" :label="item.label" :value="item.value" :key="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </template>

      <template v-if="searchType === 6">
        <el-form-item>
          <el-input v-model="search.chiefEditor" placeholder="请输入精编人"></el-input>
        </el-form-item>
      </template>
      <el-form-item>
        <el-select v-model="searchType">
          <el-option :label="type.label" :value="type.value" v-for="type in searchTypes" :key="type.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="search.editStatus" placeholder="请选择精编状态">
          <el-option label="不限(精编状态)" key="" value=""></el-option>
          <el-option v-for="item in getSelectList('editStatus')" :label="item.label" :value="item.value" :key="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="search.publishStatus" placeholder="请选择发布状态">
          <el-option label="不限(发布状态)" key="" value=""></el-option>
          <el-option v-for="item in _getStatusList('publishStatus')" :label="item.label" :value="item.value" :key="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="search.reviewStatus" placeholder="请选择审核状态">
          <el-option label="不限(审核状态)" key="" value=""></el-option>
          <el-option v-for="item in _getStatusList('reviewStatus')" :label="item.label" :value="item.value" :key="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="search.cloneFlag">
          <el-option label="不限(复制状态)" key="" value=""></el-option>
          <el-option v-for="item in getSelectList('cloneFlag')" :label="item.label" :value="item.value" :key="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="$search">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="$export">导出书籍列表</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="$mergeBooks">合并书籍</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>
<script>
  import util from '@/common/util'
  import {getSelectList, getValue, default as map} from '@/common/map'
  import mergeBooks from '../widget/MergeBooks'

  export default {
    data () {
      return {
        searchType: 1,
        searchTypes: [
          {
            label: '书名/UUID',
            value: 1,
            id: 'title'
          },
          {
            label: '作者',
            value: 2,
            id: 'author'
          },
          {
            label: '制书编辑',
            value: 3,
            id: 'editor'
          },
          {
            label: '书籍状态',
            value: 4,
            id: 'status'
          },
          {
            label: '精编人',
            id: 'chiefEditor',
            value: 6
          }
        ],
        search: {
          editStatus: '',
          publishStatus: '',
          reviewStatus: '',
          timeRange: [],
          status: '',
          title: '',
          author: '',
          editor: '',
          cloneFlag: '',
          chiefEditor: ''
        },
        fullscreenLoading: false
      }
    },
    watch: {
      searchType: function (val) {
        var list = ['title', 'author', 'editor', 'status', 'chiefEditor']
        var getValue = id => {
          for (let i = 0; i < this.searchTypes.length; i++) {
            if (this.searchTypes[i].id === id) {
              return this.searchTypes[i].value
            }
          }
          return null
        }

        list.forEach(li => {
          var res = getValue(li)
          if (res !== val) {
            this.search[li] = ''
          }
        })
      }
    },
    created: function () {
      var query = this.$store.state.search
      this.search = {
        ...this.search,
        ...this._query2search(query)
      }

      if (!this.$store.state.permission['BOOK_SEARCH']) {
        let index = this.searchTypes.findIndex(item => item.value === 3)
        this.searchTypes.splice(
          index,
          1
        )
      }
      for (let i = 0; i < this.searchTypes.length; i++) {
        if (isValid(this.search[this.searchTypes[i].id])) {
          this.searchType = this.searchTypes[i].value
          break
        }
      }

      function isValid (value) {
        if (typeof value === 'string') {
          return value !== ''
        } else if (Array.isArray(value)) {
          return value.length > 0
        } else {
          return true
        }
      }
    },
    methods: {
      $search: function () {
        var query = util.url.getQuery(location.href)
        query = {
          ...query,
          ...this._search2query(),
          pageIndex: ''
        }
        var url = util.url.genUrl({query})

        window.location.href = url
      },
      $mergeBooks: function () {
        mergeBooks.open()
      },
      $export: function () {
        var promise = null
        console.log(this.$store.state.search)
        if (Object.keys(this.$store.state.search).length === 0) {
          promise = this.$confirm('未设置筛选条件，是否导出？', '提示')
        } else {
          promise = Promise.resolve()
        }
        promise.then(() => {
          this._export().catch(err => {
            this.$message({
              showClose: true,
              message: err.message || '导出出错',
              type: 'error'
            })
            this.$loading().close()
          })
        })
      },
      _export: async function () {
        var token = await this._requestExport()
        this.$loading({
          text: '文件准备中……'
        })
        var downloadLink = await this._checkExportStatus(token)
        this.$loading().close()
        window.location.href = downloadLink
      },
      _checkExportStatus: async function (token) {
        var res = await this.$http.get(`/book/checkExportListStatus.json?token=${token}`)
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
          return await this._checkExportStatus(token)
        } else {
          throw new Error(status.message)
        }
      },
      _requestExport: async function () {
        var res = await this.$http.post(`/book/prepareExportList.json`, {
          ...this.$store.state.search,
          pageIndex: this.$store.state.pageIndex
        })
        return res.body.token
      },
      _search2query: function () {
        var ret = {
          ...this.search
        }
        if (ret.timeRange && ret.timeRange.length > 0) {
          ret.createTimeFrom = +new Date(ret.timeRange[0])
          ret.createTimeTo = +new Date(ret.timeRange[1])
        } else {
          ret.createTimeFrom = ''
          ret.createTimeTo = ''
        }
        delete ret.timeRange
        return ret
      },
      _query2search: function (query) {
        var ret = {}

        for (let i in query) {
          if (query[i]) {
            ret[i] = query[i]
          }
        }

        var numbers = ['editStatus', 'status', 'cloneFlag']

        numbers.forEach(item => {
          if (ret[item]) {
            ret[item] = +ret[item]
          }
        })

        if (ret.createTimeTo) {
          ret.timeRange = [
            new Date(+query.createTimeFrom),
            new Date(+query.createTimeTo)
          ]
          delete ret.createTimeFrom
          delete ret.createTimeTo
        }

        return ret
      },
      _getStatusList: function (key) {
        const ret = []

        function genValue (map) {
          var ret = [map[1], map[2]]
          return ret.map(item => {
            if (item === undefined) {
              return '_'
            } else {
              return item
            }
          }).join('')
        }

        map[key].forEach((status, statusKey) => {
          let all = {}
          map.publishChannel.forEach((channel, channelKey) => {
            ret.push({
              label: `${status}(${channel})`,
              value: genValue({
                [channelKey]: statusKey
              })
            })
            all[channelKey] = statusKey
          })
          ret.push({
            label: `均${status}`,
            value: genValue(all)
          })
        })
        return ret
      },
      getSelectList,
      getValue
    }
  }
</script>
