<template>
  <div class="paragraphs" v-loading="loading"
      @scroll="onScroll">
    <vuedrag v-model="paragraphs" :effectAllowed="effectAllowed"
      ref="vuedrag"
      tagName="ul"
      class="j-dragWrp"
      @beforestart="beforestart"
      @end="end">
      <template scope="props">
        <li draggable="true" class="j-dragEle section-wrap"
          @dragstart="props.dragstart"
          @dragenter="props.dragenter"
          v-for="(paragraph, index) in paragraphs"
          v-html="paragraph.content"
          :id="'paragraph-' + index"
          @click="onclick"
          @focus="onFocus"
          @blur="onblur"
          @mouseup="checkToolbarState"
          @keydown="onKeydown"
          @keyup="onKeyup"
          @paste="onPaste"
          @copy="onCopy"
          @cut="onCopy"
          :key="paragraph.content">
        </li>
        <ttoolbar ref="ttoolbar" v-show="toolbarVisible && textModeVisible && !isSeparate"
          :style="'top:' + toolbarTop + 'px;'">
        </ttoolbar>
        <ptoolbar ref="ptoolbar" v-show="toolbarVisible && paragraphModeVisible"
          :style="'top:' + toolbarTop + 'px;'"
          :watch="isMultiple"
          :el="$el"
          :switch="$parent.$refs.switch">
        </ptoolbar>
      </template>
    </vuedrag>
  </div>
</template>

<script type="text/javascript">
import { mapState } from 'vuex'
import Range from './toolbar/Range'
import Ttoolbar from './toolbar/Ttoolbar'
import Ptoolbar from './toolbar/Ptoolbar'
import toolbarState from './toolbar/toolbarState'
import { formatStyle, addHistory, clearHistory, SyntaxChecking } from '@/util'
import vuedrag from './vuedraggable'

export default {
  data () {
    return {
      toolbarTop: 8,
      range: {},
      innerHTMLBefore: '',
      effectAllowed: true,
      copyNode: null
    }
  },
  mounted () {
    const vm = this

    window.onresize = () => {
      if (vm.$store.state.isMultiple) {
        vm.multiToolbarReTop()
        return
      }
      vm.toolbarReTop()
    }

    window.onbeforeunload = function () {
      if (!vm.$store.state.hasBeenSaved) return false
    }
  },
  updated () {
    this.syntaxChecking()
  },
  computed: mapState({
    paragraphs (state) {
      return state.paragraphs
    },
    toolbarVisible (state) {
      return state.toolbarVisible
    },
    textModeVisible (state) {
      return state.textModeVisible
    },
    paragraphModeVisible (state) {
      return state.paragraphModeVisible
    },
    isSeparate (state) {
      return state.isSeparate
    },
    isMultiple (state) {
      if (state.isMultiple) {
        this.multiToolbarReTop()
      } else {
        this.toolbarReTop()
      }
      return state.isMultiple
    },
    loading (state) {
      return state.loading
    }
  }),
  methods: {
    onScroll () {
      if (this.$store.state.isMultiple) this.multiToolbarReTop()
    },
    syntaxChecking () {
      this.$nextTick(function () {
        var paragraphs = this.$el.querySelectorAll('.section')
        var syntaxChecking = new SyntaxChecking()
        for (var i = 0; i < paragraphs.length; i++) {
          if (i !== 0) {
            syntaxChecking.add({
              dom: paragraphs[i],
              rules: [
                ['closeUp', '段落可能未正确闭合']
              ]
            })
          }
        }
        syntaxChecking.check()
      })
    },
    beforestart (event) {
      if (this.$store.state.toolbarVisible) {
        this.$message({
          message: '请先将工具栏面板关闭再执行拖动操作',
          type: 'warning',
          duration: 1500
        })
        this.effectAllowed = false
      } else {
        this.effectAllowed = true
      }
    },
    end () {
      this.$store.commit('updateHasBeenSaved', false)
    },
    onCopy () {
      var copyNode = event.target
      if (copyNode.nodeType === 1 && copyNode.tagName === 'IMG') {
        this.copyNode = copyNode
      } else {
        this.copyNode = null
      }
    },
    onPaste () {
      var selected = this.$store.state.selected.children[0]
      var text = event.clipboardData.getData('text/plain')
      event.preventDefault()
      var range = new Range()
      range.range.deleteContents()
      var textNode = document.createTextNode(text)
      if (this.copyNode) {
        var newCopyNode = document.createElement('img')
        newCopyNode.src = this.copyNode.src
        newCopyNode.className = this.copyNode.className
        newCopyNode.setAttribute('data-width', this.copyNode.getAttribute('data-width'))
        newCopyNode.setAttribute('data-height', this.copyNode.getAttribute('data-height'))
        range.range.insertNode(newCopyNode)
      } else {
        range.range.insertNode(textNode)
      }
      range.selection.addRange(range.range)
      this.$store.commit('updateHasBeenSaved', false)
    },
    onKeydown () {
      var selected = this.$store.state.selected
      this.innerHTMLBefore = event.currentTarget.innerHTML

      if (!event.shiftKey && !event.ctrlKey && event.keyCode === 13) {
        this.$message({message: '"Shift + 回车" 换行！', type: 'warning', duration: 1500})
        return
      }
      let editable = event.target.querySelector('.section')
      if (event.keyCode === 8) {
        if (editable.textContent === '') {
          event.preventDefault()
          this.$store.commit('updateHasBeenSaved', false)
          return
        }
      }

      /* if (editable.classList.contains('yd-imagetitle') && (editable.children[0].nodeType !== 1 || !editable.children[0].classList.contains('yd-imagetitle--left'))) {
        editable.innerHTML = `<span class="yd-imagetitle--left">${editable.innerHTML}</span>`
        return
      } */

      if (event.ctrlKey && event.keyCode === 65) {
        this.checkToolbarState(selected)
        return
      }
    },
    onKeyup () {
      var target = event.target.children[0]
      /* if (target.innerHTML === '<br>' && target.classList.contains('yd-imagetitle')) {
        target.classList.remove('yd-imagetitle')
      } */
      if (target.style) {
        target.removeAttribute('style')
      }
      if (event.shiftKey && event.keyCode === 83) {
        this.$parent.$refs['switch'].$el.click()
        return
      }

      if (event.ctrlKey && event.keyCode === 13) {
        this.innerHTMLBefore = '<p class="section">新建段落</p>'
        this.$refs.ptoolbar.newParagraph(event.currentTarget, 'text')
        this.$store.commit('updateHasBeenSaved', false)
        addHistory(this.innerHTMLBefore)
        return
      }

      if (event.currentTarget.innerHTML !== this.innerHTMLBefore) {
        this.$store.commit('updateHasBeenSaved', false)
        addHistory(this.innerHTMLBefore)
      }
    },
    onclick (event) {
      /* 编辑模式 格式刷 多选 特殊段落（空白段落） */
      var crtTgt = event.currentTarget
      let isSeparate = !!crtTgt.querySelector('.yd-separate')
      let isImgPrgrph = !!crtTgt.querySelector('.paragraph-img')
      var fmtBrs = this.$store.state.formatBrush
      if (fmtBrs.isActive) {
        if (isImgPrgrph) {
          this.$message({message: '图片段落，不能操作格式刷样式！', type: 'warning', duration: 1500})
        } else if (isSeparate) {
          this.$message({message: '空白段落，不能操作格式刷样式！', type: 'warning', duration: 1500})
        } else {
          formatStyle(crtTgt.querySelector('.section'), fmtBrs)
          this.$store.commit('updateHasBeenSaved', false)
        }
        return
      }

      if (event.shiftKey && !this.$store.state.mode) {
        if (isSeparate) {
          this.$message({message: '空白段落不支持多选！', type: 'warning', duration: 1500})
          return
        }

        crtTgt.classList.toggle('multi-selected')

        var multiSelected = this.$el.querySelectorAll('.multi-selected')
        this.$store.commit('updateMultiSelects', multiSelected)
        
        var selectArray = Array.prototype.slice.call(multiSelected, 0)

        var imgArray = selectArray.length ? selectArray.filter(function (item) {
          return !!item.querySelector('.paragraph-img')
        }) : []
        var textArray = selectArray.length ? selectArray.filter(function (item) {
          return !item.querySelector('.paragraph-img')
        }) : []

        if (imgArray.length && textArray.length) {
          // 图文混合多选模式
          this.$store.commit('setImgTextMode', true)
          this.$store.commit('updateIsImgPrgrph', true)
          /* this.$message({message: '图片段落不支持多选！', type: 'warning', duration: 1500})
          return */
        } else if (imgArray.length) {
          this.$store.commit('setImgTextMode', false)
          this.$store.commit('updateIsImgPrgrph', true)
        } else {
          this.$store.commit('setImgTextMode', false)
          this.$store.commit('updateIsImgPrgrph', false)
        }

        if (multiSelected.length) {
          this.$store.commit('updateIsMultiple', true)
          this.$store.commit('updateToolbarVisible', true)
        } else {
          this.$store.commit('updateIsMultiple', false)
          if (!this.$el.querySelector('.section-selected')) this.$store.commit('updateToolbarVisible', false)
        }
      } else {
        this.$store.commit('setImgTextMode', false)
        var contenteditable = this.getContenteditable(crtTgt)
        this.toolbarReTop(crtTgt)
        this.showToolbar(isImgPrgrph, isSeparate)

        if (this.$store.state.mode && !isSeparate) {
          crtTgt.setAttribute('contenteditable', true)
          crtTgt.focus()
        }

        this.clearMulitySelected()

        var selected = this.$el.querySelector('.section-selected')
        if (selected) {
          if (selected !== crtTgt) {
            selected.classList.remove('section-selected')
            selected.setAttribute('contenteditable', false)
            crtTgt.classList.add('section-selected')
            clearHistory()
          }
        } else {
          crtTgt.classList.add('section-selected')
          clearHistory()
        }
        this.$store.commit('updateSelected', crtTgt)
      }
    },
    getContenteditable (node) {
      var contenteditable = node.getAttribute('contenteditable')
      if (contenteditable === 'inherit' || contenteditable === true || contenteditable === 'true') return true
      return false
    },
    onFocus (event) {
      var crtTgt = event.currentTarget
      crtTgt.setAttribute('draggable', false)
    },
    onblur (event) {
      var crtTgt = event.currentTarget
      crtTgt.setAttribute('draggable', true)
    },
    showToolbar (isImgPrgrph, isSeparate) {
      this.$store.commit('updateIsImgPrgrph', isImgPrgrph)
      this.$store.commit('updateIsSeparate', isSeparate)
      this.$store.commit('updateToolbarVisible', true)
    },
    toolbarReTop (crtTgt) {
      if (!this.$el) return
      var selected = crtTgt !== undefined ? crtTgt : this.$store.state.selected
      if (!selected) return
      var prgrList = this.$refs.vuedrag.$el.querySelectorAll('li')
      var distance = 41
      for (var i = 0; i < prgrList.length; i++) {
        var item = prgrList[i]
        if (item === selected) {
          break
        } else {
          distance += (item.clientHeight + 38)
        }
      }
      this.toolbarTop = (distance - 33)
    },
    multiToolbarReTop () {
      if (!this.$el) return
      this.toolbarTop = this.$el.scrollTop + 80
    },
    checkToolbarState (event) {
      var fmtBrs = this.$store.state.formatBrush
      if (fmtBrs.isActive) return
      var vm = this
      var target = event.currentTarget || event
      setTimeout(function () {
        if (vm.$store.state.mode) {
          /* vm.range = new Range() */
          toolbarState.checkTextCommandStatus(vm.$refs.ttoolbar, target)
        } else {
          toolbarState.checkParagraphCommandState(vm.$refs.ptoolbar.$el, target.querySelector('.section'), size => {
            vm.$refs.ptoolbar.tsize = size
          })
        }
      }, 16)
    },
    clearMulitySelected () {
      this.$store.commit('setImgTextMode', false)
      var selecteds = this.$store.state.multiSelects
      if (!selecteds || !selecteds.length) return
      for (var i = 0; i < selecteds.length; i++) {
        selecteds[i].classList.remove('multi-selected')
      }
      this.$store.commit('updateIsMultiple', false)
    }
  },
  components: { Ttoolbar, Ptoolbar, vuedrag }
}
</script>

<style type="text/css">
.paragraphs {
  position: relative;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  overflow-y: scroll;
}

.paragraphs ul {
  padding: 40px 20px 0 38px;
  box-sizing: border-box;
  position: relative;
}

.section-wrap {
  background-color: #f1f8ff;
  border: 1px solid #bedfff;
  border-radius: 3px;
  padding: 10px 5px;
  margin-bottom: 36px;
}

.section-wrap.section-selected {
  border: 1px double #f75304;
}

.section-wrap.multi-selected {
  border: 1px double #0ab50a;
}

.section-wrap h1,
.section-wrap h2,
.section-wrap h3,
.section-wrap h4,
.section-wrap h5 {
  font-weight: normal;
  margin-top: 0;
}

.section-wrap h1.j-chapter,
.section-wrap h2.j-chapter,
.section-wrap h3.j-chapter {
  border-bottom: 1px dotted rgba(0, 0, 0, 0);
  font-size: 1.6em;
  padding-top: 1.2em;
  margin-bottom: 2.6em;
  line-height: 1.3;
}

.section-wrap img{
  max-width: 450px;
}

.section-wrap p{
  margin: 0;
  text-indent: 2em;
  line-height: 1.5;
  text-align: justify;
  text-justify: inter-ideograph;
  clear: none;
  word-wrap: break-word;
  word-break: break-all;
}

.section-wrap a {
  text-decoration: underline;
  color: #151515;
}

.section-wrap a:visited {
  color: #000;
}

.section-wrap a.highlight {
  color: black;
  text-shadow: 0px 1px 1px #fff;
}

.section-wrap .mark {
  position: relative;
  width: 24px;
  height: 20px;
  display: inline-block;
  margin-left: -4px;
  margin-right: -4px;
  background: url(data:image/png;base64,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) center center no-repeat;
  background-size: 24px 20px;
}

.section-wrap .section {
  box-sizing: border-box;
}
.section-wrap i {
  font-style: italic;
}
.section-wrap b {
  font-weight: 700;
}
.section-wrap .yd-font-hksong {
  font-family: "hkstw5";
}
.section-wrap .yd-font-hkkai {
  font-family: "hkktw5";
}
.section-wrap .yd-font-hkyuan {
  font-family: "hkytw3";
}
.section-wrap .yd-font-hkpop {
  font-family: "hkpop1w5";
}
.section-wrap .yd-font-hkgirl {
  font-family: "hksnwzw5";
}
.section-wrap .yd-font-hkbaby {
  font-family: "hkwwtw5";
}
.section-wrap .yd-font-hkhei {
  font-family: "hkhtw3";
}
.section-wrap .yd-paragraph-f {
  text-align: left;
}
.section-wrap .yd-paragraph-c {
  text-align: center;
}
.section-wrap .yd-paragraph-j {
  text-align: justify;
}
.section-wrap .yd-paragraph-r {
  text-align: right;
}
.section-wrap .yd-textindent {
  text-indent: 2em;
}
.section-wrap .yd-martop-5 {
  margin-top: 0.5em;
}
.section-wrap .yd-martop-10 {
  margin-top: 1em;
}
.section-wrap .yd-martop-15 {
  margin-top: 1.5em;
}
.section-wrap .yd-martop-20 {
  margin-top: 2em;
}
.section-wrap .yd-martop-25 {
  margin-top: 2.5em;
}
.section-wrap .yd-marbom-5 {
  margin-bottom: 0.5em;
}
.section-wrap .yd-marbom-10 {
  margin-bottom: 1em;
}
.section-wrap .yd-marbom-15 {
  margin-bottom: 1.5em;
}
.section-wrap .yd-marbom-20 {
  margin-bottom: 1.8em;
}
.section-wrap .yd-marbom-25 {
  margin-bottom: 2em;
}
.section-wrap .yd-lineheight-1 {
  line-height: 1.5;
}
.section-wrap .yd-lineheight-2 {
  line-height: 1.7;
}
.section-wrap .yd-lineheight-3 {
  line-height: 1.9;
}
.section-wrap .yd-lineheight-4 {
  line-height: 2;
}
.section-wrap .yd-lineheight-5 {
  line-height: 2.1;
}
.section-wrap .underline {
  text-decoration: underline;
}
.section-wrap .j-chapter {
  text-indent: 0;
}
.section-wrap .bold {
  font-weight: bold;
}
.section-wrap .italic {
  font-style: italic;
}
.section-wrap .sub {
  vertical-align: sub;
  font-size: 12px;
}
.section-wrap .sup {
  vertical-align: super;
  font-size: 12px;
}
/* .section-wrap .yd-fsize-1 {
  font-size: 1em;
}
.section-wrap .yd-fsize-2 {
  font-size: 1.25em;
}
.section-wrap .yd-fsize-3 {
  font-size: 1.416666666666667em;
}
.section-wrap .yd-fsize-4 {
  font-size: 1.583333333333333em;
}
.section-wrap .yd-fsize-5 {
  font-size: 1.75em;
}
.section-wrap .yd-fsize-6 {
  font-size: 1.916666666666667em;
}
.section-wrap .yd-fsize-7 {
  font-size: 2.083333333333333em;
} */

.section-wrap .yd-fsize-15 {
  font-size: 15px;
}
.section-wrap .yd-fsize-17 {
  font-size: 17px;
}
.section-wrap .yd-fsize-19 {
  font-size: 19px;
}
.section-wrap .yd-fsize-21 {
  font-size: 21px;
}
.section-wrap .yd-fsize-23 {
  font-size: 23px;
}
.section-wrap .yd-fsize-25 {
  font-size: 25px;
}

.section-wrap .paragraph-img--internal {
  display: inline;
  margin: 0;
  max-height: 15px;
  vertical-align: text-bottom;
  top: 0;
}

/* 样式向下兼容 */
.section-wrap .yd-fsize-normal {
  font-size: 1em;
}
.section-wrap .yd-fsize-middle {
  font-size: 1.5em;
}
.section-wrap .yd-fsize-big {
  font-size: 2em;
}
/* 样式向下兼容 */

.section-wrap .yd-copyright {
  line-height: 2;
  text-align: left;
  text-indent: 0;
  margin-bottom: 0;
}
.section-wrap .yd-recommendlg {
  margin-left: 2em;
  text-align: left;
  text-indent: 0em!important;
  font-family: 'Heiti SC' !important;
}
.section-wrap .yd-recommendperson {
  text-align: right;
}
.section-wrap .yd-quote {
  margin-left: 2em;
  text-indent: 0;
  font-family: 'Heiti SC' !important;
}

/* 20180103新增样式 */
.section-wrap .yd-separate {
  background-color: #a8a8a8;
}
.section-wrap .yd-poetry {
  line-height: 1!important;
  font-family: Serif!important;
}
.section-wrap .yd-imagetitle span.yd-imagetitle--left {
  text-align: left;
  line-height: 1;
  display: inline-block;
}
.section-wrap .yd-textSubtitle--1 {
  font-weight: bold;
  font-size: 2em;
}
.section-wrap .yd-textSubtitle--2 {
  font-weight: bold;
  font-size: 1.5em;
}
.section-wrap .yd-textSubtitle--3 {
  font-weight: bold;
  font-size: 1em;
}
.section-wrap .yd-box {
  display: block;
  padding: 9.5px;
  margin: 0 0 10px;
  color: #333;
  word-break: break-all;
  word-wrap: break-word;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-indent: initial;
  white-space: pre-line;
  overflow: auto;
}

.section-wrap .yd-imagetitle {
  margin-top: 0;
  font-size: 14px;
  text-align: center;
  text-indent: 0em!important;
  font-family: 'Heiti SC' !important;
}
.section-wrap .yd-imagetitle::after {
  content: "图片注释段落";
  font-size: 12px;
  color: rgb(255, 0, 241);
}
.section-wrap .yd-code {
  display: block;
  padding: 9.5px;
  margin: 0 0 10px;
  font-size: 13px;
  line-height: 1.42857143;
  color: #333;
  word-break: break-all;
  word-wrap: break-word;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: Menlo,Monaco,Consolas,Courier New,monospace;
  text-indent: initial;
  white-space: pre;
  overflow: auto;
  max-width: 800px;
}
</style>
