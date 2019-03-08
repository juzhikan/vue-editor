<template>
  <el-dialog v-model="visible" :title="title">
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item prop="text">
        <el-input type="textarea" :rows="4" v-model="form.text"></el-input>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="onSure">确定</el-button>
    </template>
  </el-dialog>
</template>
<script>
  export default {
    name: 'MessageBox',
    data () {
      return {
        form: {
          text: ''
        },
        rules: {
          text: []
        },
        visible: false,
        title: ''
      }
    },
    methods: {
      open (opts = {}, cb) {
        var {text = '', title = '', rules = []} = opts
        this.rules.text = rules
        this.title = title
        this.text = text
        this.visible = true
        this.$off()
        this.$once('sure', cb)
      },
      onSure () {
        this.$refs.form.validate(res => {
          if (res) {
            this.visible = false
            this.$emit('sure', this.form.text)
          }
        })
      }
    }
  }
</script>
