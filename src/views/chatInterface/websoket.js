   import notice from '@/notice/notice.js' // 通知类
   import store  from '@/store/index'
   import Cookies from 'js-cookie';
   // const wsurl = 'ws:' + Cookies.get('hostName').split(':')[1] + ':8282'
   // console.log('数据', wsurl)
  function connectSocket(msgData) {
    const wsurl = 'ws://59.111.95.148:8282'
    window.webSocket = new WebSocket(wsurl)
    /*建立连接*/
    webSocket.onopen = evt => {
      webSocket.send(msgData)
    }
    /*连接关闭*/
    webSocket.onclose = evt => {
      console.log("webSocket连接关闭")
    }
    /*接收服务器推送消息*/
    webSocket.onmessage = evt => {
      let data = JSON.parse(evt.data)
      if (data.action === 'ping') {
        const data = JSON.stringify({
          action: 'ping'
        })
        webSocket.send(data)
      }
      if (data.action === 'login') {
        localStorage.userMsg = JSON.stringify(data)
      }
      if (data.action === 'notice') {
        var list = store.state.noticeList
        if (localStorage.noticeList) {
          list = Array.from(JSON.parse(localStorage.noticeList))
        }
        list.push(data);
        store.state.noticeList = list
        localStorage.noticeList = JSON.stringify(list)
        // 浏览器是否支持Notification
        if(!window.Notification) {
          alert("该浏览器不支持桌面通知！")
        } else {
          // 是否已被允许使用Notification
          if (Notification.permission === "granted") {
            notice.ymywindow({
              title: '提示',
              message: data.message
            })
          } else if (Notification.permission !== "denied") {
            // 请求用户授权
            Notification.requestPermission (function(permission) {
              if (permission === "granted") {
                notice.ymywindow({
                  title: '提示',
                  message: data.message
                })
              }
           })
         }
       }
      }
      if (data.action === 'group-chat') {
        var list = store.state.useList
        if (localStorage.useList) {
          list = Array.from(JSON.parse(localStorage.useList))
        }
        list.push(data);
        // console.log('数据1', JSON.stringify(list))
        store.state.useList = list
        localStorage.useList = JSON.stringify(list)
      }
      if(data.action === 'download_url'){
        if(data.download_url){
            store.state.downloadStatus = true;
            store.state.isaDownStatus = true;
            var a = document.createElement('a');
            a.href = data.download_url;
            a.click();
        }
      }
    }
    /*连接发生错误时*/
    webSocket.onerror = (evt, e) => {
      console.log('error', evt)
    }
  }
  export default {
    connectSocket
  }
