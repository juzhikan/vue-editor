import Vue from 'vue'

const cache = {
  saveUser (data, cb, errorcb) {
    Vue.http.post('/authority/saveUser.json', data).then(response => {
      cb(response.body)
    }, response => {
      errorcb(response.body)
    })
  },
  saveRole (data, cb, errorcb) {
    Vue.http.post('/authority/saveRole.json', data).then(response => {
      cb(response.body)
    }, response => {
      errorcb(response.body)
    })
  },
  delRole (data, cb, errorcb) {
    Vue.http.post('/authority/delRole.json', data).then(response => {
      cb(response.body)
    }, response => {
      errorcb(response.body)
    })
  }
}

export default cache
