<template>
  <el-dialog :title="dialogData.formType === 'create' ? '新增用户' : '修改用户'" 
  :visible.sync="dialogData.dialogVisible"
  :close-on-click-modal="false"
  :close-on-press-escape="false"
  @close="closeDialog"
  :center="true"
  v-loading="loading"
  width="30%"
  element-loading-text="拼命加载中">
    <el-form :model="formData" :rules="rules" ref="form" label-width="100px" style="width: 100%" @submit.native.prevent> 
      <el-form-item label="角色：" prop="roleId">
        <el-select v-model="formData.roleId" placeholder="请选择">
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="账号：" prop="username">
        <el-input v-model="formData.username"></el-input>
      </el-form-item>
      <el-form-item label="姓名：" prop="adminname">
        <el-input v-model="formData.adminname"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer"> 
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="submitForm">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import urlmap from '@/utils/urlmap';

const formConfig = {
  roleId: '',
  username: '',
  adminname: ''
};

const roleList = [
  { id: 2, name: '生产计划' },
  { id: 3, name: '普通管理员' },
  { id: 4, name: '重卷' },
  { id: 5, name: '检测' },
  { id: 6, name: '库房' },
  { id: 7, name: '6号机组-喷带' },
  { id: 8, name: '6号机组-化钢' },
  { id: 9, name: '7号机组-喷带' },
  { id: 10, name: '7号机组-化钢' },
  { id: 11, name: '8号机组-喷带' },
  { id: 12, name: '8号机组-化钢' },
  { id: 13, name: '9号机组-喷带' },
  { id: 14, name: '9号机组-化钢' }
];

export default {
  props: {
    dialogData: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      formData: {
        roleId: '',
        username: '',
        adminname: ''
      },
      roleList: roleList,
      rules: {
        roleId: [
          { required: true, message: '请选择角色', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请填写账号', trigger: 'blur' },
          { max: 20, message: '账号长度在6-20位之间', trigger: 'blur' },
          { min: 6, message: '账号长度在6-20位之间', trigger: 'blur' }
        ],
        adminname: [
          { required: true, message: '请填写姓名', trigger: 'blur' },
          { max: 10, message: '姓名长度在2-10位之间', trigger: 'blur' },
          { min: 2, message: '姓名长度在2-10位之间', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5]+$/, message: '只能输入中文汉字', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  created () {
    if (this.dialogData.formType === 'create') {
      this.formData = Object.assign({}, formConfig);
    } else {
      this.formData = Object.assign(this.formData, this.dialogData.rowData);
    }
  },
  methods: {
    closeDialog() {
      this.$emit('close');
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$http('POST', urlmap.addUser, this.formData).then(data => {
            this.$emit('submit');
          }).catch(err => {
            console.log(err);
          }).finally(() => {
            this.loading = false;
          }); 
        } else {
          return false;
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>

</style>