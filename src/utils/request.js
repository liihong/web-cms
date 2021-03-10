import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

const BASE_URL = process.env.NODE_ENV === 'development' ? '/api' : 'http://www.letonglexue.com/api'
// const BASE_URL =  'http://www.letonglexue.com/api'

// 创建axios实例
const request = axios.create({
  // baseURL: 'https://easy-mock.com/mock/5baa16736d85f81e16ad4858/cms',
  baseURL: BASE_URL ,
  timeout: 5000 // 请求超时时间
})

// request拦截器
request.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
request.interceptors.response.use(
  response => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    const res = response.data
    if (res.status !== 0) {
      // Message({
      //   message: res.msg,
      //   type: 'error',
      //   duration: 5 * 1000
      // })

      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (res.status === 50008 || res.status === 50012 || res.status === 50014) {
        MessageBox.confirm(
          '你已被登出，可以取消继续留在该页面，或者重新登录',
          '确定登出',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.msg,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

request.get = function get(url, param) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url,
      params: param
    }).then(res => {
        resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

request.post = function post(url, param) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url:request.baseURL+url,
      data: param
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

request.getBolb = function(url, param) {
  return new Promise((resolve, reject) => {
    return axios({
      url: url,
      method: 'GET',
      params: param,
      responseType: 'blob'
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
request.postBolb = function(url, param) {
  return new Promise((resolve, reject) => {
    return axios({
      url: url,
      method: 'POST',
      params: param,
      headers:{
        'Content-Type': 'multipart/form-data'
      }
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

export default request
