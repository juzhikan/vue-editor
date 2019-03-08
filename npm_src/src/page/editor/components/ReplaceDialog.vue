<template>
  <el-dialog title="批量替换" v-model="visible" custom-class="replace-dialog">
    <div class="flex-box">
      <span>查找内容：</span><el-input size="small" placeholder="请输入查找内容" v-model="findValue"></el-input>
    </div>
    <div class="flex-box" style="margin-top: 15px;">
      <span>替换为：</span><el-input size="small" placeholder="请输入替换内容" v-model="replaceValue"></el-input>
    </div>
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
      findValue: '',
      replaceValue: ''
    }
  },
  watch: {
    value (val) {
      this.visible = val
      if (!val) {
        this.findValue = ''
        this.replaceValue = ''
      }
    },
    visible (val) {
      this.$emit('visible-change', val)
    }
  },
  methods: {
    exchange () {
      if (/^\s*$/.test(this.findValue) || this.findValue === '') {
        this.$message({
          message: '输入内容为空',
          type: 'warning',
          duration: 1500
        })
        return
      } else {
        this.$emit('confirm', this.findValue, this.replaceValue)
      }
    }
  }
}
</script>
<style>
  .replace-dialog .flex-box {
    display: flex;
  }
  .replace-dialog .flex-box span {
    display: block;
    width: 80px;
    line-height: 30px;
  }
  .replace-dialog .el-input {
    flex: 1;
  }
</style>
