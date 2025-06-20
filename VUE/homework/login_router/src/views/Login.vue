<script setup>
// 229970615 李松蔓
import { ref } from 'vue'
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const username = ref('')
const password = ref('')

const handleLogin = () => {
  if (username.value === 'xy' && password.value === '123') {
    userStore.login(username.value)
    router.push('/')
  } else {
    alert('用户名或密码错误！')
  }
}
</script>
<template>
  <div class="login-container">
    <h2 class="login-title">用户登录</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-item">
        <label class="form-label">用户名：</label>
        <input type="text" v-model="username" placeholder="请输入用户名" class="form-input" />
      </div>
      <div class="form-item">
        <label class="form-label">密　码：</label>
        <input type="password" v-model="password" placeholder="请输入密码" class="form-input" />
      </div>
      <button type="submit" class="login-btn">登录</button>
    </form>
  </div>
</template>

<style scoped>
.login-container {
  width: 400px;
  margin: 10px auto;
  padding: 10px;
  text-align: center;
  background-color: #fff;
}

/* 登录标题 */
.login-title {
  font-size: 28px;
  color: #333;
  margin-bottom: 30px;
  font-weight: 600;
}

/* 表单项容器 */
.form-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 20px;
}

/* 表单标签 */
.form-label {
  width: 80px;
  text-align: right;
  margin-right: 10px;
  font-size: 16px;
  color: #333;
}

/* 表单输入框 */
.form-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

/* 登录按钮 */
.login-btn {
  width: 100px;
  /* 按钮适当变窄 */
  padding: 10px;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.login-btn:hover {
  background: #0056b3;
}
</style>