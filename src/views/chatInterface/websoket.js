   import notice from '@/notice/notice.js' // 通知类
   import store  from '@/store/index'
  function connectSocket(msgData) {
<<<<<<< HEAD
    const wsurl = 'ws://192.168.2.20:8282'
=======
    const wsurl = 'ws://106.14.150.55:8282'
>>>>>>> f130195071cc2d236642970d18c0f3f6f893b3a0
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
<<<<<<< HEAD
      console.log('推送消息00', evt.data)
=======
>>>>>>> f130195071cc2d236642970d18c0f3f6f893b3a0
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
<<<<<<< HEAD
        var list = store.state.noticeList
        if (localStorage.noticeList) {
          list = Array.from(JSON.parse(localStorage.noticeList))
        }
        list.push(data);
        store.state.noticeList = list
        localStorage.noticeList = JSON.stringify(list)
=======
>>>>>>> f130195071cc2d236642970d18c0f3f6f893b3a0
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
<<<<<<< HEAD
=======
         } else {
          notice.ymNotice({
            title: '提示',
            message: data.message,
            position: 'right-top',
            remindtype: '5',
            imgUrl: '../../images/3d.jpg',
          })
>>>>>>> f130195071cc2d236642970d18c0f3f6f893b3a0
         }
       }
      }
      if (data.action === 'group-chat') {
<<<<<<< HEAD
        console.log('推送数据', data)
=======
        // console.log('推送数据', data)
>>>>>>> f130195071cc2d236642970d18c0f3f6f893b3a0
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