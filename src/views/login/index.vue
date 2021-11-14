<template>
  <div class="login-container">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="80px"
      class="login-form"
    >
      <h2 class="login-title">梦学谷会员管理系统</h2>
      <el-form-item label="账号" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
// import { login, getUserInfo } from "@/api/login";
import { login, getUserInfo } from "@/api/login";

export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {       
        if (valid) {
          this.$store.dispatch('Login', this.form).then(response=>{

            if (response.flag) {
              this.$router.push('/')
            }else{
              this.$message({
                message:response.message,
                type:'warning'
              })
            }

          }).catch(error=>{
            
          })
          // 提交表单给后台进行验证是否正确
          // login(this.form.username, this.form.password).then((response) => {
          //   const resp = response.data;
          //   if (resp.flag) {
          //     // 验证成功，通过token去获取用户信息
          //     getUserInfos(resp.data.token).then((response) => {
          //       // 获取到了用户的数据
          //       const respUser = response.data;
          //       if (respUser.flag) {
          //         // 保存token 和用户信息
          //         localStorage.setItem(
          //           "mxg-msm-user",
          //           JSON.stringify(respUser.data)
          //         );
          //         localStorage.setItem("mxg-msm-token", resp.data.token);
          //         // 前往首页
          //         this.$router.push("/");
          //       } else {
          //         this.$message({
          //           message: respUser.message,
          //           type: "warning",
          //         });
          //       }
          //     });
          //   } else {
          //     /* 验证失败 */
          //     // 未通过，弹出警告
          //     this.$message({
          //       message: resp.message,
          //       type: "warning",
          //     });
          //   }
          // });
        } else {
          console.log("验证失败");
          return false;
        }
      });
    },
  },
};
</script>
<style scoped>
.login-form {
  width: 350px;
  /* 上下间距160px 左右自动居中 */
  margin: 160px auto;
  background-color: rgb(255, 255, 255, 0.8);
  padding: 28px;
  border-radius: 20px;
}
.login-container {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url("../../assets/login.jpg");
}
.login-title {
  color: #303133;
  text-align: center;
}
</style>