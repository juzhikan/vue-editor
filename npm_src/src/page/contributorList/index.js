import Vue from 'vue'
import App from './components/App.vue'
import ElementUI from 'element-ui'

Vue.use(ElementUI)

new Vue({
  el: '#app',
  template: '<App/>',
  components: {
    'App': App
  }
})
