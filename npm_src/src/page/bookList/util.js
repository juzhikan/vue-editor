import Vue from 'vue'
import {Message} from 'element-ui'
import store from './store'

export function genTime (value) {
  var date = new Date()
  date.setTime(value)
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

export function isInArray (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === val) {
      return true
    }
  }
  return false
}

export function syncData (id, type, force = 0) {
  return new Promise((resolve, reject) => {
    Vue.http.post('/book/publish.json', {
      id: id,
      channel: type,
      force: force
    }).then(res => {
      if (res.body.code === 200) {
        Message({
          showClose: true,
          message: '发布请求已发送',
          type: 'success'
        })
        store.commit('syncData', id)
        resolve()
      } else {
        Message({
          showClose: true,
          message: res.body.message,
          type: 'error'
        })
        reject()
      }
    }).catch(() => {
      Message({
        showClose: true,
        message: '发布请求发送失败',
        type: 'error'
      })
      reject()
    })
  })
}

export function stopSyncData (id, type) {
  return new Promise((resolve, reject) => {
    Vue.http.post('/book/stopPublish.json', {
      id: id,
      channel: type
    }).then(res => {
      if (res.body.code === 200) {
        Message({
          showClose: true,
          message: '请求已发送',
          type: 'success'
        })
        store.commit('syncData', id)
        resolve()
      } else {
        Message({
          showClose: true,
          message: res.body.message,
          type: 'error'
        })
        reject()
      }
    }).catch(() => {
      Message({
        showClose: true,
        message: '请求发送失败',
        type: 'error'
      })
      reject()
    })
  })
}
