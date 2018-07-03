   import notice from '@/notice/notice.js' // 通知类
   import store  from '@/store/index'
  function connectSocket(msgData) {
    const wsurl = 'ws://106.14.150.55:8282'
    window.webSocket = new WebSocket(wsurl)
    // console.log("webSocket连接成功前", wsurl)
    /*建立连接*/
    webSocket.onopen = evt => {
      // console.log("webSocket连接成功")
    //   let data = {type: 'bind'}
    //   let json = JSON.stringify(msgData)
      // console.log("webSocket连接成功...", msgData)
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
         } else {
          notice.ymNotice({
            title: '提示',
            message: data.message,
            position: 'right-top',
            remindtype: '5',
            imgUrl: '../../images/3d.jpg',
          })
         }
       }
      }
      if (data.action === 'group-chat') {
        // console.log('推送数据', data)
        // localStorage.removeItem('useList')
        // const list = Array.from(JSON.parse(localStorage.useList)) || [];
        var list = store.state.useList
        if (localStorage.useList) {
          list = Array.from(JSON.parse(localStorage.useList))
        }
        list.push(data);
        // console.log('数据1', JSON.stringify(list))
        store.state.useList = list
        localStorage.useList = JSON.stringify(list)
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