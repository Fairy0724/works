import axios from "axios";
// 229970615 李松蔓
// 获取天气函数
export const getWeather = (sheng, place) => {
  const id = "10005524"
  const key = "2f7240954d0cd3f38c709e2e11bbce44"
  return axios.get('http://124.222.204.22/api/tianqi/tqybmoji15.php', {
    params: { id, key, sheng, place }
  });
}