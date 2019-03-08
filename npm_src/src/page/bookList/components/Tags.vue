<template>
  <div>
    <el-tag v-for="tag in tags" :key="tag" :closable="true" @close="deleteTag(tag)">{{tag}}</el-tag>
    <el-button v-if="!editable" @click="onAdd" size="small">添加</el-button>
    <el-input v-else v-model="text" @blur="onBlur" size="mini"></el-input>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        editable: false,
        text: '',
        tags: []
      }
    },
    props: {
      value: String
    },
    watch: {
      value: function (val) {
        if (val) {
          this.tags = this.value.split(',')
        } else {
          this.tags = []
        }
      }
    },
    methods: {
      onAdd: function () {
        this.editable = true
        this.text = ''
      },
      onBlur: function () {
        this.editable = false
        this.addTag(this.text)
        this.$emit('input', this.tags.join(','))
      },
      addTag: function (item) {
        if (item.trim().length === 0) {
          return
        }
        var exist = false
        this.tags.forEach(tag => {
          if (tag === item) {
            exist = true
            return false
          }
        })
        if (!exist) {
          this.tags.push(item)
        }
      },
      deleteTag: function (item) {
        this.tags.forEach((tag, index) => {
          if (tag === item) {
            this.tags.splice(index, 1)
            this.$emit('input', this.tags.join(','))
            return false
          }
        })
      }
    }
  }
</script>
<style scoped>
  .el-tag + .el-tag{
    margin-left: 10px;
  }
  .el-input{
    display: inline-block;
    width: 50px
  }
</style>
