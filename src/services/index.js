/*
 * @Author: your name
 * @Date: 2020-02-19 14:32:37
 * @LastEditTime: 2020-02-19 21:03:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vue-template-self/src/services/index.js
 */
import Axios from 'axios'
// const baseURL = process.env.BASE_API
export class API {
  constructor (baseURL) {
    baseURL = baseURL || process.env.BASE_API
    const api = Axios.create({
      baseURL
    })
    api.interceptors.response.use(
      function (response) {
        // Do something with response data
        if (response.status === 200 && response.data.code === 20000) {
          return (response.data.data)
        } else {
          return Promise.reject(response)
        }
      },
      function (error) {
        // Do something with response error
        return Promise.reject(error)
      }
    )
    return api
  }
}
