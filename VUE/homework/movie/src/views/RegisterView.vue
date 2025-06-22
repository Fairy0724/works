<template>
  <div class="login-page">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="container">
        <div class="logo-wrapper">
          <img src="../assets/images/logo.png" alt="LOGO" class="logo">
        </div>
        <a href="/" class="go-home">
          <span>进入电影网站首页</span>
          <i class="fa fa-angle-right" style="color: #00b38a;"></i>
        </a>
      </div>
    </header>
    <!-- 主要内容区 -->
    <main class="main-content">
      <div class="main-bg-bar"></div>
      <div class="container">
        <div class="login-container">
          <!-- 左侧Banner区域 -->
          <div class="banner-section">
            <div class="banner-content">
              <h2 class="title">夏日电影盛宴</h2>
              <p class="summer-text">SUMMER</p>
              <p class="description">注册账户，享受专属特权，全场电影免费观看！</p>
              <div class="cta-buttons">
                <button class="btn btn-primary">
                  <i class="fa fa-shopping-bag"></i> 了解更多
                </button>
                <button class="btn btn-secondary">
                  <i class="fa fa-gift"></i> 查看活动
                </button>
              </div>
            </div>
            <div class="decorations">
              <div class="circle circle-large"></div>
              <div class="circle circle-medium"></div>
              <div class="circle circle-small"></div>
            </div>
          </div>
          <!-- 右侧注册框 -->
          <div class="login-section">
            <div class="login-box">
              <div class="login-header">
                <h3 class="login-title">用户注册</h3>
                <p class="login-subtitle">请填写以下信息完成注册</p>
              </div>
              <form class="login-form" @submit.prevent="handleRegister">
                <div class="form-group">
                  <label for="username" class="form-label">用户名</label>
                  <div class="input-wrapper">
                    <i class="fa fa-user input-icon"></i>
                    <input type="text" id="username" v-model="username" placeholder="请设置用户名" class="form-input">
                  </div>
                </div>
                <div class="form-group">
                  <label for="password" class="form-label">密码</label>
                  <div class="input-wrapper">
                    <i class="fa fa-lock input-icon"></i>
                    <input type="password" id="password" v-model="password" placeholder="请设置密码" class="form-input">
                  </div>
                </div>
                <div class="form-group">
                  <label for="confirmPassword" class="form-label">确认密码</label>
                  <div class="input-wrapper">
                    <i class="fa fa-lock input-icon"></i>
                    <input type="password" id="confirmPassword" v-model="confirmPassword" placeholder="请确认密码"
                      class="form-input">
                  </div>
                </div>
                <div class="agreement">
                  <input type="checkbox" id="agreement" v-model="isAgree" class="form-checkbox">
                  <label for="agreement" class="form-label">
                    我已阅读并同意<a href="#" class="link">《用户协议》</a>和<a href="#" class="link">《隐私政策》</a>
                  </label>
                </div>
                <button type="submit" class="login-button">立即注册</button>
                <p v-if="error" class="error">{{ error }}</p>
                <p v-if="success" class="success">{{ success }}</p>
              </form>
              <div class="register-link">
                <span class="text">已有账号？</span>
                <RouterLink to="/login" class="link">立即登录</RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <!-- 底部信息 -->
    <footer class="footer">
      <div class="container">
        <div class="footer-top">
          <div class="footer-logo">
            <img src="../assets/images/logo.png" alt="LOGO" class="logo">
            <p class="slogan">免费·亲民·快捷</p>
          </div>
          <div class="footer-links">
            <div class="footer-col">
              <h4 class="footer-title">关于我们</h4>
              <ul class="footer-list">
                <li><a href="#" class="footer-link">公司简介</a></li>
                <li><a href="#" class="footer-link">加入我们</a></li>
                <li><a href="#" class="footer-link">联系方式</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h4 class="footer-title">客户服务</h4>
              <ul class="footer-list">
                <li><a href="#" class="footer-link">帮助中心</a></li>
                <li><a href="#" class="footer-link">售后服务</a></li>
                <li><a href="#" class="footer-link">配送说明</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h4 class="footer-title">支付方式</h4>
              <ul class="footer-list">
                <li><a href="#" class="footer-link">在线支付</a></li>
                <li><a href="#" class="footer-link">银行转账</a></li>
                <li><a href="#" class="footer-link">货到付款</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h4 class="footer-title">关注我们</h4>
              <div class="social-media">
                <a href="#" class="social-icon weixin">
                  <i class="fa fa-weixin"></i>
                </a>
                <a href="#" class="social-icon weibo">
                  <i class="fa fa-weibo"></i>
                </a>
                <a href="#" class="social-icon instagram">
                  <i class="fa fa-instagram"></i>
                </a>
              </div>
              <p class="contact">客服电话：400-123-4567</p>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p class="copyright">CopyRight © 2025 荔枝烧蓝莓电影网. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import http from '../utils/http'
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const isAgree = ref(false)
const error = ref('')
const success = ref('')
const router = useRouter()

const handleRegister = async () => {
  error.value = ''
  success.value = ''
  if (!username.value || !password.value || !confirmPassword.value || !isAgree.value) {
    error.value = '请填写完整信息并勾选协议'
    return
  }
  if (password.value !== confirmPassword.value) {
    error.value = '两次输入的密码不一致'
    return
  }
  try {
    const res = await http.get('/users', { params: { username: username.value } })
    if (res.data.length > 0) {
      error.value = '用户名已存在'
      return
    }
    const addRes = await http.post('/users', {
      username: username.value,
      password: password.value,
      avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiByeD0iNjAiIGZpbGw9IiNFNUU3RUIiLz4KPGNpcmNsZSBjeD0iNjAiIGN5PSI0NSIgcj0iMjAiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTIwIDEwNUMyMCA5NS4wNTc2IDI4LjA1NzYgODcgMzggODdIODJDNzEuOTQyNCA4NyA2NCA5NS4wNTc2IDY0IDEwNUw2NCAxMTBIMjBWMTA1WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K',
      favorites: []
    })
    if (addRes.status === 201) {
      success.value = '注册成功，2秒后跳转登录页'
      setTimeout(() => router.push('/login'), 2000)
    } else {
      error.value = '注册失败'
    }
  } catch (e) {
    error.value = '注册失败，请重试'
    console.log(e)
  }
}
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css');

:root {
  --primary-color: #00b38a;
  --primary-dark: #009974;
  --secondary-color: #87e8de;
  --text-color: #333;
  --text-light: #666;
  --text-lighter: #999;
  --bg-light: #f8f9fa;
  --bg-gray: #e9ecef;
  --border-radius: 8px;
  --box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  color: var(--text-color);
}

a {
  text-decoration: none;
  color: inherit;
}

ul {
  list-style: none;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.header {
  background-color: white;
  box-shadow: var(--box-shadow);
  padding: 20px 0;
}

.header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header .container span {
  color: #00b38a;
}

.logo-wrapper {
  display: flex;
  align-items: center;
}

.logo {
  width: 320px;
  height: 100px;
  border-radius: 8px;
  margin-right: 10px;
}

.go-home {
  color: var(--primary-color);
  font-size: 14px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.go-home:hover {
  color: var(--primary-dark);
  transform: translateX(2px);
}

.go-home i {
  margin-left: 5px;
}

.main-content {
  position: relative;
  padding: 60px 0;
  background: linear-gradient(135deg, #e5f6e5 0%, #d1f0d1 100%);
}

.main-bg-bar {
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  width: 60%;
  height: 100%;
  padding: 20px;
  background: linear-gradient(135deg, #00b38a 0%, #009974 100%);
  border-radius: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  z-index: 1;
}

.login-container {
  display: flex;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--box-shadow);
}

.banner-section {
  flex: 1;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: white;
  padding: 60px;
  position: relative;
  overflow: hidden;
}

.banner-content {
  position: relative;
  z-index: 10;
}

.title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
}

.summer-text {
  font-size: 60px;
  font-weight: 900;
  margin-bottom: 30px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.description {
  font-size: 16px;
  margin-bottom: 40px;
  max-width: 300px;
}

.cta-buttons {
  display: flex;
  gap: 20px;
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.btn-primary {
  background-color: transparent;
  color: white;
  border: 2px solid white;
}

.btn-primary:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn-secondary {
  background-color: transparent;
  color: white;
  border: 2px solid white;
}

.btn-secondary:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn i {
  margin-right: 8px;
}

.decorations {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
}

.circle-large {
  width: 300px;
  height: 300px;
  top: -100px;
  right: -100px;
}

.circle-medium {
  width: 200px;
  height: 200px;
  top: 200px;
  right: -50px;
}

.circle-small {
  width: 100px;
  height: 100px;
  bottom: 100px;
  right: 100px;
}

.login-section {
  flex: 1;
  background-color: white;
  padding: 60px;
  display: flex;
  justify-content: center;
}

.login-box {
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.login-subtitle {
  color: var(--text-light);
  font-size: 14px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-lighter);
}

.form-input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(0, 179, 138, 0.2);
}

.agreement {
  display: flex;
  align-items: center;
  margin: 10px 0;
}

.form-checkbox {
  margin-right: 10px;
}

.link {
  color: #00b38a;
  text-decoration: none;
  transition: all 0.3s ease;
}

.link:hover {
  color: #009974;
  text-decoration: underline;
}

.login-button {
  width: 100%;
  padding: 14px;
  background-color: #00b38a;
  color: white;
  font-size: 16px;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-button:hover {
  background-color: #009974;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 179, 138, 0.2);
}

.register-link {
  text-align: center;
  font-size: 14px;
  margin-top: 20px;
}

.error {
  color: red;
  margin-top: 10px;
  text-align: center;
}

.success {
  color: green;
  margin-top: 10px;
  text-align: center;
}

.footer {
  background-color: white;
  padding: 60px 0;
  border-top: 1px solid #eee;
}

.footer-top {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 40px;
}

.footer-logo {
  flex: 1;
  margin-right: 40px;
  min-width: 400px;
}

.footer-logo img {
  width: 180px;
  height: 80px;
  border-radius: 8px;
  margin-bottom: 10px;
  left: 10px;
}

.footer-logo .slogan {
  font-size: 18px;
  color: var(--text-light);
}

.footer-links {
  flex: 3;
  display: flex;
  flex-wrap: wrap;
}

.footer-col {
  flex: 1;
  min-width: 150px;
  margin-bottom: 20px;
}

.footer-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
}

.footer-list {
  font-size: 14px;
  color: var(--text-light);
}

.footer-list li {
  margin-bottom: 10px;
}

.footer-link {
  transition: all 0.3s ease;
}

.footer-link:hover {
  color: var(--primary-color);
}

.social-media {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.social-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.social-icon:hover {
  background-color: var(--primary-color);
  color: white;
}

.contact {
  font-size: 14px;
  color: var(--text-light);
}

.footer-bottom {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #eee;
  font-size: 12px;
  color: var(--text-lighter);
}

@media (max-width: 992px) {
  .login-container {
    flex-direction: column;
  }

  .banner-section,
  .login-section {
    padding: 40px;
  }

  .summer-text {
    font-size: 40px;
  }

  .footer-top {
    flex-direction: column;
  }

  .footer-logo {
    margin-bottom: 40px;
  }
}

@media (max-width: 576px) {

  .banner-section,
  .login-section {
    padding: 30px;
  }

  .title {
    font-size: 24px;
  }

  .summer-text {
    font-size: 30px;
  }

  .description {
    font-size: 14px;
  }

  .btn {
    padding: 10px 16px;
    font-size: 14px;
  }

  .footer-top {
    flex-direction: column;
  }

  .footer-logo {
    margin-bottom: 40px;
  }
}

.main-content>.container {
  position: relative;
  z-index: 2;
}
</style>
