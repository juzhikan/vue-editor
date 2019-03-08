import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './App.vue'
import ElementUI from 'element-ui'
import '@/css/common.css'

Vue.use(ElementUI)
Vue.use(VueResource)
Vue.http.options.emulateJSON = true

Vue.http.interceptors.push((request, next) => {
  if (request.method === 'POST') {
    request.body[window.SITE_CONFIG.csrfName] = window.SITE_CONFIG.csrfToken
  }
  next()
})

new Vue({
  render: h => h(App)
}).$mount('#app')
