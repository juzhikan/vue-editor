<template>
  <el-button type="success" size="small" @click="formatBrush" title="格式刷" style="border-color: #dadada;background-color: #dadada;padding: 5px 9px;vertical-align: middle;">
    <span class="fa fa-paint-brush" aria-hidden="true"></span> 格式刷
  </el-button>
</template>

<script type="text/javascript">

export default {
  data () {
    return {
      temporaryBrush: {
        isActive: false,
        styleArray: []
      }
    }
  },
  methods: {
    formatBrush () {
      var state = this.$store.state
      var fmtBrs = state.formatBrush
      var selected = state.selected
      var target = event.currentTarget
      if (fmtBrs.isActive) {
        this.$store.commit('updateFormatBrush', {
          isActive: false,
          styleArray: []
        })
        target.classList.remove('active')
        document.body.classList.remove('active-brush')
        this.$message({message: '格式刷已经清空样式', type: 'success', duration: 1500})
        return
      }
      if (!selected) {
        this.$message({message: '请选择一个有效段落', type: 'warning', duration: 1500})
        return
      }
      var contentNode = selected.querySelector('.section')
      var style = contentNode.getAttribute('style')
      if (style) {
        this.temporaryBrush.styleArray.push({style: style})
        this.temporaryBrush.isActive = true
      }
      var childNode = contentNode.children[0]
      this.loopStyle(childNode, contentNode)
      if (this.temporaryBrush.isActive) {
        this.$store.commit('updateFormatBrush', this.temporaryBrush)
        this.temporaryBrush = {
          isActive: false,
          styleArray: []
        }
        state.isChapterEdited = true
        target.classList.add('active')
        document.body.classList.add('active-brush')
        this.$message({message: '格式刷已经填满样式', type: 'success', duration: 1500})
      } else {
        this.$message({message: '无可复制样式', type: 'warning', duration: 1500})
      }
    },
    loopStyle (cNode, pNode) {
      if (!cNode) return
      var cNodeText = cNode.textContent.replace(/\s/g, '')
      var pNodeText = pNode.textContent.replace(/\s/g, '')
      if (cNode && cNodeText === pNodeText) {
        if (/(bold|yd-font-|yd-fsize-|underline|italic)/ig.test(cNode.className)) {
          this.temporaryBrush.styleArray.unshift({className: cNode.className})
          this.temporaryBrush.isActive = true
        }
        if (/font-color/ig.test(cNode.className)) {
          this.temporaryBrush.styleArray.unshift({colorClass: cNode.className, color: cNode.getAttribute('style')})
          this.temporaryBrush.isActive = true
        }
        this.loopStyle(cNode.children[0], pNode)
      }
    }
  }
}
</script>
