import RegisterView from '../views/RegisterView.vue'
import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue'
import ProfileView from '../views/ProfileView.vue'
import MovieDetail from '../views/MovieDetail.vue'
import { createRouter, createWebHistory } from 'vue-router'
const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: RegisterView },
  { path: '/profile', name: 'profile', component: ProfileView },
  { path: '/movie/:id', name: 'movieDetail', component: MovieDetail }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes

})

//导出路由
export default router