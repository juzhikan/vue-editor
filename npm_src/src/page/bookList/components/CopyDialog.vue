<template>
<el-dialog v-model="visible" title="复制理由（必填）">
  <el-input
    type="textarea"
    :rows="4"
    placeholder="请输入内容"
    v-model="text"
    ></el-input>
    <template slot="footer">
      <el-button @click="onCancel">取消</el-button>
      <el-button @click="onSure" type="primary">确定</el-button>
    </template>
</el-dialog>
</template>
<script>
  export default {
    data () {
      return {
        visible: this.value,
        text: ''
      }
    },
    methods: {
      onSure: function () {
        this.visible = false
      },
      onCancel: function () {
        this.visible = false
      }
    },
    props: ['value'],
    watch: {
      visible: function (val) {
        this.$emit('input', val)
      },
      value: function (val) {
        this.visible = val
      }
    }
  }
</script>
