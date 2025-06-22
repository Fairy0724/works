<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import http from '../utils/http'
import { useUserStore } from '../stores/userStore'
import { useRouter, RouterLink } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const movies = ref([])
const filterType = ref('全部')
const filterCountry = ref('全部')
const filterYear = ref('全部')

const loading = ref(true)
const error = ref('')
const searchQuery = ref('')

// 分页相关
const currentPage = ref(1)
const itemsPerPage = 8

watch([filterType, filterCountry, filterYear], () => {
  currentPage.value = 1
})

// 动态生成分类数据
const types = computed(() => {
  const typeSet = new Set()
  movies.value.forEach(movie => {
    if (Array.isArray(movie.type)) {
      movie.type.forEach(type => typeSet.add(type))
    } else if (movie.type) {
      typeSet.add(movie.type)
    }
  })
  return ['全部', ...Array.from(typeSet).sort()]
})

const countries = computed(() => {
  const countrySet = new Set(movies.value.map(m => m.countryRegion))
  return ['全部', ...Array.from(countrySet).sort()]
})

const years = computed(() => {
  const yearSet = new Set(movies.value.map(m => m.year))
  return ['全部', ...Array.from(yearSet).sort((a, b) => b - a)] // 年份降序排列
})

const filteredMovies = computed(() => {
  return movies.value.filter(m => {
    const typeOk = filterType.value === '全部' ||
      (Array.isArray(m.type) ? m.type.includes(filterType.value) : m.type === filterType.value)
    const countryOk = filterCountry.value === '全部' || m.countryRegion === filterCountry.value
    const yearOk = filterYear.value === '全部' || m.year == filterYear.value
    const searchOk = !searchQuery.value.trim() || m.title.includes(searchQuery.value.trim()) || (m.desc && m.desc.includes(searchQuery.value.trim()))
    return typeOk && countryOk && yearOk && searchOk
  })
})

const totalPages = computed(() => Math.ceil(filteredMovies.value.length / itemsPerPage))
const pagedMovies = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredMovies.value.slice(start, start + itemsPerPage)
})

const handleSearch = () => {
  currentPage.value = 1
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page
}
const getVisiblePages = computed(() => {
  const visiblePages = []
  const startPage = Math.max(currentPage.value - 2, 1)
  const endPage = Math.min(startPage + 4, totalPages.value)
  for (let i = startPage; i <= endPage; i++) visiblePages.push(i)
  return visiblePages
})

const logout = () => {
  userStore.logout()
  router.push('/login')
}

const fetchMovies = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await http.get('/movies')
    movies.value = res.data
  } catch (e) {
    error.value = '获取电影数据失败'
    console.log(e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchMovies()
})
</script>

<template>
  <div class="home-container">
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

    <!-- 电影筛选和列表区域 -->
    <div class="products-section">
      <div class="section-wrapper">
        <h2 class="section-title">电影</h2>
        <div class="category-tabs">
          <div class="tab-item" :class="{ active: filterType === '全部' }" @click="filterType = '全部'">全部类型</div>
          <div v-for="t in types.filter(t => t !== '全部')" :key="t" class="tab-item"
            :class="{ active: filterType === t }" @click="filterType = t">{{ t }}</div>
        </div>
        <div class="category-tabs">
          <div class="tab-item" :class="{ active: filterCountry === '全部' }" @click="filterCountry = '全部'">全部国家/地区</div>
          <div v-for="c in countries.filter(c => c !== '全部')" :key="c" class="tab-item"
            :class="{ active: filterCountry === c }" @click="filterCountry = c">{{ c }}</div>
        </div>
        <div class="category-tabs">
          <div class="tab-item" :class="{ active: filterYear === '全部' }" @click="filterYear = '全部'">全部年份</div>
          <div v-for="y in years.filter(y => y !== '全部')" :key="y" class="tab-item"
            :class="{ active: filterYear === y }" @click="filterYear = y">{{ y }}</div>
        </div>

        <div class="product-grid">
          <div v-if="filteredMovies.length === 0" class="no-products">暂无电影</div>
          <div v-else v-for="movie in pagedMovies" :key="movie.id" class="product-card"
            @click="router.push(`/movie/${movie.id}`)" style="cursor:pointer;">
            <div class="product-image">
              <img :src="movie.poster" :alt="movie.title">
              <div class="discount-badge">{{ movie.score }}分</div>
            </div>
            <div class="product-info">
              <h3>{{ movie.title }}</h3>
              <div class="desc">{{ movie.desc }}</div>
              <div class="brand">{{ movie.countryRegion }} | {{ Array.isArray(movie.type) ? movie.type.join('、') :
                movie.type }} | {{ movie.year }}</div>
            </div>
          </div>
        </div>
        <!-- 分页组件 -->
        <div class="pagination" v-if="totalPages >= 1">
          <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
          <button v-for="page in getVisiblePages" :key="page" :class="{ active: page === currentPage }"
            @click="goToPage(page)">{{ page }}</button>
          <button @click="nextPage" :disabled="currentPage === totalPages">下一页</button>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section about">
          <h3>关于我们</h3>
          <p>荔枝烧蓝莓电影网，专注于高品质电影内容推荐。</p>
        </div>
        <div class="footer-section links">
          <h3>快速链接</h3>
          <ul>
            <li><a href="/">首页</a></li>
            <li><a href="#">电影分类</a></li>
            <li><a href="#">热门推荐</a></li>
            <li><a href="#">关于我们</a></li>
            <li><a href="#">联系我们</a></li>
          </ul>
        </div>
        <div class="footer-section contact">
          <h3>联系我们</h3>
          <p><i class="fa fa-phone"></i> 400-123-4567</p>
          <p><i class="fa fa-envelope"></i> support@lizhi.com</p>
          <div class="socials">
            <a href="#"><i class="fa fa-weixin"></i></a>
            <a href="#"><i class="fa fa-weibo"></i></a>
            <a href="#"><i class="fa fa-instagram"></i></a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2025 荔枝烧蓝莓电影网. 保留所有权利.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css');

.home-container {
  background: #f8f9fa;
  min-height: 100vh;
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

.products-section {
  padding: 2rem 2rem;
  background-color: #f8f9fa;
}

.section-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 20px;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  text-align: center;
  position: relative;
  margin-bottom: 30px;
  padding: 0;
}

.section-title::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -10px;
  transform: translateX(-50%);
  width: 40px;
  height: 3px;
  background-color: #2ecc71;
  border-radius: 2px;
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin: 20px 0;
  padding-left: 20px;
}

.tab-item {
  padding: 8px 20px;
  border-radius: 20px;
  background-color: #f5f5f5;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.tab-item:hover {
  background-color: #e0f2e9;
  color: #2ecc71;
}

.tab-item.active {
  background-color: #2ecc71;
  color: white;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.product-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  overflow: hidden;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.product-image {
  position: relative;
  overflow: hidden;
  height: 300px;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.discount-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: #ff8800;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 500;
  z-index: 10;
}

.product-info {
  padding: 1.5rem;
}

.product-info h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  line-height: 1.4;
  height: 3.36rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.desc {
  color: #666;
  font-size: 0.95rem;
  margin-top: 0.5rem;
}

.brand {
  font-size: 0.875rem;
  color: #999;
  margin-top: 0.5rem;
}

.no-products {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 14px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  padding: 8px 16px;
  margin: 0 5px;
  border: 1px solid #ccc;
  background-color: #fff;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination button.active {
  background-color: #2ecc71;
  color: white;
}

.footer {
  background-color: #2c3e50;
  color: white;
  padding: 4rem 2rem;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 4rem;
}

.footer-section {
  padding: 1rem;
}

.footer-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  position: relative;
}

.footer-section h3::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 40px;
  height: 2px;
  background-color: #2ecc71;
}

.footer-section p {
  margin-bottom: 1rem;
}

.footer-section ul {
  padding-left: 0 !important;
  margin-left: 0;
}

.footer-section ul li {
  list-style: none;
  margin-bottom: 0.75rem;
}

.footer-section ul li a {
  color: #fff;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-section ul li a:hover {
  color: #2ecc71;
}

.socials {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.socials a {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: #fff !important;
}

.socials a i {
  color: #fff !important;
}

.socials a:hover {
  background-color: #2ecc71;
  color: #fff !important;
}

.socials a:hover i {
  color: #fff !important;
}

.footer-bottom {
  text-align: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
