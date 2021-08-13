import Login from './component/Login.vue';
import ListEntry from './component/ListEntry.vue';

const routes = [
  { path: '/entry', component: ListEntry },
  { path: '/login', component: Login },
  { path: '*', redirect: '/entry' }
]

export default routes