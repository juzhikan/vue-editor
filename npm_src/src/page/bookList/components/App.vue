<template>
    <div class="bl center-block">
       <NavMenu></NavMenu>
        <div class="container-fluid" style="margin-top: 20px">
         <div class="pull-right">
            <el-button type="primary" @click="$openBookInfoDialog()" v-if="$store.state.permission['BOOK_CREATE']">新建书籍</el-button>
             <el-button v-if="$store.state.permission['BOOK_MIGRATE']" type="danger" @click="importDlgVisible = true">高级功能</el-button>
          </div>
          <Search></Search>
          <div class="bl-list">
            <el-table :data="list" :row-class-name="$getTableRowClassName">
              <el-table-column label="封面">
                <template scope="scope">
                  <img class="cover-preview" :src="scope.row.coverImage + '?imageView&thumbnail=300x420'" :alt="scope.row.title" v-if="scope.row.coverImage">
                  <div v-else>没有图片</div>
                </template>
              </el-table-column>
              <el-table-column label="书籍信息" width="400">
                <template scope="scope">
                  <div class="binfo">
                    <div>
                      <span class="binfo-title">书名：</span>
                      <span class="binfo-content">{{scope.row.title}}</span>
                    </div>
                    <div>
                      <span class="binfo-title">作者：</span>
                      <span class="binfo-content">
                        <span v-for="item in scope.row.authors">
                          {{item.name}}
                        </span>
                      </span>
                    </div>
                    <div>
                      <span class="binfo-title">UUID：</span>
                      <span class="binfo-content">{{scope.row.sourceUuid}}</span>
                    </div>
                    <div>
                      <span class="binfo-title">BookId：</span>
                      <span class="binfo-content">{{scope.row.id}}</span>
                    </div>
                    <div>
                      <span class="binfo-title">出版社：</span>
                      <span class="binfo-content">{{scope.row.publisher}}</span>
                    </div>
                    <div>
                      <span class="binfo-title">编书人：</span>
                      <span class="binfo-content">{{scope.row.editorName}}（{{scope.row.editorUsername}}）</span>
                    </div>
                    <div v-if="scope.row.chiefEditorName">
                      <span class="binfo-title">精编人：</span>
                      <span class="binfo-content">{{scope.row.chiefEditorName}}（{{scope.row.chiefEditorUsername}}）</span>
                    </div>
                    <div>
                      <span class="binfo-title">入库时间：</span>
                      <span class="binfo-content">{{scope.row.createTime|time}}</span>
                    </div>
                    <el-tooltip placement="top" v-if="scope.row.cloneMessage">
                        <div slot="content" class="wb" style="width:200px">{{scope.row.cloneMessage}}</div>
                        <div class="toe">
                          <span class="binfo-title">复制理由：</span>
                          <span style="color: red">
                            {{scope.row.cloneMessage}}
                          </span>
                        </div>
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="计费数据统计">
                <template scope="scope">
                  <template v-if="scope.row.complexity">
                    <div><span class="text-primary">图片数量：</span><br>{{scope.row.complexity.imageCount}}</div>
                    <div><span class="text-primary">注释数量：</span><br>{{scope.row.complexity.markCount}}</div>
                    <div><span class="text-primary">样式数量：</span><br>{{scope.row.complexity.classCount}}</div>
                  </template>
                </template>
              </el-table-column>
              <el-table-column label="书籍状态">
                <template scope="scope">
                 <template v-if="scope.row.status === 11">
                   <div>解析失败</div>
                   <el-tooltip placement="top">
                    <div slot="content" class="wb" style="width:200px;">{{scope.row.statusMessage}}</div>
                    <div class="error-text">{{scope.row.statusMessage}}</div>
                  </el-tooltip>
                 </template>
                <template v-else-if="scope.row.status === 10 || scope.row.status === 20">
                    <div>{{getValue('bookStatus2', scope.row.status)}}</div>
                    <el-tooltip placement="top">
                        <div slot="content" class="wb" style="width:200px">{{scope.row.statusMessage}}</div>
                        <div class="text-muted">{{scope.row.statusMessage}}</div>
                    </el-tooltip>
                </template>
                 <template v-else>
                   <span>{{getValue('bookStatus2', scope.row.status)}}</span>
                 </template>
                </template>
              </el-table-column>
              <el-table-column label="精编状态">
                <template scope="scope">
                  <span>{{getValue('editStatus', scope.row.editStatus)}}</span>
                </template>
              </el-table-column>
              <el-table-column label="审核状态">
                <template scope="scope">
                  <div>
                    <span class="text-primary">阅读：</span>{{getValue('reviewStatus', scope.row.yueduBusinessData.reviewStatus)}}
                  </div>
                  <div v-if="scope.row.yueduBusinessData.reviewMessage && scope.row.yueduBusinessData.reviewStatus === 2">
                    <el-tooltip placement="top">
                        <div slot="content" class="wb" style="width:200px">{{scope.row.yueduBusinessData.reviewMessage}}</div>
                        <div class="text-muted error-text">{{scope.row.yueduBusinessData.reviewMessage}}</div>
                    </el-tooltip>
                  </div>
                  <div>
                    <span class="text-primary">蜗牛：</span>{{getValue('reviewStatus', scope.row.snailBusinessData.reviewStatus)}}
                  </div>
                  <div v-if="scope.row.snailBusinessData.reviewMessage && scope.row.snailBusinessData.reviewStatus === 2">
                    <el-tooltip placement="top">
                        <div slot="content" class="wb" style="width:200px">{{scope.row.snailBusinessData.reviewMessage}}</div>
                        <div class="text-muted error-text">{{scope.row.snailBusinessData.reviewMessage}}</div>
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="发布状态">
                <template scope="scope">
                    <template v-for="ps in scope.row.publishStatuses">
                        <div><span class="text-primary" >{{getValue('publishChannel', ps.channel)}}</span>&nbsp;{{getValue('publishStatus', ps.status) }}</div>
                        <template v-if="ps.status > 1">
                            <el-tooltip placement="top">
                                <div slot="content" style="width:200px;word-wrap: break-word">{{ps.message}}</div>
                                <div :class="{'text-danger error-text': ps.status === 3, 'text-muted': ps.status === 2, 'small': true}">{{ps.message}}</div>
                            </el-tooltip>
                        </template>
                    </template>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template scope="scope">
                  <template v-if="scope.row.status === 0">
                    <div>
                      <el-button type="text" size="mini" @click="$openBookInfoDialog(scope.row.id)" v-if="$store.state.permission['BOOK_INFO_EDIT']">出版信息</el-button>
                    </div>
                    <div>
                      <el-button type="text" size="mini" @click="openEditor(scope.row.id)" v-if="$store.state.permission['BOOK_CONTENT_EDIT']">内容编辑</el-button>
                    </div>
                    <div>
                      <el-button type="text" size="mini" @click="$openSyncDialog(scope.row.id)" v-if="$store.state.permission['BOOK_PUBLISH'] && scope.row.canPublish === 1">发布</el-button>
                    </div>
                    <div>
                      <el-button type="text" size="mini" @click="$openBusinessInfoDialog(scope.row.id)">业务信息</el-button>
                    </div>
                    <div>
                      <el-button type="text" size="mini" @click="$openBookPreviewDialog(scope.row.id)" v-if="$store.state.permission['BOOK_PREVIEW']">书籍预览</el-button>
                    </div>
                    <div v-if="$store.state.permission['BOOK_EDIT_REQUEST']">
                      <el-button type="text" size="mini" v-if="scope.row.editStatus == '0'" @click="requestEdit(scope.row.id)">需精编</el-button>
                      <el-button type="text" size="mini" v-if="scope.row.editStatus == '1'" @click="cancelEdit(scope.row.id)">撤销需精编</el-button>
                    </div>
                    <div v-if="$store.state.permission['BOOK_EXPORT']">
                      <el-button type="text" size="mini" @click="$downloadBook(scope.row.id)" >导出</el-button>
                    </div>
                    <div v-if="$store.state.permission['BOOK_DELETE']">
                      <el-button type="text" size="mini" @click="$deleteBook(scope.row.id)" >删除</el-button>
                    </div>
                    <div>
                      <el-button type="text" size="mini" @click="requestCopy(scope.row.id)">复制</el-button>
                    </div>
                  </template>
                  <template v-else-if="scope.row.status === 11">
                    <div>
                      <el-button type="text" size="mini" @click="$analyzeBook(scope.row.id)">重新解析</el-button>
                    </div>
                    <div>
                      <el-button type="text" size="mini" @click="$deleteBook(scope.row.id)" v-if="$store.state.permission['BOOK_DELETE']">删除</el-button>
                    </div>
                  </template>
                  <template v-else-if="scope.row.status === 9">
                    <div>
                      <el-button type="text" size="mini" @click="$deleteBook(scope.row.id)" v-if="$store.state.permission['BOOK_DELETE']">删除</el-button>
                    </div>
                  </template>
                  <template v-if="$store.state.permission['SUPER_ADMIN']">
                    <div>
                      <el-button type="text" size="mini"  @click="$downloadOriginalFile(scope.row.id)">下载原始文件</el-button>
                    </div>
                  </template>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="bl-pager">
            <el-pagination @current-change="onPageChange" layout="prev, pager, next" :current-page="pageIndex" :page-count="pageCount"></el-pagination>
          </div>
        </div>
        <BookInfoDialog v-model="isShowBookInfoDialog" :id="edittingBookId" :key="edittingBookKey"></BookInfoDialog>
        <BusinessInfoDialog v-model="isShowBusinessInfoDialog" :id="businessInfoBookId" :key="businessInfoKey"></BusinessInfoDialog>
        <el-dialog v-model="isShowSyncDialog" title="选择对应的同步方式" :close-on-click-modal="false">
          <el-button type="primary" @click="$syncData('1', 0)">发布到阅读</el-button>
          <el-button v-if="!$store.state.snailDisabled" type="primary" @click="$syncData('2', 0)">发布到蜗牛</el-button>
          <el-button v-if="!$store.state.snailDisabled" type="primary" @click="$syncData('1,2', 0)">全部发布</el-button>
          <div v-if="$store.state.permission['SUPER_ADMIN']" :style="{'marginTop': '10px'}">
            <el-button type="primary" @click="$syncData('1', 1)">强制发布到阅读</el-button>
            <el-button v-if="!$store.state.snailDisabled" type="primary" @click="$syncData('2', 1)">强制发布到蜗牛</el-button>
            <el-button v-if="!$store.state.snailDisabled" type="primary" @click="$syncData('1,2', 1)">强制全部发布</el-button>
          </div>
          <div v-if="$store.state.permission['SUPER_ADMIN']" :style="{'marginTop': '10px'}">
            <el-button type="primary" @click="$stopSyncData('1')">终止发布到阅读</el-button>
            <el-button v-if="!$store.state.snailDisabled" type="primary" @click="$stopSyncData('2')">终止发布到蜗牛</el-button>
            <el-button v-if="!$store.state.snailDisabled" type="primary" @click="$stopSyncData('1,2')">终止全部发布</el-button>
          </div>
        </el-dialog>
        <BookPreviewDialog v-model="isShowBookPreviewDialog" :id="bookPreviewBookId" :key="bookPreviewBookId"></BookPreviewDialog>
        <el-dialog v-model="importDlgVisible">
          <el-form labelWidth="120px">
          <el-form-item label="书籍uuid：">
            <el-input type="textarea" rows="10" style="width: 400px" v-model="importDlg.uuid" placeholder="使用换行符或者英文逗号分隔uuid"></el-input>
          </el-form-item>
          <el-form-item label="线上平台：">
            <el-select v-model="importDlg.channel">
              <el-option value="1" label="阅读"></el-option>
              <el-option value="2" label="蜗牛"></el-option>
            </el-select>
          </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="$onImport" type="primary" >提交</el-button>
          </span>
        </el-dialog>

    </div>
</template>
<script>
  import BookInfoDialog from './BookInfoDialog'
  import BusinessInfoDialog from './BusinessInfoDialog'
  import BookPreviewDialog from './BookPreviewDialog'
  import NavMenu from '@/common/components/NavMenu'
  import util, {genTime} from '@/common/util'
  import {getSelectList, getValue} from '@/common/map'
  import Search from './Search'
  import {syncData, stopSyncData} from '../util'
  import '@/css/binfo.css'
  import {get, post} from '@/common/http'
  import messageBox from '@/page/bookList/widget/MessageBox'

  export default {
    name: 'App',
    data () {
      return {
        isShowBookInfoDialog: false,
        isShowBusinessInfoDialog: false,
        isShowSyncDialog: false,
        isShowBookPreviewDialog: false,
        edittingBookId: '',
        businessInfoBookId: '',
        businessInfoKey: Date.now(),
        bookPreviewBookId: '',
        syncingId: null,
        fullscreenLoading: false,
        importDlg: {
          uuid: '',
          channel: '1',
          force: false
        },
        importDlgVisible: false
      }
    },
    computed: {
      list: function () {
        return this.$store.state.list
      },
      pageCount: function () {
        return this.$store.state.pageCount
      },
      pageIndex: function () {
        return this.$store.state.pageIndex
      },
      edittingBookKey: function () {
        return `key_${this.edittingBookId}`
      }
    },
    methods: {
      $onImport: function () {
        this.$http.post('/import/importBook.json', this.importDlg).then(res => {
          if (res.body.code === 200) {
            this.$message({
              showClose: true,
              message: '成功',
              type: 'success'
            })
            window.location.reload()
          } else {
            this.$message({
              showClose: true,
              message: res.body.message,
              type: 'error'
            })
          }
          this.importDlgVisible = false
        }).catch(() => {
          this.$message({
            showClose: true,
            message: '失败',
            type: 'error'
          })
          this.importDlgVisible = false
        })
      },
      $getTableRowClassName: function (row) {
        if (row.id === this.$store.state.activeId) {
          return 'active'
        } else {
          return ''
        }
      },
      $analyzeBook: function (id) {
        return this.$http.post('/book/analyseBook.json', {id}).then(res => {
          if (res.body.code === 200) {
            this.$message({
              showClose: true,
              message: '重新解析成功',
              type: 'success'
            })
            window.location.reload()
          } else {
            this.$message({
              showClose: true,
              message: res.body.message,
              type: 'error'
            })
          }
        }).catch(() => {
          this.$message({
            showClose: true,
            message: '重新解析失败',
            type: 'error'
          })
        })
      },
      $syncData: function (type, force) {
        syncData(this.syncingId, type, force).then(() => {
          this.isShowSyncDialog = false
        }).catch(() => {
          this.isShowSyncDialog = false
        })
      },
      $stopSyncData: function (type) {
        stopSyncData(this.syncingId, type).then(() => {
          this.isShowSyncDialog = false
        }).catch(() => {
          this.isShowSyncDialog = false
        })
      },
      $downloadOriginalFile: function (bookId) {
        return get('/system/getUploadedFileLink.json', {bookId}).then(res => {
          window.location.href = res.link
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.message || '服务器错误',
            type: 'error'
          })
        })
      },
      $downloadBook: function (id) {
        this._downloadBook(id).catch(err => {
          this.$message({
            showClose: true,
            message: err.message || '导出出错',
            type: 'error'
          })
          this.$loading().close()
        })
      },
      _downloadBook: async function (id) {
        var token = await this._requestExport(id)
        this.$loading({
          text: '文件准备中……'
        })
        var downloadLink = await this._checkExportStatus(token)
        this.$loading().close()
        window.location.href = downloadLink
      },
      _checkExportStatus: async function (token) {
        var res = await this.$http.get(`/book/checkExportBookStatus.json?token=${token}`)
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
      _requestExport: async function (id) {
        var res = await this.$http.post(`/book/prepareExportBook.json`, {
          id
        })
        return res.body.token
      },
      $deleteBook: function (id) {
        this._deleteBook(id).catch(err => {
          if (err !== 'cancel') {
            this.$message({
              showClose: true,
              message: '删除失败',
              type: 'error'
            })
          }
        })
      },
      _deleteBook: async function (id) {
        await this.$confirm('你确定要删除吗？', {
          type: 'warning'
        })
        var res = await this.$http.post('/book/delete.json', {
          id
        })
        if (res.body.code === 200) {
          this.$store.commit('deleteBook', {id})
          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
        } else {
          this.$message({
            showClose: true,
            message: res.body.message,
            type: 'error'
          })
        }
      },
      requestCopy: function (id) {
        messageBox.open({
          title: '复制理由',
          rules: [{required: true, trigger: 'blur', message: '此项必填'}]
        }, text => {
          post('/editor/cloneBook.json', {bookId: id, message: text}).then(() => {
            this.$message({
              type: 'success',
              message: '复制成功'
            })
          }).catch(err => {
            this.$message({
              type: 'error',
              message: err.message
            })
          })
        })
      },
      cancelEdit: function (id) {
        post('/book/cancelRequestBookEditing.json', { id }).then(() => {
          this.$store.commit('updateBook', {
            id,
            editStatus: 0
          })
          this.$message({
            message: '撤销成功',
            type: 'success'
          })
        }).catch(err => {
          this.$message({
            message: err.message,
            type: 'error'
          })
        })
      },
      requestEdit: function (id) {
        this.$confirm('你确定要请求精编吗？', {type: 'warning'}).then(() => {
          return this.$http.post('/book/requestEditing.json', {id})
        }).then((res) => {
          if (res.body.code === 200) {
            this.$store.commit('makeNeedEdit', {id})
          } else {
            this.$message({
              showClose: true,
              message: res.body.message,
              type: 'error'
            })
          }
        }).catch((err) => {
          if (err === 'cancel') {
            return
          }
          this.$message({
            showClose: true,
            message: '请求失败',
            type: 'error'
          })
        })
      },
      openEditor: function (id) {
        window.open(`/editor/main.do?bookId=${id}`)
      },
      onPageChange: function (page) {
        var query = util.url.getQuery(location.href)
        query.pageIndex = page
        location.href = util.url.genUrl({
          query
        })
      },
      /**
       *  @param id {Object} 书的id，没有则为新增模式
       */
      $openBookInfoDialog: function (id) {
        this.edittingBookId = id
        this.isShowBookInfoDialog = true
        this._updateFocus(id)
      },
      /**
       *  @param id {Object} 书的id
       */
      $openBusinessInfoDialog: function (id) {
        this.businessInfoBookId = id
        this.businessInfoKey = Date.now()
        this.isShowBusinessInfoDialog = true
        this._updateFocus(id)
      },
      $openSyncDialog: function (id) {
        this.syncingId = id
        this.isShowSyncDialog = true
        this._updateFocus(id)
      },
      $openBookPreviewDialog: function (id) {
        this.bookPreviewBookId = id
        this.isShowBookPreviewDialog = true
        this._updateFocus(id)
      },
      _updateFocus: function (id) {
        this.$store.commit('updateFocus', id)
      },
      getSelectList,
      getValue
    },
    components: {
      BookInfoDialog,
      BusinessInfoDialog,
      BookPreviewDialog,
      NavMenu,
      Search
    },
    filters: {
      time: function (value) {
        return genTime(value)
      }
    }
  }

</script>
<style>
  html{
    overflow-y: scroll;
  }
  .wb{
    word-break: break-all;
    white-space: normal;
    word-wrap: break-word;
  }
  .toe{
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .bl{
    width: 90%;
  }
  .bl-list .el-table__body-wrapper{
    overflow: hidden;
  }
  .error-text{
    max-height: 70px;
    overflow: hidden;
  }
  .center-table{
    display: table;
    margin-left: auto;
    margin-right: auto;
  }
  input[type="file"]{
    display: none;
  }
  .editDialog .el-date-editor.el-input{
    width: 100%;
  }
  .editDialog .el-select{
    display: block;
  }
  .editDialog.el-dialog--small{
    width: 750px;
  }
  .cover-preview{
    display: block;
    width: 100%;
  }
  tr.active{
    background: #dfe6ec;
  }
</style>
