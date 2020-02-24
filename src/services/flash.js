/*
 * @Author: span
 * @Date: 2020-02-19 13:26:48
 * @LastEditTime: 2020-02-19 21:08:55
 * @LastEditors: Please set LastEditors
 * @Description: flash通用api文件 列出了常用API 若有不详或更新或添加请按原有格式写注释之后添加
 * @FilePath: /vue-template-self/src/services/flash.js
 */
import { formatWowsStyleArray, transformUnderscoreApi } from 'xgb-common'

import { API } from './index'
const flash = new API('https://flash-api.xuangubao.cn')
/**
 * @description 输入日期是否为交易日
 * @author shufangyi
 * @date 2019-05-13
 * @export
 * @param {string} [timestamp='']
 * @returns {boolean}
 */
export function isTradingDay (timestamp = '') {
  return flash.get('/api/trading_day/day', {
    params: {
      timestamp
    }
  })
}

/**
 * @description 获取异动
 * @author shufangyi
 * @date 2018-11-06
 * @export
 * @param {*} types 事件类型
 * * 10001: 涨停
 * * 10002：跌停
 * * 10003：涨停炸板
 * * 10004：跌停炸板
 * * 10005：接近涨停
 * * 10006：接近跌停
 * * 10007：即将打开涨停
 * * 10008：即将打开跌停
 * * 10009：大涨
 * * 10010：大跌
 * * 10012：新股开板
 * * 10014：新股开板回封
 * * 11001：板块拉升
 * * 11002：板块跳水
 * @param {number} [count=2] 获取最新的几条数据
 * @param {*} timestamp 时间戳 历史数据
 * @returns
 */
export function getNewYidongItem (count = 2, types, timestamp = '') {
  let typesDefault =
    types || [
      10001,
      10002,
      10003,
      10004,
      10005,
      10006,
      10007,
      10008,
      // 10009,
      // 10010,
      10012,
      10014
    ].join(',')
  return flash.get(
    `/api/event/history?types=${typesDefault}&count=${count}&timestamp=${timestamp}`
  )
}

/**
 * @description 获取各股池前三的股票
 * @author shufangyi
 * @date 2018-11-06
 * @export
 * @returns
 */
export function getPoolsTopStocks () {
  return flash.get('/api/pool/preview')
}

/**
 * @description 获取涨停池数据
 * @date 2018-10-22
 * @returns
 */
export function getboardstock () {
  return flash.get('/api/pool/limit_up')
}

/**
 * @description 获取跌停池数据
 * @date 2018-10-22
 * @returns
 */
export function getdownstock () {
  return flash.get('/api/pool/limit_down')
}

/**
 * @description 获取涨停炸板池数据
 * @date 2018-10-22
 * @returns
 */
export function getboomstock () {
  return flash.get('/api/pool/limit_up_broken')
}

// 跌停炸板池
export function getLimitDownBroken () {
  return flash.get('/api/pool/limit_down_broken')
}

/**
 * @description 获取新股池数据
 * @date 2018-10-22
 * @returns
 */
export function getnewstock () {
  return flash.get('/api/pool/new_stock')
}

/**
 * @description 获取次新股池数据
 * @date 2018-10-22
 * @returns
 */
export function getsecstock () {
  return flash.get('/api/pool/nearly_new')
}

/**
 * @description 获取强势股池数据
 * @date 2018-10-22
 * @returns
 */
export function getmultistock () {
  return flash.get('/api/pool/super_stock')
}

/**
 * @description 获取昨日涨停池数据
 * @date 2018-10-22
 * @export funtion
 * @returns
 */
export function getboardpre () {
  return flash.get('/api/pool/yesterday_limit_up')
}

/**
 * @description 获取股票信息
 * @date 2018-10-22
 * @export
 * @param {string} symbols 以[,]分割
 * * fields:
 * * stock_chi_name 股票名
 * * symbol 代码
 * * price 价格
 * * turnover_ratio 换手率
 * * change_percent 涨跌幅
 * * mtm 涨速
 * * volume_bias_ratio 量比
 * * turnover_value 成交额
 * * limit_timeline 时间线
 * @returns
 */
export function getStockReal (symbols) {
  const fields = [
    'stock_chi_name',
    'symbol',
    'price',
    'change_percent',
    'turnover_ratio',
    'mtm',
    'volume_bias_ratio',
    'turnover_value'
    // 'limit_timeline'
  ]
  return flash.get(
    `/api/stock/data?strict=true&symbols=${symbols}&fields=${fields.join(',')}`
  )
}

/**
 * @description A股模块-获取股票排行榜
 * @date 2018-10-22
 * @param {*} rankType
 * @param {*} coverage // 1 为所有  2 为科创板
 * @returns
 */
export function getStockRank (rankType, coverage = 1) {
  return flash.get(`/api/stock/rank?type=${rankType}&coverage=${coverage}`)
}

/**
 * @description 查询大涨股理由
 * @date 2018-10-22
 * @param {*} symbols
 * @returns
 */
export function getTopStockReason (symbols) {
  return flash.get(`/api/surge_stock/reason/today?symbols=${symbols}`)
}

/**
 * @description 市场热度分时数据
 * @date 2018-10-09
 * @param {Array} fields 字段
 * @param {string} data 时间 格式 yyyy-MM-dd
 * @returns promise
 */
export function getMarketState (fields, data) {
  /**
   * * rise_count: 上涨数量
   * * fall_count: 下跌数量
   * * stay_count: 平盘数量
   * * limit_up_count: 涨停数量
   * * limit_down_count: 跌停数量
   * * limit_up_broken_count: 炸板数量
   * * limit_up_broken_ratio: 炸板率
   * * yesterday_limit_up_avg_pcp: 昨日涨停今日表现
   * * market_temperature: 市场热度
   */
  const defaultFields = fields || [
    'rise_count',
    'fall_count',
    'stay_count',
    'limit_up_count',
    'limit_down_count',
    'limit_up_broken_count',
    'limit_up_broken_ratio',
    'yesterday_limit_up_avg_pcp',
    'market_temperature'
  ]
  let url = `/api/market_indicator/line?fields=${defaultFields.join(',')}`
  if (data) {
    url = `${url}&date=${data}`
  }
  return flash.get(url)
}

/**
 * @description 板块模块-版块分类排行
 * @date 2018-10-22
 * @export
 * @param {number} [type=0]
 * * 0: 全部分类
 * * 1: 概念分类
 * * 2: 行业分类
 * * 3: 风格分类
 * @param {string} [field='core_avg_pcp']
 * * avg_pcp: 涨跌幅
 * * core_avg_pcp: 核心涨跌幅
 * * fund_flow: 资金净流向
 * @returns
 */
export function getPlateRank (type = 0, field = 'core_avg_pcp') {
  return flash.get(`/api/plate/rank?field=${field}&type=${type}`)
}

/**
 * @description 获取板块分时图
 * @author shufangyi
 * @date 2018-11-08
 * @export
 * @param {*} indexType
 * * 1:等权核心股
 * * 2:等权全部股
 * @param {*} plateId
 * @returns
 */
export function getPalteTendency (plateId, indexType = 1) {
  return flash.get(
    `/api/plate/index_realtime?index_type=${indexType}&plate_id=${plateId}`
  )
}

/**
 * @description 获取板块详情
 * @author shufangyi
 * @date 2018-10-23
 * @export
 * @param {string} plateIds '111,222,333'
 * @param {array} fields
 **  'plate_id',  id
 **  'plate_name',  板块名
 **  'fund_flow',  资金流向
 **  'rise_count',  上涨数量
 **  'fall_count',  下跌数量
 **  'stay_count',  平盘数量
 **  'limit_up_count',  涨停数量
 **  'led_falling_stocks',  领跌股
 **  'led_rising_stocks',  领涨股
 **  'core_avg_pcp',  核心涨跌幅
 **  'core_avg_pcp_rank',  核心涨跌幅排名
 **  'core_avg_pcp_rank_30min',  核心涨跌幅排名（30分钟前）
 **  'core_avg_pcp_rank_change'  核心涨跌幅排名变动
 * @returns
 */
export function getPlateInfo (
  plateIds,
  fields = [
    'plate_id',
    'plate_name',
    'fund_flow',
    'rise_count',
    'fall_count',
    'stay_count',
    'limit_up_count',
    'core_avg_pcp',
    'core_avg_pcp_rank',
    'core_avg_pcp_rank_change',
    'top_n_stocks,'
  ]
) {
  return flash.get(
    `/api/plate/data?plates=${plateIds}&fields=${fields.join(',')}`
  )
}

/**
 * @description 获取历史板块涨跌幅
 * @author shufangyi
 * @date 2019-04-18
 * @export
 * @param {Array} plateIds
 * @param {Number} date 秒为单位
 * @returns
 */
export function getPlateHistoryData (plateIds, date) {
  return flash.get(
    `/api/plate/change_pct_history?plate_ids=${plateIds.join(
      ','
    )}&timestamp=${date}`
  )
}

/**
 * @description 获取板块理由，利好利空标签
 * @author shufangyi
 * @date 2019-04-03
 * @export
 * @param {*} [plateIds=[]]
 * @returns
 */
export function getPlateBenefited (plateIds = []) {
  return flash.get(
    `/api/surge_stock/plates/info?plate_ids=${plateIds.join(',')}`
  )
}

/**
 * @description 盯盘首页 获取大涨股前三
 * @author shufangyi
 * @date 2018-11-15
 * @export
 * @returns
 */
export function getTopGainerStockByFlash () {
  return flash.get('/api/surge_stock/latest')
}

/**
 * @description 获取排名靠前板块
 * @author shufangyi
 * @date 2018-11-22
 * @export
 * @param {number} count 数量
 * @param {string} [fields='top']
 * * top 正数
 * * bottom 倒数
 * * all 全部
 * @returns
 */
export function getTopPlate (count = 3, fields = 'top') {
  return flash.get(`/api/stage2/plate/top_info?count=${count}&fields=${fields}`)
}

/**
 * @description 市场行情分时
 * @author shufangyi
 * @date 2019-03-20
 * @export
 * @param {array} fields
 * * rise_count: 上涨数量
 * * fall_count: 下跌数量
 * * stay_count: 平盘数量
 * * limit_up_count: 涨停数量
 * * limit_down_count: 跌停数量
 * * limit_up_broken_count: 涨停炸板数量
 * * limit_up_broken_ratio: 涨停炸板率
 * * yesterday_limit_up_avg_pcp: 昨日涨停今日表现
 * * market_temperature: 市场温度
 * * lianbangaodu: 全部股票连板高度
 * * nst_lianbangaodu: 非st股连板高度
 * @param {string} date [YYYY-MM-DD]
 * @returns Promise
 */
export function getThermometerByFlash (
  date,
  fields = [
    'market_temperature',
    'limit_up_count',
    'limit_down_count',
    'limit_up_broken_ratio',
    'yesterday_limit_up_avg_pcp'
  ]
) {
  return flash.get('/api/market_indicator/line', {
    params: {
      fields: fields.join(','),
      date
    }
  })
}

/**
 * @description 大涨股板块
 * @author shufangyi
 * @date 2019-03-20
 * @export
 * @param {string} data 当天零点时间戳
 * @returns
 */
export function getSurgeStockPlates (date) {
  return flash.get('/api/surge_stock/plates', {
    params: {
      date
    }
  })
}

/**
 * @description 大涨股股票
 * @author shufangyi
 * @date 2019-03-20
 * @export
 * @param {string} date [YYYYMMDD]
 * @param {boolean} [normal=true] 是否显示非涨停股
 * @param {boolean} [uplimit=true] 是否显示涨停股
 * @returns
 */
export function getSurgeStockStocks (date, normal = true, uplimit = true) {
  return flash
    .get('/api/surge_stock/stocks', {
      params: {
        date,
        normal,
        uplimit
      }
    })
    .then(res => {
      let result
      console.log(res)
      console.log(formatWowsStyleArray(res.items, res.fields), 'aaa')
      try {
        result = transformUnderscoreApi(
          formatWowsStyleArray(res.items, res.fields)
        )
      } catch (err) {
        console.log('getSurgeStockStocks flash', err)
        Promise.reject(err)
      }
      return result || {}
    })
    .catch(e => Promise.reject(e))
}

/**
 * @description 获取大涨股top1 在文章页底部做大涨股入口
 * @author shufangyi
 * @date 2019-07-26
 * @export
 * @returns
 */
export function getSurgeStockTopOne () {
  return flash
    .get('/api/stage5/share?typ=surge')
    .then(res => res.ShareStock || null)
    .catch(e => Promise.reject(e))
}

/**
 * @description
 * @author shufangyi
 * @date 2019-03-20
 * @export
 * @param {*} [symbols=[]]
 * @param {*} [fields=[]]
 * * break_limit_down_times: 开跌停板次数
 * * break_limit_up_times: 开涨停板次数
 * * business_amount_in: 内盘量
 * * business_amount_out: 外盘量
 * * buy_lock_volume_ratio: 买入封单比
 * * buy_price1: 买一价
 * * buy_price2: 买二价
 * * buy_price3: 买三价
 * * buy_price4: 买四价
 * * buy_price5: 买五价
 * * buy_volume1: 买一量
 * * buy_volume2: 买二量
 * * buy_volume3: 买三量
 * * buy_volume4: 买四量
 * * buy_volume5: 买五量
 * * change_percent: 涨跌幅
 * * close_price: 收盘价
 * * first_break_limit_down: 首次开跌停板时间
 * * first_break_limit_up: 首次开涨停板时间
 * * first_limit_down: 首次跌停时间
 * * first_limit_up: 首次涨停时间
 * * high_price: 最高价
 * * issue_price: 发行价
 * * last_break_limit_down: 最后开跌停板时间
 * * last_break_limit_up: 最后开涨停板时间
 * * last_limit_down: 最后跌停时间
 * * last_limit_up: 最后涨停时间
 * * limit_down_days: 连续跌停天数
 * * limit_status: 涨跌停状态
 * * limit_up_days: 连续涨停天数
 * * listed_date: 上市日期
 * * low_price: 最低价
 * * m_days_n_boards_boards: 几天几板板数
 * * m_days_n_boards_days: 几天几板天数
 * * mtm: 量比
 * * nearly_new_acc_pcp: 次新股累计涨幅
 * * nearly_new_break_days: 次新股开板天数
 * * new_stock_acc_pcp: 新股累计涨幅
 * * new_stock_break_limit_up: 新股开板时间
 * * new_stock_limit_up_days: 新股连续涨停天数
 * * new_stock_limit_up_price_before_broken: 新股开板前涨停价
 * * non_restricted_capital: 流通市值
 * * non_restricted_shares: 流通股本
 * * open_price: 开盘价
 * * prev_close_price: 昨日收盘价
 * * price: 最新价
 * * price_change: 涨跌额
 * * sell_lock_volume_ratio: 卖出封单比
 * * sell_price1: 卖一价
 * * sell_price2: 卖二价
 * * sell_price3: 卖三价
 * * sell_price4: 卖四价
 * * sell_price5: 卖五价
 * * sell_volume1: 卖一量
 * * sell_volume2: 卖二量
 * * sell_volume3: 卖三量
 * * sell_volume4: 卖四量
 * * sell_volume5: 卖五量
 * * stock_chi_name: 股票中文名
 * * symbol: 股票代码
 * * total_capital: 总市值
 * * total_shares: 总股本
 * * trade_status: 交易状态
 * * turnover_ratio: 换手率
 * * turnover_value: 成交额
 * * turnover_volume: 成交量
 * * updated_at: 更新时间
 * * volume_bias_ratio: 量比
 * * yesterday_break_limit_up_times: 昨日开涨停板数
 * * yesterday_first_limit_up: 昨日首次涨停时间
 * * yesterday_last_limit_up: 昨日最后涨停时间
 * * yesterday_limit_down_days: 昨日连续跌停天数
 * * yesterday_limit_up_days: 昨日连续涨停天数
 * * limit_timeline: 涨跌状态时间线
 * * entity_pcp: 实体涨幅
 * * today_extreme_deficit: 今日极亏
 * * today_extreme_profit: 今日极赚
 * * volume: 现手
 * * amplitude: 振幅
 * * backward_adjust_price: 后复权价
 * * per: 市盈率
 * * pbr: 市净率
 * * volume_trading_status: 现手交易状态
 * @param {boolean} [strict=true]
 * @returns
 */
export function getStockDetail (
  symbols = [],
  fields = [
    'symbol',
    'stock_chi_name',
    'change_percent',
    'm_days_n_boards_boards',
    'm_days_n_boards_days'
  ],
  strict = true
) {
  return flash.get('/api/stock/data', {
    params: {
      symbols: symbols.join(','),
      fields: fields.join(','),
      strict
    }
  })
}

/**
 * @description 获取最新的公司动态列表
 * @param {number} limit 动态个数，最多20条
 */
export function getDynamicList (limit = 10) {
  return flash.get(`/api/kechuangban/dynamicList?limit=${limit}`)
}

/**
 * @description 获取最新的资讯列表
 * @param {number} limit 列表文章的个数，最多20条
 * @param {string} cursor 查看更多时用到，传入前一个请求的cursor的值即可
 * @param {string} company_name 获取某个科创板公司的最新新闻
 */
export function getLatestNews (params) {
  return flash.get('/api/kechuangban/latestNews', {
    params
  })
}

/**
 * @description 获取科创板公司列表
 * @param {number} limit 要获取的公司个数
 * @param {string} cursor 查看更多时用到，传入前一个请求的cursor的值即可
 * @param {string} a_stock 是否只包含A股公司参股
 * @param {string} industry_label 所属行业
 * @param {string} ipo_phase_label 上市阶段
 */
export function getCompanyList (params) {
  return flash.get(`/api/kechuangban/listCompanies`, {
    params
  })
}

/**
 * @description 获取持有科创板公司的 A 股公司列表
 * @param {number} limit 要获取的公司个数
 * @param {string} cursor 查看更多时用到，传入前一个请求的cursor的值即可
 */
export function getShareholderList (params) {
  return flash.get('/api/kechuangban/listHolders', {
    params
  })
}

/**
 * @description 获取A股公司参股详情
 * @param {number} limit 要获取的公司个数
 * @param {string} cursor 查看更多时用到，传入前一个请求的cursor的值即可
 * @param {string} symbol 该A股公司的代码
 */
export function getShareholderDetail (params) {
  return flash.get('/api/kechuangban/holderDetail', {
    params
  })
}

/**
 * @description 获取科创公司详情
 * @param {string} chi_name 公司名称
 */
export function getCompanyDetail (name = '') {
  return flash.get(`/api/kechuangban/companyDetail?chi_name=${name}`)
}

/**
 * @description 搜索
 * @param {string} keyword
 */
export function searchCompany (keyword = '') {
  return flash.get(`/api/kechuangban/search?keyword=${keyword}`)
}

/**
 * @description 新闻详情
 * @param {number} article_id
 */
export function getNewsDetail (id) {
  return flash.get(`/api/kechuangban/newsDetail?article_id=${id}`)
}

/**
 * @description 热门搜索
 */
export function getHotCompanyList () {
  return flash.get('/api/kechuangban/hotCompanies')
}

/**
 * @description 上报用户搜索，用户在搜索结果页点击科创板公司后用这个接口上报，用 POST JSON 的方式，在 QueryString 里传参数没有用
 */
export function addCompanyClick (data) {
  return flash.post('/api/kechuangban/reportCompanyClick', data)
}

/**
 * @description 科创公司名单中用的下拉菜单选项
 */
export function getCompanySelectorOpts () {
  return flash.get('/api/kechuangban/dict')
}

/**
 * @description 获取科创列表
 */
export function getWikiList () {
  return flash.get('/api/kechuangban/wikiList')
}
