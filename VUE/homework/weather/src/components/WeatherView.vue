<script setup>
// 229970615 李松蔓
import { getWeather } from '../utils/api';
import { ref, onMounted } from 'vue';

const weatherList = ref([]);
const city = '重庆'
const province = '重庆'
const loading = ref(true)
const error = ref('')
const today = ref({})

// 获取天气
onMounted(async () => {
  try {
    const res = await getWeather(province, city)
    //成功获取+判断是数组
    if (res.data.code === 200 && Array.isArray(res.data.data)) {
      // 只取前七天
      weatherList.value = res.data.data.slice(0, 7)
      console.log('weatherList---', weatherList.value)
      today.value = res.data.data[0]
      console.log('today---', today.value)
    } else {
      error.value = res.data.msg || '获取天气失败'
    }
  } catch (err) {
    error.value = err.message || '获取天气失败'
  } finally {
    loading.value = false
  }
})

//将 MM/DD 转为 YYYY-MM-DD
function formatDate(week2) {
  if (!week2 || typeof week2 !== 'string' || !week2.includes('/')) return week2 || '';
  const now = new Date();
  const year = now.getFullYear();
  const [month, day] = week2.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}
</script>

<template>
  <div>
    <h2>{{ city }}</h2>
    <div v-if="today">
      <!-- 今日日期 -->
      <div>今天：{{ formatDate(today.week2) }} {{ today.weal }}</div>
      <!-- 今日天气 -->
      <div>{{ today.wea1 }}</div>
    </div>
    <div v-if="loading">加载中...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else class="weather-grid">
      <div v-for="(item, idx) in weatherList" :key="idx" class="weather-card">
        <div>{{ formatDate(item.week2) }}</div>
        <img :src="item.img1" alt="天气图标" style="width:48px;height:48px;" />
        <!-- 天气详情 -->
        <!-- 只有一个就不写转 -->
        <div v-if="item.wea1 == item.wea2">
          {{ item.wea1 }}
        </div>
        <div v-else>
          {{ item.wea1 }}转{{ item.wea2 }}
        </div>
        <div>{{ item.wendu2.trim() }}℃ ~ {{ item.wendu1.trim() }}℃</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.weather-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  /* 一排4个 */
  gap: 12px;
  max-width: 600px;
}

.weather-card {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  background: #fafbfc;
  box-shadow: 0 2px 8px #eee;
}
</style>