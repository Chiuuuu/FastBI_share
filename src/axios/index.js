/**
 *创建axios服务实例
 * 为方便起见，为所有支持的请求方法提供了别名
 * @example
  axios.get(url[, config])
  axios.delete(url[, config])
  axios.post(url[, data[, config]])
  axios.put(url[, data[, config]])
  注意
  在使用别名方法时， url、method、data 这些属性都不必在配置中指定。
*/
import axios from 'axios'

const service = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? 'http://10.10.20.102:8080' : '/admin/dev-api/',
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  },
  timeout: 60000 // 请求超时时间
})

// 添加请求拦截器
service.interceptors.request.use(
  function(config) {
    if (config.url === '/share/getOaToken') {
      return config
    }
    const adminToken = window.localStorage.getItem('token')
    if (adminToken) {
      // 判断token是否存在，如果存在则每个请求都带上token
      // Bearer是JWT的认证头部信息
      config.headers.common['Authorization'] = `${adminToken}`
    }
    return config
  },
  function(error) {
    return Promise.reject(error)
  }
)

/**
 * respone拦截器
 */
service.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    const { response } = error
    return Promise.reject(error)
  }
)

export default service
