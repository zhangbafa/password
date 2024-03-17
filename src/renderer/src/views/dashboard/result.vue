<template>
    <div class="result-box">
        <a-result status="success" title="操作成功" >
        <template #subtitle>
            可选择以下按钮操作
        </template>
        <template #extra>
            <a-space>
                <a-button @click="handlerbackcreate">继续添加</a-button>
                <a-button type='primary' @click="handlerbackhome">返回首页</a-button>
            </a-space>
        </template>
        </a-result>
    </div>    
</template>
  
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const handlerbackhome = () => {
    router.push({path:'/dashboard'})
}

const handlerbackcreate = () => {
    router.push({name: 'passwordcreate'})
}
</script>

<style>
.result-box{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 90vh;
}
</style>