<script setup>
// 229970615 李松蔓
import { useUserStore } from './stores/user'

const userStore = useUserStore()
</script>

<template>
  <!-- 导航栏 -->
  <div class="nav-container">
    <div class="nav">
      <!-- 为每个 RouterLink 添加 custom 以自定义激活类 -->
      <RouterLink to="/" class="nav-link" :class="{ 'active': $route.path === '/' }">首页</RouterLink> |

      <RouterLink to="/about" class="nav-link" :class="{ 'active': $route.path === '/about' }">关于我们</RouterLink> |

      <RouterLink to="/login" class="nav-link" v-if="!userStore.isLoggedIn"
        :class="{ 'active': $route.path === '/login' }">用户</RouterLink>

      <span class="welcome-text" v-else>欢迎，{{ userStore.username }}</span>
    </div>
  </div>

  <!-- 路由视图 -->
  <RouterView></RouterView>
</template>

<style scoped>
.nav-container {
  background-color: #fff;
}

.nav {
  font-size: 20px;
  padding: 16px;
  text-align: center;
}

/* 导航链接基础样式 */
.nav-link {
  text-decoration: none;
  color: #333;
  margin: 0 8px;
  font-weight: bold;
  text-decoration: underline;
}


.active {
  color: #4caf50 ;
}

.welcome-text {
  color: #333;
  margin: 0 8px;
}


.nav-link:not(.active):hover,
.nav-link:not(.active):focus {
  color: #4caf50;
}
</style>