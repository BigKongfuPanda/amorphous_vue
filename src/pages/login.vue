<template>
  <div class="login_bg">
    <div class="login_form">
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="80px" label-position="top">
        <el-row class="login_hd">
          <h3>生产数据管理系统</h3>
        </el-row>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login" class="login_btn" >登录</el-button>
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
        password: '',
        disabled: false
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur'},
          { min: 0, max: 20, message: '长度在 0 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户名', trigger: 'blur'},
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login() {
      this.$refs['ruleForm'].validate((valid) => {
        if(valid) {
          this.disabled = true;
          this.$http('POST', urlmap.login, this.form).then(res => {
            const data = res.data;
            if(data.status != 0) {
              return this.$alert(data.message, { confirmButtonText: '确定' });
            }
            this.$router.push({ path: '/plan/6'});
          }).catch(err => {
            this.$alert(err.message, { confirmButtonText: '确定' });
          }).finally(() => {
            this.disabled = false;
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
  .login_form {
    background-color: #fff;
    width: 300px;
    padding: 20px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 10px;
  }
  .login_hd {
    text-align: center;
    h3 {
      font-size: 22px;
      margin: 10px 0;
    }
  }
  .login_btn {
    width: 100%;
  }
</style>

