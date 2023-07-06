<script setup lang="ts">
import { ref } from 'vue'
import Menu from '@/components/layout/menu/index.vue'
import Footer from '@/components/layout/footer/index.vue'

const msg = ref('首页')
</script>

<template>
  <div class="module">
    <div class="module-left">
        <Menu />
    </div>
    <div class="module-main">
        <router-view />
        <div>
            <Footer />
        </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>