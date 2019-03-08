import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './components/app.vue'
import ElementUI from 'element-ui'

Vue.use(ElementUI)
Vue.use(VueResource)

Vue.http.interceptors.push((request, next) => {
  if (request.method === 'POST') {
    request.body[window.SITE_CONFIG.csrfName] = window.SITE_CONFIG.csrfToken
  }
  next()
})

Vue.http.options.emulateJSON = true

new Vue({
  el: '#app',
  template: '<App/>',
  components: {
    'App': App
  }
})
