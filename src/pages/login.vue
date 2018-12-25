<template>
  <div class="login_bg">
    <div class="form">
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>

</template>

<script>
import urlmap from '@/utils/urlmap';
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur'},
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户名', trigger: 'blur'},
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login() {
      this.refs['ruleForm'].validte((valid) => {
        if(valid) {
          this.$http('POST', urlmap.login, this.form).then(data => {
            if(data.status != 0) {
              return 
            }
          }).catch(err => {

          })
        }
      });
    }
  }
}
</script>

<style lang="scss">
  .login_bg {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: url('../assets/login-1.jpeg') no-repeat left top;
    background-size: 100% 100%;
  }
</style>

