<template>
  <el-config-provider :locale="zhCn">
    <div class="app-container">
      <nav-header />
      <keep-alive include="Home">
        <router-view />
      </keep-alive>
      <el-backtop :right="20" :bottom="20" />
    </div>
  </el-config-provider>
</template>

<script setup>
import NavHeader from '@/components/layout/NavHeader.vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
</script>

<style>
.app-container {
  min-height: 100vh;
}
</style>