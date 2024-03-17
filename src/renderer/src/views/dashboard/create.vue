<template>
  <a-card :title="card_title" style="margin-top: 15px">
    <a-typography>
      <a-typography-paragraph>
        <ul>
          <li style="padding: 4px 0">
            建议使用生成随机密码        
            <a-button :style="{marginLeft:'10px'}" size="mini"> 
              <template #icon><icon-refresh /></template> 
            </a-button>
          </li>
        </ul>
      </a-typography-paragraph>
    </a-typography>
    
    <a-form ref="formRef" size="large" :rules="rules" :model="form" :style="{width:'600px',marginTop:'30px'}" @submit="handleSubmit">
      <a-form-item field="platform" label="平台" validate-trigger="blur">
        <a-input v-model="form.platform" placeholder="请输入所在平台" />
      </a-form-item>
      <a-form-item field="account" label="账号">
        <a-input v-model="form.account" placeholder="请输入账号" />
      </a-form-item>
      <a-form-item field="password" label="密码" validate-trigger="blur">
        <a-input-password v-model="form.password" placeholder="请输入密码" />
        <!-- <a-button  :style="{marginLeft:'10px'}">Delete</a-button> -->
        <a-tooltip content="生成随机密码" @click="handleRandomPassword">
        <a-button :style="{marginLeft:'10px'}" > <template #icon><icon-refresh /></template> </a-button>
        </a-tooltip>
        <!-- <icon-refresh size="20"/> -->
      </a-form-item>
      <a-form-item field="password2" label="确认密码" validate-trigger="blur">
        <a-input-password v-model="form.password2" placeholder="请再次输入密码" />
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button html-type="submit" type="primary" :disabled="disabled" :loading="loading">提交</a-button>
          <a-button @click="$refs.formRef.resetFields()">重置</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  
  </a-card>
  </template>
  
<script>
  import { reactive, toRaw,ref} from 'vue';
  import { useRouter,useRoute } from 'vue-router'
  import {Message} from '@arco-design/web-vue'
  import { nanoid } from 'nanoid'
  export default {
    setup() {
      const router = useRouter()
      const route = useRoute()
      const card_title = ref('新增账号')
      const disabled = ref(false)
      const loading = ref(false)
      const handleSubmit = async ({values, errors}) => {
        if(!errors){
          disabled.value = true
          setTimeout(()=>{
            disabled.value= false
            loading.value = false
          },1000)
          if(values.id>0){
            const response = await window.mpwd.update(toRaw(values))
            if(response.changes==1){
                // Message.info("修改成功")
                // setTimeout(() => {
                  router.push({name:'DashboardResult'})
                // }, 1000);
            }
          }else{
            const response = await window.mpwd.create(toRaw(values))
            if(response.changes==1){
                // Message.info("添加成功")
                // setTimeout(() => {
                  // router.push({name:'Dashboard'})
                  router.push({name:'DashboardResult'})
                // }, 1000);
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
        card_title.value = '编辑账号'
        window.mpwd.findOne({id:route.query.id}).then(res=>{
          console.log(res)
          if(res.code===0){
            Message.error(res.message)
            setTimeout(() => {
              router.push({name:'recycsettingle'})
            }, 2000);
            return false
          }
          form.platform = res.platform
          form.account = res.account
          form.password = res.hash_password
          form.password2 = res.hash_password
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

      const handleRandomPassword = ()=> {
        const id = nanoid()
        form.password = id
        form.password2 = id
      }
  
      return {
        form,
        rules,
        handleSubmit,
        handleRandomPassword,
        card_title,
        disabled,
        loading
      }
    },
  }
  </script>
  