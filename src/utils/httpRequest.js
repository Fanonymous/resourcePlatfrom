import Vue from 'vue'
import axios from 'axios'
import router from '@/router'
import qs from 'qs'
import merge from 'lodash/merge'
import { clearLoginInfo } from '@/utils'
import { Message } from 'element-ui'
const http = axios.create({
  baseURL: window.SITE_CONFIG.baseUrl, // api的base_url
  timeout: 5*60*1000,
  //是否携带cookie信息
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})

/**
 * 请求拦截
 */
http.interceptors.request.use(config => {
  // let token = Vue.cookie.get('accesstoken')
  // if (!token || !/\S/.test(token) || router.path != '/login') {
  //     clearLoginInfo()
  //     router.push({ name: 'login' })
  //     return
  // }
	config.headers['accesstoken'] = Vue.cookie.get('accesstoken')
//	config.headers['roleid'] =  Vue.cookie.get('roleId')
	config.headers['appType'] =  1
	config.headers['deptId'] = Vue.cookie.get('orgId')
	config.headers['deptType'] = Vue.cookie.get('userType')
	config.headers['userId'] = Vue.cookie.get('userId')

  return config
}, error => {
  return Promise.reject(error)
})

/**
 * 响应拦截
 */
http.interceptors.response.use(response => {
//console.log(response.data.code)
  if (response.data.code === 500) {
    //未知异常
    Message({
      message: response.data.msg,
      type: 'error',
      duration: 3 * 1000
    })
  }
  if (response.data &&( response.data.code === 110 || response.data.code === 401)) { // 401, token失效
    //未知异常
    if(response.data.msg != undefined){
    	Message({
	      message: response.data.msg,
	      type: 'error',
	      duration: 3 * 1000
	    })
    }

    clearLoginInfo()
		// if(window.SITE_CONFIG.cmsIp == 1){
		  router.push({ name: 'login' })
		// }else{
		//   window.location.href = window.SITE_CONFIG.cmsIp
		// }
  }
  if(response.data && response.data.code === 444){
    //授权失败
    clearLoginInfo()
    router.push({ name: 'authorization-fail' })
  }
  return response
}, error => {
  // console.log(error)
  // console.log(error.response)
  // if (error && error.response) {
  //     switch (error.response.status) {
  //       case 404:
  //         Message({
  //           message: '请求出错404',
  //           type: 'error',
  //           duration: 3 * 1000
  //         })
  //         break;
  //       case 500:
  //         Message({
  //           message: '服务器错误500',
  //           type: 'error',
  //           duration: 3 * 1000
  //         })
  //         break;
  //       case 504:
  //         Message({
  //           message: '连接超时',
  //           type: 'error',
  //           duration: 3 * 1000
  //         })
  //         break;
  //       default: error.message = `连接出错(${error.response.status})!`;
  //   }
  // }

  return Promise.reject(error)
})

/**
 * 请求地址处理
 * @param {*} actionName action方法名称
 */
http.adornUrl = (actionName) => {
  // console.log(actionName,'actionNameactionName')
  // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
  //return window.SITE_CONFIG.baseUrl + actionName
  return (process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? '/proxyApi/' : window.SITE_CONFIG.baseUrl)+actionName
}
http.adornUrlMedia = (actionName) => {
  // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
  //return window.SITE_CONFIG.baseUrl + actionName
  return (process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? '/proxyApi/' : window.SITE_CONFIG.baseUrlMedia) + actionName
}
http.adornLocalUrl = (actionName) => {
  // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
  return (process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? '/proxyApi/' : window.SITE_CONFIG.baseLocalUrl) + actionName
}
http.adornAnyUrl = (actionName) => {
  // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
  return (process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? '/proxyApi/' : window.SITE_CONFIG.analysisIp) + actionName
}

http.adornLicenseUrl = (actionName) => {
  // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
  return (process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? '/proxyApi/' : window.SITE_CONFIG.license) + actionName
}
http.adornOauthUrl = (actionName) => {
  return (process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? '/proxyApi/' : window.SITE_CONFIG.diamaOauth) + actionName
}
/**
 * get请求参数处理
 * @param {*} params 参数对象
 * @param {*} openDefultParams 是否开启默认参数?
 */
http.adornParams = (params = {}, openDefultParams = true) => {
  var defaults = {
    //'t': new Date().getTime()
  }
  return openDefultParams ? merge(defaults, params) : params
}

/**
 * post请求数据处理
 * @param {*} data 数据对象
 * @param {*} openDefultdata 是否开启默认数据?
 * @param {*} contentType 数据格式
 *  json: 'application/json; charset=utf-8'
 *  form: 'application/x-www-form-urlencoded; charset=utf-8'
 */
http.adornData = (data = {}, openDefultdata = true, contentType = 'json') => {
  var defaults = {
    //'t': new Date().getTime()
  }
  data = openDefultdata ? merge(defaults, data) : data
  return contentType === 'json' ? JSON.stringify(data) : qs.stringify(data)
}

export default http
