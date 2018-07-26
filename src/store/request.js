'use strict'

import router from '../router'
import axios from 'axios'
import Cookies from 'js-cookie';
let Axios = axios.create({
  timeout:30000,
});
// http request 拦截器
// Axios.interceptors.request.use(
//   config => {
//     if (localStorage.token) {
//       config.headers.token = `${localStorage.token}`;
//     }
//     return config;
//   },
//   err => {
//     return Promise.reject(err);
//   });

// http response 拦截器
Axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    console.log(error.response);
    if (error.response) {
      if(error.response.status == '600') {
        Cookies.remove('user');
        localStorage.removeItem('token');
        router.push('/login');
      }
      // console.log(error)
      // router.push('/500')
      // switch (error.response.status) {
      //   case 600:
      //     router.push('/login')
      // }
    }
    return Promise.reject(error.response.data)   // 返回接口返回的错误信息
  });

 export default Axios