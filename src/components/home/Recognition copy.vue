<template>

  <div>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>发起打码任务</el-breadcrumb-item>
    </el-breadcrumb>

    <el-tabs type="border-card" class="box-card">

      <!-- 基于图片的验证码源 -->
      <el-tab-pane label="图片">
        <el-form :label-position="labelPosition" label-width="100px" :model="formData"  v-loading="loading === '1'">
          <!-- 上传图片 -->
          <el-form-item label="上传图片">

            <el-upload align="left"
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
            <el-button type="primary" @click="recognise">开始识别<i class="el-icon-camera-solid el-icon--right"></i></el-button>
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
              v-model="captcha_base64">
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
            <el-button type="primary" @click="recognise_base">开始识别<i class="el-icon-camera-solid el-icon--right"></i></el-button>
          </el-form-item> 

        </el-form>
        
      </el-tab-pane>

      <!-- 基于URL的验证码源 -->
      <el-tab-pane label="URL">
        <el-form :label-position="labelPosition" label-width="100px" :model="formData">
          <!-- 上传图片 -->
          <el-form-item label="验证码链接">
            <el-input placeholder="请输入内容" v-model="captcha_url">
              <template slot="prepend">Http://</template>
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
            <el-button type="primary" @click="recognise">开始识别<i class="el-icon-camera-solid el-icon--right"></i></el-button>
          </el-form-item> 

        </el-form>
        
      </el-tab-pane>
    </el-tabs>
    
  </div>
    
  
</template>


<script>
  import axios from 'axios'

  export default {
    data() {
      return {
        labelPosition: 'right',
        formData: {
          code: '',
          bypass_client: '',
          bypass_result: '',
          curr_acc: '',
          speed: '',
          score: ''
        },

        temp_res: '',
        captcha_base64: '',

        posterUrl: '',
        imgUrls: [],

        // 上传后文件名称和路径
        imageInfo:{
          name:'',
          path:'',
        },
        

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

        // 验证码链接
        captcha_url: '',

        loading: '0'
      };
    },
    methods: {

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
          this.uploadPoster('/upload', uploadData, config)
          .then(res=>{
              console.log(res)
              let data = res.data;

              if(data.status === "200") {
                  params.onSuccess();
                  
                  // store the img path for showing in the bypass module
                  console.log('filename ' + data.fileName)
                  window.sessionStorage.setItem("captcha_src", data.fileName)

                  this.imageInfo.name = data.fileName;
                  this.imageInfo.path = data.filePath;
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
          this.temp_res = '';
          this.formData.bypass_result = '';
          this.imageInfo.name = '';
          this.imageInfo.path = '';

          this.clearForm();
      },

      clearForm(){
          this.formData.curr_acc = ''
          this.formData.speed = ''
          this.formData.bypass_result = ''
          this.formData.bypass_client = ''
          this.formData.code = ''
          this.formData.score = ''
      },

      uploadPoster(url, obj, config) {
          // let poster_upload_path = "/api/hello";
          return axios.post(url, obj, config);
      },

      recognise() {
        console.log("begin to recognise")
        console.log(this.imageInfo)

        this.loading = '1';
        this.$http.post("recognition", this.imageInfo).then(res=>{
          console.log(res)
          const data = res.data
          if(data.status != '200') {
            this.$message.error("识别失败！");
          }else{
            this.formData.curr_acc = data.curr_acc
            this.formData.speed = data.speed
            this.formData.bypass_result = data.bypass_result
            this.formData.bypass_client = data.client
            this.formData.code = data.class
            this.formData.score = data.mark
            this.$message.success("识别成功！");
          }
        })

        this.loading = '0';
        // this.textarea = this.temp_res;
      },

// base64 recognise
      recognise_base(){
        console.log("begin to recognise")

        this.loading = '1';
        this.$http.post("recognition", {"captcha_base64": this.captcha_base64, "src_type": "1"}).then(res=>{
          console.log(res)
          // const data = res.data
          // if(data.status != '200') {
          //   this.$message.error("识别失败！");
          // }else{ 
          //   this.formData.curr_acc = data.curr_acc
          //   this.formData.speed = data.speed
          //   this.formData.bypass_result = data.bypass_result
          //   this.formData.bypass_client = data.client
          //   this.formData.code = data.class
          //   this.formData.score = data.mark
          //   this.$message.success("识别成功！");
          // }
        })

        this.loading = '0';
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
