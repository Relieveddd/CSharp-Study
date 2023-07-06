<script setup lang="ts">
import { ref } from 'vue'
import { useMenu } from "./useMenu"

const { menus } = useMenu();

</script>

<template>
    <div class="module-menu" v-for="(item, index) in menus" :key="item.name">
        <div class="title">{{ item.name }}</div>
        <div class="menus" v-for="items in item.menus" :key="items.key">
            <router-link :to="{ name: items.key }">{{ items.name }}</router-link>
        </div>
    </div>
</template>

<style scoped></style>