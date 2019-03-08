import VueRouter from 'vue-router'
import Paragraphs from './components/Paragraphs.vue'

const router = new VueRouter({
  routes: [
    { path: '/:id', component: Paragraphs }
  ]
})

export default router
