   import notice from '@/notice/notice.js' // 通知类\
  function connectSocket(msgData) {
    const wsurl = 'ws://192.168.2.20:8282'
    window.webSocket = new WebSocket(wsurl)
    /*建立连接*/
    webSocket.onopen = evt => {
      console.log("webSocket连接成功")
    //   let data = {type: 'bind'}
    //   let json = JSON.stringify(msgData)
      console.log("webSocket连接成功...", msgData)
      webSocket.send(msgData)
    }
    /*连接关闭*/
    webSocket.onclose = evt => {
      console.log("webSocket连接关闭")
    }
    /*接收服务器推送消息*/
    webSocket.onmessage = evt => {
      let data = JSON.parse(evt.data)
      console.log('推送数据', data)
      if (data.action === 'notice') {
        notice.ymNotice({
          title: '提示',
          message: data.message,
          position: 'right-top',
          remindtype: '5',
          imgUrl: '../../images/3d.jpg',
        })
        notice.ymywindow({
          title: '提示',
          message: data.message
        })
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