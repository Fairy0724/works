import { defineStore } from 'pinia'
//导出
export const useUserStore = defineStore('user', {
  state: () => ({
    isLogin: false,
    userInfo: {},
  }),
  actions: {
    login(user) {
      this.isLogin = true
      this.userInfo = user
    },
    logout() {
      this.isLogin = false
      this.userInfo = {}
    },
  },
})