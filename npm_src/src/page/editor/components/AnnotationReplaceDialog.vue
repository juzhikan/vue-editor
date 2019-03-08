<template>
  <el-dialog title="批量注释" v-model="visible" :custom-class="''">
    <div style="line-height:2;">注释标记形式：[X]，X为阿拉伯数字</div>
    <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 999}" placeholder="请按顺序逐条输入注释内容" v-model="quoteValue"></el-input>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="exchange('(\\[|【)', '(\\]|】)')">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: ['value'],
  data () {
    return {
      visible: false,
      quoteValue: ''
    }
  },
  watch: {
    value (val) {
      this.visible = val
    },
    visible (val) {
      this.$emit('visible-change', val)
    }
  },
  methods: {
    exchange (basicF, basicB) {
      if (/^\s*$/.test(this.quoteValue)) {
        this.$message({
          message: '输入内容为空',
          type: 'warning',
          duration: 1500
        })
        return
      } else {
        var basicRegGlobal = new RegExp(basicF + '[1-9]\\d*' + basicB, 'g')
        var indexList = this.quoteValue.match(basicRegGlobal)
        if (!indexList) {
          this.$message({
            message: '输入格式有误',
            type: 'warning',
            duration: 1500
          })
          return
        }

        var wrap = document.querySelector('.paragraphs')
        var section = wrap.querySelectorAll('.section')

        if (section) {
          this.restLabel('<span class="su[pb]">' + basicF, basicB + '<\\/span>', section)
          var comments = this.extractInput(indexList, basicF, basicB, basicRegGlobal)
          this.doExchange(section, indexList, basicF, basicB, comments)
        }
      }
    },
    restLabel (frontReg, backReg, section) {
      for (var i = 0; i < section.length; i++) {
        if (section[i].classList.contains('yd-code')) continue
        var content = section[i].innerHTML
        var regstr = frontReg + '[1-9]\\d*' + backReg
        var replaceRegSingle = new RegExp(regstr)
        var replaceRegGlobal = new RegExp(regstr, 'g')
        var match = content.match(replaceRegGlobal)
        if (match) {
          for (var j = 0; j < match.length; j++) {
            var key = this.extractNum(frontReg, backReg, match[j])
            content = content.replace(replaceRegSingle, `[${key}]`)
          }
          section[i].innerHTML = content
        }
      }
    },
    extractNum (frontReg, backReg, sourceStr) {
      var regstr = '(' + frontReg + '|' + backReg + ')'
      var replaceRegGlobal = new RegExp(regstr, 'g')
      return sourceStr.replace(replaceRegGlobal, '')
    },
    extractInput (indexList, basicF, basicB, basicRegGlobal) {
      var comments = {}
      for (var i = 0; i < indexList.length; i++) {
        var key = this.extractNum(basicF, basicB, indexList[i])
        var cloneCommentRegStr = basicF + key + basicB + '[\\s\\S]+?' + basicF + '[1-9]\\d*' + basicB
        if (i === indexList.length - 1) {
          cloneCommentRegStr = basicF + key + basicB + '[\\s\\S]+'
        }
        var cloneCommentReg = new RegExp(cloneCommentRegStr)
        var workblank = this.quoteValue.match(cloneCommentReg)[0]
        workblank = workblank.replace(/\n/g, '')
        comments[key] = workblank.replace(basicRegGlobal, '')
      }
      return comments
    },
    doExchange (section, indexList, basicF, basicB, comments) {
      for (var prop in comments) {
        for (var i = 0; i < section.length; i++) {
          if (section[i].classList.contains('yd-code')) continue
          var content = section[i].innerHTML
          var str = basicF + prop + basicB
          var reg = new RegExp(str)
          var result = content.match(reg)
          if (result) {
            var newcontent = content.replace(reg, '<span class="mark" title="' + comments[prop] + '"></span>')
            section[i].innerHTML = newcontent
          }
        }
      }

      this.$store.commit('updateHasBeenSaved', false)
      this.visible = false
      this.quoteValue = ''
    }
  }
}
</script>
