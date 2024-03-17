<script setup lang="ts">
import { reactive } from 'vue'
import { Message } from '@arco-design/web-vue';

const versions = reactive({ ...window.electron.process.versions })
//list
const handlerClick = async () => {
  Message.info("hello")

}
</script>

<template>
  <ul class="versions">
    <li class="electron-version">Electron v{{ versions.electron }}</li>
    <li class="chrome-version">Chromium v{{ versions.chrome }}</li>
    <li class="node-version">Node v{{ versions.node }}</li>
    <li class="v8-version">V8 v{{ versions.v8 }}</li>
  </ul>
  <button @click="handlerClick">click</button>
</template>
