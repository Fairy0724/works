<script setup>
// 229970615 李松蔓
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';
import http from '../utils/http';

const route = useRoute();
const movie = ref(null);
const tab = ref('detail');
const searchQuery = ref('');
const userStore = useUserStore();
const router = useRouter();
const isCollected = ref(false);

const handleSearch = () => {
  // 跳转首页并带上搜索词，或弹窗提示
  if (searchQuery.value.trim() !== '') {
    router.push({ name: 'HomeView', query: { q: searchQuery.value } });
  } else {
    alert('请输入搜索内容');
  }
};

const logout = () => {
  userStore.logout();
  router.push('/login');
};

onMounted(async () => {
  const id = route.params.id;
  const res = await http.get(`/movies/${id}`);
  movie.value = res.data;
  checkCollected();
});

function checkCollected() {
  if (!userStore.isLogin) {
    isCollected.value = false;
    return;
  }
  const movieId = parseInt(route.params.id);
  isCollected.value = userStore.userInfo?.favorites?.includes(movieId) || false;
}

async function handleCollect() {
  if (!userStore.isLogin) {
    router.push('/login');
    return;
  }

  const movieId = parseInt(route.params.id);
  const currentFavorites = userStore.userInfo?.favorites || [];

  try {
    if (!isCollected.value) {
      // 添加到收藏
      const newFavorites = [...currentFavorites, movieId];
      await http.patch(`/users/${userStore.userInfo.id}`, { favorites: newFavorites });
      userStore.userInfo.favorites = newFavorites;
      isCollected.value = true;
      alert('收藏成功');
    } else {
      // 取消收藏
      const newFavorites = currentFavorites.filter(id => id !== movieId);
      await http.patch(`/users/${userStore.userInfo.id}`, { favorites: newFavorites });
      userStore.userInfo.favorites = newFavorites;
      isCollected.value = false;
      alert('取消收藏成功');
    }
  } catch (error) {
    console.error('收藏操作失败:', error);
    alert('操作失败，请重试');
  }
}
</script>

<template>
  <div>
    <!-- 顶部导航栏 -->
    <nav class="nav-container">
      <div class="nav-wrapper">
        <div class="logo">
          <img src="../assets/images/logo.png" alt="荔枝烧蓝莓 Logo">
        </div>
        <div class="search-bar">
          <input type="text" v-model="searchQuery" placeholder="搜索电影..." @keyup.enter="handleSearch">
          <button class="search-btn" @click="handleSearch">
            <i class="fa fa-search"></i>
          </button>
        </div>
        <div class="nav-links">
          <RouterLink to="/" class="nav-link">首页</RouterLink>
          <template v-if="userStore.isLogin">
            <RouterLink to="/profile" class="nav-link">个人中心</RouterLink>
            <a href="#" class="nav-link" @click.prevent="logout">退出登录</a>
          </template>
          <template v-else>
            <RouterLink to="/login" class="nav-link">登录</RouterLink>
            <RouterLink to="/register" class="nav-link">注册</RouterLink>
          </template>
        </div>
      </div>
    </nav>
    <div class="detail-bg">
      <div class="detail-main">
        <div class="detail-card">
          <div class="detail-left">
            <img v-if="movie" :src="movie.poster" :alt="movie.title" class="movie-poster" />
          </div>
          <div class="detail-right">
            <div v-if="movie" class="info-card">
              <h2 class="movie-title">{{ movie.title }}</h2>
              <div class="movie-score"><span>{{ movie.score }}</span> 分</div>
              <div class="movie-meta">
                <span>导演：{{ movie.director }}</span>
                <span>主演：{{ movie.actors }}</span>
              </div>
              <div class="movie-meta">
                <span>类型：{{ Array.isArray(movie.type) ? movie.type.join(', ') : movie.type }}</span>
                <span>国家/地区：{{ movie.countryRegion }}</span>
                <span>年份：{{ movie.year }}</span>
              </div>
            </div>
            <div v-else class="loading">加载中...</div>
            <button class="collect-btn" :class="{ collected: isCollected }" @click="handleCollect">
              <i class="fa fa-star"></i>
              <span class="collect-text">{{ isCollected ? '已收藏' : '收藏' }}</span>
            </button>
          </div>
        </div>
        <div class="tab-card">
          <div class="tab-header">
            <div :class="['tab-item', { active: tab === 'detail' }]" @click="tab = 'detail'">电影详情</div>
            <!-- 预留可扩展tab -->
          </div>
          <div class="tab-content">
            <div v-if="tab === 'detail'">
              <div class="movie-desc">{{ movie?.desc }}</div>
              <div class="movie-detail">{{ movie?.detail }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nav-container {
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.logo img {
  width: 300px;
  height: 100px;
}

.search-bar {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 999px;
  overflow: hidden;
  padding: 0.5rem 1rem;
  width: 400px;
}

.search-bar input {
  flex: 1;
  border: none;
  outline: none;
  padding: 0.5rem;
}

.search-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  color: #333;
  transition: color 0.3s ease;
  position: relative;
  text-decoration: none;
}

.nav-link:hover {
  color: #2ecc71;
}

.detail-bg {
  background: #f5f6fa;
  min-height: 90vh;
  padding: 40px 0 60px 0;
}

.detail-main {
  max-width: 1100px;
  margin: 0 auto;
}

.detail-card {
  display: flex;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(111, 66, 193, 0.08);
  padding: 40px 40px 40px 40px;
  gap: 40px;
  align-items: flex-start;
}

.detail-left {
  flex: 0 0 360px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.movie-poster {
  width: 320px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(111, 66, 193, 0.10);
  background: #f8f9fa;
}

.detail-right {
  flex: 1;
  display: flex;
  align-items: flex-start;
}

.info-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.movie-title {
  font-size: 2.2rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: #222;
}

.movie-score {
  font-size: 1.5rem;
  color: #43b244;
  font-weight: bold;
  background: #f3faf3;
  display: inline-block;
  padding: 4px 16px;
  border-radius: 16px;
  margin-bottom: 8px;
  width: 80px;
}

.movie-meta {
  display: flex;
  gap: 30px;
  color: #666;
  font-size: 1rem;
}

.loading {
  text-align: center;
  color: #888;
  font-size: 1.2rem;
  padding: 60px 0;
}

.tab-card {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(111, 66, 193, 0.06);
  margin-top: 32px;
  padding: 24px 32px 32px 32px;
}

.tab-header {
  display: flex;
  gap: 32px;
  border-bottom: 2px solid #f0f0f0;
  margin-bottom: 18px;
}

.tab-item {
  font-size: 1.1rem;
  color: #888;
  padding: 8px 0;
  cursor: pointer;
  position: relative;
}

.tab-item.active {
  color: #00b38a;
  font-weight: bold;
}

.tab-item.active::after {
  content: '';
  display: block;
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 100%;
  height: 2px;
  background: #00b38a;
  border-radius: 2px;
}

.tab-content {
  min-height: 60px;
  color: #333;
  font-size: 1.1rem;
  line-height: 1.7;
}

.movie-desc {
  margin-bottom: 10px;
  color: #444;
  font-size: 1.1rem;
}

.movie-detail {
  color: #333;
  font-size: 1.1rem;
  line-height: 1.7;
}

.collect-btn {
  margin-top: 18px;
  padding: 8px 28px;
  background: #fff;
  color: #00b38a;
  border: 1.5px solid #00b38a;
  border-radius: 22px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  outline: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.collect-btn.collected {
  background: #00b38a;
  color: #fff;
  border-color: #00b38a;
}

.collect-btn:hover {
  background: #00b38a;
  color: #fff;
}

.collect-btn .fa-star {
  font-size: 1.2em;
}

.collect-text {
  display: inline-block;
  letter-spacing: 2px;
  font-size: 1.1rem;
  white-space: nowrap;
}
</style>