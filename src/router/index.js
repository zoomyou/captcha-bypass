import Vue from 'vue'
import Router from 'vue-router'

// 登录 注册
import Login from '@/components/Login'
import Register from '@/components/Register'
// import Login_bak from '@/components/Login_bakup'

import Home from '@/components/Home'

// 用户中心
import UserInfo from '@/components/home/user-center/UserInfo'
import ChangeInfo from '@/components/home/user-center/ChangeInfo'
import ChangePass from '@/components/home/user-center/ChangePass'

// 管理模块
import Categories from '@/components/home/Categories'
import Tasks from '@/components/home/Tasks'
import Logs from '@/components/home/Logs'
import Users from '@/components/home/Users'

// 其他
import Developer from '@/components/home/Developer'
import Recognition from '@/components/home/Recognition'
import CurrentTask from '@/components/home/CurrentTask'
import TaskLogs from '@/components/home/TaskLogs'
import TaskStatistics from '@/components/home/TaskStatistics'
import Test from '@/components/Test'


Vue.use(Router)


const router = new Router ({
  routes: [
    // 注册 登录
    {
      path: '/', 
      redirect: 'login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      component: Register
    },
    
    // 主页
    {
      path: '/home',
      component: Home,
      // redirect: '/user-info',
      children : [
        // 个人中心
        {path: '/user-info', component: UserInfo},
        {path: '/change-info', component: ChangeInfo},
        {path: '/change-password', component: ChangePass},

        // 管理模块
        {path: '/categories', component: Categories},
        {path: '/users', component: Users},
        {path: '/logs', component: Logs},
        {path: '/tasks', component: Tasks},

        // 其他
        {path: '/task-statistics', component: TaskStatistics},
        {path: '/task-logs', component: TaskLogs},
        {path: '/current-task', component: CurrentTask},
        {path: '/developer', component: Developer},
        
        {
          path: '/recognition', 
          component: Recognition
            
        },
        // {path: '/login-bak', component: Login_bak}
      ]
    },
    {
      path: '/test',
      component: Test
    }
  ]
})

// 全局路由守卫，根据token判断用户是否登录
router.beforeEach((to, from, next) => {
  
  let token = window.sessionStorage.getItem('token');

  console.log("current token is " + token)
  console.log("to is :" + to)
  console.log("path " + to.path)

  // 提示 打码客户端 是否打码中途离开页面
  if(from.path === '/current-task'){
    console.log('Leaving from /current-task')
    if(confirm('离开则判定当前任务失败，是否继续？')) {
      next()
    }else{
      return
    }
  }
  
  if (to.path === '/login' || to.path === '/register' || to.path === '/test') {
    next();

  } else {
    
    
    if (token === 'null' || token === '' || token === null) {
      console.log("no token, return to login ")
      next('/login');
    } else {
      console.log("use token" + token + ", go ahead")
      next();
    }
  }
});


export default router 