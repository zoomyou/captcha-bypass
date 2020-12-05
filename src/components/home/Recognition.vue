<template>

  <div>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>发起打码任务</el-breadcrumb-item>
    </el-breadcrumb>

    <el-tabs type="border-card" class="box-card" @tab-click="changeSrcType">

      <!-- 基于图片的验证码源 -->
      <el-tab-pane label="图片">
        <el-form :label-position="labelPosition" label-width="100px" :model="formData"  v-loading="loading === '1'">
          <!-- 上传图片 -->
          <el-form-item label="上传图片">

            <el-upload align="left"
              ref="img-upload"
              :action="posterUrl"
              :limit="1"
              :http-request="(params)=>uploadImage(params)"
              :on-remove="(file, fileList)=>removeImage(file, fileList)"
              list-type="picture"
              accept="image/*"
              >
              <el-button >选择图片<i class="el-icon-upload el-icon--right"></i></el-button>
            </el-upload>
          </el-form-item>

          <!-- 验证码类型 -->
          <el-form-item label="验证码类型">
            <el-input type="text" v-model="formData.code">
            </el-input>
          </el-form-item>
          
          <!-- 任务分发 -->
          <el-form-item label="打码客户端">
            <el-input type="text" v-model="formData.bypass_client">
            </el-input>
          </el-form-item>

          <!-- 识别结果 -->
          <el-form-item label="识别结果">
            <el-input type="text" v-model="formData.bypass_result">
            </el-input>
          </el-form-item>

          <!-- 识别率 耗时 -->
          <el-form-item label="识别率">
            <el-input type="text" v-model="formData.curr_acc">
            </el-input>
          </el-form-item>

          <el-form-item label="耗时">
            <el-input type="text" spellcheck="false" v-model="formData.speed">
            </el-input>
          </el-form-item>

          <!-- 打码评分 -->
          <el-form-item label="分数">
            <el-input type="text" v-model="formData.score">
            </el-input>
          </el-form-item>

          <!-- 识别按钮 -->
          <el-form-item align="left">
            <el-button type="primary" @click="recognise" :disabled="recog_disabled">
              {{this.recogButton}}
              <span v-show="!show" class="count">({{count}}s)</span>
              <!-- <i class="el-icon-camera-solid el-icon--right"></i> -->
            </el-button>

            <el-button v-if="accepted" type="primary" @click="right"><i class="el-icon-check"></i></el-button>
            <el-button v-if="accepted" type="danger" @click="fault"><i class="el-icon-close"></i></el-button>
            
          </el-form-item> 
                
        </el-form>

      </el-tab-pane>

      <!-- 基于base64编码的验证码源 -->
      <el-tab-pane label="Base64">
        <el-form :label-position="labelPosition" label-width="100px" :model="formData">
          <!-- 上传图片 -->
          <el-form-item label="Base64编码">
            <el-input
              type="textarea"
              :rows="6"
              spellcheck="false"
              v-model="formData.data">
            </el-input>
          </el-form-item>

          <!-- 验证码类型 -->
          <el-form-item label="验证码类型">
            <el-input type="text" v-model="formData.code">
            </el-input>
          </el-form-item>
          
          <!-- 任务分发 -->
          <el-form-item label="打码客户端">
            <el-input type="text" v-model="formData.bypass_client">
            </el-input>
          </el-form-item>

          <!-- 识别结果 -->
          <el-form-item label="识别结果">
            <el-input type="text" v-model="formData.bypass_result">
            </el-input>
          </el-form-item>

          <!-- 识别率 耗时 -->
          <el-form-item label="识别率">
            <el-input type="text" v-model="formData.curr_acc">
            </el-input>
          </el-form-item>

          <el-form-item label="耗时">
            <el-input type="text" v-model="formData.speed">
            </el-input>
          </el-form-item>

          <!-- 打码评分 -->
          <el-form-item label="分数">
            <el-input type="text" v-model="formData.score">
            </el-input>
          </el-form-item>

          <!-- 识别按钮 -->
          <el-form-item align="left">
            <el-button type="primary" @click="recognise" :disabled="recog_disabled">
              {{this.recogButton}}
              <span v-show="!show" class="count">({{count}}s)</span>
              <!-- <i class="el-icon-camera-solid el-icon--right"></i> -->
            </el-button>

            <el-button v-if="accepted" type="primary" @click="right"><i class="el-icon-check"></i></el-button>
            <el-button v-if="accepted" type="danger" @click="fault"><i class="el-icon-close"></i></el-button>
            
          </el-form-item> 

        </el-form>
        
      </el-tab-pane>

      <!-- 基于URL的验证码源 -->
      <el-tab-pane label="图片URL">
        <el-form :label-position="labelPosition" label-width="100px" :model="formData">
          <!-- 上传图片 -->
          <el-form-item label="URL 地址">
            <el-input placeholder="Http://" v-model="formData.data" spellcheck="false">
              <!-- <template slot="prepend">Http://</template> -->
            </el-input>
          </el-form-item>

          <!-- 验证码类型 -->
          <el-form-item label="验证码类型">
            <el-input type="text" v-model="formData.code">
            </el-input>
          </el-form-item>
          
          <!-- 任务分发 -->
          <el-form-item label="打码客户端">
            <el-input type="text" v-model="formData.bypass_client">
            </el-input>
          </el-form-item>

          <!-- 识别结果 -->
          <el-form-item label="识别结果">
            <el-input type="text" v-model="formData.bypass_result">
            </el-input>
          </el-form-item>

          <!-- 识别率 耗时 -->
          <el-form-item label="识别率">
            <el-input type="text" v-model="formData.curr_acc">
            </el-input>
          </el-form-item>

          <el-form-item label="耗时">
            <el-input type="text" v-model="formData.speed">
            </el-input>
          </el-form-item>

          <!-- 打码评分 -->
          <el-form-item label="分数">
            <el-input type="text" v-model="formData.score">
            </el-input>
          </el-form-item>

          <!-- 识别按钮 -->
         <el-form-item align="left">
            <el-button type="primary" @click="recognise" :disabled="recog_disabled">
              {{this.recogButton}}
              <span v-show="!show" class="count">({{count}}s)</span>
              <!-- <i class="el-icon-camera-solid el-icon--right"></i> -->
            </el-button>

            <el-button v-if="accepted" type="primary" @click="right"><i class="el-icon-check"></i></el-button>
            <el-button v-if="accepted" type="danger" @click="fault"><i class="el-icon-close"></i></el-button>
            
          </el-form-item> 

        </el-form>
        
      </el-tab-pane>

      <!-- 基于验证码链接 -->
      <el-tab-pane label="验证码链接">
        <el-form :label-position="labelPosition" label-width="100px" :model="formData" spellcheck="false">
          <!-- 上传图片 -->
          <el-form-item label="链接地址">
            <el-input placeholder="Http://" v-model="formData.data">
              <!-- <template slot="prepend">Http://</template> -->
            </el-input>
          </el-form-item>

          <!-- 验证码类型 -->
          <el-form-item label="验证码类型">
            <el-input type="text" v-model="formData.code">
            </el-input>
          </el-form-item>
          
          <!-- 任务分发 -->
          <el-form-item label="打码客户端">
            <el-input type="text" v-model="formData.bypass_client">
            </el-input>
          </el-form-item>

          <!-- 识别结果 -->
          <el-form-item label="识别结果">
            <el-input type="text" v-model="formData.bypass_result">
            </el-input>
          </el-form-item>

          <!-- 识别率 耗时 -->
          <el-form-item label="识别率">
            <el-input type="text" v-model="formData.curr_acc">
            </el-input>
          </el-form-item>

          <el-form-item label="耗时">
            <el-input type="text" v-model="formData.speed">
            </el-input>
          </el-form-item>

          <!-- 打码评分 -->
          <el-form-item label="分数">
            <el-input type="text" v-model="formData.score">
            </el-input>
          </el-form-item>

          <!-- 识别按钮 -->
         <el-form-item align="left">
            <el-button type="primary" @click="recognise" :disabled="recog_disabled">
              {{this.recogButton}}
              <span v-show="!show" class="count">({{count}}s)</span>
              <!-- <i class="el-icon-camera-solid el-icon--right"></i> -->
            </el-button>

            <el-button v-if="accepted" type="primary" @click="right"><i class="el-icon-check"></i></el-button>
            <el-button v-if="accepted" type="danger" @click="fault"><i class="el-icon-close"></i></el-button>
            
          </el-form-item> 

        </el-form>
        
      </el-tab-pane>

    </el-tabs>
    
  </div>
    
  
</template>


<script>
  const TIME_COUNT = 60;// 倒计时时间
  
  import axios from 'axios'

  export default {
    created() {
      this.src_type = '0'
    },

    data() {
      return {
        labelPosition: 'right',
        formData: {
          user_id: window.sessionStorage.getItem("user_id"),
          code: '',
          bypass_client: '',
          bypass_result: '',
          curr_acc: '',
          speed: '',
          score: '',
          src_type: '0',
          // temp_res: '',
          // captcha_base64: '',
          data:'',
          // path:'',
          job_id: '-1',
          // 验证码链接
          // captcha_url: ''
        },

        
        accepted: false,
        recognising: false,
        recog_disabled: false, 

        recogButton: '开始识别',
        show: true, // 初始启用按钮
        count: '', // 初始化次数
        timer: null,

        posterUrl: '',
        imgUrls: [],

        // 上传后文件名称和路径
        // imageInfo:{
        //   name:'',
        //   path:'',
        // },
        

        // 下拉框内容
        options: [{
            value: '选项1',
            label: '6字符数字+小写字母'
          }, {
            value: '选项2',
            label: 'Image-based 拖拽'
          }, {
            value: '选项3',
            label: 'Image-based 点选'
          }],
        value:'',

        loading: '0'
      };
    },
    
    methods: {
      // 对话框展示信息
      showInfo(info){
        this.$alert(info, {
          confirmButtonText: '确定',
          callback: action => {
            // this.$message({
            //   type: 'info',
            //   message: `action: ${ action }`
            // });
          }
        });
      },

      // 上传图片
      uploadImage(params) {
          console.log(params);
          let uploadData = new FormData();
          uploadData.append('upload', params.file);
          uploadData.append('user_id', window.sessionStorage.getItem("user_id"))
          
          let config = {
              headers: {
                  'Content-Type': 'multipart/form-data'
              }
          };
          // this.uploadPoster('homed'+new Date().getTime()+'/'+params.file.name, uploadData, config)
          this.uploadPoster('image/upload', uploadData, config)
          .then(res=>{
              console.log(res)
              let data = res.data;

              if(data.status === "200") {
                  params.onSuccess();
                  
                  // store the img path for showing in the bypass module
                  console.log('filename ' + data.fileName)
                  window.sessionStorage.setItem("captcha_src", data.fileName)

                  this.formData.data = data.fileName;
                  // this.formData.path = data.filePath;
                  this.$message.success(data.message);
                  // this.temp_res = JSON.stringify(data.fileName);
              }
          }).catch(error=>{
              params.onError();
              this.$message.error("上传失败");
          });
      },

      removeImage(file, fileList) {

          console.log(fileList);
          // this.temp_res = '';
          this.formData.bypass_result = '';
          this.formData.data = '';
          // this.formData.path = '';

          this.initForm();
      },

      initForm(){
          this.formData.data = ''
          this.recogButton = '开始识别'
          this.formData.curr_acc = ''
          this.formData.speed = ''
          this.formData.bypass_result = ''
          this.formData.bypass_client = ''
          this.formData.code = ''
          this.formData.score = ''
          this.job_id = '-1'
          this.accepted = false
          this.recog_disabled = false
          this.$refs['img-upload'].clearFiles()
      },

      uploadPoster(url, obj, config) {
          // let poster_upload_path = "/api/hello";
          return this.$http.post(url, obj, config);
      },

      recognise() {
        // 重新识别 则重新初始化表单
        if(this.recogButton === '重新识别'){
          return this.initForm();
        }

        console.log("begin to recognise")
        console.log(this.formData)
        this.recog_disabled = true;

        this.loading = '1';

        console.log("当前src_type是：" + this.src_type);

        this.$http.post("recognition", this.formData).then(res=>{
          const data = res.data
          if(data.status != '200') {

            // 如果与AI打码客户端连接出现问题
            if(data.status == '501'){
              this.showInfo(data.message);
              
              this.$http.get("response", {
                params:{
                  "job_id": data.job_id,
                  "response_code" : "0"
                }
              }).then( res => {
              })
              return ;
            }

            this.recog_disabled = false;    
            return this.showInfo(data.message);;

          }else{
            this.formData.bypass_result = data.bypass_result
            this.formData.bypass_client = data.client
            this.formData.code = data.class
            this.formData.job_id = data.job_id
            this.$message.success(data.message);
            
            // 添加识别结果反馈按钮
            this.accepted = true;
          }
        })

        this.loading = '0';
      },

      changeSrcType(tab, event){
        this.formData.src_type = tab.index
        this.initForm()
      },

      right(){
        // axios right to update feedback
        this.$http.get("response", {
          params:{
            "job_id": this.formData.job_id,
            "response_code" : "1"
          }
        }).then( res => {
            // 结果数据处理
            
            let data = res.data 
            
            console.log(data)

            if(data.status != '200') {
              this.$message.error(data.message)
            }else{
              this.formData.curr_acc = data.curr_acc
              this.formData.speed = data.speed
              this.formData.score = data.mark
              this.$message.success(data.message)
            }
        })

        this.accepted = false;
        this.recog_disabled = false;
        this.recogButton = '重新识别'
        // this.initForm();
      },

      fault(){
        // axios right to update feedback
        this.$http.get("response", {
          params:{
            "job_id": this.formData.job_id,
            "response_code" : "0"
          }
        }).then( res => {
            // 结果数据处理
            let data = res.data 
            
            console.log(data)

            if(data.status != '200') {
              this.$message.error(data.message)
            }else{
              this.formData.curr_acc = data.curr_acc
              this.formData.speed = data.speed
              this.formData.score = data.mark
              this.$message.success(data.message)
            }
        })

        this.accepted = false;
        this.recog_disabled = false;
        this.recogButton = '重新识别'
      }

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.el-row {
    /* border: #333333;
    border-style:solid;
    border-width:1px; */
    line-height: 10px;
}

#test {
  line-height: 80px;
  /* border: #42B983;
  border-style:solid;
  border-width:1px; */

}



</style>
