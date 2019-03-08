<template>
  <el-dialog :close-on-click-modal="false" title="作者合并" :visible.sync="visible">
    <div>
      <el-input
        type="textarea"
        :rows="6"
        @input="_onInput"
        :value="input"
        :placeholder="placeholder"
        ></el-input>
    </div>
    <div class="clearfix" style="margin-top: 10px">
      <div class="pull-right">
        <el-button @click="visible=false">取消</el-button>
        <el-button type="primary" @click="_merge">执行合并</el-button>
      </div>
      <div class="err-text" v-if="errText">{{errText}}</div>
    </div>
  </el-dialog>
</template>
<script>
import {get, post} from '@/common/http'
export default {
  data () {
    return {
      visible: false,
      input: '',
      errText: ''
    }
  },
  methods: {
    open () {
      this.visible = true
      this.input = ''
      this.errText = ''
    },

    _onInput (val) {
      this.input = val
      this._check()
    },

    _check () {
      let lines = this.input.split('\n')
      let reg = /^\s*(\d+)\s+(\d+(?:,\d+)*)\s*$/
      let resArr = []

      for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim()
        if (line) {
          if (reg.test(line)) {
            let arr = [RegExp.$1].concat(RegExp.$2.split(','))
            resArr.push(arr.join(','))
          } else {
            this.errText = `格式错误, 错误发生在第 ${i + 1} 行。正确格式示例： 123 456,678,980`
            return
          }
        }
      }

      if (resArr.length === 0) {
        this.errText = '内容不能为空'
        return
      }

      this.errText = ''

      return resArr
    },

    _merge () {
      let resArr = this._check()
      if (!resArr) {
        return
      }

      this.$confirm('被合并的作者ID将被删除，请谨慎操作！！！', '提示').then(() => {
        get('/contributor/mergeContributor.json', {
          repeatedContributors: resArr.join('|')
        }).then(data => {
          this.$message.success(data.message)
          this.visible = false
        }).catch(err => {
          this.$message.error(err.message)
        })
      }).catch(() => {})
    }
  },
  computed: {
    placeholder () {
      return `每行一条待合并作者信息，主作者ID放第一个，冗余作者ID以英文逗号间隔放在后面，例如：\n\n3345(主ID) 7315(冗余ID),9583(冗余ID)`
    }
  }
}
</script>
<style scoped>
  .err-text{
    color: red;
  }
</style>
