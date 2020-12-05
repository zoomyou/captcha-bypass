<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>打码任务</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 基本信息展示 -->
    <el-card class="box-card">
      <div class="captcha-region">
        <b v-if="this.loading === '1'">正在实时接收打码任务...</b>

        
        <!-- 验证码图片 -->
        <div class="captcha-img" >
          <div class="img" id="captcha" v-if="!fromIframe" v-bind:style="{position: ci_posi, width: widthData, height: heightData}">
            <img :src="captcha_src" @load="getStyle"/>
          </div>

          <div class="captcha_iframe" v-else >
            <iframe :src="captcha_src" height="100%" width="100%"></iframe>
          </div>
          
          <!-- <el-image id="captcha" :src="src" :fit="scale-down" ></el-image> -->

          <!-- <img id="captcha" src="@/components/home/laoding.gif" /> -->
        </div>

        <!-- 打码结果 -->
        <div class="captcha-res" v-if="!fromIframe">
          <el-input v-model="bypass_res" placeholder="打码结果" v-if="this.loading === '0'"></el-input>
        </div>

        <!-- 按钮区域 -->
        <div class="captcha-button" align="center" v-if="this.loading === '0'">
          <el-button type="primary" @click="submmit">
            提交
            <span v-show="!show" class="count">({{this.count}}s)</span>
          </el-button>

          <el-button type="info" @click="reset" v-if="!fromIframe">重置</el-button>
          <el-button type="danger" @click="giveUp">放弃</el-button>
        </div>
      </div>

      <!-- 对话框提示超时 -->
      <el-dialog title="打码超时" :visible.sync="this.dialogVisible" width="30%">
        <span>您已超时，系统认定此次打码任务失败！</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="timeout">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog title="警告" :visible.sync="this.cautionVisible" width="30%">
        <span>{{cautionMsg}}</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="leave">确 定</el-button>
          <el-button type="primary" @click="cancel">取 消</el-button>
        </span>
      </el-dialog>

    </el-card>
  </div>
</template>


<script>
var markerCount = 0;  // marker 计数器

export default {
  mounted() {},

  updated() {
    const self = this;
    
    if (self.loading === "0" && self.fromIframe === false) {
      document.getElementById("captcha").onclick = function (e) {
        e = e || window.event;
        var x = e.offsetX || e.layerX,
          y = e.offsetY || e.layerY;
        console.log(x);

        self.createMarker(x, y, "captcha");
        let coord = x + "," + y + "   ";
        console.log(coord);

        self.bypass_res = self.bypass_res + coord;
        console.log(self.bypass_res);
      };
    }
  },

  created() {
    this.captcha_src = require("@/components/home/loading.gif");
    this.user_id = window.sessionStorage.getItem("user_id");
    this.initWebSocket();
  },

  destroyed() {
    this.websock.close(); //离开路由之后断开websocket连接

    

    console.log("leaving websocket...");
  },

  data() {
    return {
      user_id: "",
      // captcha source address
      captcha_src: "",
      src_type: '',
      
      // 警告对话框内容
      cautionMsg: '',

      // 是否来自一个验证码链接
      fromIframe: false,

      websock: null,

      bypass_res: "",
      loading: "1",

      
      TIME_COUNT: 60,
      show: true,
      count: "",
      timer: null,

      dialogVisible: false,
      cautionVisible: false,

      // captcha img 
      widthData: '',
      heightData: '',
      ci_posi: 'relative'
      
    };
  },
  methods: {
    createMarker(x, y, divName) {
      var div = document.createElement("div");

      let side = 24;
      

      div.className = "marker";
      div.innerText = ++markerCount;
      div.style.textAlign = "center";
      div.style.color = "#ffffff";
      div.style.width = side + "px";
      div.style.height = side + "px";
      
      div.style.left = (x - side/2) + "px";
      div.style.top = (y - side/2) + "px";
      
      div.style.borderRadius = "35px";
      div.style.position = "absolute";
      div.style.zIndex = 20;
      div.style.background = "#FF66FF";
      // div.style.opacity = 0.7;

      document.getElementById(divName).appendChild(div);
      console.log("create marker");
    },

    initWebSocket() {
      //初始化weosocket
      const wsuri = "ws://localhost:80/socket/" + this.user_id;
      // const wsuri = "ws://47.97.74.223:80/socket/" + this.user_id;
      // const wsuri = "ws://10.10.11.161:80/socket/" + this.user_id;
      this.websock = new WebSocket(wsuri);
      this.websock.onerror = this.websocketonerror;
      this.websock.onopen = this.websocketonopen;
      this.websock.onclose = this.websocketclose;
      this.websock.onmessage = this.websocketonmessage;
    },

    websocketonopen() {
      console.log("Established socket connection!");
    },

    websocketonerror() {
      //连接建立失败重连
      console.log(
        "Error in establishing connect to socket server, try to reconnect..."
      );
      this.initWebSocket();
    },

    websocketonmessage(e) {
      //数据接收
      // clear tha last records
      this.clearMarkers();

      // start timer
      this.startTimer();

      // show captcha based on captcha type
      const reStrData = e.data;
      let redata = JSON.parse(reStrData)
      console.log(redata);
      
      if(redata.src_type === '0'){
        console.log('uploaded image')
        this.captcha_src = "http://localhost:80/image/" + redata.show_data;
        // this.captcha_src = "http://47.97.74.223:80/image/" + redata.show_data;
        // this.captcha_src = "http://10.10.11.161:80/image/" + redata.show_data
      }else{
        
        console.log('captcha from url')
        
        if(redata.src_type === '2'){
          this.captcha_src = redata.show_data + "&a=" + Math.random();
          console.log('New img_src: ' + this.captcha_src)
        }else{
          this.captcha_src = redata.show_data
        }

        if(redata.src_type === '3'){
          this.fromIframe = true;
          console.log('fromeIframe : ' + this.fromIframe)
        }
      }      

      this.src_type = redata.src_type;
      this.loading = "0";
      console.log("Received image from server! " + redata);
    },

    websocketclose(e) {
      //关闭
      console.log("Disconnect from socket!", e);
      // 关闭定时器
      this.closeTimer();
    },

    sendMessage(message) {
      if (typeof WebSocket == "undefined") {
        console.log("您的浏览器不支持WebSocket");
      } else {
        console.log("您的浏览器支持WebSocket");

        console.log("send msg: " + message);

        this.websock.send(message);
      }
    },

    clearMarkers() {
      // let imgDiv = document.getElementById("captcha")
      let markers = document.querySelectorAll(".marker");
      let markerPara = document.getElementById("captcha");

      console.log(markerPara);

      for (var i = 0; i < markers.length; i++) {
        markerPara.removeChild(markers[i]);
      }

      console.log(markerPara);

      this.bypass_res = "";
      markerCount = 0;
      console.log(markers);
    },

    
    reset() {
      this.clearMarkers();
    },

    submmit() {
      
      if(this.src_type === '3')
        this.bypass_res = '完成打码'

      if(this.bypass_res === ''){
        // return this.cautionMsg = '任务正在进行中，此时离开打码界面系统自动判定为任务失败，是否确定离开？'.
        this.cautionVisible = true
        return this.cautionMsg = '打码结果内容为空，提交则判定为打码失败，确定提交？'
      }

      
      this.sendMessage(this.bypass_res);
      this.captcha_src = require("@/components/home/loading.gif");
      this.closeTimer();
      this.clearMarkers();
      this.loading = "1";
      this.fromIframe = false;
      console.log("submit, now bypass " + this.bypass_res);
    },

    // 放弃这个任务
    giveUp() {
      this.bypass_res = 'giveup'
      this.submmit();
      this.fromIframe = false;
    },

    // 定时器开启，并且定时器结束后发送超时信息到后台
    startTimer() {
      if (!this.timer) {
        this.count = this.TIME_COUNT;
        this.show = false;
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= this.TIME_COUNT) {
            this.count--;
          } else {
            this.bypass_res = 'timeout'
            this.submmit();
            this.dialogVisible = true;
          }
        }, 1000);
      }
    },

    initTimer() {
      // (this.TIME_COUNT = 60),
        (this.show = true),
        (this.timer = null),
        (this.count = "");
    },

    closeTimer() {
      clearInterval(this.timer); // 清除定时器
      this.initTimer();
    },

    timeout(){
      this.dialogVisible = false;
      this.fromIframe = false;
    },

    cancel(){
      this.cautionVisible = false;
    },

    // 判定路由跳转
    // 用户中途离开打码界面时如何处理， // 如果离开则直接认为放弃任务
    leave(){
      this.giveUp()
      this.cautionVisible = false
    },

    // 获取图片宽高
    getStyle(event){
      let w = event.target.width
      let h = event.target.height
      this.widthData = w + "px"
      this.heightData = h + "px"
      console.log("width and height are " + w + "," + h)
    }

  },
};
</script>

<style scoped>
.captcha-img {
  height: 75%;
  width: 100%;
  /* padding: 5px 5px; */
}

.captcha-button {
  /* height: 10%; */
  width: 100%;
  margin-top: 10px;
}

.captcha-region {
  /* background-color: aquamarine; */

  width: 400px;
  /* height: 400px; */
}

.captcha_iframe {
  width: 500px;
  height: 500px;
}
</style>