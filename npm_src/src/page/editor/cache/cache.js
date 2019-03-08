import Vue from 'vue'

const cache = {
  getArticles (param, cb, errorcb) {
    Vue.http.get('/editor/getArticles.json' + param).then(response => {
      cb(response.body)
    }, response => {
      errorcb(response.body)
    })
  },
  getParagraphs (param, cb, errorcb) {
    Vue.http.get('/editor/getParagraphs.json' + param).then(response => {
      cb(response.body)
    }, response => {
      errorcb(response.body)
    })
  },
  saveParagraphs (data, cb, errorcb) {
    Vue.http.post('/editor/saveParagraphs.json', data).then(response => {
      cb(response.body)
    }, response => {
      errorcb(response.body)
    })
  },
  saveArticle (data, cb, errorcb) {
    Vue.http.post('/editor/saveArticle.json', data).then(response => {
      cb(response.body)
    }, response => {
      errorcb(response.body)
    })
  },
  delArticle (data, cb, errorcb) {
    Vue.http.post('/editor/delArticle.json', data).then(response => {
      cb(response.body)
    }, response => {
      errorcb(response.body)
    })
  },
  moveArticle (data, cb, errorcb) {
    Vue.http.post('/editor/moveArticle.json', data).then(response => {
      cb(response.body)
    }, response => {
      errorcb(response.body)
    })
  },
  getImageUploadToken (cb, errorcb) {
    Vue.http.get('/upload/getImageUploadToken.json').then(response => {
      cb(response.body)
    }, response => {
      errorcb(response.body)
    })
  },
  splitArticle (data, cb, errorcb) {
    Vue.http.post('/editor/splitArticle.json', data).then(response => {
      cb(response.body)
    }, response => {
      errorcb(response.body)
    })
  },
  startEditing (data, cb, errorcb) {
    Vue.http.post('/book/startEditing.json', data).then(response => {
      cb(response.body)
    }, response => {
      errorcb(response.body)
    })
  },
  finishEditing (data, cb, errorcb) {
    Vue.http.post('/book/finishEditing.json', data).then(response => {
      cb(response.body)
    }, response => {
      errorcb(response.body)
    })
  }
}

export default cache
