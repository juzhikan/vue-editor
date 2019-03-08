<template>
  <div class="catalog">
    <p :title="bookTitle" 
      @contextmenu.prevent="$refs.bookCtxMenu.open()" 
      class="bookTitle">{{'《' + bookTitle + '》'}}
    </p>
    <ul ref="domUl">
      <draggable v-model="articles" @end="onDragEnd">
        <router-link v-for="(article, index) in articles"
        tag="li" :to="'/' + article.id"
        @contextmenu.native.prevent="beforeOpenCtxMenue(article, index)"
        @click.native="clickArticle(article, index)"
        :style="article.title === '' ? 'background-color: rgba(240, 104, 110, 0.3);' : ''"
        :index="index"
        :title="article.title"
        :id="'atc-' + article.id"
        :key="'atc-' + article.title"
        :class="{'multi-selected': article.isMultiple}">
          <div :class="'level-' + article.level">
            <el-tooltip v-if="article.markers && article.markers.length" :content="message(article.markers)" placement="top">
              <span class="textContent">
                <i class="el-icon-information" style="color: #F7BA2A;vertical-align: text-bottom;font-size: 15px;"></i> {{article.title}}
              </span>
            </el-tooltip>
            <span class="textContent" v-else>{{article.title}}</span>
          </div>
        </router-link>
      </draggable>
    </ul>

    <context-menu ref="bookCtxMenu">
      <div><el-button disabled="disabled" type="text" style="padding: 4px;" @click="newCoverArticle">新建封面章节</el-button></div>
      <div><el-button disabled="disabled" type="text" style="padding: 4px;" @click="newCopyrightArticle">新建版权信息章节</el-button></div>
    </context-menu>

    <context-menu id="context-menu" ref="ctxMenu" @ctx-open="onCtxOpen">
      <div><el-button type="text" style="padding: 4px;" @click="newArticle">新建章节</el-button></div>
      <div><el-button type="text" style="padding: 4px;" v-show="isMultiple" @click="beforeShowMergeDialog">合并章节</el-button></div>
      <!-- <div><el-button type="text" style="padding: 4px;" @click="adjustArticle" v-show="!isMultiple">章节调整</el-button></div> -->
      <div><el-button type="text" style="padding: 4px;" v-show="!isMultiple" @click="setAsTextArticle">设为正文章节</el-button></div>
      <div><el-button type="text" style="padding: 4px;" @click="incrementArticleLevel">增加标题等级</el-button></div>
      <div><el-button type="text" style="padding: 4px;" @click="decrementArticleLevel">降低标题等级</el-button></div>
      <div><el-button type="text" style="padding: 4px;" @click="delArticle">删除章节</el-button></div>
    </context-menu>

    <el-dialog title="新建章节" v-model="newArticleVisible" custom-class="dialog-article">
      <el-form :model="form">
        <el-form-item label="章节名称">
          <el-input v-model="form.title" auto-complete="off" style="width: 480px;"></el-input>
        </el-form-item>
        <el-form-item label="章节等级">
          <el-select v-model="form.level" placeholder="请选择章节等级">
            <el-option label="1" value="1"></el-option>
            <el-option label="2" value="2"></el-option>
            <el-option label="3" value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newArticleVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveArticle">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="合并章节" v-model="mergeArticleVisible" custom-class="dialog-article">
      <div style="line-height:2;">选择需保留的章节标题：</div>
      <el-select v-model="retainAtcl">
        <el-option
          v-for="item in multiAtcls"
          :key="item.id"
          :label="item.title"
          :value="item.id">
        </el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="mergeArticleVisible = false">取 消</el-button>
        <el-button type="primary" @click="mergeArticles">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="章节调整" v-model="adjustArticleVisible" custom-class="dialog-article">
      <el-form :model="form">
        <el-form-item label="章节名称">
          <el-input v-model="form.title" auto-complete="off" style="width: 480px;"></el-input>
        </el-form-item>
        <el-form-item label="章节等级">
          <el-select v-model="form.level" placeholder="请选择章节等级">
            <el-option label="1" value="1"></el-option>
            <el-option label="2" value="2"></el-option>
            <el-option label="3" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="当前章节等级">
          <div>{{form.level}}</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="adjustArticleVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveArticle">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import Cache from '../cache/cache'
import draggable from 'vuedraggable'
import ContextMenu from 'vue-context-menu'
import { shadowCopy, throttle } from '@/util'

var bookTitle = window.PAGE_CONFIG.bookTitle

export default {
  data () {
    return {
      ctxArticle: {},
      ctxIndex: 0,
      ctxTarget: null,
      form: {},
      articles: [],
      newArticleVisible: false,
      mergeArticleVisible: false,
      adjustArticleVisible: false,
      querySwitch: true,
      bookTitle: bookTitle,
      clickId: undefined,
      retainAtcl: null,
      isMultiple: false,
      multiAtcls: []
    }
  },
  created: async function () {
    try {
      var res = await this.$http.get('/editor/getArticles.json?bookId=' + window.PAGE_CONFIG.bookId)
      this.articles = res.body.articles
      this.init()
    } catch (error) {
      this.messagePack('error', error)
    }
  },
  watch: {
    '$route': 'switchRoute'
  },
  methods: {
    init () {
      if (!this.articles.length) {
        this.newArticle()
      } else {
        var routeid = this.$route.params.id
        if (routeid) {
          this.switchRoute()
        } else {
          this.$router.push({ path: '/' + this.articles[0].id })
        }
      }
    },
    switchRoute: async function () {
      /* 更新视图前隐藏工具条 */
      this.$store.commit('updateToolbarVisible', false)

      /* 获取视图数据 */
      var id = this.$route.params.id
      this.$store.commit('updateLoading', true)
      var res = await this.$http.get('/editor/getParagraphs.json?articleId=' + id)
      this.$store.commit('updateLoading', false)

      /* 更新store */
      this.updateViewStore(res.data)
      if (this.$store.state.permission['SUPER_ADMIN']) this.getArticleLinks()
    },
    updateViewStore (data) {
      var paragraphs = data.paragraphs
      var routeId = this.$route.params.id
      
      var routeHistoryId = this.$store.state.routeId
      var routeChange = routeHistoryId !== routeId
      
      routeChange && this.$store.commit('updateRouteId', routeId)
      this.$store.commit('updateArticleVersion', data.version)
      
      if (routeChange) {
        this.updateStoreParagraphs([])
        throttle(this.updateStoreParagraphs, 20).call(this, paragraphs)
      } else {
        this.updateStoreParagraphs(paragraphs)
      }
    },
    updateStoreParagraphs (paragraphs) {
      this.$store.commit('updateParagraphs', paragraphs)
    },
    clickArticle (article, index) {
      var id = article.id
      if (event.shiftKey) {
        article.isMultiple = !article.isMultiple
        this.$set(this.articles, index, article)
        if (article.isMultiple) {
          this.$store.commit('addArticle', article)
        } else {
          this.$store.commit('removeArticle', article)
        }
        console.log(this.$store.state.multiArticles)
      } else {
        this.$store.commit('clearArticle')
        this.articles.forEach((article, i) => {
          if (article.isMultiple) {
            article.isMultiple = !article.isMultiple
            this.$set(this.articles, i, article)
          }
        })
      }
    },
    getArticleLinks: async function () {
      var res = await this.$http.get('/system/getArticleLinks.json?articleId=' + this.$route.params.id)
      var data = res.body
      try {
        if (data.code === 200) {
          this.$store.commit('updateArticleLinks', {
            link: data.link,
            histories: data.histories
          })
        } else {
          this.$message({
            message: data.message,
            type: 'warning',
            duration: 800
          })
        }
      } catch (e) {
        this.$message({
          message: '网络异常',
          type: 'warning',
          duration: 800
        })
      }
    },
    onDragEnd (event) {
      var newIndex = event.newIndex
      if (newIndex === event.oldIndex) return
      var afterArticleId = ''
      if (newIndex - 1 >= 0) afterArticleId = this.articles[newIndex - 1].id
      Cache.moveArticle({
        'articleId': this.articles[newIndex].id,
        'afterArticleId': afterArticleId
      }, () => {
        this.$message({
          message: '章节移动成功！',
          type: 'success',
          duration: 800
        })
      }, () => {
        this.$message({
          message: '章节移动失败！',
          type: 'warning',
          duration: 800
        })
      })
    },
    incrementArticleLevel () {
      this.handleLevel('decrementArticleLevel', function (level) {
        return level === 1 ? level : level - 1
      })
    },
    decrementArticleLevel () {
      this.handleLevel('incrementArticleLevel', function (level) {
        return level === 3 ? level : level + 1
      })
    },
    handleLevel: async function (ajaxName, action) {
      var isMultiple = this.ctxArticle.isMultiple
      var articlesArr = isMultiple ? this.$store.state.multiArticles : [ this.ctxArticle ]

      var articleIds = articlesArr.map(function (atcl) {
        return atcl.id
      })

      articleIds = articleIds.join(',')

      var res = await this.$http.post(`/editor/${ajaxName}.json`, {articleId: articleIds})
      var data = res.body
      if (data.code === 200) {
        this.updateLocalLevel(articlesArr, action)
      } else {
        var errormsg = data.code === 500 ? '增加标题等级超过最大等级！' : data.message
        this.$message({
          message: errormsg,
          type: 'error',
          duration: 800
        })
      }
    },
    updateLocalLevel (articlesArr, action) {
      articlesArr.forEach(function (article) {
        article.level = action(article.level)
      }, this)
    },
    beforeShowMergeDialog () {
      this.multiAtcls = this.$refs['domUl'].querySelectorAll('.multi-selected')
      if (this.multiAtcls.length >= 2) {
        this.retainAtcl = this.multiAtcls[0].id
        this.mergeArticleVisible = true
      } else {
        this.$message({
          message: '请选择至少两个章节',
          type: 'warning',
          duration: 800
        })
      }
    },
    mergeArticles: async function () {
      var data = []
      var retainAtclId = this.retainAtcl.replace('atc-', '')
      for (var i = 0; i < this.multiAtcls.length; i++) {
        var id = this.multiAtcls[i].id
        if (id !== this.retainAtcl) {
          data.push(id.replace('atc-', ''))
        }
      }
      data.unshift(retainAtclId)
      var articleIds = data.join(',')
      var res = await this.$http.post('/editor/mergerArticles.json', {articleIds: articleIds})
      if (res.body.code === 200) {
        var vm = this
        this.$message({
          message: '合并成功',
          type: 'success',
          duration: 800,
          onClose () {
            location.href = location.origin + '/editor/main.do' + location.search
          }
        })
      }
    },
    beforeOpenCtxMenue (article, index) {
      this.isMultiple = event.currentTarget.classList.contains('multi-selected')
      this.$refs.ctxMenu.open(event, article, index)
    },
    onCtxOpen (article, index) {
      var target = event.currentTarget
      this.ctxArticle = article
      this.ctxTarget = target
      this.ctxIndex = parseFloat(target.getAttribute('index'))
    },
    newArticle () {
      this.form = {
        bookId: window.PAGE_CONFIG.bookId,
        title: '',
        level: 1
      }
      this.newArticleVisible = true
    },
    adjustArticle () {
      var article = this.ctxArticle
      this.form = {
        id: article.id,
        bookId: window.PAGE_CONFIG.bookId,
        title: article.title,
        level: article.level
      }
      this.adjustArticleVisible = true
    },
    saveArticle () {
      if (!this.form.title) {
        this.$message({message: '章节标题不能为空！', type: 'warning', duration: 1500})
        return
      }
      var article = this.ctxArticle
      var form = this.form
      /* type为true 表示新建章节 */
      var type = form.id === undefined

      var data = {
        'article': JSON.stringify(form),
        'afterArticleId': type ? article.id : ''
      }
      var message = type ? '新建章节成功' : '章节调整成功'
      this.cSaveArticle(data, message, response => {
        this.updateArticle(response)
      })
    },
    newCoverArticle () {
      this.cSaveArticle({
        'article': JSON.stringify({
          bookId: window.PAGE_CONFIG.bookId,
          type: 'cover'
        })
      }, '新建封面章节成功', () => {
        this.updateCatalog()
      })
    },
    newCopyrightArticle () {
      this.cSaveArticle({
        'article': JSON.stringify({
          bookId: window.PAGE_CONFIG.bookId,
          type: 'copyright-page'
        })
      }, '新建版权信息章节成功', () => {
        this.updateCatalog()
      })
    },
    cSaveArticle: async function (data, message, onSuccess) {
      try {
        var res = await this.$http.post('/editor/saveArticle.json', data)
        res = res.body
        if (res.code !== 200) {
          this.messagePack('warning', res.message)
          return
        }
        this.messagePack('success', message, function () {
          onSuccess(res)
        })
      } catch (e) {
        this.messagePack('error', '网络请求出错')
      }
    },
    setAsTextArticle () {
      this.cResetArticleType({
        articleId: this.ctxArticle.id
      }, '设置成功')
    },
    cResetArticleType: async function (data, message) {
      try {
        var res = await this.$http.post('/editor/resetArticleTextTypeBeginAt.json', data)
        res = res.body
        if (res.code !== 200) {
          this.messagePack('warning', res.message)
          return
        }
        this.messagePack('success', message)
      } catch (e) {
        this.messagePack('error', '网络请求出错')
      }
    },
    updateCatalog: async function () {
      try {
        var res = await this.$http.get('/editor/getArticles.json?bookId=' + window.PAGE_CONFIG.bookId)
        res = res.body
        if (res.code === 200) {
          var articles = res.articles
          var articlesLocal = this.articles
          articles.forEach((ele, index) => {
            if (ele.id !== articlesLocal[index].id) {
              articlesLocal.splice(index, 0, ele)
            }
          })
        }
      } catch (error) {
        this.messagePack('error', error)
      }
    },
    messagePack (type, msg, onClose) {
      var fn = onClose || function () {}
      this.$message({
        message: msg,
        type: type,
        duration: 800,
        onClose: fn
      })
    },
    updateArticle (res) {
      var form = this.form
      var type = form.id === undefined
      var visible = type ? 'newArticleVisible' : 'adjustArticleVisible'
      this[visible] = false

      var index = this.ctxIndex
      var article = this.ctxArticle

      var version = type ? 0 : this.$store.state.currentVersion
      index = type ? index + 1 : index
      var delcount = type ? 0 : 1
      var markers = type ? [] : article.markers

      var id = type ? res.id : article.id
      this.articles.splice(index, delcount, {
        bookId: article.bookId,
        id: id,
        level: form.level,
        title: form.title,
        version: version,
        markers: markers
      })

      if (!type) {
        this.$nextTick(function () {
          var active = this.$refs['domUl'].querySelector('.router-link-active')
          if (!active) {
            var link = this.$refs['domUl'].querySelector('#atc-' + id)
            link.classList.add('router-link-active')
          }
        })
      }
    },
    delArticle () {
      this.$confirm('确定要删除所选章节吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.doDelArticle()
      }).catch(() => {})
    },
    doDelArticle () {
      var index = this.ctxIndex
      var article = this.ctxArticle
      var delCurrentArticle = article.id === Number(this.$store.state.routeId)

      Cache.delArticle({
        'articleId': article.id
      }, response => {
        this.$message({
          message: '章节删除成功',
          type: 'success',
          duration: 800,
          onClose: () => {
            /* 删除store里保存的article */
            if (article.isMultiple) this.$store.commit('removeArticle', article)

            /* 删除articles里的article */
            this.articles.splice(index, 1)
            console.log(1)
            this.$store.commit('updateHasBeenSaved', true)
            console.log(2)
            if (delCurrentArticle) {
              if (!this.articles[index]) index--
              if (index < 0) return
              this.$router.push({ path: '/' + this.articles[index].id })
            }
          }
        })
      }, response => {
        this.$message({message: '网络请求出错', type: 'warning'})
      })
    },
    message (markers) {
      var message = ''
      var seperate
      var length = markers.length
      length = length > 10 ? 10 : length
      for (var i = 0; i < length; i++) {
        seperate = i === 0 ? '' : '\n'
        message += seperate + markers[i].message
      }
      return message
    }
  },
  components: {
    draggable,
    ContextMenu
  }
}
</script>

<style type="text/css">
.catalog {
  flex: 1;
  padding-right: 10px;
  padding-top: 10px;
  padding-bottom: 40px;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: auto;
}
.catalog .bookTitle {
  font-size: 18px;
  padding: 10px 10px 10px 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
}

.catalog ul {
  margin: 0;
  padding: 0;
}

.catalog li {
  font-family: 'Source Sans Pro', 'Helvetica Neue', Arial, sans-serif;
  list-style: none;
  height: 28px;
  line-height: 28px;
  color: #7f8c8d;
  font-size: 16px;
  margin-bottom: 5px;
  box-sizing: border-box;
  cursor: pointer;
}

.catalog li .textContent {
  display: inline-block;
  width:100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.catalog li.router-link-active {
  color: #42b983;
}

.catalog li.multi-selected {
  border: 1px dashed #20a0ff;
}

.catalog li>div {
  height: 100%;
  box-sizing: border-box;
}

.catalog li>div.level-2 {
  padding-left: 10px;
  font-size: 14px;
}

.catalog li>div.level-3 {
  padding-left: 20px;
  font-size: 12px;
}

.catalog .ctx-menu {
  padding: 4px;
  min-width: 100px;
}

.catalog .ctx-menu span {
  letter-spacing: 2px;
}

.dialog-article {
  width: 600px!important;
}
</style>
