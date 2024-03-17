<template>
  <a-spin :loading="loading" tip="正在修改中，请稍后片刻" style="width: 100%;margin-top: 22px">
  <a-card title="修改主密码">
    <a-typography>
      <a-typography-paragraph>
        <ul>
          <li style="padding: 4px 0;">修改主密码需要原密码</li>
          <li style="padding: 4px 0;">修改主密码会重新加密已有的账号密码</li>
        </ul>
      </a-typography-paragraph>
    </a-typography>
    <div>
      <a-form ref="formRef" size="large" :rules="rules" :model="form" :style="{width:'400px',marginTop:'30px'}" @submit="handleSubmit">
      <a-form-item field="password" label="原密码" validate-trigger="blur">
        <a-input v-model="form.password" placeholder="请输入原密码" />
      </a-form-item>
      <a-form-item field="newpassword" label="新密码" validate-trigger="blur">
        <a-input v-model="form.newpassword" placeholder="请输入新密码" />
      </a-form-item>
      
      <a-form-item>
        <a-space>
          <a-button html-type="submit" type="primary">提交</a-button>
          <a-button @click="$refs.formRef.resetFields()">重置</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
  <div v-if="show">
    更新中。
  </div>
  </a-card>
</a-spin>
</template>

<script setup>
import { ref,reactive } from 'vue';
import {Message} from '@arco-design/web-vue'

const form = reactive({
        password: '',
        newpassword:''
});
const rules = {
        password: [
                {
                  required: true,
                  message:'必填项',
                },
              ],
        newpassword: [
          {
            required: true,
            message:'必填项',
          },
        ],
  }
const loading =ref(false)
const handleSubmit = async ({values, errors}) => {
  
  if(!errors){
    loading.value = true
    const res = await window.mpwd.updateMasterPassword({password:form.password,newpassword:form.newpassword})
    setTimeout(()=>{
      if(res.code==200){
        loading.value = false
        window.mpwd.setMasterPassword(form.newpassword)
        Message.success(res.message)
      }else{
        Message.error(res.message)
      }
    },2000)
    
  }
}
</script>
