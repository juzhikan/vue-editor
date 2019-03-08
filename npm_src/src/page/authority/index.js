import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import routes from './router/routes'
import App from './App.vue'
import ElementUI from 'element-ui'
import '@/css/common.css'

Vue.use(VueRouter)
Vue.use(ElementUI)
Vue.use(VueResource)
Vue.http.options.emulateJSON = true

Vue.http.interceptors.push((request, next) => {
  if (request.method === 'POST') {
    request.body[window.SITE_CONFIG.csrfName] = window.SITE_CONFIG.csrfToken
  }
  next()
})

const router = new VueRouter({
  linkActiveClass: 'router-link-Active',
  routes
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
