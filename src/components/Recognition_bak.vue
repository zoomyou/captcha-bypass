<template>

  <div>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>发起打码任务</el-breadcrumb-item>
    </el-breadcrumb>

    <el-tabs type="border-card" class="box-card">

      <!-- 基于图片的验证码源 -->
      <el-tab-pane label="图片">
        <el-form :label-position="labelPosition" label-width="100px" :model="formLabelAlign">
          <!-- 上传图片 -->
          <el-form-item label="上传图片">
            <el-upload align="left"
              :action="posterUrl"
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
            <el-input type="text" v-model="code">
            </el-input>
          </el-form-item>

          <!-- 打码客户端 -->
          <el-form-item label="打码客户端">
            <el-input type="text" v-model="bypass_client">
            </el-input>
          </el-form-item>

          <!-- 识别结果 -->
          <el-form-item label="识别结果">
            <el-input
              type="textarea"
              :rows="2"
              placeholder=""
              v-model="textarea">
            </el-input>
          </el-form-item>

          <!-- 识别按钮 -->
          <el-form-item align="left">
            <el-button type="primary" @click="onSubmit">开始识别<i class="el-icon-camera-solid el-icon--right"></i></el-button>
          </el-form-item> 

        </el-form>
      </el-tab-pane>

      <!-- 基于URL的验证码源 -->
      <el-tab-pane label="URL">
        <el-form :label-position="labelPosition" label-width="100px" :model="formLabelAlign">
          <!-- 上传图片 -->
          <el-form-item label="验证码链接">
            <el-input placeholder="请输入内容" v-model="captcha_url">
              <template slot="prepend">Http://</template>
            </el-input>
          </el-form-item>

          <!-- 验证码类型 -->
          <el-form-item label="验证码类型">
            <el-input type="text" v-model="code">
            </el-input>
          </el-form-item>

          <!-- 打码客户端 -->
          <el-form-item label="打码客户端">
            <el-input type="text" v-model="bypass_client">
            </el-input>
          </el-form-item>
          
          <!-- 识别结果 -->
          <el-form-item label="识别结果">
            <el-input
              type="textarea"
              :rows="2"
              placeholder=""
              v-model="textarea">
            </el-input>
          </el-form-item>

          <!-- 识别按钮 -->
          <el-form-item align="left">
            <el-button type="primary" @click="onSubmit">开始识别<i class="el-icon-camera-solid el-icon--right"></i></el-button>
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
        formLabelAlign: {
          name: '',
          region: '',
          type: ''
        },

        temp_res: '',
        textarea: '',

        posterUrl: '',
        imgUrls: [],

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
        captcha_url: ''


      };
    },
    methods: {

      // 上传图片
      uploadImage(params) {
          console.log(params);
          let uploadData = new FormData();
          uploadData.append('image_file', params.file);
          let config = {
              headers: {
                  'Content-Type': 'multipart/form-data'
              }
          };
          // this.uploadPoster('homed'+new Date().getTime()+'/'+params.file.name, uploadData, config)
          this.uploadPoster('/api/b', uploadData, config)
          .then(res=>{
              if(res.status == 200) {
                  params.onSuccess();
                  this.imgUrls.push({name:params.file.name, url:res.data.url});
                  // console.log(this.imgUrls);
                  console.log(res.data);
                  this.temp_res = JSON.stringify(res.data);
              }
          }).catch(error=>{
              params.onError();
              this.$message.error('上传失败');
          });
      },

      removeImage(file, fileList) {
          console.log(fileList);
          this.temp_res = '';
          this.textarea = '';
      },

      uploadPoster(url, obj, config) {
          // let poster_upload_path = "/api/hello";
          return axios.post(url, obj, config);
      },

      onSubmit() {
        this.textarea = this.temp_res;
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
