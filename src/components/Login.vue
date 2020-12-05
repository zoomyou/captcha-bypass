<template>
  <div>
      <!-- model 绑定数据 -->
      <!-- rules 绑定表单验证规则 -->
      <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="login-container" label-position="left"
           label-width="0px">

        <h3 class="login_title">系统登录</h3>
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="账号">
            
          </el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item prop="password" placeholder="密码">
          <el-input v-model="loginForm.password" type="password" placeholder="密码"></el-input>
        </el-form-item>
        
        <!-- 按钮 -->
        <el-form-item style="width: 100%">
          <el-button type="primary" @click="login" style="width: 100%">登录</el-button>
        </el-form-item>
        <el-form-item style="width: 100%">
          <el-button type="primary" @click="register" style="width: 100%">注册</el-button>
        </el-form-item>
       
      </el-form>
  </div>
</template>


<script>
export default {
  
  data() {
    return {
      loginForm: {
        username : '',
        password : ''
      },
      loginRules: {
        // 用户名验证
        username : [
          { required:true, message: '请输入用户名', trigger: "blur"},
          { min: 3, max : 10, message: "长度在3到10个字符", trigger:"blur"}
        ],
        // 密码验证
        password : [
          { required:true, message: '请输入密码', trigger: "blur"},
          { min: 3, max : 10, message: "长度在3到15个字符", trigger:"blur"}
        ]
      }
    }
  },
  methods: {

    // 需要 返回 
    login(){
      // 通过 this.$refs 找到 表单对象引用 loginRef 使用 validate 方法
      // 这里 需要了解 promise 返回对象怎么处理 async await
      this.$refs.loginRef.validate( async (valid) => {
        const resTemp = await this.$http.post("login", this.loginForm);
        const res = resTemp.data
        
        console.log(resTemp)
        
        if(res.status !== 200) {
          return this.$message.error(res.message);
        }

        console.log("res.data token is " + res.data.token);
        this.$message.success(res.message);
        
        window.sessionStorage.setItem("token", res.data.token);
        window.sessionStorage.setItem("user_id", res.data.user_id);
        window.sessionStorage.setItem("role", res.data.role);
        
        this.$router.push("/home");
      });
    },
    register(){
      this.$router.push("/register")

    }
  }
  
}
</script>


<style scoped>

  .login-container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }

  .login_title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }

</style>
