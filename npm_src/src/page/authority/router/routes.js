import User from '../components/User.vue'
import Role from '../components/Role.vue'

const routes = [{
  path: '/',
  redirect: '/user'
}, {
  path: '/user',
  component: User
}, {
  path: '/role',
  component: Role
}]

export default routes
