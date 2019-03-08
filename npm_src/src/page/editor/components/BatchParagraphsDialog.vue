<template>
  <el-dialog title="批量段落" v-model="visible">
    <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 999}" placeholder="请按顺序逐条输入段落内容，单个段落内不能存在换行，不同段落以换行区分" v-model="inputValue"></el-input>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="exchange">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { shadowCopy } from '@/util'
export default {
  props: ['value'],
  data () {
    return {
      visible: false,
      inputValue: ''
    }
  },
  watch: {
    value (val) {
      this.visible = val
    },
    visible (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    exchange () {
      if (/^\s*$/.test(this.inputValue)) {
        this.$message({
          message: '输入内容为空',
          type: 'warning',
          duration: 1500
        })
        return
      } else {
        var arr = this.inputValue.split('\n')
        var paragraphs = shadowCopy(this.$store.state.paragraphs)

        var selected = this.$store.state.selected
        var index = parseInt(selected.id.replace('paragraph-', ''), 10)
        for (var i = 0; i < arr.length; i++) {
          var textContent = arr[i] ? arr[i] : '<br>'
          paragraphs.splice(index + 1, 0, {content: '<p class="section">' + textContent + '</p>'})
          index++
        }

        this.$store.commit('updateParagraphs', paragraphs)
        this.$store.commit('updateHasBeenSaved', false)

        this.visible = false
        this.inputValue = ''
      }
    }
  }
}
</script>
