<template>
  <div>
    <el-dialog title="书籍预览" v-model="isShowDialog" :close-on-click-modal="false">
      <el-row :gutter="20">
        <el-col :span="6">
          <img class="cover" :src="book.coverImage" :alt="book.title" v-if="book.coverImage">
          <div v-else>无图片</div>
        </el-col>
        <el-col :span="18">
          <dl class="dl-horizontal dl farther">
            <dt>书名：</dt>
            <dd>{{book.title}}</dd>
            <dt>作者：</dt>
            <dd>
              <span v-for="item in book.authors">{{item.name}}<br /></span>
            </dd>
            <dt>译者：</dt>
            <dd>
              <span v-for="item in book.translators">{{item.name}}<br /></span>
            </dd>
            <dt>ISBN：</dt>
            <dd>{{book.isbn}}</dd>
            <dt>书籍语言</dt>
            <dd>{{language}}</dd>
            <dt>出版社：</dt>
            <dd>{{book.publisher}}</dd>
            <dt>出版时间：</dt>
            <dd>{{book.publishTime|time}}</dd>
          </dl>
        </el-col>
      </el-row>
      <dl class="dl-horizontal dl farther">
        <dt>书籍介绍：</dt>
        <dd><span v-html="_escape(book.description)"></span></dd>
        <dt>作者介绍：</dt>
        <dd>
          <template v-for="item in book.authors">
              <span v-html="_escape(item.description)"></span>
              <br />
          </template>
        </dd>
        <dt>译者简介：</dt>
        <dd>
            <template v-for="item in book.translators">
                <span v-html="_escape(item.description)"></span>
                <br />
            </template>
        </dd>
      </dl>

      <el-row>
        <el-col :span="8">
         <div class="catalog">
          <template v-for="(item, index) in articles">
            <div :class="{active: index == currentArticleIndex, ['level-' + item.level]: true, 'catalog-item': true}" :title="item.title" @click="changePage(index)">{{item.title}}</div>
          </template>
          </div>
        </el-col>
        <el-col :span="16">
          <Preview :key="previewHtml" :content="previewHtml" :onEnd="onEnd"></Preview>
        </el-col>
      </el-row>

    </el-dialog>
  </div>
</template>
<script>
  import Book from '../struct/book'
  import Preview from '@/common/components/Preview'
  import {genTime} from '../util'
  import {getValue} from '@/common/map'
  import {getBookInfoById} from '../store'

  export default {
    name: 'BookPreviewDialog',
    props: ['value', 'id'],
    data: function () {
      return {
        isShowDialog: this.value,
        book: this.id ? this.getBookData(this.id) : new Book(),
        articles: [],
        paras: [],
        currentArticleIndex: 0,
        previewKey: +new Date()
      }
    },
    mounted: function () {
      if (this.id) {
        this.init(this.id)
      }
    },
    methods: {
      init: async function (id) {
        this.articles = await this.getArticles(id)
        if (this.articles.length > 0) {
          this.paras = await this.getPara(this.articles[0].id)
        }
      },
      changePage: async function (index) {
        this.currentArticleIndex = index
        this.paras = []
        this._refreshPreview()
        this.paras = await this.getPara(this.articles[this.currentArticleIndex].id)
        this._refreshPreview()
      },
      getBookData: function (id) {
        return getBookInfoById(id)
      },
      getArticles: async function (id) {
        var res = await this.$http.get(`/editor/getArticles.json?bookId=${id}`)
        return res.body.articles
      },
      getPara: async function (id) {
        var res = await this.$http.get(`/editor/getParagraphs.json?articleId=${id}`)
        return res.body.paragraphs
      },
      onEnd: function ({action}) {
        if (action === 'prev' && this.currentArticleIndex > 0) {
          this.changePage(this.currentArticleIndex - 1)
        } else if (action === 'next' && this.currentArticleIndex < this.articles.length - 1) {
          this.changePage(this.currentArticleIndex + 1)
        } else {
          this.$message({
            showClose: true,
            message: '没有内容了',
            type: 'warning'
          })
        }
      },
      _refreshPreview: function () {
        this.previewKey = +new Date()
      },
      _escape: function (str) {
        if (str) {
          return str.replace(/[\n\r]/g, '<br>')
        } else {
          return str
        }
      }
    },
    watch: {
      value: function (val) {
        this.isShowDialog = val
      },
      isShowDialog: function (val) {
        this.$emit('input', val)
      }
    },
    computed: {
      previewHtml: function () {
        var res = ''
        this.paras.forEach((item) => {
          res += item.content
        })
        return res
      },
      language: function () {
        return getValue('languages', this.book.language)
      }
    },
    components: {
      Preview
    },
    filters: {
      time: function (val) {
        if (val === '') {
          return ''
        }
        return genTime(val)
      }
    }
  }
</script>
<style scoped>
  .dl.farther dd, .dl.farther dt{
    margin-top: 10px;
  }
  .dl dt{
    width: 100px;
    text-align: left;
  }
  .dl dd{
    margin-left: 100px;
  }
  .dl.farther:before{
    content: "";
    display: block;
    height: 1px;
  }
  .cover{
    display: block;
    width: 100%;
  }
  .catalog{
    height: 660px;
    overflow: auto;
  }
  .catalog-item{
    height: 25px;
    line-height: 25px;
    white-space: nowrap;
    cursor: pointer;
  }
  .catalog-item.active{
    cursor: default;
  }
  .catalog-item.active,
  .catalog-item:hover{
    background: #bedfff;
  }
  .level-0{
    padding-left: 10px;
    font-size: 16px;
    font-weight: bold;
  }
  .level-1{
    padding-left: 20px;
    font-size: 18px;
  }
  .level-2{
    padding-left: 30px;
    font-size: 16px;
  }
  .level-3{
    padding-left: 40px;
    font-size: 14px;
  }
</style>
