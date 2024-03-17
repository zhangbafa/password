<template>
  <a-card title="设置主密码" style="margin-top: 15px">
    <template #extra>
      <a-button @click="updateMasterPassword" type="outline"  size="small">修改主密码</a-button>
    </template>
    <a-typography>
      <!-- <a-typography-title :heading="3">设置主密码</a-typography-title> -->
      <a-typography-paragraph>
        <ul>
          <li style="padding: 4px 0">主密码是获取密码是重要凭证，请务必妥善保存</li>
          <li style="padding: 4px 0">主密码错误将获取不到正确的密码</li>
          <!-- <li style="padding: 4px 0">软件关闭则主密码丢失，下次使用需要重新输入</li> -->
        </ul>
      </a-typography-paragraph>
    </a-typography>
    <div>
      <a-form
        ref="formRef"
        size="large"
        :rules="rules"
        :model="form"
        :style="{ width: '400px', marginTop: '30px' }"
        @submit="handleSubmit"
      >
        <a-form-item field="password" label="主密码" validate-trigger="blur">
          <a-input v-model="form.password" placeholder="请输入主密码" ref="passwordFocus" />
        </a-form-item>

        <a-form-item>
          <a-space>
            <a-button html-type="submit" type="primary">提交</a-button>
            <a-button @click="$refs.formRef.resetFields()">重置</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </div>
  </a-card>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
const passwordFocus = ref(null)
onMounted(() => {
  passwordFocus.value.focus()
})
const form = reactive({
  password: ''
})
const rules = {
  password: [
    {
      required: true,
      message: '必填项'
    }
  ]
}
const router = useRouter()
const handleSubmit = async ({ values, errors }) => {
  if (!errors) {
    const resp = await window.mpwd.setMasterPassword(form.password)
    if (resp.code == 200) {
      Message.success(resp.message)
      setTimeout(()=>{
        router.push({
          name:'Dashboard'
        })
      },500)
    } else {
      Message.error(resp.message)
    }
  }
}


const updateMasterPassword = () => {
  router.push({
    name: 'update-masterpassword'
  })
}
</script>
