import Vue from 'vue'
import Editor from './Editor.vue'
import VueResource from 'vue-resource'
import store from './store'
import ElementUI from 'element-ui'
import '@/css/common.css'
import '@/css/editor.css'
import VueRouter from 'vue-router'
import router from './router'
import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)
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

var vm = new Vue({
  router,
  store,
  render: h => h(Editor)
}).$mount('#mount-app')

router.beforeEach((to, from, next) => {
  if (!store.state.hasBeenSaved) {
    vm.$confirm('系统检测到可能有改动尚未保存，确定要执行切换操作吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      store.commit('updateHasBeenSaved', true)
      next()
    }).catch(() => {})
  } else {
    next()
  }
})
