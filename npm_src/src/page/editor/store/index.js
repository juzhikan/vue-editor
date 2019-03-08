import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    ...window.PAGE_CONFIG.permission,
    count: 1,
    paragraphs: [],
    articleVersion: Number,
    articleLinks: null,
    formatBrush: {
      isActive: false,
      styleArray: []
    },
    isChapterEdited: false,
    mode: true,
    toolbarVisible: false,
    textModeVisible: true,
    paragraphModeVisible: false,
    isImgPrgrph: false,
    imgTextMode: false,
    loading: false,
    hasBeenSaved: true,
    isMultiple: false,
    isSeparate: false,
    multiSelects: null,
    multiArticles: [],
    selected: null,
    routeId: String
  },
  mutations: {
    updateParagraphs (state, value) {
      state.paragraphs = value
    },
    updateArticleVersion (state, value) {
      state.articleVersion = value
    },
    updateArticleLinks (state, value) {
      state.articleLinks = value
    },
    updateFormatBrush (state, value) {
      state.formatBrush.styleArray = value.styleArray
      state.formatBrush.isActive = value.isActive
    },
    updateMode (state, value) {
      state.mode = value
    },
    updateIsSeparate (state, value) {
      state.isSeparate = value
    },
    updateToolbarVisible (state, value) {
      state.toolbarVisible = value
    },
    updateTextModeVisible (state, value) {
      state.textModeVisible = value
    },
    updateParagraphModeVisible (state, value) {
      state.paragraphModeVisible = value
    },
    updateIsImgPrgrph (state, value) {
      state.isImgPrgrph = value
    },
    setImgTextMode (state, value) {
      state.imgTextMode = value
    },
    updateIsMultiple (state, value) {
      state.isMultiple = value
    },
    updateLoading (state, value) {
      state.loading = value
    },
    updateHasBeenSaved (state, value) {
      state.hasBeenSaved = value
    },
    updateMultiSelects (state, value) {
      state.multiSelects = value
    },
    addArticle (state, value) {
      state.multiArticles.push(value)
    },
    removeArticle (state, value) {
      var articles = state.multiArticles
      var index = 0
      for (; index < articles.length; index++) {
        if (articles[index] === value) break
      }
      state.multiArticles.splice(index, 1)
    },
    clearArticle (state) {
      state.multiArticles = []
    },
    updateSelected (state, value) {
      state.selected = value
    },
    updateRouteId (state, value) {
      state.routeId = value
    }
  }
})
