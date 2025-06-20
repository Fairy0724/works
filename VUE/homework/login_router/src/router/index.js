// 229970615 李松蔓
import { createRouter, createWebHashHistory } from "vue-router";
import Home from '../views/Home.vue';
import About from '../views/About.vue';
import Login from '../views/Login.vue';
import { useUserStore } from '../stores/user';
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }

];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

// 全局前置守卫：判断登录状态
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  // 排除登录页，其他页面需登录
  if (to.name !== 'Login' && !userStore.isLoggedIn) {
    next({ name: 'Login' })
  } else {
    next()
  }
})
export default router;