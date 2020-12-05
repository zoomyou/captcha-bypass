<template>
  
    <el-container >
      <!-- 头部 -->
      <el-header >
        <div>
          <!-- <img src="@/assets/logo-capb.png"> -->
          <span>CaptchaBreaker</span>
        </div>
        <el-button type="info" @click="logout()">退出登录</el-button>
      </el-header>

      <!-- body -->
      <el-container>
        <!-- 左侧导航 -->
        <el-aside width="200px">
          <el-menu router unique-opened>
            <!-- 一级 : 注意这里 index 前面加了 ： 作为动态数据绑定-->
            <div v-for="item in menulist" :key="item.id">
                <div v-if="item.children.length != 0">
                  <el-submenu :index="item.path">  

                  <template slot="title">
                    <!-- <i class="el-icon-user"></i> -->
                    <span>{{item.name}}</span>
                  </template>
                  
                  <!-- 二级 -->
                  <el-menu-item  :index="subitem.path" v-for="subitem in item.children" :key="subitem.id">
                    <template slot="title">
                      <!-- <i class="el-icon-user"></i> -->
                      <span>{{subitem.name}}</span>
                    </template>
                  </el-menu-item>
                  </el-submenu>
                </div>

                <div v-else>
                  <el-menu-item  :index="item.path" >
                      <template slot="title">
                        <!-- <i class="el-icon-user"></i> -->
                        <span>{{item.name}}</span>
                      </template>
                  </el-menu-item>
                </div>
            </div>
          </el-menu>
        </el-aside>

        <!-- 主界面 -->
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  
</template>


<script>

export default {
  data() {
    return {
      // 左侧菜单数据
      menulist : [],

      menulists : {
        "人工打码客户端" : [
          {
              "id": 1,
              "name": "个人中心",
              "path": "/home",
              "children": [
                  {
                      "id": 101,
                      "name": "基本信息",
                      "path": "/user-info",
                      "children": []
                  },
                  {
                      "id": 102,
                      "name": "修改信息",
                      "path": "/change-info",
                      "children": []
                  },
                  {
                      "id": 103,
                      "name": "修改密码",
                      "path": "/change-password",
                      "children": []
                  }
              ]
          },
          {
              "id": 2,
              "name": "打码任务",
              "path": "/current-task",
              "children": []
          },
          {
              "id": 3,
              "name": "任务统计",
              "path": "/task-statistics",
              "children": []
          },
          {
              "id": 4,
              "name": "任务日志",
              "path": "/task-logs",
              "children": []
          },
          {
              "id": 5,
              "name": "验证码类型",
              "path": "/categories",
              "children": []
          }
        ],
        "打码请求者" : [
          {
              "id": 1,
              "name": "个人中心",
              "path": "/home",
              "children": [
                  {
                      "id": 101,
                      "name": "基本信息",
                      "path": "/user-info",
                      "children": []
                  },
                  {
                      "id": 102,
                      "name": "修改信息",
                      "path": "/change-info",
                      "children": []
                  },
                  {
                      "id": 103,
                      "name": "修改密码",
                      "path": "/change-password",
                      "children": []
                  }
              ]
          },
          {
              "id": 2,
              "name": "识别流程",
              "path": "/recognition",
              "children": []
          },
          {
              "id": 3,
              "name": "任务统计",
              "path": "/task-statistics",
              "children": []
          },
          {
              "id": 4,
              "name": "任务日志",
              "path": "/task-logs",
              "children": []
          },
          {
            "id": 5,
            "name": "验证码类型",
            "path": "/categories",
            "children": []
          }
        ],
        "管理员" : [
          {
              "id": 1,
              "name": "个人中心",
              "path": "/home",
              "children": [
                  {
                      "id": 101,
                      "name": "基本信息",
                      "path": "/user-info",
                      "children": []
                  },
                  {
                      "id": 102,
                      "name": "修改信息",
                      "path": "/change-info",
                      "children": []
                  },
                  {
                      "id": 103,
                      "name": "修改密码",
                      "path": "/change-password",
                      "children": []
                  }
              ]
          },
          {
              "id": 2,
              "name": "任务管理",
              "path": "/tasks",
              "children": []
          },
          {
              "id": 3,
              "name": "用户管理",
              "path": "/users",
              "children": []
          },
          {
              "id": 4,
              "name": "日志管理",
              "path": "/logs",
              "children": []
          },
          {
              "id": 5,
              "name": "验证码类型管理",
              "path": "/categories",
              "children": []
          },
          
        ]
      }
      
    }
  },

  // 打开home路径 初始化菜单
  created() {
    this.getMenuList()
    

  },


  methods: {
    // 退出登录
    
    logout(){
      let user_id = window.sessionStorage.getItem("user_id")
      console.log('current user is: ' + user_id)
      this.$http.get("logout", {
          params:{
            "user_id": parseInt(user_id)
          }
      }).then( res => {
          // 结果数据处理
          
          let data = res.data 
          
          console.log(data)

          if(data.status != '200') {
            this.$message.error(data.message);
            return 
          }else{
            this.$message.success(data.message);
            window.sessionStorage.clear()
            console.log("logout " + window.sessionStorage.getItem("token"));
            
            this.$router.push('login')
          }
        }
      )
    },

    // 获取所有菜单
    getMenuList(){
      // 从 session 中获取 roleid
      let role = window.sessionStorage.getItem("role");
      
      
      this.menulist = this.menulists[role]
      console.log(this.menulist)
    }
  }
}

</script>



<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.el-container {
  height: 100%;
}

.el-header {
  width: 100%;
  

  /* 这部分display用法 */
  display: flex;
  justify-content: space-between;

  /* 消除el-header默认的左右两个padding */
  padding: 0px 10px;
  

  /* 元素居中对齐 */
  align-items: center;

  background-color: #333333;

  color: #ffffff;
  font-size: 20px;
}

.el-aside {
  background-color: #ffffff;
  height: 100%;
}
</style>
