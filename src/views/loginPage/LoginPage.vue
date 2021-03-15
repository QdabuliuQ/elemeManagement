<template>
  <div id="LoginPage">
    <div class="loginBox">
      <div class="loginBoxTitle">饿了么后台管理系统</div>
      <div class="loginBoxForm">
        <div class="formContainer">
          <div class="logo">
            <i class="iconfont icon-elment"></i>
          </div>
          <el-form
            :rules="rules"
            :model="ruleForm"
            ref="ruleForm"
            label-width="120px"
            class="demo-ruleForm"
          >
            <el-form-item label="管理员账号：" prop="userName">
              <el-input placeholder="请输入账号" v-model="ruleForm.userName"></el-input>
            </el-form-item>
            <el-form-item label="管理员密码：" prop="password">
              <el-input placeholder="请输入密码" show-password v-model="ruleForm.password"></el-input>
            </el-form-item>
          </el-form>
          <div class="loginBtnContainer">
            <el-button @click="toLogin" class="loginBtn" type="primary">登录系统</el-button>
            <el-button @click="clearInformation">取消登录</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {login} from 'network/LoginPage'

export default {
  name: "LoginPage",
  data() {
    return {
      ruleForm: {  // 表单数据
        userName: "",
        password: ""
      },
      rules: {
        userName: [
          { required: true, message: '请输入用户账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    // 登录按钮
    toLogin() {
      // 验证表单
      this.$refs.ruleForm.validate(res => {
        if (res) {
          login(this.ruleForm.userName, this.ruleForm.password).then(res => {
            if (res.data.status == 1) {
              // 调用md5 方法生成md5作为token
              var md5rod = md5(`{"userName":${this.ruleForm.userName},"password":${this.ruleForm.password}}`);
              sessionStorage.setItem('token', md5rod)  // 保存token
              this.$router.push('/homePage')
              this.$notify({
                title: '成功',
                message: '登录成功',
                type: 'success'
              });
            }
          })
        } else {
          this.$notify({
            title: '失败',
            message: '用户名或者密码错误',
            type: 'error'
          });
        }
      })
    },

    // 取消按钮
    clearInformation() {
      this.$refs.ruleForm.resetFields()
    }
  }
};
</script>
<style scoped>
#LoginPage {
  width: 100%;
  height: 100%;
  background-color: #3d98ff;
  position: relative;
}
.el-form-item{
  margin-bottom: 30px;
}
.loginBox {
  width: 500px;
  height: 450px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.loginBoxTitle {
  width: 100%;
  height: 20%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 40px;
  letter-spacing: 1px;
}
.loginBoxForm {
  width: 100%;
  height: 80%;
  background-color: #fff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.formContainer {
  width: 90%;
}
.loginBtnContainer{
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 25px;
}
.loginBtn{
  margin-right: 35px;
}
.logo{
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}
.logo .iconfont{
  font-size: 50px;
  color: #3d98ff;
  padding: 20px;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.123);
}
</style>