import axios from 'axios';

// 封装axios请求实例
const instance = axios.create({
  baseURL: 'http://localhost:3000', // JSON Server 地址
  timeout: 5000
});
// 导出实例
export default instance
