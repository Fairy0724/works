<template>
  <div>
    <!-- 229970615 李松蔓 -->
    <!-- 顶部导航 -->
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

    <div class="profile-page container">
      <!-- 左侧菜单 -->
      <div class="profile-sidebar">
        <div class="user-card">
          <div class="avatar-wrapper">
            <img :src="userStore.userInfo?.avatar" alt="头像">
          </div>
          <h3>{{ userStore.userInfo?.username }}</h3>
        </div>
        <div class="menu-list">
          <div v-for="menu in menuItems" :key="menu.key" :class="['menu-item', { active: currentMenu === menu.key }]"
            @click="currentMenu = menu.key">
            <i :class="menu.icon"></i>
            {{ menu.label }}
          </div>
        </div>
      </div>

      <!-- 右侧内容区 -->
      <div class="profile-content">
        <!-- 基本信息 -->
        <div v-if="currentMenu === 'basic'" class="content-card">
          <div class="card-header">
            <h2>基本信息</h2>
            <el-button type="primary" @click="toggleEditMode">
              {{ editMode ? '保存' : '编辑' }}
            </el-button>
          </div>
          <div class="info-list">
            <div class="info-item">
              <span class="info-label">用户名</span>
              <template v-if="editMode">
                <el-input v-model="userForm.username" placeholder="请输入用户名" name="username" />
              </template>
              <span v-else class="info-value">{{ userStore.userInfo?.username }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">手机号</span>
              <template v-if="editMode">
                <el-input v-model="userForm.phone" placeholder="请输入手机号" name="phone" />
              </template>
              <span v-else class="info-value">{{ userStore.userInfo?.phone || '未绑定' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">邮箱</span>
              <template v-if="editMode">
                <el-input v-model="userForm.email" placeholder="请输入邮箱" name="email" />
              </template>
              <span v-else class="info-value">{{ userStore.userInfo?.email || '未绑定' }}</span>
            </div>
          </div>
        </div>

        <!-- 我的收藏 -->
        <div v-if="currentMenu === 'favorites'" class="content-card">
          <h2>我的收藏</h2>
          <div v-if="favorites.length === 0" class="empty-state">
            <img src="../assets/images/none.png" alt="暂无收藏">
            <p>您还没有收藏任何电影</p>
            <RouterLink to="/" class="btn-primary">去逛逛</RouterLink>
          </div>
          <div v-else class="movie-grid">
            <div v-for="movie in favorites" :key="movie.id" class="movie-card" @click="goToMovie(movie.id)">
              <div class="movie-image">
                <img :src="movie.poster" :alt="movie.title">
                <div class="discount-badge">{{ movie.score }}分</div>
              </div>
              <div class="movie-info">
                <h3>{{ movie.title }}</h3>
                <div class="desc">{{ movie.desc }}</div>
                <div class="brand">{{ movie.countryRegion }} | {{ Array.isArray(movie.type) ? movie.type.join(', ') :
                  movie.type }} | {{ movie.year }}</div>
                <button class="btn-heart" @click.stop="removeFavorite(movie.id)"><i class="fa fa-heart"></i>
                  取消收藏</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 账号安全 -->
        <div v-if="currentMenu === 'security'" class="content-card">
          <h2>账号安全</h2>
          <div class="security-list">
            <div class="security-item">
              <div class="security-info">
                <h3>登录密码</h3>
                <p>建议您定期更换密码，设置安全性高的密码可以使账号更安全</p>
              </div>
              <el-button @click="showPwdDialog = true">修改</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';
import request from '../utils/http';

const router = useRouter();
const userStore = useUserStore();
const searchQuery = ref('');
const editMode = ref(false);
const currentMenu = ref('basic');
const showPwdDialog = ref(false);
const userForm = ref({ username: '', phone: '', email: '' });
const favorites = ref([]);

const menuItems = [
  { key: 'basic', label: '基本信息', icon: 'el-icon-user' },
  { key: 'favorites', label: '我的收藏', icon: 'el-icon-star' },
  { key: 'security', label: '账号安全', icon: 'el-icon-lock' }
];

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ name: 'home', query: { q: searchQuery.value } });
  }
};

const logout = () => {
  userStore.logout();
  router.push('/login');
};

const fetchFavorites = async () => {
  if (!userStore.userInfo?.favorites || userStore.userInfo.favorites.length === 0) {
    favorites.value = [];
    return;
  }
  const ids = userStore.userInfo.favorites;
  // 使用json-server的正确查询语法，通过id数组查询
  const promises = ids.map(id => request.get(`/movies/${id}`));
  try {
    const responses = await Promise.all(promises);
    favorites.value = responses.map(res => res.data);
  } catch (error) {
    console.error('获取收藏电影失败:', error);
    favorites.value = [];
  }
};

const removeFavorite = async (movieId) => {
  if (!userStore.userInfo?.id) return;
  const newFavs = userStore.userInfo.favorites.filter(id => id !== movieId);
  await request.patch(`/users/${userStore.userInfo.id}`, { favorites: newFavs });
  userStore.userInfo.favorites = newFavs;
  await fetchFavorites();
};

const goToMovie = (id) => {
  router.push(`/movie/${id}`);
};

const toggleEditMode = async () => {
  if (editMode.value) {
    // 当前是编辑模式，点击保存
    try {
      await request.patch(`/users/${userStore.userInfo.id}`, {
        username: userForm.value.username,
        phone: userForm.value.phone,
        email: userForm.value.email
      });
      // 更新store中的用户信息
      userStore.userInfo.username = userForm.value.username;
      userStore.userInfo.phone = userForm.value.phone;
      userStore.userInfo.email = userForm.value.email;
      editMode.value = false;
    } catch (error) {
      console.error('保存失败:', error);
    }
  } else {
    // 当前是查看模式，点击编辑
    editMode.value = true;
    userForm.value = {
      username: userStore.userInfo?.username || '',
      phone: userStore.userInfo?.phone || '',
      email: userStore.userInfo?.email || ''
    };
  }
};

onMounted(() => {
  fetchFavorites();
});
</script>
<style scoped>
.profile-page {
  display: flex;
  gap: 30px;
  padding: 30px;
  background-color: #f8faf8;
  min-height: calc(100vh - 60px);
  max-width: 1400px;
  margin: 0 auto;
}

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

.profile-sidebar {
  background: #fff;
  border-radius: 16px;
  padding: 35px;
  height: fit-content;
  box-shadow: 0 4px 20px rgba(46, 204, 113, 0.1);
  width: 280px;
  flex-shrink: 0;
}

.profile-content {
  flex: 1;
}

.content-card {
  background: #fff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(46, 204, 113, 0.1);
  margin-bottom: 30px;
}

.content-card h2 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 35px;
  padding-bottom: 25px;
  color: #2c3e50;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

/* 信息项样式 */
.info-item {
  display: flex;
  align-items: center;
  padding: 20px 30px;
  border-radius: 12px;
  margin-bottom: 15px;
  background: #f8faf8;
  transition: all 0.3s;
}

.info-item:hover {
  background: #f0f9f0;
  transform: translateX(5px);
}

.info-label {
  width: 120px;
  color: #666;
  font-size: 15px;
  font-weight: 500;
}

.info-value {
  flex: 1;
  color: #2c3e50;
  font-size: 15px;
}

/* 收藏电影卡片样式 */
.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
  margin-top: 30px;
}

.movie-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  overflow: hidden;
  cursor: pointer;
}

.movie-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.movie-image {
  position: relative;
  overflow: hidden;
  height: 300px;
}

.movie-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.movie-card:hover .movie-image img {
  transform: scale(1.05);
}

.discount-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: #f56c6c;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  z-index: 10;
}

.movie-info {
  padding: 20px;
}

.brand {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.movie-info h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  line-height: 1.4;
  height: 44px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  color: #333;
}

.btn-heart {
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  border: none;
  background: #fff;
  border: 1px solid #f56c6c;
  color: #f56c6c;
  margin-top: 10px;
}

.btn-heart:hover {
  background: #fef0f0;
}

/* 用户卡片和菜单样式 */
.user-card {
  text-align: center;
  padding-bottom: 35px;
  border-bottom: 2px solid #e8f3e8;
}

.avatar-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 25px;
}

.avatar-wrapper img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #e8f3e8;
  box-shadow: 0 4px 15px rgba(46, 204, 113, 0.2);
}

.user-card h3 {
  font-size: 20px;
  color: #2c3e50;
  margin-bottom: 10px;
  font-weight: 600;
}

.menu-list {
  margin-top: 25px;
}

.menu-item {
  padding: 16px 22px;
  color: #666;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.3s;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  font-size: 16px;
}

.menu-item:hover {
  background: #f0f9f0;
  color: #2ecc71;
  transform: translateX(5px);
}

.menu-item.active {
  background: #2ecc71;
  color: #fff;
  box-shadow: 0 4px 12px rgba(46, 204, 113, 0.2);
}

.menu-item i {
  margin-right: 12px;
  font-size: 18px;
}

/* Element Plus 按钮样式覆盖 */
:deep(.el-button--primary) {
  background-color: #2ecc71;
  border-color: #2ecc71;
  border-radius: 20px;
  padding: 8px 20px;
}

:deep(.el-button--primary:hover) {
  background-color: #27ae60;
  border-color: #27ae60;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(46, 204, 113, 0.2);
}

:deep(.el-input) {
  flex: 1;
}

:deep(.el-input__inner) {
  background: #ffffff;
  border-color: #e8f3e8;
  border-radius: 8px;
  height: 40px;
}

:deep(.el-input__inner:focus) {
  border-color: #2ecc71;
  box-shadow: 0 0 0 2px rgba(46, 204, 113, 0.2);
}
</style>