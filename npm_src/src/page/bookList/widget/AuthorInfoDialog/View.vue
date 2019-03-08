<template>
  <el-dialog v-model="visible" title="作者信息">
    <el-form>
      <el-form-item label="姓名">
        {{author.name}}
      </el-form-item>
      <el-form-item label="角色">
        <span class="word" :key="item" v-for="item in author.roles">
              <el-tag>{{getValue('roles', item)}}</el-tag>
        </span>
      </el-form-item>
      <el-form-item label="外文名">
        {{author.otherName}}
      </el-form-item>
      <el-form-item label="国籍">
        {{author.nationality}}
      </el-form-item>
      <el-form-item label="出生年月">
        {{author.birthDate}}
      </el-form-item>
      <el-form-item label="已有显示名">
        {{author.aliasNames}}
      </el-form-item>
      <el-form-item label="简介">
        <div class="description">{{author.description}}</div>
      </el-form-item>
      <el-form-item label="关联书籍">
        <a :href="`/book/list.do?contributorId=${author.id}`" target="_blank">点击查看</a>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
  import Author from '@/common/struct/author'
  import {getValue} from '@/common/map'

  export default {
    name: 'AuthorInfoDialog',
    data () {
      return {
        visible: false,
        author: new Author()
      }
    },
    methods: {
      open (author = {}) {
        this.visible = true
        this.author = new Author(author)
      },
      getValue
    }
  }
</script>
<style scoped>
.word + .word{
  margin-left: 10px;
}
.description{
  max-height: 400px;
  overflow: auto;
}
</style>
