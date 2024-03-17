<template>
  <router-view />
</template>

<script>
export default {
  name: 'App',
  setup() {
    setTimeout(() => {
      
      document.getElementById('loadingPage').remove()
    }, 0);
  }
}
</script>