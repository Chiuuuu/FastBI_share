import $axios from '../../axios'

export default {
  /**
   * @description 生成token
   * @param {string} data.oaNum 工号
   * @returns
   */
  getToken(data) {
    return $axios.post('/share/getOaToken', data)
  },
  /**
   * @description 分享大屏列表
   * @param {Object} data 请求参数
   * @param {string} data.current 页码
   * @param {string} data.pageSize 单页条数
   * @param {string} data.screenName 大屏名称
   * @returns
   */
  getList(data) {
    return $axios.post('/share/oaList', data)
  },
  /**
   * @description 分享大屏详情
   * @param {Object} url 密文
   * @param {Object} headers 密码
   * @returns
   */
  getScreenInfo(url, headers) {
    return $axios.get('/share/oa/' + url, { headers })
  }
}
