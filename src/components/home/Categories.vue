<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>验证码类型</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 基本信息展示 -->
    <el-card class="box-card">
      <el-row :gutter="20" v-if="this.role === '管理员'">
        <el-col :span="6">
          <el-button type="primary" @click="addCateVisible = true">添加类别</el-button>
        </el-col>
      </el-row>

      <!-- 类别表格 -->
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column type="index" width="70"></el-table-column>

        <el-table-column prop="code" label="类型代码" width="120"></el-table-column>

        <el-table-column prop="name" label="名称" width="180"></el-table-column>

        <el-table-column prop="details" label="详情" width="280"></el-table-column>
      </el-table>
    </el-card>

    <!-- 添加类别对话框 -->
    <el-dialog title="添加验证码类型" :visible.sync="addCateVisible" width="40%">
      <!-- 添加类别 表单 -->
      <span>
        <el-form
          ref="addCateRef"
          :model="addCateForm"
          :rules="addCateRules"
          class="addCate-container"
          label-position="left"
          label-width="0px"
        >
          <!-- <h3 class="login_title">系统登录</h3> -->
          <!-- code -->
          <el-form-item prop="code">
            <el-input v-model="addCateForm.code" placeholder="类型代码"></el-input>
          </el-form-item>

          <el-form-item prop="name">
            <el-input v-model="addCateForm.name" placeholder="类型名称"></el-input>
          </el-form-item>

          <el-form-item prop="details">
            <el-input type="textarea" :rows="2" placeholder="类型描述" v-model="addCateForm.details"></el-input>
          </el-form-item>
        </el-form>
      </span>

      <!-- 按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
export default {
  created() {
      this.getCategories();
      this.role = window.sessionStorage.getItem("role")
  },

  data() {
    return {
      role: '',
      // 表格数据
      tableData: [],

      //   添加类别 弹窗是否可视
      addCateVisible: false,

      //   表单数据
      addCateForm: {
        category_id: -1,
        code: "",
        name: "",
        details: "",
      },
      //   表单验证
      addCateRules: {
        code: [
          { required: true, message: "请输入验证码类型代码", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        name: [
          { required: true, message: "请输入验证码类型名称", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" },
        ],
        details: [
          { required: true, message: "请输入验证码类型描述", trigger: "blur" },
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
      },
    };
  },
  methods: {
    addCategory: function () {
      //   表单校验
      this.$refs.addCateRef.validate(async (valid) => {
        if (valid == false) return;
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateForm
        );

        console.log(res);

        if (res.status != 200) {
          this.$message.error(res.message);
        } else {
          this.$message.success(res.message);
        }

        this.addCateVisible = false;
        // TODO: 执行一次表格内容刷新
      });
    },

    // get all of the captcha categories to render the table 
    getCategories: function() {
        const path = 'categories'
        this.$http.get(path).then( res => {
            console.log(res)
            this.tableData = res.data.data;
            console.log(this.tableData)
        })
    }
  },
};
</script>

<style scoped>
</style>