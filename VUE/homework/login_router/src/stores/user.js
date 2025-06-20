// 229970615 李松蔓
import { defineStore } from 'pinia'

// 简单登录状态管理（实际项目建议结合后端 token）
export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    username: ''
  }),
  actions: {
    // 模拟登录
    login(username) {
      this.isLoggedIn = true
      this.username = username
    },
    // 退出登录
    logout() {
      this.isLoggedIn = false
      this.username = ''
    }
  }
})