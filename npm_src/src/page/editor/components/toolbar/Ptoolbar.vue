<template>
  <div :class="wrpClassName">
    <el-dialog :title="'新建图片段落'" ref="imgUpload" v-model="UploadVisible">
      <el-upload
        ref="upload"
        class="upload-demo"
        :action="action"
        :data="uploadParam"
        :on-change="onUploadChange"
        :on-remove="onRemoveFile"
        :before-upload="onBeforeUpload"
        :multiple="false"
        :accept="'.png,.jpg,.jpeg'"
        list-type="picture">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/jpeg/png文件，且不超过2mb</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="UploadVisible = false">取 消</el-button>
        <el-button type="primary" @click="insertImgParagraph">确 定</el-button>
      </div>
    </el-dialog>

    <el-popover
      ref="newprgrph"
      placement="top-start"
      width="400"
      trigger="hover"
      v-model="npvisible"
    >
      <div style="padding: 5px;">
        <el-button size="mini" type="primary" @click="batchpDialogVisible = true">批量段落</el-button>
        <el-button size="mini" type="primary" @click="basic('newParagraph', 'copyright')">版权段落</el-button>
        <el-button size="mini" type="primary" @click="basic('newParagraph', 'text')">文本段落</el-button>
        <el-button size="mini" type="primary" @click="basic('newParagraph', 'img')">图片段落</el-button>
        <!-- <el-button size="mini" type="primary" @click="basic('newParagraph', 'separate')">空白段落</el-button> -->
      </div>
    </el-popover>

    <batchp-dialog ref="batchpdialog" v-model="batchpDialogVisible"></batchp-dialog>

    <div class="contentWrapper c-cb j-pEditFn-region">
      <div >
        <button v-popover:newprgrph>
          <span v-show="!isMultiple" class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span>
        </button>
        <button v-show="!imgTextMode && isImgPrgrph && !isSeparate" id="full-screen" @click="basic('imageFull', 'screen')" title="图片全屏">
          <span class="glyphicon glyphicon-fullscreen" aria-hidden="true"></span>
        </button>
        <button v-show="!imgTextMode && isImgPrgrph && !isSeparate" id="full-width" @click="basic('imageFull', 'width')" title="图片通栏宽">
          <span class="glyphicon glyphicon-resize-horizontal" aria-hidden="true"></span>
        </button>
        <button v-show="isImgPrgrph && !isSeparate" id="full-width" @click="basic('beforeMerge', false)" title="合并图文段落">
          <span class="fa fa-exchange" aria-hidden="true"></span>
        </button>
        <button v-show="!isImgPrgrph && !isSeparate" id="align-left" @click="basic('align', 'yd-paragraph-f')" title="左对齐">
          <span class="glyphicon glyphicon-align-left" aria-hidden="true"></span>
        </button>
        <button v-show="!isImgPrgrph && !isSeparate" id="align-center" @click="basic('align', 'yd-paragraph-c')" title="居中对齐">
          <span class="glyphicon glyphicon-align-center" aria-hidden="true"></span>
        </button>
        <button v-show="!isImgPrgrph && !isSeparate" id="align-justify" @click="basic('align', 'yd-paragraph-j')" title="两端对齐">
          <span class="glyphicon glyphicon-align-justify" aria-hidden="true"></span>
        </button>
        <button v-show="!isImgPrgrph && !isSeparate" id="align-right" @click="basic('align', 'yd-paragraph-r')" title="右对齐">
          <span class="glyphicon glyphicon-align-right" aria-hidden="true"></span>
        </button>
        <div v-show="!isImgPrgrph && !isSeparate" ref="mutex">
          <button id="recommend-person" @click="basic('customize', 'yd-recommendperson')" title="署名段落">
            <span class="glyphicon glyphicon-hand-up" aria-hidden="true"></span>
          </button>
          <button id="quote" @click="basic('customize', 'yd-quote')" title="引用段落">
            <span class="glyphicon glyphicon-sound-dolby" aria-hidden="true"></span>
          </button>
          <button id="poetry" @click="basic('customize', 'yd-poetry')" title="诗歌段落">
            <span class="glyphicon glyphicon-leaf" aria-hidden="true"></span>
          </button>
          <button id="image-title" @click="basic('customize', 'yd-imagetitle')" title="图片注释段落">
            <span class="glyphicon glyphicon-subtitles" aria-hidden="true"></span>
          </button>
          <!-- <button id="text-subtitle" style="padding: 0;width: 28px;height: 28px;line-height: 28px;" title="正文小标题段落">
            <el-dropdown trigger="click" placement="top" :split-button="false" @command="textSubtitle">
              <span class="el-dropdown-link">
                <i class="fa fa-text-height" aria-hidden="true">{{tsize}}</i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="1"><i class="fa fa-text-height" aria-hidden="true"></i>1</el-dropdown-item>
                <el-dropdown-item :command="2"><i class="fa fa-text-height" aria-hidden="true"></i>2</el-dropdown-item>
                <el-dropdown-item :command="3"><i class="fa fa-text-height" aria-hidden="true"></i>3</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </button> -->
        </div>
        <div v-show="!isImgPrgrph">
          <button v-show="!isMultiple && !isSeparate" id="title-hide" @click="basic('hideTitle')" title="标题隐藏">
            <span class="glyphicon glyphicon-eye-close" aria-hidden="true"></span>
          </button>
          <button v-show="!isMultiple" @click="basic('warnSplit')" title="章节拆分">
            <span class="glyphicon glyphicon-th" aria-hidden="true"></span>
          </button>
          <!-- <button v-show="!isSeparate" ref="box" id="box" @click="basic('code', 'box')">
            <span class="fa fa-square-o" aria-hidden="true" title="插入框"></span>
          </button> -->
          <button v-show="!isSeparate" ref="codeS" id="code" @click="basic('code', 'code')">
            <span class="fa fa-code" aria-hidden="true" title="代码化"></span>
          </button>
          <button v-show="!isSeparate" @click="basic('textual')" title="清除格式（保留注释）">
            <span class="fa fa-minus-circle" aria-hidden="true"></span>
          </button>
          <button v-show="!isSeparate" @click="basic('textualAll')" title="清除格式（还原注释）">
            <span class="fa fa-eraser" aria-hidden="true"></span>
          </button>
          <button v-show="isMultiple && !isSeparate" @click="basic('beforeMerge', false)" title="段落合并">
            <span class="glyphicon glyphicon-tasks" aria-hidden="true"></span>
          </button>
          <button v-show="isMultiple && !isSeparate" @click="basic('beforeMerge', true)" title="段落合并-保留换行">
            <span class="fa fa-files-o" aria-hidden="true"></span>
          </button>
          <button v-show="isMultiple && !isSeparate" @click="copyToClipboard" title="复制到剪切板">
            <span class="fa fa-scissors" aria-hidden="true"></span>
          </button>
        </div>
        <button @click="basic('beforeDel')" title="删除段落">
          <span class="glyphicon glyphicon-remove-circle" aria-hidden="true"></span>
        </button>
        <button id="close" @click="hideToolbar" style="color: #ff2525;" title="关闭">
          <span class="glyphicon glyphicon-off" aria-hidden="true"></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { textual, mutexclass, remove } from '@/util'
import BatchpDialog from '../BatchParagraphsDialog'
import toolbarState from './toolbarState'
import Cache from '../../cache/cache'
import { mapState } from 'vuex'
import { copyrightParagraphsConfig, newParagraphConfig, newSeparateParagraphConfig } from '../../config'

var mutexlist = ['yd-recommendperson', 'yd-quote', 'yd-imagetitle', 'yd-poetry', 'yd-paragraphtitle', 'yd-textSubtitle--1', 'yd-textSubtitle--2', 'yd-textSubtitle--3']
var fn = function () {}

export default {
  name: 'vue-toolbar',
  props: {
    el: {
      type: HTMLDivElement,
      default () { return null }
    },
    switch: {
      type: Object,
      default () { return null }
    }
  },
  components: { BatchpDialog },
  data () {
    return {
      npvisible: false,
      UploadVisible: false,
      fileList: [],
      batchpDialogVisible: false,
      action: '//nos.netease.com/',
      uploadParam: {},
      message: '',
      tsize: 0
    }
  },
  computed: mapState({
    isImgPrgrph (state) {
      return state.isImgPrgrph
    },
    wrpClassName (state) {
      var str = state.isMultiple ? ' vertical' : ''
      return 'pTbWrp' + str
    },
    isMultiple (state) {
      return state.isMultiple
    },
    isSeparate (state) {
      return state.isSeparate
    },
    imgTextMode (state) {
      return state.imgTextMode
    }
  }),
  methods: {
    hideToolbar () {
      this.$store.commit('updateToolbarVisible', false)
    },
    confirmDialogVisibleChange (val) {
      this.confirmDialogVisible = val
    },
    getParagraphIndex (p) {
      return parseInt(p.id.replace('paragraph-', ''), 10)
    },
    basic (handle, param) {
      if (this.$store.state.isMultiple) {
        var multiSelects = this.$store.state.multiSelects
        if (multiSelects.length < 2) {
          this.$message({message: '多选模式下请至少选择两个段落！', type: 'warning', duration: 1500})
          return
        }
        switch (handle) {
          case 'beforeDel':
            this[handle](multiSelects)
            break
          case 'beforeMerge':
            this[handle](param)
            break
          case 'textualAll':
          case 'textual':
            this[handle](multiSelects)
            break
          default:
            var len = multiSelects.length
            for (var i = 0; i < len; i++) {
              this[handle](multiSelects[i].querySelector('.section'), param, i, len)
            }
        }
      } else {
        var selected = this.$store.state.selected.querySelector('.section')
        this[handle](selected, param)
      }
    },
    textualAll (selected) {
      this.textual(selected, true)
    },
    textual (selected, type) {
      var param
      if (selected && selected.length) {
        var _selected = Array.prototype.slice.call(selected, 0)
        param = _selected.map(function (el) {
          return el.children[0]
        })
      } else {
        param = selected
      }

      this.$confirm('确定要清除所有格式吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        textual(param, type)
        this.$store.commit('updateHasBeenSaved', false)
        this.$store.commit('updateToolbarVisible', false)
      }).catch(() => {})
    },
    exchange (selected, param, i, len) {
      var img = selected.querySelector('img')
      img.className = 'paragraph-img--internal'
      if ((i && i === len - 1) || i === undefined) {
        this.$store.commit('setImgTextMode', false)
        this.$store.commit('updateIsImgPrgrph', false)
      }
    },
    align (selected, type) {
      if (selected.className.indexOf(type) !== -1) {
        selected.classList.toggle(type)
        toolbarState.checkParagraphCommandState(this.$el, selected)
        return
      }
      selected.classList.remove('yd-paragraph-f', 'yd-paragraph-c', 'yd-paragraph-j', 'yd-paragraph-r')
      selected.classList.add(type)

      toolbarState.checkParagraphCommandState(this.$el, selected)
      this.$store.commit('updateHasBeenSaved', false)
    },
    hideTitle (selected) {
      if (!selected.classList.contains('j-chapter')) {
        this.$message({message: '请选择本章节的标题段落！！', type: 'warning', duration: 1500})
        return
      }
      selected.classList.toggle('yd-chapterhide')
      toolbarState.checkParagraphCommandState(this.$el, selected)
      this.$store.commit('updateHasBeenSaved', false)
    },
    imageFull (selected, type) {
      var img = selected.querySelector('.paragraph-img')
      console.log(img)
      if (!img) {
        this.$message({message: '请选择本章节的图片段落！！', type: 'warning', duration: 1500})
        return
      }
      var typeArr = ['screen', 'width']
      var deltype = type === typeArr[0] ? typeArr[1] : typeArr[0]
      selected.classList.remove('yd-full' + deltype)
      selected.classList.toggle('yd-full' + type)
      img.classList.remove('full-' + deltype)
      img.classList.toggle('full-' + type)

      toolbarState.checkParagraphCommandState(this.$el, selected)
      this.$store.commit('updateHasBeenSaved', false)
    },
    textSubtitle (param) {
      if (param === this.tsize) {
        this.tsize = 0
      } else {
        this.tsize = param
      }
      this.basic('customize', `yd-textSubtitle--${param}`)
    },
    customize (selected, type) {
      if (!/yd-textSubtitle/.test(type)) this.tsize = 0
      mutexclass(selected, type, mutexlist)
      /* var isImgTitle = selected.classList.contains('yd-imagetitle')
      var imgTitleLeftClass = selected.childNodes[0].classList
      if (isImgTitle) {
        selected.innerHTML = `<span class="yd-imagetitle--left">${selected.innerHTML}</span>`
      } else if (imgTitleLeftClass && imgTitleLeftClass.contains('yd-imagetitle--left')) {
        let innerHTML = selected.childNodes[0].innerHTML
        selected.innerHTML = innerHTML
      } */
      toolbarState.checkParagraphCommandState(this.$el, selected)
      this.$store.commit('updateHasBeenSaved', false)
    },
    code (selected, type) {
      var target = event.currentTarget
      selected.classList.toggle(`yd-${type}`)
      if (selected.classList.contains(`yd-${type}`)) {
        selected.innerHTML = selected.innerHTML.replace(/<br>/g, '\n')
      } else {
        selected.innerHTML = selected.innerHTML.replace(/\n/g, '<br>')
      }

      toolbarState.checkParagraphCommandState(this.$el, selected)
      this.$store.commit('updateHasBeenSaved', false)
    },
    beforeMerge (type) {
      this.$confirm('确定要合并多个选中段落吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnPressEscape: false,
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        this.mergeParagraphs(type)
      })
    },
    mergeParagraphs (type) {
      var multiSelects = this.$store.state.multiSelects
      if (!multiSelects) return
      var len = multiSelects.length
      var resultHtml = []
      var counts = 0
      for (var i = 0; i < len; i++) {
        var item = multiSelects[i]
        resultHtml.push(item.querySelector('.section').innerHTML)
        if (i !== 0) {
          var index = this.getParagraphIndex(item)
          this.$store.state.paragraphs.splice(index - counts, 1)
          counts++
        }
      }
      var baseParagraph = multiSelects[0]
      var separate = type ? '<br>' : ''
      baseParagraph.querySelector('.section').innerHTML = resultHtml.join(separate)

      this.hideToolbar()
      this.$store.commit('updateHasBeenSaved', false)
    },
    beforeDel (selected) {
      this.$confirm('确定要删除选中段落吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnPressEscape: false,
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        this.delParagraph(selected)
      })
    },
    delParagraph (selected) {
      var len = selected.length
      var index
      if (len) {
        var counts = 0
        for (var i = 0; i < len; i++) {
          var item = selected[i]
          index = this.getParagraphIndex(item)
          this.$store.state.paragraphs.splice(index - counts, 1)
          counts++
        }
      } else {
        index = this.getParagraphIndex(selected.parentNode)
        this.$store.state.paragraphs.splice(index, 1)
      }

      this.hideToolbar()
      this.$store.commit('updateHasBeenSaved', false)
    },
    copyToClipboard () {
      var multiSelects = this.$store.state.multiSelects
      var contentArr = []
      for (var i = 0; i < multiSelects.length; i++) {
        contentArr.push(multiSelects[i].textContent)
      }
      this.message = contentArr.join('\n')
      this.$copyText(this.message).then(e => {
        this.$message({message: '所选内容已复制到剪切板', type: 'success', duration: 800})
      }, function (e) {
        this.$message({message: '所在浏览器不支持该功能！', type: 'error', duration: 800})
      })
    },
    newParagraph (selected, type) {
      if (type === 'img') {
        this.newUploadImageDialog()
      } else if (type === 'copyright') {
        this.$confirm('新建版权段落会清空当前章节内容，确定新建吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnPressEscape: false,
          closeOnClickModal: false,
          type: 'warning'
        }).then(() => {
          this.newCopyrightParagraph()
        })
      } else {
        let content
        switch (type) {
          case 'separate':
            content = newSeparateParagraphConfig
            break
          default:
            content = newParagraphConfig
            break
        }
        selected = selected.classList.contains('section') ? selected.parentNode : selected
        var index = this.getParagraphIndex(selected)
        this.$store.state.paragraphs.splice(index + 1, 0, {content: content})
        this.$store.commit('updateHasBeenSaved', false)
        if (type !== 'text') return
        if (!this.$store.state.mode) this.switch.$el.click()
        this.$nextTick(function () {
          var paragraphs = this.el.querySelectorAll('.section-wrap')
          paragraphs[index + 1].click()
        })
      }
      this.npvisible = false
    },
    newCopyrightParagraph () {
      let newCopyrightParagraphs = copyrightParagraphsConfig.slice(0)
      this.$store.commit('updateParagraphs', newCopyrightParagraphs)

      this.hideToolbar()
      this.$store.commit('updateHasBeenSaved', false)
    },
    newUploadImageDialog () {
      Cache.getImageUploadToken(response => {
        this.action = '//nos.netease.com/' + response.token.bucket
        this.uploadParam.Object = response.token.key
        this.uploadParam['x-nos-token'] = response.token.token
        this.uploadParam['Bucket'] = response.token.bucket
        this.uploadParam['Expires'] = response.token.expires
        this.$refs.imgUpload.open()
        this.fileList = []
      }, response => {
        console.log('erro')
      })
    },
    insertImgParagraph () {
      var selected = this.$store.state.selected
      var list = this.fileList
      if (list.length === 0) {
        this.$message({message: '还未上传图片！', type: 'warning', duration: 1500})
        return
      }
      var index = this.getParagraphIndex(selected)
      if (list[0].response) {
        this.$store.state.paragraphs.splice(index + 1, 0, {content: '<p class="section"><img class="paragraph-img" src="' + list[0].response.url + '"></p>'})
      }
      this.UploadVisible = false
      this.hideToolbar()
      this.$store.commit('updateHasBeenSaved', false)
      this.$refs.upload.clearFiles()
      this.$nextTick(function () {
        var paragraphs = this.el.querySelectorAll('.section-wrap')
        paragraphs[index + 1].click()
      })
    },
    onBeforeUpload (file) {
      var list = this.$refs.upload.uploadFiles
      if (this.fileList.length > 1) {
        this.$message({message: '只允许上传一张图片', type: 'warning', duration: 1500})
        return false
      }
      var size = (file.size / 1024).toFixed(3)
      if (size > 2048) {
        this.$message({message: '图片大小超过了2mb！', type: 'warning', duration: 1500})
        return false
      }
    },
    onRemoveFile (file, fileList) {
      this.fileList = fileList
    },
    onUploadChange (file, fileList) {
      this.fileList = fileList
    },
    warnSplit (selected) {
      if (!this.$store.state.hasBeenSaved) {
        this.$confirm('数据很可能已经发生了改动，请确定已经保存？', '提示', {
          confirmButtonText: '保存了，继续分割',
          cancelButtonText: '取消，先去保存',
          closeOnPressEscape: false,
          type: 'warning'
        }).then(() => {
          this.splitArticle(selected.parentNode)
          this.$store.commit('updateHasBeenSaved', true)
        }).catch(() => {})
      } else {
        this.splitArticle(selected.parentNode)
      }
    },
    splitArticle (selected) {
      Cache.splitArticle({
        'articleId': this.$store.state.routeId,
        'paragraphIndex': this.getParagraphIndex(selected)
      }, response => {
        this.$message({
          message: '分割成功',
          type: 'success',
          duration: 1500,
          onClose () {
            location.reload()
          }
        })
      }, response => {
        this.$message({message: '分割失败', type: 'warning', duration: 1500})
      })
    }
  }
}
</script>

<style scoped>
.pTbWrp {
  position: absolute;
  height: 30px;
  width:560px;
  padding-right: 5px;
  left: 38px;
  background-color: #e3e7ea;
  box-sizing: border-box;
  box-shadow: 0 0 5px 0px rgba(0, 0, 0, 0.5);
}
.pTbWrp.vertical {
  width: 28px;
  height: auto;
  left: 5px!important;
}
.contentWrapper button.active .fa,
.contentWrapper button.active .glyphicon {
  color: #2196f3;
}
.contentWrapper button {
  border-radius: 0;
  border: none;
  float: left;
  padding: 4px 7px;
  background: none;
  box-shadow: none;
  -webkit-box-shadow: none;
}
.contentWrapper button:hover {
  background: #d4d4d4;
}
.contentWrapper button.active {
  background: #d4d4d4;
  box-shadow: inset 0 3px 5px rgba(0,0,0,.125);
}
.contentWrapper .el-select {
  width: 80px;
}
.contentWrapper .el-select.fontFamily {
  width: 130px;
}
.contentWrapper .el-dropdown {
  width: 100%;
  height: 100%;
}
.contentWrapper .el-dropdown-menu {
  min-width: 0;
  margin-left: 50px;
}
</style>
