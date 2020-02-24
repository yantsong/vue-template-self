/*
 * @Author: span
 * @Date: 2020-02-19 13:26:48
 * @LastEditTime: 2020-02-19 21:32:00
 * @LastEditors: span
 * @Description: 具体项目相关api
 * @FilePath: /vue-template-self/src/services/api.js
 */

import axios from 'axios'
// import config from '~src/config'
import { API } from './index'
const Axios = axios.create()
const wows = new API('https://api-wows-wscn.xuangubao.cn')
// const sit = createApi('https://alli-api-sit.xuangubao.cn')
export const XGB = new API()

// export XGB = XGB
export const StockHotApi = {
  getThermometer (date) {
    return XGB.get('/temperature', {
      params: {
        date
      }
    })
  }
}
export const bkjApiServices = {
  getAllTags (date) {
    return XGB({
      method: 'GET',
      url: '/large_stocks',
      params: {
        date
      }
    })
  }
}
export const tradingDayApi = time => Axios.get(
  `https://flash-api.xuangubao.cn/api/trading_day/prev?count=1&timestamp=${time}`
)

// 首页热门股池
export const homeHot = () => Axios.get(
  `https://flash-api.xuangubao.cn/api/pool/preview`
)
// 首页今日机会
export const homeJinri = () => {
  return XGB({
    method: 'GET',
    url: '/hengtai/h5/jinrijihui'
  })
}

// 主题库详情
export const subjectDetail = (plateid) => {
  return XGB({
    method: 'GET',
    url: `/hengtai/h5/subjectDetail?plateid=${plateid}`
  })
}

// 获取股票涨跌幅
export const getStockData = (symbols) => {
  return axios.get(
    `https://flash-api.xuangubao.cn/api/stock/data?symbols=${symbols}&fields=symbol,stock_chi_name,change_percent&strict=true`
  )
}

// 主题库文章详情
export const getArticleDetail = (id) => {
  return XGB({
    method: 'GET',
    url: `/hengtai/h5/msgDetail?msgid=${id}`
  })
}
// 获取主题库文章
export const getSubjectArt = (plateid, page = 1) => {
  return axios.get(
    `https://alli-api.xuangubao.cn/hengtai/h5/subjectDetail/${plateid}/messages?page=${page}&limit=40`
  )
}
// 主题库股票池
export const getSubjectPool = (id) => {
  return XGB({
    method: 'GET',
    url: `/hengtai/h5/plateStocks?plateid=${id}`
  })
}
export function getStockLabs (symbols) {
  return wows.get(`/v3/milo/labels/stock?codes=${symbols}`).then(labs => {
    console.log('labs', labs)
    const obj = {}
    try {
      const fields = labs.fields
      Object.entries(labs.records).forEach(stock => {
        const temp = []
        stock[1].forEach((item, index) => {
          temp[index] = {}
          item.forEach((val, idx) => {
            temp[index][underscoreToCamelCase(fields[idx])] = val
          })
        })
        obj[stock[0]] = temp
      })
    } catch (e) {
      console.log(e)
    }
    return obj
  })
}
function underscoreToCamelCase (str) {
  return str
    .split('_')
    .reduce(
      (arr, split) => `${arr}${split[0].toUpperCase()}${split.substring(1)}`
    )
}
