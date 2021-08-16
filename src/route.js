import Login from './component/Login.vue';
import ListEntry from './component/ListEntry.vue';
import DetailEntry from './component/DetailEntry.vue';

const routes = [
  { path: '/entry/:id', component: DetailEntry },
  { path: '/entry', component: ListEntry },
  { path: '/login', component: Login },
  { path: '*', redirect: '/entry' }
]

export default routes