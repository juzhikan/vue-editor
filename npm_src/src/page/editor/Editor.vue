<template>
    <div class="editor-container">

      <html-dialog ref="htmldialog" v-model="htmlDialogVisible" @visible-change="htmlDialogVisibleChange"></html-dialog>

      <annotation-replace-dialog v-model="annotationReplaceDialogVisible" @visible-change="annotationReplaceDialogVisibleChange"></annotation-replace-dialog>

      <replace-dialog v-model="replaceDialogVisible" @confirm="replace" @visible-change="replaceDialogVisibleChange"></replace-dialog>

      <el-popover ref="status-popover" placement="top-start" trigger="hover" v-model="statusPopoverVisible">
        <el-radio-group v-model="editStatus" @change="changeStatus">
          <el-radio disabled :label="0">未精编</el-radio>
          <el-radio :label="5">精编中</el-radio>
          <el-radio :label="10">已精编</el-radio>
        </el-radio-group>
      </el-popover>

      <div class="col1">
        <div class="row1">
          <el-button type="primary" style="padding: 9px 9px;" v-popover:status-popover size="small" @click="returnList">返回书籍列表</el-button>
          <el-button type="success" size="small" @click="saveParagraphs">保存</el-button>
        </div>
        <catalog ref="catalog"></catalog>
      </div>

      <div class="col2">
        <div class="operate-wrap">
          <format-brush></format-brush>

          <el-button type="warning" size="small" style="padding: 5px 9px;" @click="htmlDialogVisible = true">
            HTML段落
          </el-button>

          <el-button type="warning" size="small" style="padding: 5px 9px;" @click="annotationReplaceDialogVisible = true">
            <i class="fa fa-registered" aria-hidden="true"></i> 批量注释
          </el-button>

          <el-button type="warning" size="small" style="padding: 5px 9px;" @click="replaceDialogVisible = true">
            批量替换
          </el-button>

          <el-dropdown @command="clear" trigger="hover" :show-timeout="0" hide-timeout="50" style="margin-left: 10px;">
            <el-button type="warning" size="small" style="padding: 5px 9px;">
              清除操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="textual">清除格式（保留注释）</el-dropdown-item>
              <el-dropdown-item command="textualAll">清除格式（还原注释）</el-dropdown-item>
              <el-dropdown-item command="fix">清除非法标签</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <el-switch ref="switch" v-model="mode" style="margin: 1px 0 0 10px;"
            on-color="#20a0ff"
            off-color="#13ce66"
            on-text="编辑模式"
            off-text="段落模式"
            :width="90"
            @change="onChangeMode">
          </el-switch>

          <el-select style="float: right;height: 30px;" size="small" @change="version" v-if="$store.state.permission['SUPER_ADMIN']" v-model="selectedVersion" placeholder="选择历史版本">
            <el-option
              v-for="item in versionList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>

          <el-button type="success" size="small" v-if="$store.state.permission['SUPER_ADMIN']" style="float: right;margin-right: 15px;" @click="version">当前版本</el-button>
        </div>
        <router-view ref="paragraphs"></router-view>
      </div>

      <div class="col3">
        <preview></preview>
      </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import Catalog from './components/Catalog.vue'
import Preview from './components/Preview.vue'
import FormatBrush from './components/FormatBrush.vue'
import AnnotationReplaceDialog from './components/AnnotationReplaceDialog.vue'
import ReplaceDialog from './components/ReplaceDialog.vue'
import HtmlDialog from './components/HtmlDialog.vue'
import Cache from './cache/cache'
import { textExploreReplace, clearBR, textual, fix } from '@/util'

var editStatus = parseInt(window.PAGE_CONFIG.editStatus, 10)

export default {
  components: { Catalog, Preview, FormatBrush, ReplaceDialog, HtmlDialog, AnnotationReplaceDialog },
  data () {
    return {
      statusPopoverVisible: false,
      editStatusBefore: editStatus,
      editStatus: editStatus,
      selectedVersion: undefined,
      htmlDialogVisible: false,
      replaceDialogVisible: false,
      annotationReplaceDialogVisible: false
    }
  },
  mounted () {
    var vm = this
    document.onkeydown = function () {
      if (event.shiftKey && event.keyCode === 83) {
        vm.$refs['switch'].$el.click()
      }
      if (event.shiftKey && event.keyCode === 67) {
        if (vm.$store.state.toolbarVisible && !vm.$store.state.mode && !vm.$store.state.isMultiple) {
          vm.$refs.paragraphs.$refs.ptoolbar.$refs.codeS.click()
          return
        }
      }
    }
  },
  computed: {
    mode: {
      get: function () {
        return this.$store.state.mode
      },
      set: function (v) {
        this.$store.commit('updateMode', v)
      }
    },
    versionList () {
      var state = this.$store.state
      if (state.articleLinks) {
        this.selectedVersion = undefined
        var histories = state.articleLinks.histories
        var list = []
        for (var i = 0; i < histories.length; i++) {
          var item = histories[i]
          var time = new Date(parseInt(item.createTime, 10)).toLocaleString()
          var user = item.createBy.substring(0, item.createBy.indexOf('@'))
          list.push({
            label: '版本：' + item.version + '， ' + time + '， ' + user,
            value: item.contentLink
          })
        }
        return list
      } else {
        return []
      }
    }
  },
  methods: {
    getSections () {
      return this.$refs['paragraphs'].$el.querySelectorAll('.section')
    },
    htmlDialogVisibleChange (val) {
      this.htmlDialogVisible = val
    },
    replaceDialogVisibleChange (val) {
      if (val) {
        this.$store.commit('updateToolbarVisible', false)
      }
      this.replaceDialogVisible = val
    },
    annotationReplaceDialogVisibleChange (val) {
      if (val) {
        this.$store.commit('updateToolbarVisible', false)
      }
      this.annotationReplaceDialogVisible = val
    },
    replace (findValue, repalceValue) {
      var sections = this.getSections()
      var findNum = 0
      for (var i = 0; i < sections.length; i++) {
        findNum += textExploreReplace(sections[i], findValue, repalceValue)
      }
      if (findNum === 0) {
        this.$message({message: '未查找到需要替换的内容！', type: 'warning', duration: 1500})
      } else {
        this.$message({message: `已成功替换${findNum}处！`, type: 'success', duration: 1500})
        this.$store.commit('updateHasBeenSaved', false)
        this.replaceDialogVisible = false
      }
    },
    clear (command) {
      this[command]()
    },
    textualAll () {
      this.textual(true)
    },
    textual (type) {
      this.$confirm('确定要清除所有格式吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        textual(this.getSections(), type)
        this.$store.commit('updateHasBeenSaved', false)
        this.$store.commit('updateToolbarVisible', false)
      }).catch(() => {})
    },
    fix () {
      this.$confirm('确定要清除问题标签吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        fix(this.getSections())
        this.$store.commit('updateHasBeenSaved', false)
        this.$store.commit('updateToolbarVisible', false)
      }).catch(() => {})
    },
    saveParagraphs: async function () {
      var paragraphs = []
      var dragWrp = document.querySelector('.j-dragWrp')
      var paragraphsList = dragWrp.querySelectorAll('.j-dragEle')
      if (!paragraphsList.length) {
        this.$message({message: '没有可以保存的内容！', type: 'warning', duration: 1500})
        return
      }
      clearBR(this.getSections())
      for (var i = 0; i < paragraphsList.length; i++) {
        paragraphs.push({
          'content': paragraphsList[i].innerHTML
        })
      }

      var formdata = new FormData()
      formdata.append(window.SITE_CONFIG.csrfName, window.SITE_CONFIG.csrfToken)
      formdata.append('articleId', this.$store.state.routeId)
      formdata.append('version', this.$store.state.articleVersion)
      formdata.append('paragraphs', JSON.stringify(paragraphs))

      var res = await this.$http.post('/editor/saveParagraphs.json', formdata, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      if (res.body.code === 200) {
        this.$store.commit('updateToolbarVisible', false)
        this.$store.commit('updateHasBeenSaved', true)
        this.$message({message: '保存成功！', type: 'success', duration: 1500})

        this.$refs.catalog.switchRoute()
      } else {
        this.$message({
          message: '保存出错！',
          type: 'warning',
          duration: 1500
        })
      }
      return false
    },
    changeStatus (value) {
      if (value === this.editStatusBefore) return
      this.$confirm('确定要切换书籍精编状态吗？(切换前请确认改动已经保存)', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnPressEscape: false,
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        this.doChangeStatus()
      }).catch(() => {
        this.cancelChangeStatus()
      })
    },
    cancelChangeStatus () {
      this.editStatus = this.editStatusBefore
    },
    doChangeStatus () {
      var value = this.editStatus
      if (value !== 5 && value !== 10) return
      var fun = value === 5 ? 'startEditing' : 'finishEditing'

      Cache[fun]({
        'id': window.PAGE_CONFIG.bookId
      }, response => {
        this.$message({
          message: '书籍状态切换成功！',
          type: 'success',
          duration: 1500,
          onClose () {
            location.reload()
          }
        })
      }, response => {
        this.$message({message: '请求异常！', type: 'warning', duration: 1500})
      })
    },
    onChangeMode (mode) {
      var state = this.$store.state
      var selected = state.selected
      if (mode) {
        this.$refs.paragraphs.clearMulitySelected()
        this.$store.commit('updateTextModeVisible', true)
        this.$store.commit('updateParagraphModeVisible', false)
        if (!state.selected) this.$store.commit('updateToolbarVisible', false)
      } else {
        if (selected) {
          selected.setAttribute('contenteditable', false)
          this.$refs.paragraphs.checkToolbarState(selected)
        }
        this.$store.commit('updateTextModeVisible', false)
        this.$store.commit('updateParagraphModeVisible', true)
      }
    },
    returnList () {
      window.location.href = '/book/list'
    },
    version (v) {
      if (!v) return
      if (v === event) window.open(this.$store.state.articleLinks.link)
      window.open(v)
    }
  }
}
</script>
<style type="text/css">
.editor-container {
  height: 100%;
  padding-top: 20px;
  width: 98%;
  margin: 0 auto;
  display: flex;
  flex-flow: row;
  align-item: stretch;
  justify-content: space-between;
}

.col1 {
  width: 280px;
  position: relative;
  display: flex;
  flex-flow: column;
  align-item: stretch;
  justify-content: space-between;
}

.col2 {
  flex: 1;
  height: 100%;
  display: flex;
  flex-flow: column;
  align-item: stretch;
  justify-content: space-between;
  width: 1px;
}

.col2 .operate-wrap {
  width: 100%;
  padding: 10px 38px;
  box-sizing: border-box;
  background-color: #fff;
  height: 45px;
}

.col2 .operate-wrap:after {
  display: block;
  clear: both;
  visibility: hidden;
  height: 0;
  overflow: hidden;
  content: ".";
}

.col2 .operate-wrap .el-button.active {
  background-color: #13ce66!important;
  border-color: #13ce66!important;
}

.col3 {
  width: 420px;
  overflow-x: scroll;
}

.col1 .row1 {
  padding: 10px 10px 10px 0;
  top: 0;
  left: 0;
  height: 48px;
  width: 100%;
  background-color: #ffffff;
}
.el-radio__input.is-disabled.is-checked .el-radio__inner {
  background-color: #20a0ff;
  border-color: #20a0ff;
}

@media screen and (max-width: 1400px) {
  .editor-container {
    width: 99%;
  }
  .col1 {
    width: 180px;
  }
  .col3 {
    width: 375px;
  }
}
</style>
