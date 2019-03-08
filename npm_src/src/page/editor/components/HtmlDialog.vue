<template>
  <el-dialog title="批量HTML替换" v-model="visible">
    <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 999}" placeholder="请输入HTML" v-model="inputValue"></el-input>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="exchange">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
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
      this.$emit('visible-change', val)
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
        var arr = this.inputValue.match(/<(p|h[1-6]) class="[\s\S]+?>[\s\S]+?<\/(p|h[1-6])>/g)
        var newParagraphs = []

        for (var i = 0; i < arr.length; i++) {
          newParagraphs.push({content: arr[i]})
        }

        this.$store.commit('updateParagraphs', newParagraphs)

        this.$store.commit('updateHasBeenSaved', false)

        this.visible = false
        this.inputValue = ''
      }
    }
  }
}
</script>
