<template>
  <div class="test">
    <img :src="captcha_src">
  </div>
</template>

<script>
  export default {
    name : 'test',
    data() {
      return {
        user_id: '',
        // captcha source address
        captcha_src: '',

        websock: null,
      }
    },
    created() {
      this.user_id = window.sessionStorage.getItem("user_id")
      this.initWebSocket();
    },
    destroyed() {
      this.websock.close() //离开路由之后断开websocket连接
      console.log("leaving websocket...")
    },

    methods: {
      initWebSocket(){ //初始化weosocket
        const wsuri = "ws://localhost:80/socket/" + this.user_id;
        this.websock = new WebSocket(wsuri);
        this.websock.onerror = this.websocketonerror;
        this.websock.onopen = this.websocketonopen;
        this.websock.onclose = this.websocketclose;
        this.websock.onmessage = this.websocketonmessage;
      },

      websocketonopen(){ //连接建立之后执行send方法发送数据
        console.log("Established socket connection!");
      },

      websocketonerror(){//连接建立失败重连
        console.log("Error in establishing connect to socket server, try to reconnect...");
        this.initWebSocket();
      },
      
      websocketonmessage(e){ //数据接收
        console.log('image receive')
        console.log(e)
        const redata = e.data;
        // this.src = redata.captcha_src;
        // this.code = this.code 
        this.captcha_src = "http://localhost:80/image/" + redata
        // data:image/jpeg;base64,
        console.log("Received image from server! " + redata)
      },

      websocketclose(e){  //关闭
        console.log('Disconnect from socket!',e);
      },


      sendMessage() {
        if(typeof(WebSocket) == "undefined") {
            console.log("您的浏览器不支持WebSocket");
        }else {
            console.log("您的浏览器支持WebSocket");
            
            socket.send('{"toUserId":"'+$("#toUserId").val()+'","contentText":"'+$("#contentText").val()+'"}');
        }
      },
      
      
    },
  }
</script>

<style scoped>

</style>
