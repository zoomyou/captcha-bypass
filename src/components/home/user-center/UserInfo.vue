<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>基本信息</el-breadcrumb-item>
        </el-breadcrumb>

         <!-- 基本信息展示 -->
        <el-card class="box-card" >
            <el-row>
                <el-col :span="24"><div class="grid-content bg-purple-dark"><h2>用户名</h2></div></el-col>
            </el-row>
            <el-row class="row-content">
                <el-col :span="24"><div class="grid-content bg-purple-dark">{{user_info.user_name}}</div></el-col>
            </el-row>

            <el-row>
                <el-col :span="24"><div class="grid-content bg-purple-dark"><h2>角色</h2></div></el-col>
            </el-row>
            <el-row class="row-content">
                <el-col :span="24"><div class="grid-content bg-purple-dark">{{user_info.role}}</div></el-col>
            </el-row>

            <el-row>
                <el-col :span="24"><div class="grid-content bg-purple-dark"><h2>邮箱</h2></div></el-col>
            </el-row>
            <el-row class="row-content">
                <el-col :span="24"><div class="grid-content bg-purple-dark">{{user_info.mail}}</div></el-col>
            </el-row>
            
            <el-row>
                <el-col :span="24"><div class="grid-content bg-purple-dark"><h2>Token</h2></div></el-col>
            </el-row>
            <el-row class="row-content">
                <el-col :span="24"><div class="grid-content bg-purple-dark">{{user_info.token}}</div></el-col>
            </el-row>

            <div v-if="user_info.role == '人工打码客户端'"> 
                <el-row >
                    <el-col :span="24"><div class="grid-content bg-purple-dark"><h2>累计得分</h2></div></el-col>
                </el-row>
                <el-row class="row-content">
                    <el-col :span="24"><div class="grid-content bg-purple-dark">{{user_info.mark}}</div></el-col>
                </el-row>
            </div>
            
        </el-card>
    </div>
</template>


<script>
export default {

    created(){
      this.get_user_info()  
    },

    data() {
        return {
            user_info : {
                username: '',
                role: '',
                mail: '',
                token: '',
                mark:''
                
                // status: '',
                
            },
            // user_info : null,
        }
    },
    methods : {
        get_user_info() {

            // user_id 可以从 sessionstorage获取
            const uid = window.sessionStorage.getItem("user_id")
            // window.sessionStorage.getItem("user_id")
            let path = "users/" + uid
            // users api 传递 user_id 获取 对应user数据
            this.$http.get(path, {
                query:{

                }
            }).then( res => {
                // 结果数据处理
                // console.log(res.data)
                this.user_info = res.data 
                // console.log(res)
            }
            )

            
            // 根据user_id 利用 /api/users 中获取 users对象
            // this.user_info = this.users[user_id]
        }
    }
}
</script>

<style scoped>




.el-row {
    margin-bottom: 10px;
}

</style>