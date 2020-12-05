<template>

<el-form ref="registerRef" :model="registerForm" :rules="registerRules" class="register-container" label-position="left"
           label-width="0px" v-loading="loading" >
    <h3 class="register_title">用户注册</h3>
    
    <el-form-item prop="user_name">
      <el-input type="text" v-model="registerForm.user_name" placeholder="账号"></el-input>
    </el-form-item>

    <el-form-item prop="password">
      <el-input type="password" v-model="registerForm.password" placeholder="密码"></el-input>
    </el-form-item>

    <!-- <el-form-item prop="checkPass2">
      <el-input type="password" v-model="registerForm.password" auto-complete="off" placeholder="确认密码"></el-input>
    </el-form-item> -->
    
    <!-- 邮箱 -->
    <el-form-item  prop="mail">
      <el-input v-model="registerForm.mail" placeholder="邮箱"></el-input>
    </el-form-item>

    <!-- 角色 -->
    <el-form-item prop="role">
      <el-select v-model="registerForm.role_id" placeholder="请选择您的角色">
        <el-option
          v-for="item in this.roles"
          :key="item.value"
          :label="item.label"
          :value="item.value" >
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item style="width: 100%">
      <el-button type="primary" @click="register()" style="width: 100%">注册</el-button>
    </el-form-item>
</el-form>

</template>

<script>
export default {
     data(){
      return {
        registerRules: {
          // 用户名验证
          user_name : [
            { required:true, message: '请输入用户名', trigger: "blur"},
            { min: 3, max : 10, message: "长度在3到10个字符", trigger:"blur"}
          ],
          // 密码验证
          password : [
            { required:true, message: '请输入密码', trigger: "blur"},
            { min: 3, max : 10, message: "长度在3到15个字符", trigger:"blur"}
          ],
          // 角色
          role_id:[
            { required:true, message: "请选择您的角色", trigger: "change"}
          ]
        },

        
        
        // 角色下拉框数据
        roles: [
        //   {
        //   value: '0',
        //   label: '管理员'
        // }, 
        {
          value: '1',
          label: '打码请求者'
        }, {
          value: '2',
          label: '人工打码客户端'
        }],

        registerForm: {
          user_name : '',
          password : '',
          mail: '',
          role_id: '', 
        },
        
        
        checked: true,
        
        loading: false
      }
    },
    methods: {
      
      register: function (){

        this.loading = true;

        this.$refs.registerRef.validate( async (valid) => {
          const resTemp = await this.$http.post("register", this.registerForm);
          const res = resTemp.data
          console.log(resTemp)
          
          if(res.status !== 200) {
            this.$message.error(res.message);
            this.loading = false;
            return 
            // this.$router.push("/login");
          }

          this.$message.success(res.message);

          window.sessionStorage.setItem("token", res.data.token);
          window.sessionStorage.setItem("user_id", res.data.user_id);
          window.sessionStorage.setItem("role", res.data.role);
          
          this.$router.push("/home");
        });
        
      }
    }
}
</script>


<style scoped>

  .register-container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }

  .el-select {
    width: 100%
  }

  .register_title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }

</style>