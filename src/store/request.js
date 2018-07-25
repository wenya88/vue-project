'use strict'

import router from '../router'
import axios from 'axios'
let Axios = axios.create({
  timeout:30000,
});
// http request 拦截器
Axios.interceptors.request.use(
  config => {
    if (localStorage.token) {
      config.headers.token = `${localStorage.token}`;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  });

// http response 拦截器
Axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error) {
      console.log(error)
      router.push('/500')
    }
    return Promise.reject(error.response.data)   // 返回接口返回的错误信息
  });

 export default Axios