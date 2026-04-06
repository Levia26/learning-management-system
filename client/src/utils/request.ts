import axios from 'axios'

// 创建实例
const request = axios.create({
  baseURL: '/api',
})

// 请求拦截器（重点🔥）
request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default request