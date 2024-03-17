<template>
  <div >
    <a-form ref="formRef" size="large" :rules="rules" :model="form" :style="{width:'600px',marginTop:'30px'}" @submit="handleSubmit">
      <a-form-item field="platform" label="平台" validate-trigger="blur">
        <a-input v-model="form.platform" placeholder="请输入所在平台" />
      </a-form-item>
      <a-form-item field="account" label="账号">
        <a-input v-model="form.account" placeholder="请输入账号" />
      </a-form-item>
      <a-form-item field="password" label="密码" validate-trigger="blur">
        <a-input-password v-model="form.password" placeholder="请输入密码" />
      </a-form-item>
      <a-form-item field="password2" label="确认密码" validate-trigger="blur">
        <a-input-password v-model="form.password2" placeholder="请再次输入密码" />
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button html-type="submit" type="primary">提交</a-button>
          <a-button @click="$refs.formRef.resetFields()">重置</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  
  </div>
  </template>
  
<script>
  import { reactive, toRaw} from 'vue';
  import { useRouter,useRoute } from 'vue-router'
  import {Message} from '@arco-design/web-vue'
  export default {
    setup() {
      const router = useRouter()
      const route = useRoute()
      const handleSubmit = async ({values, errors}) => {
        if(!errors){
          if(values.id>0){
            const response = await window.mpwd.update(toRaw(values))
            if(response.changes==1){
                Message.info("修改成功")
                setTimeout(() => {
                  router.push({name:'Dashboard'})
                }, 1000);
            }
          }
            
        }
      }
  
      const form = reactive({
        platform: '',
        account:'',
        password: '',
        password2: '',
        id:''
      });

      if(route.query.id){
        window.mpwd.findOne({id:route.query.id}).then(res=>{
          form.platform = res.platform
          form.account = res.account
          form.password = ''
          form.password2 = ''
          form.id = res.id
        })
      }
  
      const rules = {
        platform: [
          {
            required: true,
            message:'必填项',
          },
        ],
        account: [
          {
            required: true,
            message:'必填项',
          },
        ],
        password: [
          {
            required: true,
            message:'必填项',
          },
        ],
        password2: [
          {
            required: true,
            message:'必填项',
          },
          {
            validator: (value, cb) => {
              if (value !== form.password) {
                cb('两次输入密码不一致')
              } else {
                cb()
              }
            }
          }
        ]
      }
  
      return {
        form,
        rules,
        handleSubmit
      }
    },
  }
  </script>
  