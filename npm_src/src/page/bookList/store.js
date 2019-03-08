import Vue from 'vue'
import Vuex from 'vuex'
import Book from './struct/book'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    ...window.__initState,
    ...{
      activeId: null,
      snailDisabled: window.SITE_CONFIG.snailDisabled
    }
  },
  mutations: {
    updateBook ({list}, payload) {
      var isExist = false
      list.forEach((item, index) => {
        if (+item.id === +payload.id) {
          Object.assign(list[index], payload)
          isExist = true
          return false
        }
      })
      if (!isExist) {
        list.unshift(payload)
      }
    },
    deleteBook ({list}, payload) {
      list.forEach((item, index) => {
        if (+item.id === +payload.id) {
          list.splice(index, 1)
          return false
        }
      })
    },
    makeNeedEdit ({list}, payload) {
      list.forEach((item, index) => {
        if (+item.id === +payload.id) {
          item.editStatus = 1
        }
      })
    },
    updateFocus (state, id) {
      state.activeId = id
    },
    syncData ({list}, id) {
      list.forEach(item => {
        if (item.id === id) {
          item.publishStatus = 2
          return false
        }
      })
    }
  }
})

export default store

export function getBookInfoById (id) {
  var list = store.state.list
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      return new Book(list[i])
    }
  }
  return null
}
